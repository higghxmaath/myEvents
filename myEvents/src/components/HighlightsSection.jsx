import { useEventContext } from "../context/EventContext";
import { Link } from "react-router-dom";

function HighlightsSection() {
  const { state } = useEventContext();
  const { events = [] } = state;

  const upcoming = [...events]
    .filter((e) => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <section className="highlights-section">
      <div className="highlights-header">
        <h2>
          Highlights from <span className="accentt">Upcoming Events</span>
        </h2>
        <Link to="/events" className="view-all">View All Events →</Link>
      </div>

      <div className="highlight-grid">
        {upcoming.length > 0 ? (
          upcoming.map((event) => (
            <div
              key={event._id || event.id}
              className="highlight-card"
            >
              <img
                src={
                  event.image ||
                  "https://via.placeholder.com/300x200?text=Event+Image"
                }
                alt={event.title}
                className="highlight-image"
              />

              <div className="highlight-info">
                <h3>{event.title}</h3>

                <p className="event-date">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                <p className="event-location">{event.location}</p>
                <p className="event-location">{event.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events">No upcoming events yet.</p>
        )}
      </div>
    </section>
  );
}

export default HighlightsSection;
