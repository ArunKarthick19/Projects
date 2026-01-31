  import React, { useEffect, useRef, useState } from "react";
  import * as d3 from "d3";

  const GanttChart = () => {
    const svgRef = useRef();
    const [startDate, setStartDate] = useState(
      () => new Date("2025-09-10T00:00:00")
    );
    const [endDate, setEndDate] = useState(() => new Date("2025-09-11T00:00:00"));

    // flight details///////////////////////////////////////////////////////////////////////////////////////////////////
    const selectedFlight = {
      id: "XY123456",
      aircraftType: "NB",
      eibt: new Date("2025-09-10T10:00:00"), //SIBT/EIBT
      aibt: new Date("2025-09-10T10:02:00"), //AIBT
      sobt: new Date("2025-09-10T18:00:00"), //SOBT/EOBT
    };

    //Date & calendar
    const handleNext = () => {
      const newStart = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      setStartDate(newStart);
      setEndDate(new Date(newStart.getTime() + 24 * 60 * 60 * 1000));
    }; //next date button

    const handlePrev = () => {
      const newStart = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
      setStartDate(newStart);
      setEndDate(new Date(newStart.getTime() + 24 * 60 * 60 * 1000));
    }; //prev date button

    const handleDateChange = (dateStr) => {
      const newStart = new Date(dateStr + "T00:00:00");
      setStartDate(newStart);
      setEndDate(new Date(newStart.getTime() + 24 * 60 * 60 * 1000));
    }; //custom date button

    useEffect(() => {

      const drawGridLines = (scale) => {
  // Clear previous grid lines
  chartGroup.selectAll(".vertical-grid").remove();
  chartGroup.selectAll(".horizontal-grid").remove();

  // Vertical grid lines based on x-axis ticks
  const tickInterval = getTickInterval(1); // Use zoomLevel = 1 for initial
  const ticks = scale.ticks(tickInterval);

  chartGroup
    .selectAll(".vertical-grid")
    .data(ticks)
    .join("line")
    .attr("class", "vertical-grid")
    .attr("x1", (d) => scale(d))
    .attr("x2", (d) => scale(d))
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", "#e0e0e0")
    .attr("stroke-width", 1);

  // Horizontal grid lines for each milestone row
  for (let i = 0; i <= milestoneTemplates.length; i++) {
    chartGroup
      .append("line")
      .attr("class", "horizontal-grid")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", i * milestone_spacing)
      .attr("y2", i * milestone_spacing)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 1);
  }
};
      const svg = d3.select(svgRef.current);
      const width = 1200;

      //to adjust spacing
      const taskHeight = 8;
      const barSpacing = 1;
      const milestone_spacing = 25;
      const margin = { top: 20, right: 20, bottom: 100, left: 400 };
      const numMilestones = milestoneTemplates.length;
      const height = numMilestones * milestone_spacing + margin.top + margin.bottom; //to adjust height based on number of milestones

      svg.selectAll("*").remove(); //remove previous drawings before rendering new content???
      svg
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible");

      //layout management
      const labelGroup = svg // for milestone labels
        .append("g")
        .attr("transform", `translate(0,${margin.top})`);
      const chartGroup = svg // for gantt chart
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      //to get usable space
        const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const xScale = d3 //the horizontal time scale, range is the width of the chart
        .scaleTime()
        .domain([startDate, endDate])
        .range([0, innerWidth]);
      const xAxisGroup = chartGroup
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .attr("class", "x-axis");

      const drawAxis = (scale, zoomLevel) => { //draws & redraw axis based on zoom level with time scale 
        const tickInterval = getTickInterval(zoomLevel);
        const axis = d3
          .axisBottom(scale)
          .ticks(tickInterval)
          .tickFormat(d3.timeFormat("%d %b %H:%M"));

        xAxisGroup.call(axis);

        xAxisGroup
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "rotate(-35)")
          .attr("dx", "-0.8em")
          .attr("dy", "0.15em")
          .style("font-size", "10px")
          .style("user-select", "none");
      };

      drawAxis(xScale, 1);

      //milestone mapping, filters based on a/c type and calculates planned & actual times
      const milestones = milestoneTemplates
        .filter((t) => t.aircraftTypes.includes(selectedFlight.aircraftType)) //filter a/c type
        .map((t) => {
          const anchorTime = selectedFlight[t.anchor]; //get time based on anchor

          const toDate = (offsetMin) =>
            offsetMin != null
              ? new Date(anchorTime.getTime() + offsetMin * 60000)
              : null;


               const plannedStart = toDate(t.planned_start);
    const plannedEnd = toDate(t.planned_end);
    const actualStart = toDate(t.actual_start);
    const actualEnd = toDate(t.actual_end);

    // Log the planned and actual times
    console.log(`Milestone: ${t.name}`);
    console.log(`Planned Start: ${plannedStart ? plannedStart.toLocaleString() : 'N/A'}`);
    console.log(`Planned End: ${plannedEnd ? plannedEnd.toLocaleString() : 'N/A'}`);
    console.log(`Actual Start: ${actualStart ? actualStart.toLocaleString() : 'N/A'}`);
    console.log(`Actual End: ${actualEnd ? actualEnd.toLocaleString() : 'N/A'}`);
    console.log('---'); // Separator for each milestone

          return {
            ...t,
            planned: { //planned calculations
              start: toDate(t.planned_start),
              end: toDate(t.planned_end),
            },
            actual: { //actual calculations
              start: toDate(t.actual_start),
              end: toDate(t.actual_end),
            },
            isDeadline: t.planned_start == null && t.planned_end != null, //milestone where which are end only
          };
        });

      const renderTasks = (scale) => {
        chartGroup.selectAll("rect.planned-task").remove();
        chartGroup.selectAll("rect.actual-task").remove();
        chartGroup.selectAll("rect.delay-task").remove();
        chartGroup.selectAll("line.planned-deadline").remove();
        chartGroup.selectAll("line.actual-deadline").remove();
        chartGroup.selectAll("text.label").remove();
        chartGroup.selectAll("line.dependency").remove();

        // Milestone labels
        labelGroup
          .selectAll("text.milestone-label")
          .data(milestones)
          .join("text")
          .attr("class", "milestone-label")
          .text((d) => d.name)
          .attr("x", margin.left - 10)
          .attr("y", (d, i) => i * milestone_spacing + taskHeight)
          .attr("text-anchor", "end")
          .attr("fill", "black")
          .style("font-size", "12px");

        // Planned task bars (blue)
        const taskMilestones = milestones.filter(
          (m) => !m.isDeadline && m.planned.start
        );
        chartGroup
          .selectAll("rect.planned-task")
          .data(taskMilestones)
          .join("rect")
          .attr("class", "planned-task")
          .attr("x", (d) => scale(d.planned.start))
          .attr("y", (d, i) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return originalIndex * milestone_spacing;
          })
          .attr("width", (d) => scale(d.planned.end) - scale(d.planned.start))
          .attr("height", taskHeight)
          .attr("fill", "#4A90E2")
          .attr("opacity", 0.8);

        // Actual task bars (green + red for delays)
        const actualTaskMilestones = milestones.filter(
          (m) => !m.isDeadline && m.actual.start && m.actual.end
        );

        // Green part (actual duration up to planned end or actual end, whichever is earlier)
        chartGroup
          .selectAll("rect.actual-task")
          .data(actualTaskMilestones)
          .join("rect")
          .attr("class", "actual-task")
          .attr("x", (d) => scale(d.actual.start))
          .attr("y", (d, i) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return originalIndex * milestone_spacing + taskHeight + barSpacing;
          })
          .attr("width", (d) => {
            const actualEnd = d.actual.end;
            const plannedEnd = d.planned.end;
            const endTime = actualEnd <= plannedEnd ? actualEnd : plannedEnd;
            return scale(endTime) - scale(d.actual.start);
          })
          .attr("height", taskHeight)
          .attr("fill", "#50C878")
          .attr("opacity", 0.8);

        // Red part (delay - only if actual end is after planned end)
        const delayedMilestones = actualTaskMilestones.filter(
          (d) => d.actual.end > d.planned.end
        );
        chartGroup
          .selectAll("rect.delay-task")
          .data(delayedMilestones)
          .join("rect")
          .attr("class", "delay-task")
          .attr("x", (d) => scale(d.planned.end))
          .attr("y", (d, i) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return originalIndex * milestone_spacing + taskHeight + barSpacing;
          })
          .attr("width", (d) => scale(d.actual.end) - scale(d.planned.end))
          .attr("height", taskHeight)
          .attr("fill", "#E74C3C")
          .attr("opacity", 0.8);

        // Planned deadline markers (blue dashed)
        const plannedDeadlineMilestones = milestones.filter((m) => m.isDeadline);
        chartGroup
          .selectAll("line.planned-deadline")
          .data(plannedDeadlineMilestones)
          .join("line")
          .attr("class", "planned-deadline")
          .attr("x1", (d) => scale(d.planned.end))
          .attr("x2", (d) => scale(d.planned.end))
          .attr("y1", (d) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return originalIndex * milestone_spacing;
          })
          .attr("y2", (d) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return originalIndex * milestone_spacing + taskHeight;
          })
          .attr("stroke", "#4A90E2")
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "5,5");

        // Actual deadline markers (green or red)
        const actualDeadlineMilestones = milestones.filter(
          (m) => m.isDeadline && m.actual.end
        );
        chartGroup
          .selectAll("line.actual-deadline")
          .data(actualDeadlineMilestones)
          .join("line")
          .attr("class", "actual-deadline")
          .attr("x1", (d) => scale(d.actual.end))
          .attr("x2", (d) => scale(d.actual.end))
          .attr("y1", (d) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return originalIndex * milestone_spacing + taskHeight + barSpacing;
          })
          .attr("y2", (d) => {
            const originalIndex = milestones.findIndex((m) => m.id === d.id);
            return (
              originalIndex * milestone_spacing + taskHeight * 2 + barSpacing
            );
          })
          .attr("stroke", (d) =>
            d.actual.end > d.planned.end ? "#E74C3C" : "#50C878"
          )
          .attr("stroke-width", 3)
          .attr("stroke-dasharray", "5,5");

        // Dependencies (L-shaped: horizontal then vertical)
        const dependencyLines = milestones.flatMap((m, i) =>
          m.dependsOn
            ?.map((depId) => {
              const depIndex = milestones.findIndex((d) => d.id === depId);
              const dep = milestones[depIndex];
              if (!dep) return null;

              const startX = scale(dep.planned.end);
              const startY = depIndex * milestone_spacing + taskHeight / 2;
              const endX = scale(m.planned.start ?? m.planned.end);
              const endY = i * milestone_spacing + taskHeight / 2;

              // defines L-shaped path(for dependencies): horizontal first, then vertical
              return {
                id: `${dep.id}->${m.id}`,
                horizontal: {
                  x1: startX,
                  y1: startY,
                  x2: endX,
                  y2: startY,
                },
                vertical: {
                  x1: endX,
                  y1: startY,
                  x2: endX,
                  y2: endY,
                },
              };
            })
            .filter(Boolean)
        );

        // Remove old dependency lines, when zooming
        chartGroup.selectAll("line.dependency").remove();
        chartGroup.selectAll("line.dependency-horizontal").remove();
        chartGroup.selectAll("line.dependency-vertical").remove();
        //redneder dependency lines
        //horizontal line for dependencies
        chartGroup
          .selectAll("line.dependency-horizontal")
          .data(dependencyLines)
          .join("line")
          .attr("class", "dependency-horizontal")
          .attr("x1", (d) => d.horizontal.x1)
          .attr("y1", (d) => d.horizontal.y1)
          .attr("x2", (d) => d.horizontal.x2)
          .attr("y2", (d) => d.horizontal.y2)
          .attr("stroke", "gray")
          .attr("stroke-dasharray", "4,4")
          .attr("stroke-width", 2)
          .attr("opacity", 0.6);

        // vertical line for dependencies
        chartGroup
          .selectAll("line.dependency-vertical")
          .data(dependencyLines)
          .join("line")
          .attr("class", "dependency-vertical")
          .attr("x1", (d) => d.vertical.x1)
          .attr("y1", (d) => d.vertical.y1)
          .attr("x2", (d) => d.vertical.x2)
          .attr("y2", (d) => d.vertical.y2)
          .attr("stroke", "gray")
          .attr("stroke-dasharray", "4,4")
          .attr("stroke-width", 2)
          .attr("opacity", 0.6);
      };
      drawGridLines(xScale);
      renderTasks(xScale);
      //handling zoom
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          const transform = event.transform;
          const newScale = transform.rescaleX(xScale);
          const currentZoomLevel = transform.k;

          drawAxis(newScale, currentZoomLevel);
          drawGridLines(newScale);
          renderTasks(newScale);
        });

      svg.call(zoom);

      //Zoom handling, so if u zoom out the timeline(x axis) will adjust accordingly
      //10min->15mins->30mins->1hr
      function getTickInterval(zoomLevel) {
        if (zoomLevel < 0.5) return d3.timeHour.every(6);
        if (zoomLevel < 0.8) return d3.timeHour.every(1);
        if (zoomLevel < 1.5) return d3.timeMinute.every(30);
        if (zoomLevel < 2.5) return d3.timeMinute.every(15);
        else return d3.timeMinute.every(10);
      }
    }, [startDate, endDate]);

    return (
      <div>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <p>
          Scroll at the Gantt chart area to zoom.<br />
          <strong>Currently only NB arrival</strong>
        </p>
         <div style={{ 
        backgroundColor: "#f5f5f5", 
        padding: "10px", 
        borderRadius: "5px",
        marginBottom: "10px"
      }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Flight Details:</h3>
        <p style={{ margin: "5px 0" }}>Flight ID: {selectedFlight.id}</p>
        <p style={{ margin: "5px 0" }}>Aircraft Type: {selectedFlight.aircraftType}</p>
        <p style={{ margin: "5px 0" }}>EIBT:{selectedFlight.eibt.toLocaleString()}</p>
        <p style={{ margin: "5px 0" }}>AIBT: {selectedFlight.aibt.toLocaleString()}</p>
        <p style={{ margin: "5px 0" }}>SOBT: {selectedFlight.sobt.toLocaleString()}</p>
      </div>
          <button onClick={handlePrev}>← Prev</button>
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate.toISOString().split("T")[0]}
            disabled
          />
          <button onClick={handleNext}>Next →</button>
        </div>

        <svg ref={svgRef}></svg>

        {/* legend */} 
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#f5f5f5",
            borderRadius: "5px",
          }}
        >
          <h4>Legend:</h4>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "15px",
                  backgroundColor: "#4A90E2",
                }}
              ></div>
              <span>Planned</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "15px",
                  backgroundColor: "#50C878",
                }}
              ></div>
              <span>Actual (On Time)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "20px",
                  height: "15px",
                  backgroundColor: "#E74C3C",
                }}
              ></div>
              <span>Delay</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "7px",
                  height: "15px",
                  backgroundColor: "#4A90E2",
                  borderTop: "5px dashed #4A90E2",
                }}
              ></div>
              <span>Planned Deadline</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "7px",
                  height: "15px",
                  backgroundColor: "#50C878",
                  borderTop: "5px dashed #50C878",
                }}
              ></div>
              <span>Actual Deadline</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "15px",
                  height: "2px",
                  backgroundColor: "gray",
                  borderTop: "4px dashed gray",
                }}
              ></div>
              <span>Dependency</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //actual milestones
  const milestoneTemplates = [
    {
      id: "4",
      name: "Door 2 Security - Security",
      planned_end: -15,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },
    {
      id: "10",
      name: "RSM MAB(PLB activation time) - Ramp",
      planned_end: -10,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },
    {
      id: "13",
      name: "Arrival team MAB - Pax",
      planned_end: -10,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },
    {
      id: "9",
      name: "MAB(Cleaning team) - AIC",
      planned_end: -5,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },
    {
      id: "5",
      name: "Catering MAB (Highlifts arrive at aircraft site) - Cabin Svc",
      planned_end: -5,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },
    {
      id: "17",
      name: "RLO MAB - Ramp",
      planned_end: -5,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },

    {
      id: "11",
      name: "Thumbs up - Ramp",
      planned_end: +3,
      anchor: "aibt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      // actual_start: 0,
      // actual_end: 0
    },

    {
      id: "12",
      name: "PLB Dock/PAX Step - Ramp",
      planned_end: +4,
      anchor: "aibt",
      aircraftTypes: ["NB"],
      dependsOn: ["4", "10"],
      // actual_start: 0,
      // actual_end: 0
    },

    {
      id: "20",
      name: "Unloading Start & End - Ramp",
      planned_start: +3,
      planned_end: +30,
      anchor: "aibt",
      aircraftTypes: ["NB"],
      dependsOn: ["17"],
      // actual_start: 0,
      // actual_end: 0
    },

    {
      id: "7",
      name: "Unlloading Start and End - Cabin Svc",
      planned_start: +5,
      planned_end: +30,
      anchor: "aibt",
      aircraftTypes: ["NB"],
      dependsOn: ["5"],
      // actual_start: 0,
      // actual_end: 0
    },

    {
      id: "18",
      name: "First and last trip start(to arrival belt) - Baggage",
      planned_start: +10,
      planned_end: +25,
      anchor: "aibt",
      aircraftTypes: ["NB"],
      dependsOn: ["20"],
      // actual_start: 0,
      // actual_end: 0
    },

    {
      id: "14",
      name: "Cleaning Start & End - AIC",
      planned_start: +15,
      planned_end: +30,
      anchor: "aibt",
      aircraftTypes: ["NB"],
      dependsOn: ["4", "9", "12"],
      // actual_start: 0,
      // actual_end: 0
    },

    ////Dummy Milestones/////////////////
    //dependsOn:[] is case seneitive if using letters as id
    {
      id: "A",
      name: "Dummy milestone A",
      planned_start: -50,
      planned_end: -30,
      anchor: "eibt",
      aircraftTypes: ["NB"], 
      dependsOn: [],
      actual_start: -50, //can leave null if not started
      actual_end: -20, //can leave null if not ended
    },
    {
      id: "B",
      name: "Dummy milestone B",
      planned_start: -35,
      planned_end: -20,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: ["A"],
      actual_start: -32,
      actual_end: -15,
    },
    {
      //Template for milestones that only have endtime
      id: "C",
      name: "Dummy milestone C (end only)",
      planned_end: -10,
      anchor: "eibt",
      aircraftTypes: ["NB"],
      dependsOn: ["B"],
      actual_end: -8,
    },

        {
      id: "D",
      name: "Dummy milestone D",
      planned_start: -50,
      planned_end: -30,
      anchor: "sobt",
      aircraftTypes: ["NB"],
      dependsOn: [],
      actual_start: -50, //can leave null if not started
      actual_end: -20, //can leave null if not ended
    },

        {
      id: "E",
      name: "Dummy milestone E",
      planned_start: -50,
      planned_end: -30,
      anchor: "sobt",
      aircraftTypes: ["NB"],
      dependsOn: ['D'],
      actual_start: -50, //can leave null if not started
      actual_end: -20, //can leave null if not ended
    },
  ];

  export default GanttChart;
