import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useEventContext();
  const { isAuthenticated, user } = state;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event...</p>;
  if (!event) return (
    <div className="app-container">
      <h2>Event Not Found</h2>
      <p>The event you're looking for doesn’t exist or may have been removed.</p>
    </div>
  );

  const isRSVPed = Array.isArray(event.attendees) && event.attendees.some(a => String(a.userId) === String(user?.id || user?._id));

  // handleRSVP should call /api/rsvps endpoints; your context rsvp/cancelRsvp helpers will handle details if wired
  return (
    <div className="app-container">
      <div className="event-details-card">
        <img src={event.image || "/placeholder.jpg"} alt={event.title} className="event-details-image" />
        <div className="event-details-content">
          <h2>{event.title}</h2>
          <p className="event-date">📅 {event.date}</p>
          <p className="event-location">📍 {event.location}</p>
          <p className="event-description">{event.description}</p>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
