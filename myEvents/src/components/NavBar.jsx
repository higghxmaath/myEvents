import { Link } from "react-router-dom";
import { useState } from "react";
import { useEventContext } from "../context/EventContext";
import { useNavigate } from "react-router-dom";


function NavBar() {
  const { state, dispatch } = useEventContext();
  const { isAuthenticated, user } = state;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
  navigate("/login");
};



// inside handleLogout
const handleLogout = () => {
  dispatch({ type: "LOGOUT" });
  navigate("/"); 
};


  return (
    <>
      <nav>
        <div className="nav-left">
          <Link to="/" className="logo">
            my<span>Events</span>
          </Link>

          <div className="nav-links">
            <Link to="/events">Events</Link>
            {isAuthenticated && <Link to="/create">Create Event</Link>}
            {isAuthenticated && <Link to="/profile">Profile</Link>}
          </div>
        </div>

        <div className="nav-right">
          {!isAuthenticated ? (
            <button onClick={handleLogin} className="btn-primary">
              Login
            </button>
          ) : (
            <div className="user-session">
              <span className="username">👋 {user.name}</span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          )}
          {/* Burger button */}
          <button
            className={`burger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Overlay when menu is open */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          {isAuthenticated && (
            <p className="mobile-username">👋 {user.name}</p>
          )}

          <Link to="/events" onClick={() => setMenuOpen(false)}>
            Events
          </Link>

          {isAuthenticated && (
            <>
              <Link to="/create" onClick={() => setMenuOpen(false)}>
                Create Event
              </Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
            </>
          )}

          {!isAuthenticated ? (
            <button
              onClick={() => {
                handleLogin();
                setMenuOpen(false);
              }}
              className="btn-primary"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="btn-secondary"
            >
              Logout
            </button>
          )}
        </div>

      
    </>
  );
}

export default NavBar;
