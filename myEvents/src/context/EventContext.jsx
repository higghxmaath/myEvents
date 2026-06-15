import React, { createContext, useReducer, useEffect, useState, useContext, useCallback } from "react";
import { eventReducer, initialState } from "../reducers/eventReducer";
import { API_URL } from "../config/api";

export const EventContext = createContext();

function getStoredAuth() {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  return null;
}

export const EventProvider = ({ children }) => {
  const stored = getStoredAuth();
  const [state, dispatch] = useReducer(eventReducer, {
    ...initialState,
    isAuthenticated: !!stored,
    user: stored?.user ?? null,
    token: stored?.token ?? null,
  });
  const [loading, setLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/events`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      dispatch({ type: "SET_EVENTS", payload: data });
    } catch (err) {
      console.error("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserRsvps = useCallback(async (userId, token) => {
    try {
      const res = await fetch(`${API_URL}/api/rsvps/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const rsvpsList = await res.json();
      const rsvpMap = {};
      rsvpsList.forEach((r) => {
        const eventId = r.eventId?._id || r.eventId;
        if (eventId) rsvpMap[eventId] = true;
      });
      dispatch({ type: "SET_RSVPS", payload: rsvpMap });
    } catch (err) {
      console.error("Error loading RSVPs:", err.message);
    }
  }, []);

  const rsvp = useCallback(async (eventId) => {
    const userId = state.user?.id || state.user?._id;
    const token = state.token;
    if (!userId || !token) return;

    try {
      const res = await fetch(`${API_URL}/api/rsvps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, eventId }),
      });
      if (!res.ok) {
        const data = await res.json();
        console.error("RSVP failed:", data.message);
        return;
      }
      dispatch({ type: "RSVP_EVENT", payload: eventId });
      await fetchEvents();
    } catch (err) {
      console.error("RSVP error:", err.message);
    }
  }, [state.user, state.token, fetchEvents]);

  const cancelRsvp = useCallback(async (eventId) => {
    const userId = state.user?.id || state.user?._id;
    const token = state.token;
    if (!userId || !token) return;

    try {
      const res = await fetch(`${API_URL}/api/rsvps`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, eventId }),
      });
      if (!res.ok) return;
      dispatch({ type: "CANCEL_RSVP", payload: eventId });
      await fetchEvents();
    } catch (err) {
      console.error("Cancel RSVP error:", err.message);
    }
  }, [state.user, state.token, fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (state.isAuthenticated && state.user && state.token) {
      const userId = state.user.id || state.user._id;
      loadUserRsvps(userId, state.token);
    }
  }, [state.isAuthenticated, state.user, state.token, loadUserRsvps]);

  const wrappedDispatch = useCallback((action) => {
    if (action.type === "LOGOUT") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    dispatch(action);
  }, []);

  return (
    <EventContext.Provider
      value={{
        state,
        dispatch: wrappedDispatch,
        loading,
        fetchEvents,
        rsvp,
        cancelRsvp,
        loadUserRsvps,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
