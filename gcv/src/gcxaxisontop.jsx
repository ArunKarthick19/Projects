import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const GanttChart = () => {
  const svgRef = useRef();
  const zoomRef = useRef(); // store zoom behavior for later use

  const [startDate, setStartDate] = useState(
    () => new Date("2025-09-10T00:00:00")
  );
  const [endDate, setEndDate] = useState(() => new Date("2025-09-11T00:00:00"));
  // pls take not that the date format is standard like this Date("2025-09-11T00:00:00") which means 11 sept 2025 0000hrs(24hrs)

  // flight details///////////////////////////////////////////////////////////////////////////////////////////////////

  const selectedFlight = {
    id: "XY123456",
    aircraftType: "NB",
    eibt: new Date("2025-09-10T15:00:00"), //SIBT/EIBT
    aibt: new Date("2025-09-10T15:02:00"), //AIBT
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

  const handleResetDate = () => {
    const resetStart = new Date("2025-09-09T12:00:00");
    const resetEnd = new Date("2025-09-10T12:00:00");
    setStartDate(resetStart);
    setEndDate(resetEnd);

    // d3.select(svgRef.current).transition().duration(500).call(
    //   zoom.transform,
    //   d3.zoomIdentity // holding the zoom after hot key
    // );

    if (zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(500)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    } //holding zoom
  };

  const handleDateChange = (dateStr) => {
    const newStart = new Date(dateStr + "T00:00:00");
    setStartDate(newStart);
    setEndDate(new Date(newStart.getTime() + 24 * 60 * 60 * 1000));
  }; //custom date button

  useEffect(() => {
    const drawGridLines = (scale, milestones) => {
      // Clear previous grid lines
      chartGroup.selectAll(".vertical-grid").remove();
      chartGroup.selectAll(".horizontal-grid").remove();

      // Vertical grid lines based on x-axis ticks
      // const tickInterval = getTickInterval(1); // Use zoomLevel = 1 for initial
      // const ticks = scale.ticks(tickInterval);

      // chartGroup
      //   .selectAll(".vertical-grid")
      //   .data(ticks)
      //   .join("line")
      //   .attr("class", "vertical-grid")
      //   .attr("x1", (d) => scale(d))
      //   .attr("x2", (d) => scale(d))
      //   .attr("y1", 0)
      //   .attr("y2", innerHeight)
      //   //.attr("stroke", "#e0e0e0") //colourlol
      //   .attr("stroke", "#A6A6A6")
      //   .attr("stroke-width", 1);

      // Horizontal grid lines for each milestone row
      for (let i = 0; i <= milestones.length; i++) {
        chartGroup
          .append("line")
          .attr("class", "horizontal-grid")
          .attr("x1", 0)
          .attr("x2", innerWidth)
          .attr("y1", i * milestone_spacing)
          .attr("y2", i * milestone_spacing)
          //.attr("stroke", "#e0e0e0") //colourlol
          .attr("stroke", "#A6A6A6")
          .attr("stroke-width", 1);
      }
    };

    const svg = d3.select(svgRef.current);
    const tooltip = d3.select("#tooltip");

    //const width = 1200;
    const width = window.innerWidth - 40;

    //to adjust spacing
    const taskHeight = 8;
    const barSpacing = 0;
    const milestone_spacing = 40;
    //const margin = { top: 20, right: 20, bottom: 100, left: 400 };
    const margin = { top: 20, right: 30, bottom: 100, left: 320 };
    const numMilestones = milestoneTemplates.length;
    const height =
      numMilestones * milestone_spacing + margin.top + margin.bottom; //to adjust height based on number of milestones

    svg.selectAll("*").remove(); //remove previous drawings before rendering new content???
    svg
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("background", "#1f2937"); //colourlol

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

      const positionTooltip = () => {
    tooltip
      .style("left", `${margin.left + innerWidth - 250}px`)
      .style("top", `${margin.top + 245}px`);
  };

    const xScale = d3 //the horizontal time scale, range is the width of the chart
      .scaleTime()
      .domain([startDate, endDate])
      .range([0, innerWidth]);
    const xAxisGroup = chartGroup
      .append("g")
      .attr("transform", `translate(0, 0)`)
      .attr("class", "x-axis");

    const drawAxis = (scale, zoomLevel) => {
      //draws & redraw axis based on zoom level with time scale
      const tickInterval = getTickInterval(zoomLevel);
      const axis = d3
        .axisTop(scale)

        .ticks(tickInterval)
        //.tickFormat(d3.timeFormat("%d %b %H:%M"));
        .tickFormat((d) => {
          // Show date + time for midnight (00:00), only time for other hours
          if (d.getHours() === 0 && d.getMinutes() === 0) {
            return d3.timeFormat("%H:%M %d %b ")(d);
          } else {
            return d3.timeFormat("%H:%M")(d);
          }
        });
      const vhToPx = (vh) => (vh * window.innerHeight) / 100;

      xAxisGroup.call(axis);
      xAxisGroup
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .attr("dx", vhToPx(6))
        .attr("dy", vhToPx(-2))
        .style("font-size", "10px")
        .style("user-select", "none")
        .style("fill", "white"); //colourlol
    };

    // milestone mapping, filters based on a/c type and calculates planned & actual times
    const milestones = milestoneTemplates
      .filter((t) => t.aircraftTypes.includes(selectedFlight.aircraftType)) // filter a/c type
      .map((t) => {
        const anchorTime = selectedFlight[t.anchor]; // get time based on anchor(sobt, aibt, sibt)
        // timing for the gantt chart is being is shifted 30mins earlier cuz when shifting the timeline axis to the top it causes
        // the gantt chart bars to "appear" 30mins infront,NOT that the actual planned&actual timings are off. So to make it "appear" at the
        // right place I added -30mins offset
        const toDate = (offsetMin) =>
          offsetMin != null
            ? new Date(anchorTime.getTime() + (offsetMin - 0) * 60000)
            : null;

        return {
          ...t,
          planned: {
            // planned calculations
            start: toDate(t.planned_start),
            end: toDate(t.planned_end),
          },
          actual: {
            // actual calculations
            start: toDate(t.actual_start),
            end: toDate(t.actual_end),
          },
          isDeadline: t.planned_start == null && t.planned_end != null, // milestone which are end only
          isAIBTBlock: t.name === "SIBT/EIBT & AIBT",
          isSOBTBlock: t.name == "SOBT/EOBT & AOBT",
        };
      });

    drawAxis(xScale, 1);

    const currentTime = new Date("2025-09-10T17:16:00"); //current time
    currentTime.setMinutes(currentTime.getMinutes() - 0); // for the 30mins offset

    // Add a vertical line at the current time
    const verticalLine = chartGroup
      .append("line")
      .attr("x1", xScale(currentTime))
      .attr("x2", xScale(currentTime))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "orange") //colourlol
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", null);

    const milestonesconsolelog = milestoneTemplates //ONLY FOR DEBUGGING
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

        const milestoneName = t.name || "(no name)";

        const fmt = (d) =>
          d
            ? d.toLocaleString("en-SG", { hour: "2-digit", minute: "2-digit" })
            : "N/A";

        console.log(`Milestone: ${milestoneName}`);
        console.log(`Planned Start: ${fmt(plannedStart)}`);
        console.log(`Planned End  : ${fmt(plannedEnd)}`);
        console.log(`Actual Start : ${fmt(actualStart)}`);
        console.log(`Actual End   : ${fmt(actualEnd)}`);
        console.log(
          `Depends On   : ${
            t.dependsOn?.length ? t.dependsOn.join(", ") : "None"
          }`
        );
        console.log(
          `Affects      : ${t.affects?.length ? t.affects.join(", ") : "None"}`
        );
        console.log("----------------------------------------");

        return {
          ...t,
          planned: {
            //planned calculations
            start: toDate(t.planned_start),
            end: toDate(t.planned_end),
          },
          actual: {
            //actual calculations
            start: toDate(t.actual_start),
            end: toDate(t.actual_end),
          },
          isDeadline:
            t.planned_start == null &&
            t.planned_end != null &&
            t.name != "SIBT/EIBT & AIBT", //milestone where which are end only
          isAIBTBlock: t.name == "SIBT/EIBT & AIBT",
          isSOBTBlock: t.name == "SOBT/EOBT & AOBT",
        };
      });

      const getLiveStatus = (d) => {
  if (!d.actual?.start) return "NOT STARTED";

  if (currentTime < d.actual.start) return null;

  if (d.actual.end && currentTime > d.actual.end) {
    return d.actual.end > d.planned.end ? "COMPLETED (LATE)" : "COMPLETED";
  }

  return "IN PROGRESS";
};


    const renderTasks = (scale) => {
      chartGroup.selectAll("rect.planned-task").remove();
      chartGroup.selectAll("rect.actual-task").remove();
      chartGroup.selectAll("rect.delay-task").remove();
      chartGroup.selectAll("line.planned-deadline").remove();
      chartGroup.selectAll("line.actual-deadline").remove();
      chartGroup.selectAll("path.planned-AIBTblocks").remove();
      chartGroup.selectAll("path.actual-AIBTblocks").remove();
      chartGroup.selectAll("path.planned-SOBTblocks").remove();
      chartGroup.selectAll("path.actual-SOBTblocks").remove();
      chartGroup.selectAll("text.label").remove();
      chartGroup.selectAll("line.dependency").remove();
      chartGroup.selectAll("rect.row-bg").remove();


const hoverLabel = chartGroup
  .append("text")
  .attr("class", "hover-label")
  .attr("fill", "white")
  .attr("font-size", "10px")
  .attr("text-anchor", "start")
  .attr("opacity", 0)
  .style("pointer-events", "none");




      //       const highlightMilestone = (milestoneId) => {
      //   chartGroup
      //     .selectAll(
      //       "rect.planned-task, rect.actual-task, rect.delay-task, path.planned-deadline, path.actual-deadline"
      //     )
      //     .filter((d) => d.id === milestoneId)
      //     .transition()
      //     .duration(150)
      //     .attr("opacity", 1);

      //   labelGroup
      //     .selectAll("text.milestone-label")
      //     .filter((d) => d.id === milestoneId)
      //     .transition()
      //     .duration(150)
      //     .style("opacity", 1);
      // };
    const isInProgress = (milestone, currentTime) => {
  // Check if milestone has started but not ended
  const hasStarted = milestone.actual.start && milestone.actual.start <= currentTime;
  const hasNotEnded = !milestone.actual.end || milestone.actual.end > currentTime;
  
  return hasStarted && hasNotEnded;
};
      const highlightMilestone = (milestoneId) => {
        // Find the milestone data for the one being hovered
        const milestone = milestones.find((m) => m.id === milestoneId);
        if (!milestone) return;

        // Collect all linked IDs (this milestone + its dependencies + its affected milestones)
        const relatedIds = new Set([
          milestoneId,
          ...(milestone.dependsOn || []),
          ...(milestone.affects || []),
        ]);

        // Apply highlight to all milestone shapes
        chartGroup
          .selectAll(
            "rect.planned-task, rect.actual-task, rect.delay-task, " +
              "path.planned-deadline, path.actual-deadline, " +
              "path.planned-AIBTblocks, path.actual-AIBTblocks, " +
              "path.planned-SOBTblocks, path.actual-SOBTblocks"
          )
          .transition()
          .duration(150)
          .attr("opacity", (d) => (relatedIds.has(d.id) ? 1 : 0.55));
        // .style("fill", (d) => {
        //   if (d.id === milestoneId) return null; // Keep original color for hovered milestone
        //   if (relatedIds.has(d.id)) return "red"; // Turn related milestones red
        //   return null;
        // });

        // highlight labels
        labelGroup
          .selectAll("text.milestone-label")
          .transition()
          .duration(150)
          .style("opacity", (d) => (relatedIds.has(d.id) ? 1 : 0.55))
          .style("fill", (d) => {
            if (d.id === milestoneId) return "white"; // Keep original color for hovered milestone
            if (relatedIds.has(d.id)) return "#E53935"; // Turn related labels red
            return "white";
          });

        // // Highlight row backgrounds //HIGHLIGHT THE DEPENDENT ROWS AS WELL
        // chartGroup
        //   .selectAll("rect.row-bg")
        //   .transition()
        //   .duration(150)
        //   .attr("opacity", (d) => (relatedIds.has(d.id) ? 0.25 : 0.1))
        //   .attr("fill", (d) => (relatedIds.has(d.id) ? "#1e90ff" : "#3a3a3a"));
        //         // Highlight ONLY the hovered milestone row
        chartGroup //HIGHLIGHT ONLY HOVERED ROW
          .selectAll("rect.row-bg")
          .transition()
          .duration(150)
          .attr("opacity", (d) => (d.id === milestoneId ? 0.45 : 0.1))
          .attr("fill", (d) => (d.id === milestoneId ? "#737363" : "#3a3a3a"));
      };

      const resetHighlight = () => {
        chartGroup
          .selectAll(
            "rect.planned-task, rect.actual-task, rect.delay-task, " +
              "path.planned-deadline, path.actual-deadline, " +
              "path.planned-AIBTblocks, path.actual-AIBTblocks, " +
              "path.planned-SOBTblocks, path.actual-SOBTblocks"
          )
          .transition()
          .duration(150)
          .attr("opacity", 0.55)
          .style("fill", null);

        labelGroup
          .selectAll("text.milestone-label")
          .transition()
          .duration(150)
          .style("opacity", 0.55)
          .style("fill", "white");

        chartGroup // for the whole row highlight to diappear
          .selectAll("rect.row-bg")
          .transition()
          .duration(150)
          .attr("opacity", 0.1)
          .attr("fill", "#3a3a3a");
      };

      // Helper functions for dependency line visibility
      const showDependencyLines = (milestoneId) => {
        // Show lines where this milestone is the source (dependencies going out)
        const lineColor = "white"; // Set the line color to white
        chartGroup
          .selectAll(`[data-dependency-id^="${milestoneId}->"]`)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .style("stroke", lineColor); // Change line color

        // Show lines where this milestone is the target (dependencies coming in)
        chartGroup
          .selectAll(`[data-dependency-id$="->${milestoneId}"]`)
          .transition()
          .duration(200)
          .attr("opacity", 1);
      };

      const hideDependencyLines = () => {
        chartGroup
          .selectAll("line.dependency-horizontal, line.dependency-vertical")
          .transition()
          .duration(200)
          .attr("opacity", 0);
      };

      // Draw faint background rectangles for each milestone row
      chartGroup
        .selectAll("rect.row-bg")
        .data(milestones)
        .join("rect")
        .attr("class", "row-bg")
        .attr("x", 0)
        .attr("y", (d, i) => i * milestone_spacing)
        .attr("width", innerWidth)
        .attr("height", milestone_spacing)
        .attr("fill", "#3a3a3a") // default row color
        .attr("opacity", 0.1) // subtle base opacity
        .lower(); // ensure it stays behind bars

      // Milestone labels //colourlol
      labelGroup
        .selectAll("text.milestone-label")
        .data(milestones)
        .join("text")
        .attr("class", "milestone-label")
        .text((d) => d.name)
        .attr("x", margin.left - 10)
        .attr("y", (d, i) => i * milestone_spacing + milestone_spacing / 2)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .attr("fill", "white")
        .style("font-size", "12px")
        .style("opacity", 0.55); // makes labels softer

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
          return (
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2
          );
        })
        .attr("width", (d) => scale(d.planned.end) - scale(d.planned.start))
        .attr("height", taskHeight)
        .attr("fill", "#4A90E2")
        .attr("opacity", 0.55)
        .on("mouseover", (event, d) => { //mouseover for planned task bars
    showDependencyLines(d.id);
  highlightMilestone(d.id);

  // ---- TIME DATA ----
  const now = currentTime;
  const plannedStart = d.planned?.start;
  const plannedEnd = d.planned?.end;
  const actualStart = d.actual?.start;
  const actualEnd = d.actual?.end;

  const fmt = (t) =>
    t ? d3.timeFormat("%I:%M %p")(new Date(t)) : "N/A";

  // ---- LABEL POSITION ----
  const rowIndex = milestones.findIndex((m) => m.id === d.id);

  // center X based on bar (planned or actual)
  const centerX =
    plannedStart && plannedEnd
      ? (currentScale(plannedStart) + currentScale(plannedEnd)) / 2
      : actualStart
      ? currentScale(actualStart)
      : currentScale(plannedStart || actualEnd);

  const centerY = rowIndex * milestone_spacing - 10;

// ---- LABEL TEXT LOGIC (FINAL) ----
let displayText = "";
let statusText = "";

// 1️⃣ NOT STARTED (no actualStart OR current time before actualStart)
if (!actualStart || now < actualStart) {
  displayText = `${fmt(plannedStart)} – ${fmt(plannedEnd)}`;
  statusText = "NOT STARTED";
}

// 2️⃣ IN PROGRESS (started, but not yet finished as of 'now')
else if (!actualEnd || now < actualEnd) {
  displayText = `${fmt(actualStart)} – ${fmt(plannedEnd)}`;
  statusText = "IN PROGRESS";
}

// 3️⃣ COMPLETED (only after actualEnd is in the past)
else {
  displayText = `${fmt(actualStart)} – ${fmt(actualEnd)}`;
  statusText =
    actualEnd > plannedEnd ? "COMPLETED (LATE)" : "COMPLETED";
}




const [mouseX, mouseY] = d3.pointer(event, chartGroup.node());

// ✅ 2️⃣ THEN USE IT
hoverLabel
  .attr("x", mouseX + 4)   
  .attr("y", mouseY - 4)  
  .attr("font-size", "9px")
  .attr("text-anchor", "start")
  .text(`${d.name} | ${displayText} — ${statusText}`)
  .attr("opacity", 1);






          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;

          // Format affects with red color if current milestone is delayed
          const affectsDisplay =
            d.affects?.length > 0
              ? isDelayed
                ? d.affects
                    .map(
                      (id) =>
                        `<span style="color: red; font-weight: bold;">${id}</span>`
                    )
                    .join(", ")
                : d.affects.join(", ")
              : "N/A";



  

          //planned milestone
          tooltip
            .style("display", "block")
            // .style("left", "1600px") //use 31vw and 95vh for bottomleft
            // .style("top", "355px")
            positionTooltip();
            tooltip
            .html(`
              <strong>${d.name}</strong><br/>
              Planned Start: ${
                d.planned.start
                  ? new Date(
                      new Date(d.planned.start).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }<br/>
              Planned End: ${
                d.planned.end
                  ? new Date(
                      new Date(d.planned.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }<br/>
              Actual Start: ${
                d.actual.start
                  ? new Date(
                      new Date(d.actual.start).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }${
            startDelay
              ? ' <span style="color: red; font-weight: bold;">(STARTED LATE)</span>'
              : ""
          }<br/>
              Actual End: ${
                d.actual.end
                  ? new Date(
                      new Date(d.actual.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(ENDED LATE)</span>'
              : ""
          }<br/>
              <strong>Depends On: ${
                d.dependsOn?.length > 0 ? d.dependsOn.join(", ") : "N/A"
              }</strong><br/>
              <strong>Affects: ${affectsDisplay}</strong>
            `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => { //mouseout for planned task bars
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
          hoverLabel.attr("opacity", 0);
        });

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
          return (
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight +
            barSpacing
          );
        })
        .attr("width", (d) => {
          const actualEnd = d.actual.end;
          const plannedEnd = d.planned.end;
          const endTime = actualEnd <= plannedEnd ? actualEnd : plannedEnd;
          return scale(endTime) - scale(d.actual.start);
        })
        .attr("height", taskHeight)
        .attr("fill", "#50C878")
        .attr("opacity", 0.55)

        .on("mouseover", (event, d) => { //mouseover for actual task bars
          showDependencyLines(d.id);
          highlightMilestone(d.id);

          // ---- TIME DATA ----
  const now = currentTime;
  const plannedStart = d.planned?.start;
  const plannedEnd = d.planned?.end;
  const actualStart = d.actual?.start;
  const actualEnd = d.actual?.end;

  const fmt = (t) =>
    t ? d3.timeFormat("%I:%M %p")(new Date(t)) : "N/A";

  // ---- LABEL POSITION ----
  const rowIndex = milestones.findIndex((m) => m.id === d.id);

  // center X based on bar (planned or actual)
  const centerX =
    plannedStart && plannedEnd
      ? (currentScale(plannedStart) + currentScale(plannedEnd)) / 2
      : actualStart
      ? currentScale(actualStart)
      : currentScale(plannedStart || actualEnd);

  const centerY = rowIndex * milestone_spacing - 10;

// ---- LABEL TEXT LOGIC (FINAL) ----
let displayText = "";
let statusText = "";

// 1️⃣ NOT STARTED (no actualStart OR current time before actualStart)
if (!actualStart || now < actualStart) {
  displayText = `${fmt(plannedStart)} – ${fmt(plannedEnd)}`;
  statusText = "NOT STARTED";
}

// 2️⃣ IN PROGRESS (started, but not yet finished as of 'now')
else if (!actualEnd || now < actualEnd) {
  displayText = `${fmt(actualStart)} – ${fmt(plannedEnd)}`;
  statusText = "IN PROGRESS";
}

// 3️⃣ COMPLETED (only after actualEnd is in the past)
else {
  displayText = `${fmt(actualStart)} – ${fmt(actualEnd)}`;
  statusText =
    actualEnd > plannedEnd ? "COMPLETED (LATE)" : "COMPLETED";
}


const [mouseX, mouseY] = d3.pointer(event, chartGroup.node());

hoverLabel
  .attr("x", mouseX + 4)   
  .attr("y", mouseY - 12)   
  .attr("font-size", "9px")
  .attr("text-anchor", "start")
  .text(`${d.name} | ${displayText} — ${statusText}`)
  .attr("opacity", 1);



          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;

          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
            <strong style="color: ${isDelayed}">${d.name}</strong><br/>
            Planned Start: ${d.planned.start?.toLocaleString() || "N/A"}<br/>
            Planned End: ${d.planned.end?.toLocaleString() || "N/A"}<br/>
            Actual Start: ${d.actual.start?.toLocaleString() || "N/A"}${
            startDelay
              ? ' <span style="color: red; font-weight: bold;">(STARTED LATE)</span>'
              : ""
          }<br/>
            Actual End: ${d.actual.end?.toLocaleString() || "N/A"}${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(ENDED LATE)</span>'
              : ""
          }<br/>
            <strong>Depends On: ${
              d.dependsOn?.length > 0 ? d.dependsOn.join(", ") : "N/A"
            }</strong><br/>
            <strong>Affects: ${
              d.affects?.length > 0 ? d.affects.join(", ") : "N/A"
            }</strong>
          `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => { //mouseout for actual task bars
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
          hoverLabel.attr("opacity", 0);
        });

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
          return (
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight +
            barSpacing
          );
        })
        .attr("width", (d) => scale(d.actual.end) - scale(d.planned.end))
        .attr("height", taskHeight)
        .attr("fill", "#ff1800")
        .attr("opacity", 0.6)

        .on("mouseover", (event, d) => { //mouseover for delay task bars
          showDependencyLines(d.id);
          highlightMilestone(d.id);
          // ---- TIME DATA ----
  const now = currentTime;
  const plannedStart = d.planned?.start;
  const plannedEnd = d.planned?.end;
  const actualStart = d.actual?.start;
  const actualEnd = d.actual?.end;

  const fmt = (t) =>
    t ? d3.timeFormat("%I:%M %p")(new Date(t)) : "N/A";

  // ---- LABEL POSITION ----
  const rowIndex = milestones.findIndex((m) => m.id === d.id);

  // center X based on bar (planned or actual)
  const centerX =
    plannedStart && plannedEnd
      ? (currentScale(plannedStart) + currentScale(plannedEnd)) / 2
      : actualStart
      ? currentScale(actualStart)
      : currentScale(plannedStart || actualEnd);

  const centerY = rowIndex * milestone_spacing - 10;

// ---- LABEL TEXT LOGIC (FINAL) ----
let displayText = "";
let statusText = "";

// 1️⃣ NOT STARTED (no actualStart OR current time before actualStart)
if (!actualStart || now < actualStart) {
  displayText = `${fmt(plannedStart)} – ${fmt(plannedEnd)}`;
  statusText = "NOT STARTED";
}

// 2️⃣ IN PROGRESS (started, but not yet finished as of 'now')
else if (!actualEnd || now < actualEnd) {
  displayText = `${fmt(actualStart)} – ${fmt(plannedEnd)}`;
  statusText = "IN PROGRESS";
}

// 3️⃣ COMPLETED (only after actualEnd is in the past)
else {
  displayText = `${fmt(actualStart)} – ${fmt(actualEnd)}`;
  statusText =
    actualEnd > plannedEnd ? "COMPLETED (LATE)" : "COMPLETED";
}


const [mouseX, mouseY] = d3.pointer(event, chartGroup.node());

hoverLabel
  .attr("x", mouseX + 4)   
  .attr("y", mouseY - 12)  
  .attr("font-size", "9px")
  .attr("text-anchor", "start")
  .text(`${d.name} | ${displayText} — ${statusText}`)
  .attr("opacity", 1);


          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;

          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
            <strong style="color: ${isDelayed}">${d.name}</strong><br/>
            Planned Start: ${d.planned.start?.toLocaleString() || "N/A"}<br/>
            Planned End: ${d.planned.end?.toLocaleString() || "N/A"}<br/>
            Actual Start: ${d.actual.start?.toLocaleString() || "N/A"}${
            startDelay
              ? ' <span style="color: red; font-weight: bold;">(STARTED LATE)</span>'
              : ""
          }<br/>
            Actual End: ${d.actual.end?.toLocaleString() || "N/A"}${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(ENDED LATE)</span>'
              : ""
          }<br/>
            <strong>Depends On: ${
              d.dependsOn?.length > 0 ? d.dependsOn.join(", ") : "N/A"
            }</strong><br/>
            <strong>Affects: ${
              d.affects?.length > 0 ? d.affects.join(", ") : "N/A"
            }</strong>
          `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => { //mouseout for delay task bars
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
          hoverLabel.attr("opacity", 0);
        });

      function starPath(x, y, radius, spikes = 5) {
        let path = "";
        const step = Math.PI / spikes;
        let rot = (Math.PI / 2) * 3; // rotate to start pointing up
        let outerRadius = radius;
        let innerRadius = radius / 2;

        let startX = x + Math.cos(rot) * outerRadius;
        let startY = y + Math.sin(rot) * outerRadius;
        path = `M${startX},${startY}`;

        for (let i = 0; i < spikes; i++) {
          let x1 = x + Math.cos(rot) * outerRadius;
          let y1 = y + Math.sin(rot) * outerRadius;
          path += `L${x1},${y1}`;
          rot += step;

          let x2 = x + Math.cos(rot) * innerRadius;
          let y2 = y + Math.sin(rot) * innerRadius;
          path += `L${x2},${y2}`;
          rot += step;
        }

        return path + "Z";
      }

      //BLOCKS
      const plannedSOBTBlocks = milestones.filter((m) => m.isSOBTBlock);
      chartGroup
        .selectAll("path.planned-SOBTblocks")
        .data(plannedSOBTBlocks)
        .join("path")
        .attr("class", "planned-SOBTblocks")
        .attr("d", (d) => {
          const originalIndex = milestones.findIndex((m) => m.id === d.id);
          const x = scale(d.planned.end);
          const y =
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight / 2;

          const size = 3.5;
          return starPath(x, y, size);
        })
        .attr("fill", "#ffdd00ff")
        .attr("stroke", "#ffdd00ff")
        .attr("opacity", "0.55")

        .attr("stroke-width", 3)
        .on("mouseover", (event, d) => {  //mouseover for planned SOBT blocks
          showDependencyLines(d.id);
          highlightMilestone(d.id);
          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;
          //planned blocks?
          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
              <strong>${d.name}</strong><br/>
              SOBT/OIBT: ${
                d.planned.end
                  ? new Date(
                      new Date(d.planned.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }<br/>
              AOBT: ${
                d.actual.end
                  ? new Date(
                      new Date(d.actual.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(LATE)</span>'
              : ""
          }<br/>

            `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => { 
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
        });

      //actualSOBTblocks
      const actualSOBTblocks = milestones.filter((m) => m.isSOBTBlock);

      chartGroup
        .selectAll("path.actual-SOBTblocks")
        .data(actualSOBTblocks)
        .join("path")
        .attr("class", "actual-SOBTblocks")
        .attr("d", (d) => {
          const originalIndex = milestones.findIndex((m) => m.id === d.id);
          const x = scale(d.actual.end);
          const y =
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight +
            barSpacing +
            taskHeight / 2;
          const size = 3.5;
          return starPath(x, y, size);
        })
        .attr("fill", (d) =>
          d.actual.end > d.planned.end ? "#E74C3C" : "#50C878"
        )
        .attr("stroke", (d) =>
          d.actual.end > d.planned.end ? "#E74C3C" : "#50C878"
        )
        .attr("stroke-width", 3)
        .attr("opacity", "0.55")
        .on("mouseover", (event, d) => { //mouseover for actual SOBT blocks
          highlightMilestone(d.id);
          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
        <strong>${d.name}</strong><br/>
        SOBT/EOBT: ${
          d.planned.end
            ? new Date(
                new Date(d.planned.end).getTime() + 30 * 60000
              ).toLocaleString()
            : "N/A"
        }<br/>
        AOBT: ${
          d.actual.end
            ? new Date(
                new Date(d.actual.end).getTime() + 30 * 60000
              ).toLocaleString()
            : "N/A"
        }${
            d.actual.end > d.planned.end
              ? ' <span style="color: red; font-weight: bold;">(DELAYED)</span>'
              : ' <span style="color: green; font-weight: bold;">(ON TIME)</span>'
          }
      `);
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
          resetHighlight();
        });

      //BLOCKS
      const plannedAIBTBlocks = milestones.filter((m) => m.isAIBTBlock);
      chartGroup
        .selectAll("path.planned-AIBTblocks")
        .data(plannedAIBTBlocks)
        .join("path")
        .attr("class", "planned-AIBTblocks")
        .attr("d", (d) => {
          const originalIndex = milestones.findIndex((m) => m.id === d.id);
          const x = scale(d.planned.end);
          const y =
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight / 2;

          const size = 3.5;
          return starPath(x, y, size);
        })
        .attr("fill", "#ffdd00ff") // Blue fill for the diamond
        .attr("stroke", "#ffdd00ff")
        .attr("stroke-width", 3)
        .attr("opacity", "0.55")

        .on("mouseover", (event, d) => { //mouseover for planned AIBT blocks
          showDependencyLines(d.id);
          highlightMilestone(d.id);

          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;
          //planned blocks?
          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
              <strong>${d.name}</strong><br/>
              SIBT/EIBT: ${
                d.planned.end
                  ? new Date(
                      new Date(d.planned.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }<br/>
              AIBT: ${
                d.actual.end
                  ? new Date(
                      new Date(d.actual.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(LATE)</span>'
              : ""
          }<br/>

            `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => {
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
        });

      //actualAIBTblocks
      const actualAIBTblocks = milestones.filter((m) => m.isAIBTBlock);

      chartGroup
        .selectAll("path.actual-AIBTblocks")
        .data(actualAIBTblocks)
        .join("path")
        .attr("class", "actual-AIBTblocks")
        .attr("d", (d) => {
          const originalIndex = milestones.findIndex((m) => m.id === d.id);
          const x = scale(d.actual.end);
          const y =
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight +
            barSpacing +
            taskHeight / 2;
          const size = 3.5;
          return starPath(x, y, size);
        })
        .attr("fill", (d) =>
          d.actual.end > d.planned.end ? "#E74C3C" : "#50C878"
        )
        .attr("stroke", (d) =>
          d.actual.end > d.planned.end ? "#E74C3C" : "#50C878"
        )
        .attr("stroke-width", 3)
        .on("mouseover", (event, d) => { //mouseover for actual AIBT blocks
          highlightMilestone(d.id);
          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
        <strong>${d.name}</strong><br/>
        SIBT/EIBT: ${
          d.planned.end
            ? new Date(
                new Date(d.planned.end).getTime() + 30 * 60000
              ).toLocaleString()
            : "N/A"
        }<br/>
        AIBT: ${
          d.actual.end
            ? new Date(
                new Date(d.actual.end).getTime() + 30 * 60000
              ).toLocaleString()
            : "N/A"
        }${
            d.actual.end > d.planned.end
              ? ' <span style="color: red; font-weight: bold;">(LATE)</span>'
              : ' <span style="color: green; font-weight: bold;">(ON TIME)</span>'
          }
      `);
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
          resetHighlight();
        });

      // Planned deadline markers (blue diamond-shaped)
      const plannedDeadlineMilestones = milestones.filter(
        (m) => m.isDeadline && !m.isAIBTBlock && !m.isSOBTBlock
      );
      chartGroup
        .selectAll("path.planned-deadline")
        .data(plannedDeadlineMilestones)
        .join("path")
        .attr("class", "planned-deadline")
        .attr("d", (d) => {
          const originalIndex = milestones.findIndex((m) => m.id === d.id);
          const x = scale(d.planned.end);
          const y =
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight / 2;

          const size = 3.5;
          return `M${x},${y - size} L${x + size},${y} L${x},${y + size} L${
            x - size
          },${y} Z`;
        })
        .attr("fill", "#4A90E2") // Blue fill for the diamond
        .attr("stroke", "#4A90E2")
        .attr("opacity", "0.55") //opacity for diamond
        .attr("stroke-width", 3)
        .on("mouseover", (event, d) => { //mouseover for planned deadlines
          showDependencyLines(d.id);
          highlightMilestone(d.id);

          // ---- TIME DATA ----
  const now = currentTime;
  const plannedStart = d.planned?.start;
  const plannedEnd = d.planned?.end;
  const actualStart = d.actual?.start;
  const actualEnd = d.actual?.end;

  const fmt = (t) =>
    t ? d3.timeFormat("%I:%M %p")(new Date(t)) : "N/A";

  // ---- LABEL POSITION ----
  const rowIndex = milestones.findIndex((m) => m.id === d.id);

  // center X based on bar (planned or actual)
  const centerX =
    plannedStart && plannedEnd
      ? (currentScale(plannedStart) + currentScale(plannedEnd)) / 2
      : actualStart
      ? currentScale(actualStart)
      : currentScale(plannedStart || actualEnd);

  const centerY = rowIndex * milestone_spacing - 10;

// ---- LABEL TEXT LOGIC (FINAL) ----
let displayText = "";
let statusText = "";

// 1️⃣ NOT STARTED (no actualStart OR current time before actualStart)
if (!actualStart || now < actualStart) {
  displayText = `${fmt(plannedStart)} – ${fmt(plannedEnd)}`;
  statusText = "NOT STARTED";
}

// 2️⃣ IN PROGRESS (started, but not yet finished as of 'now')
else if (!actualEnd || now < actualEnd) {
  displayText = `${fmt(actualStart)} – ${fmt(plannedEnd)}`;
  statusText = "IN PROGRESS";
}

// 3️⃣ COMPLETED (only after actualEnd is in the past)
else {
  displayText = `${fmt(actualStart)} – ${fmt(actualEnd)}`;
  statusText =
    actualEnd > plannedEnd ? "COMPLETED (LATE)" : "COMPLETED";
}


const [mouseX, mouseY] = d3.pointer(event, chartGroup.node());

hoverLabel
  .attr("x", mouseX + 4)   
  .attr("y", mouseY - 4)   
  .attr("font-size", "9px")
  .attr("text-anchor", "start")
  .text(`${d.name} | ${displayText} — ${statusText}`)
  .attr("opacity", 1);


          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;
          //planned deadline?
          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
              <strong>${d.name}</strong><br/>         
              Planned End: ${
                d.planned.end
                  ? new Date(
                      new Date(d.planned.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }<br/>
              Actual End: ${
                d.actual.end
                  ? new Date(
                      new Date(d.actual.end).getTime() + 30 * 60000
                    ).toLocaleString()
                  : "N/A"
              }${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(ENDED LATE)</span>'
              : ""
          }<br/>
              <strong>Depends On: ${
                d.dependsOn?.length > 0 ? d.dependsOn.join(", ") : "N/A"
              }</strong><br/>
              <strong>Affects: ${
                d.affects?.length > 0 ? d.affects.join(", ") : "N/A"
              }</strong>
            `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => { //mouseout for planned deadlines
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
          hoverLabel.attr("opacity", 0);
        });

      // Actual deadline markers (green or red, diamond-shaped)
      const actualDeadlineMilestones = milestones.filter(
        (m) => m.isDeadline && m.actual.end && !m.isAIBTBlock && !m.isSOBTBlock
      );

      chartGroup
        .selectAll("path.actual-deadline")
        .data(actualDeadlineMilestones)
        .join("path")
        .attr("class", "actual-deadline")
        .attr("d", (d) => {
          const originalIndex = milestones.findIndex((m) => m.id === d.id);
          const x = scale(d.actual.end);
          const y =
            originalIndex * milestone_spacing +
            (milestone_spacing - taskHeight * 2 - barSpacing) / 2 +
            taskHeight +
            barSpacing +
            taskHeight / 2;

          const size = 3.5;
          return `M${x},${y - size} L${x + size},${y} L${x},${y + size} L${
            x - size
          },${y} Z`;
        })
        .attr(
          "fill",
          (d) => (d.actual.end > d.planned.end ? "#ff1800" : "#50C878") // Red if actual > planned, green if actual <= planned
        )
        .attr(
          "stroke",
          (d) => (d.actual.end > d.planned.end ? "#ff1800" : "#50C878") // Same color for stroke
        )
        .attr("stroke-width", 3)
        .attr("opacity", "0.60")
        .on("mouseover", (event, d) => { //mouseover for actual deadlines
          showDependencyLines(d.id);
          highlightMilestone(d.id);
const [mouseX, mouseY] = d3.pointer(event, chartGroup.node());
          // ---- TIME DATA ----
  const now = currentTime;
  const plannedStart = d.planned?.start;
  const plannedEnd = d.planned?.end;
  const actualStart = d.actual?.start;
  const actualEnd = d.actual?.end;

  const fmt = (t) =>
    t ? d3.timeFormat("%I:%M %p")(new Date(t)) : "N/A";

  // ---- LABEL POSITION ----
  const rowIndex = milestones.findIndex((m) => m.id === d.id);

  // center X based on bar (planned or actual)
  const centerX =
    plannedStart && plannedEnd
      ? (currentScale(plannedStart) + currentScale(plannedEnd)) / 2
      : actualStart
      ? currentScale(actualStart)
      : currentScale(plannedStart || actualEnd);

  const centerY = rowIndex * milestone_spacing - 10;

// ---- LABEL TEXT LOGIC (FINAL) ----
let displayText = "";
let statusText = "";

// 1️⃣ NOT STARTED (no actualStart OR current time before actualStart)
if (!actualStart || now < actualStart) {
  displayText = `${fmt(plannedStart)} – ${fmt(plannedEnd)}`;
  statusText = "NOT STARTED";
}

// 2️⃣ IN PROGRESS (started, but not yet finished as of 'now')
else if (!actualEnd || now < actualEnd) {
  displayText = `${fmt(actualStart)} – ${fmt(plannedEnd)}`;
  statusText = "IN PROGRESS";
}

// 3️⃣ COMPLETED (only after actualEnd is in the past)
else {
  displayText = `${fmt(actualStart)} – ${fmt(actualEnd)}`;
  statusText =
    actualEnd > plannedEnd ? "COMPLETED (LATE)" : "COMPLETED";
}




hoverLabel
  .attr("x", mouseX + 4)   
  .attr("y", mouseY - 4)   
  .attr("font-size", "9px")
  .attr("text-anchor", "start")
  .text(`${d.name} | ${displayText} — ${statusText}`)
  .attr("opacity", 1);

          // Check for delays
          const startDelay =
            d.actual.start &&
            d.planned.start &&
            d.actual.start > d.planned.start;
          const endDelay =
            d.actual.end && d.planned.end && d.actual.end > d.planned.end;
          const isDelayed = startDelay || endDelay;

          tooltip
            .style("display", "block")
            // .style("left", "70vw") //use 31vw and 95vh for bottomleft
            // .style("top", "31vh")
            positionTooltip();
            tooltip.html(`
            <strong style="color: ${isDelayed}">${d.name}</strong><br/>
            Planned Start: ${d.planned.start?.toLocaleString() || "N/A"}<br/>
            Planned End: ${d.planned.end?.toLocaleString() || "N/A"}<br/>
            Actual Start: ${d.actual.start?.toLocaleString() || "N/A"}${
            startDelay
              ? ' <span style="color: red; font-weight: bold;">(STARTED LATE)</span>'
              : ""
          }<br/>
            Actual End: ${d.actual.end?.toLocaleString() || "N/A"}${
            endDelay
              ? ' <span style="color: red; font-weight: bold;">(ENDED LATE)</span>'
              : ""
          }<br/>
            <strong>Depends On: ${
              d.dependsOn?.length > 0 ? d.dependsOn.join(", ") : "N/A"
            }</strong><br/>
            <strong>Affects: ${
              d.affects?.length > 0 ? d.affects.join(", ") : "N/A"
            }</strong>
          `);
        })
        // .on("mousemove", (event) => {
        //   tooltip
        //     .style("left", event.pageX + 10 + "px")
        //     .style("top", event.pageY + 10 + "px");
        // })
        .on("mouseout", () => { //mouseout for actual deadlines
          hideDependencyLines();
          resetHighlight();
          tooltip.style("display", "none");
          hoverLabel.attr("opacity", 0);
        });

      // Dependencies (L-shaped: horizontal then vertical)
      const dependencyLines = milestones.flatMap((m, i) =>
        m.dependsOn
          ?.map((depId) => {
            const depIndex = milestones.findIndex((d) => d.id === depId);
            const dep = milestones[depIndex];
            if (!dep) return null;

            // source of the dependency line
            const sourceEndTime = dep.planned.end || dep.actual.end;
            const startX = scale(sourceEndTime);
            const startY = depIndex * milestone_spacing + taskHeight / 2;

            // target for dependency line
            const targetStartTime =
              m.planned.start || m.actual.start || m.planned.end;
            const endX = scale(targetStartTime);
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

      // clear old dependency lines, when zooming
      chartGroup.selectAll("line.dependency").remove();
      chartGroup.selectAll("line.dependency-horizontal").remove();
      chartGroup.selectAll("line.dependency-vertical").remove();
      //render dependency lines (hidden by default)
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
        .attr("opacity", 0)
        .attr("data-dependency-id", (d) => d.id);

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
        .attr("opacity", 0)
        .attr("data-dependency-id", (d) => d.id);
    };

    drawGridLines(xScale, milestones);
    renderTasks(xScale);

    let currentScale = xScale; // Add this before the zoom definition

    // Add cursor trackingline and time display
    const cursorLine = chartGroup
      .append("line")
      .attr("class", "cursor-line")
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      //.attr("stroke-dasharray", "5,5") //this makes the trackingline dotted
      .attr("opacity", 0)
      .style("pointer-events", "none");

    const cursorTimeLabel = chartGroup
      .append("text")
      .attr("class", "cursor-time")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("opacity", 0)
      .style("pointer-events", "none")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("padding", "2px 5px")
      .style("border-radius", "3px");

    // Add invisible overlay to capture mouse events
    const overlay = chartGroup
      .append("rect")
      .attr("class", "overlay")
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "none")
      .style("pointer-events", "all")

      // .on("mousemove", function (event) {
      //   const [mouseX] = d3.pointer(event);
      //   const xScale = event.transform
      //     ? event.transform.rescaleX(xScale)
      //     : xScale;
      //   const hoveredTime = xScale.invert(mouseX);

      //   // Adjust for the 30min offset
      //   const displayTime = new Date(hoveredTime.getTime() + 30 * 60000);

      //   cursorLine.attr("x1", mouseX).attr("x2", mouseX).attr("opacity", 0.7);

      //   cursorTimeLabel
      //     .attr("x", mouseX)
      //     .attr("y", -5)
      //     .text(d3.timeFormat("%H:%M %d %b")(displayTime))
      //     .attr("opacity", 1);
      // })

      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);
        const hoveredTime = currentScale.invert(mouseX);

        // Adjust for the 30min offset
        const displayTime = new Date(hoveredTime.getTime() + 1 * 60000);

        cursorLine.attr("x1", mouseX).attr("x2", mouseX).attr("opacity", 0.7);

        cursorTimeLabel
          .attr("x", mouseX)
          .attr("y", -5)
          .text(d3.timeFormat("%H:%M")(displayTime))
          //.text(d3.timeFormat("%H:%M %d %b")(displayTime))
          .attr("opacity", 1);
      })
      .on("mouseout", function () {
        cursorLine.attr("opacity", 0);
        cursorTimeLabel.attr("opacity", 0);
      });

    overlay.lower(); //to all the tooltip to appear even when I hover over it.
    //without this the mouseover was stolen from the diamond milestones.
    //the overlay for the vertical line was preivously on top, now sent it below

    //handling zoom
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20]) //minzoom,maxzoom


      .on("zoom", (event) => {
        const transform = event.transform;
        const newScale = transform.rescaleX(xScale);
        currentScale = newScale;
        const currentZoomLevel = transform.k;

        verticalLine
          .attr("x1", newScale(currentTime)) // Update the x position
          .attr("x2", newScale(currentTime)); // Update the x position for both ends

        drawAxis(newScale, currentZoomLevel);
        drawGridLines(newScale, milestones);
        renderTasks(newScale);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    //Zoom handling, so if u zoom out the timeline(x axis) will adjust accordingly
    // can zoom all the way up to 1 min
    function getTickInterval(zoomLevel) {
      if (zoomLevel < 0.5) return d3.timeHour.every(6);
      if (zoomLevel < 0.8) return d3.timeHour.every(1);
      if (zoomLevel < 1.5) return d3.timeMinute.every(30);
      if (zoomLevel < 2.5) return d3.timeMinute.every(15);
      if (zoomLevel < 4) return d3.timeMinute.every(10);
      if (zoomLevel < 6) return d3.timeMinute.every(5);

      //
      return d3.timeMinute.every(5);
    }
  }, [startDate, endDate]); //useeffect ends here

  return (
    //<div>
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1f2937",
        padding: "20px",
      }} //colourlol
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          color: "white", //colourlol
        }}
      >
        <p>
          Scroll at the Gantt chart area to zoom.
          <br />
          Click and drag on the Gantt chart area to view more
          <br />
          <strong>NB Departure</strong>
        </p>
        <div
          style={{
            backgroundColor: "#1f2937", //colourlol
            color: "white", //colourlol
            padding: "5px",
            borderRadius: "10px",
            marginBottom: "25px",
          }}
        >
          <h3 style={{ margin: "0 0 5px 0" }}>Flight Details:</h3>
          <p style={{ margin: "5px 0" }}>Flight ID: {selectedFlight.id}</p>
          <p style={{ margin: "5px 0" }}>
            Aircraft Type: {selectedFlight.aircraftType}
          </p>
          <p style={{ margin: "5px 0" }}>
            EIBT:{selectedFlight.eibt.toLocaleString()}
          </p>
          <p style={{ margin: "5px 0" }}>
            AIBT: {selectedFlight.aibt.toLocaleString()}
          </p>
          <p style={{ margin: "5px 0" }}>
            SOBT: {selectedFlight.sobt.toLocaleString()}
          </p>
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
        <button onClick={handleResetDate}>Go back</button>
      </div>

      {/* tooltip styling */}
      <div
        id="tooltip"
        style={{
          position: "absolute",
          pointerEvents: "none",
          background: "white",
          border: "1px solid #ccc",
          padding: "6px",
          borderRadius: "4px",
          opacity: "1",
          fontSize: "12px",
          display: "none",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
        }}
      ></div>

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
            <span>Actual (On time)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "20px",
                height: "15px",
                backgroundColor: "#E74C3C",
              }}
            ></div>
            <span>Actual (Delayed)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#4A90E2",
                transform: "rotate(45deg)",
              }}
            ></div>
            <span>Planned Deadline</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                transform: "rotate(45deg)",
                backgroundColor: "#50C878",
              }}
            ></div>

            <span>Actual Deadline(On time)</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#E74C3C",
                transform: "rotate(45deg)",
              }}
            ></div>
            <span>Actual Deadline (Delayed)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "15px",
                height: "2px",
                backgroundColor: "gray",
                borderTop: "4px dashed gray",
              }}
            >
              <button onClick={handlePrev}>← Prev</button>
            </div>
            <span>Dependency</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// pls take not that the date format is standard like this Date("2025-09-11T00:00:00") which means 11 sept 2025 0000hrs(24hrs)
//things like affects and dependOn are case sensitive
//actual milestones
const milestoneTemplates = [
  {
    id: "SIBT/EIBT & AIBT",
    name: "SIBT/EIBT & AIBT",
    planned_end: -0,
    anchor: "eibt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: +5,
  },

  {
    id: "4",
    name: "4. Door 2 duty - Security",
    planned_start: -120,
    planned_end: -0,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_start: -115,
    actual_end: -0,
    affects: ["12", "14"],
  },
  {
    id: "1",
    name: "1. Send DLS to LC - Cargo",
    planned_end: -105,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -106,
    affects: ["16"],
  },
  {
    id: "2",
    name: "2. Send NOTOC to LC - Cargo",
    planned_end: -105,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -105,
    affects: ["16"],
  },
  {
    id: "3",
    name: "3. Towing of cargo (first trip and last trip) - TPO",
    planned_start: -105,
    planned_end: -90,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_start: -105,
    actual_end: -60,
    affects: ["22"],
  },
  {
    id: "12",
    name: "12. PLB Dock/PAX Step- Ramp",
    planned_end: -90,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["4"],
    actual_end: -91,
    affects: ["14"],
  },
  {
    id: "5",
    name: "5. Catering MAB (Highlifts arrive at aircraft site) - Cabin Svc",
    planned_end: -60,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -55,
    affects: ["8"],
  },
  {
    id: "8",
    name: "8. Loading Start & End - Cabin Svc",
    planned_start: -60,
    planned_end: -30,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["5"],
    actual_start: -61,
    actual_end: -31,
    affects: ["23"],
  },
  {
    id: "16",
    name: "16. Send ELIR and NOTOC to Ramp - Load Control",
    planned_end: -75,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["1", "2"],
    actual_end: -75,
    affects: ["22"],
  },
  {
    id: "9",
    name: "9. MAB(Cleaning team) - AIC",
    planned_end: -60,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -60,
    affects: ["14"],
  },
  {
    id: "14",
    name: "14. Cleaning Start & End - AIC",
    planned_start: -60,
    planned_end: -30,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["4", "12", "9"],
    actual_start: -60,
    actual_end: -29,
    affects: ["23"],
  },
  {
    id: "15",
    name: "15. Departure team OG - Pax",
    planned_end: -60,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -59,
    affects: ["24"],
  },
  {
    id: "23",
    name: "23. Cabin Sweep Start & End - Security",
    planned_start: -75,
    planned_end: -30,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["8", "14"],
    actual_start: -73,
    actual_end: -27,
    affects: ["24"],
  },
  {
    id: "17",
    name: "17. RLO MAB - Ramp",
    planned_end: -60,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -61,
    affects: ["22"],
  },
  {
    id: "19",
    name: "19. First and last trip arrived at bay - Baggage",
    planned_start: -60,
    planned_end: -15,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_start: -60,
    actual_end: -15,
    affects: ["22"],
  },
  {
    id: "22",
    name: "22. Loading Start & End - Ramp",
    planned_start: -60,
    planned_end: -10,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["3", "16", "17", "19"],
    actual_start: -61,
    actual_end: -11,
    affects: ["24", "26"],
  },
  {
    id: "24",
    name: "24. Boarding at gate - Pax",
    planned_start: -25,
    planned_end: -10,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["15", "23", "22"],
    actual_start: -23,
    actual_end: -12,
    affects: ["33"],
  },
  {
    id: "26",
    name: "26. Send final readback to LC - Ramp",
    planned_end: -10,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["22"],
    actual_end: -9.5,
    affects: ["30", "31"],
  },
  {
    id: "27",
    name: "27. Boarding load at -15 mins - Pax",
    planned_end: -15,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -16,
    affects: [],
  },
  {
    id: "28",
    name: "28. Boarding load at -10 mins - Pax",
    planned_end: -10,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: -9.5,
    affects: [],
  },
  {
    id: "31",
    name: "31. Loadsheet acknowledged by Captain - Load control",
    planned_end: -5,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["26"],
    actual_end: -6,
    affects: ["34"],
  },
  {
    id: "30",
    name: "30. Cargo door close - Ramp",
    planned_end: -5,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["26"],
    actual_end: -6,
    affects: [],
  },
  {
    id: "33",
    name: "33. Last pax boarded A/C - Pax",
    planned_end: -5,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["24"],
    actual_end: -5,
    affects: ["34"],
  },
  {
    id: "34",
    name: "34. Cabin door close - Pax",
    planned_end: -5,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["31"],
    actual_end: -5,
    affects: ["35"],
  },
  {
    id: "35",
    name: "35. PLB/PAX Step Retract - Ramp",
    planned_end: -5,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: ["34"],
    actual_end: -4,
    affects: [],
  },

  {
    id: "SOBT/EOBT & AOBT",
    name: "SOBT/EOBT & AOBT",
    planned_end: -0,
    anchor: "sobt",
    aircraftTypes: ["NB"],
    dependsOn: [],
    actual_end: +5,
  },
];

export default GanttChart;
