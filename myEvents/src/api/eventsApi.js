import { API_URL } from "../config/api";

export async function getEvents() {
  const res = await fetch(`${API_URL}/api/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
