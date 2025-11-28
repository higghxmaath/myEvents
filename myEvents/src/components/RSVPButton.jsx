import React from "react";
import { useEventContext } from "../context/EventContext";

function RSVPButton({ event }) {
  const { state, rsvp, cancelRsvp } = useEventContext();
  const eventId = event._id || event.id;
  const isGoing = !!state.rsvps[eventId];
  const count = event.rsvpCount || 0;

  const handle = () => {
    if (isGoing) cancelRsvp(eventId);
    else rsvp(eventId);
  };

  return (
    <button className={`btn ${isGoing ? "btn-secondary" : "btn-primary"}`} onClick={handle}>
      {isGoing ? `✓ Going (${count})` : `RSVP (${count})`}
    </button>
  );
}

export default RSVPButton;
