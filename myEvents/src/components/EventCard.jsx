import React from "react";
import { Link } from "react-router-dom";
import RSVPButton from "./RSVPButton";

function EventCard({ event, layout }) {
  const id = event._id || event.id;
  const image = event.image || "https://via.placeholder.com/300x200?text=Event+Image";
  const date = event.date ? new Date(event.date).toLocaleDateString() : "";
  const rsvpCount = event.rsvpCount || 0;
  const views = event.views || 0;

  return (
    <div className={`event-card ${layout}`}>
      <Link to={`/events/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={image} alt={event.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
      </Link>
      <div className="event-content">
        <h3>{event.title}</h3>
        <p>{date} · {event.location}</p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <small>👁 {views}</small>
          <small>✋ {rsvpCount}</small>
        </div>
        <div style={{ marginTop: 8 }}><RSVPButton event={event} /></div>
      </div>
    </div>
  );
}

export default EventCard;
