"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarPage() {
  return (
    <div style={{ maxWidth: 900, margin: "50px auto" }}>
      <h1 style={{ textAlign: "center" }}>Calendar View</h1>
      <p style={{ textAlign: "center" }}>
        This is where your user’s calendar view will appear.
      </p>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={[
          {
            title: "Netflix Billing",
            date: "2025-12-01"
          },
          {
            title: "Spotify Billing",
            date: "2025-12-01"
          },
          {
            title: "Free Trial Ends",
            date: "2025-12-10"
          }
        ]}
      />
    </div>
  );
}
