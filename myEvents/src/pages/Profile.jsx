import { useEventContext } from "../context/EventContext";
import EventCard from "../components/EventCard";

function Profile() {
  const { state, cancelRsvp } = useEventContext();
  const { events = [], rsvps = {}, user } = state;

  const userId = user?.id || user?._id;

  // Events the user RSVPed 
  const goingEvents = events.filter(e => !!rsvps[e._id || e.id]);

  // Events the user created
  const createdEvents = events.filter(e => {
    const creator = e.creator || e.creatorId || null;
    if (!creator) return false;
    const creatorId = typeof creator === "object" ? (creator._id || creator.id) : creator;
    return String(creatorId) === String(userId);
  });

  return (
    <div className="profile-page">
            <div className="profile-header">
        <div>
          <h2 className="profile-name">{user?.name || "Your profile"}</h2>
          <p className="profile-subtitle">Your Events & RSVPs</p>
        </div>
      </div>

      
    {/* Created events section */}
      <h3 className="profile-section-title" style={{ marginTop: "2rem" }}>
        Events You Created ({createdEvents.length})
      </h3>

      {createdEvents.length > 0 ? (
        <div className="profile-events-grid">
          {createdEvents.map(event => {
            const eventId = event._id || event.id;
            return (
              <div className="profile-event-wrapper" key={`created-${eventId}`}>
                <EventCard event={event} layout="profile" />
                <div style={{ marginTop: "0.6rem" }}>
                  <small style={{ color: "#666" }}>Views: {event.views || 0}</small>
                  <br />
                  <small style={{ color: "#666" }}>Interested (RSVPs): {event.rsvpCount || 0}</small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>You have not created any events yet.</p>
      )}

      
      {/* RSVP Count */}
      <h3 className="profile-section-title">
        Events You're Attending ({goingEvents.length})
      </h3>
      
      {goingEvents.length > 0 ? (
        <div className="profile-events-grid">
          {goingEvents.map(event => {
            const eventId = event._id || event.id;
            return (
              <div className="profile-event-wrapper" key={eventId}>
                <EventCard event={event} layout="profile" />
                <button className="cancel-btn" onClick={() => cancelRsvp(eventId)}>
                  Cancel RSVP
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>You have not RSVP’d to any events yet.</p>
      )}

      
    </div>
  );
}

export default Profile;
