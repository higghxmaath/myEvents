const API_URL = "http://localhost:4000/events";

export async function getEvents() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
