import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // BASE URL FOR BACKEND
  const API_BASE = "https://myevents-2.onrender.com";

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.log("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add event
  const addEvent = async (eventData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/events`, eventData);
      setEvents((prev) => [...prev, res.data]);
    } catch (err) {
      console.log("Error adding event:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE}/api/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log("Error deleting event:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const updateEvent = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${API_BASE}/api/events/${id}`, updatedData);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? res.data : e))
      );
    } catch (err) {
      console.log("Error updating event:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        fetchEvents,
        addEvent,
        deleteEvent,
        updateEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};


export const useEventContext = () => useContext(EventContext);
