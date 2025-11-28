import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CalendarFilter.css";

function CalendarFilter({ events = [], onFilter }) {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");

  // Extract unique months from events
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Filter automatically when month/date changes
  useEffect(() => {
    let filtered = events;

    if (selectedMonth !== "All") {
      filtered = filtered.filter(event => {
        const monthName = months[new Date(event.date).getMonth()];
        return monthName === selectedMonth;
      });
    }

    if (selectedDate !== "All") {
      filtered = filtered.filter(event => {
        const eventDay = new Date(event.date).getDate().toString();
        return eventDay === selectedDate;
      });
    }

    onFilter(filtered);
  }, [selectedMonth, selectedDate, events]);

  // Generate date list dynamically (1–31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return (
    <motion.div
      className="calendar-filter"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="filter-dropdown">
        <label className="filter-label">Month</label>
        <select
          className="filter-select"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        >
          <option value="All">Filter Events</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="filter-dropdown">
        <label className="filter-label">Date</label>
        <select
          className="filter-select"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        >
          <option value="All"> Dates</option>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}

export default CalendarFilter;
