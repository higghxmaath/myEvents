import { useState, useEffect } from "react";
import { useEventContext } from "../context/EventContext";
import Spinner from "../components/Spinner";
import EventCard from "../components/EventCard";
import CalendarFilter from "../components/CalendarFilter";
import { List, SquaresFour } from "@phosphor-icons/react";
import useDebounce from "../hooks/useDebounce";
import StartHostingSection from "../components/StartHostingSection";
import FooterSection from "../components/FooterSection";

function Events() {
  const { state, loading } = useEventContext();
  const { events } = state;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [layout, setLayout] = useState("grid");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    let filtered = events || [];

    if (debouncedSearch.trim() !== "") {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [events, debouncedSearch]);

  if (loading) return <Spinner />;

  return (
    <div className="app-container">
      <div className="events-header">
        <h2 className="section-title">Upcoming Events</h2>

        <div className="events-header-controls">
          <CalendarFilter events={events} onFilter={setFilteredEvents} />

          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="layout-buttons">
            <SquaresFour
              className={`layout-icon ${layout === "grid" ? "active" : ""}`}
              onClick={() => setLayout("grid")}
              weight="bold"
            />
            <List
              className={`layout-icon ${layout === "list" ? "active" : ""}`}
              onClick={() => setLayout("list")}
              weight="bold"
            />
          </div>
        </div>
      </div>

      <div className={layout === "grid" ? "events-grid" : "events-list"}>
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event._id || event.id} event={event} layout={layout} />
          ))
        ) : (
          <p className="no-events">No events available</p>
        )}
      </div>
      <StartHostingSection/>
       <FooterSection/>

    </div>
    
  );

  
}

export default Events;
