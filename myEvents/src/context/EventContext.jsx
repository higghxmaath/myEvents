import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from "react";
import { eventReducer, initialState } from "../reducers/eventReducer";

const EventContext = createContext();

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      dispatch({ type: "SET_EVENTS", payload: data });
    } catch (err) {
      console.error("fetchEvents error:", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const rsvpsStr = localStorage.getItem("rsvps");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      dispatch({ type: "LOGIN", payload: { user, token } });
      if (rsvpsStr) {
        try {
          const rsvps = JSON.parse(rsvpsStr);
          dispatch({ type: "SET_RSVPS", payload: rsvps });
        } catch (e) { console.warn("parse rsvps", e); }
      }

      // load fresh rsvps
      loadUserRsvps(user.id || user._id, token).catch(e => console.warn(e));
    }
    setLoadingAuth(false);
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem("token", state.token || "");
      localStorage.setItem("user", JSON.stringify(state.user || {}));
      localStorage.setItem("rsvps", JSON.stringify(state.rsvps || {}));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rsvps");
    }
  }, [state.isAuthenticated, state.user, state.token, state.rsvps]);

  const loadUserRsvps = useCallback(async (userId, token) => {
    if (!userId || !token) return;
    try {
      const res = await fetch(`http://localhost:4000/api/rsvps/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { console.warn("Unable to fetch RSVPs:", res.status); return; }
      const data = await res.json();
      const map = {};
      data.forEach(r => map[r.eventId] = true);
      dispatch({ type: "SET_RSVPS", payload: map });
    } catch (err) {
      console.error("loadUserRsvps", err);
    }
  }, []);

  const rsvp = async (eventId) => {
    if (!state.isAuthenticated) { alert("Please login"); return; }
    try {
      const res = await fetch("http://localhost:4000/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.token}` },
        body: JSON.stringify({ userId: state.user.id || state.user._id, eventId })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("RSVP failed", res.status, err);
        return;
      }
      dispatch({ type: "SET_RSVPS", payload: { ...(state.rsvps || {}), [eventId]: true } });
      await fetchEvents();
    } catch (err) {
      console.error("rsvp error", err);
    }
  };

  const cancelRsvp = async (eventId) => {
    if (!state.isAuthenticated) { alert("Please login"); return; }
    try {
      const res = await fetch("http://localhost:4000/api/rsvps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${state.token}` },
        body: JSON.stringify({ userId: state.user.id || state.user._id, eventId })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Cancel failed", res.status, err);
        return;
      }
      const updated = { ...(state.rsvps || {}) };
      delete updated[eventId];
      dispatch({ type: "SET_RSVPS", payload: updated });
      await fetchEvents();
    } catch (err) {
      console.error("cancelRsvp", err);
    }
  };

  if (loadingAuth) return <div>Loading...</div>;

  return (
    <EventContext.Provider value={{ state, dispatch, rsvp, cancelRsvp, fetchEvents }}>
      {children}
    </EventContext.Provider>
  );
}

export const useEventContext = () => useContext(EventContext);
