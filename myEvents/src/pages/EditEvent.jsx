import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEventContext } from "../context/EventContext";
import EventForm from "../components/EventForm";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useEventContext();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const eventToEdit = state.events.find(e => String(e.id) === String(id));
    if (eventToEdit) {
      setEventData(eventToEdit);
    } else {
      // If event not found in state, fetch from backend
      fetch(`https://myevents-2.onrender.com/api/events/${id}`)
        .then(res => res.json())
        .then(data => setEventData(data))
        .catch(() => {
          console.error("Event not found");
          navigate("/events");
        });
    }
  }, [id, state.events, navigate]);

  if (!eventData) return <p>Loading event details...</p>;

  return (
    <div className="edit-event-page">
      <h2 className="section-title">Edit Event</h2>
      <EventForm existingEvent={eventData} />
    </div>
  );
}

export default EditEvent;
