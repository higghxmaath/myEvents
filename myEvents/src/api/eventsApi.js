const api = `${import.meta.env.VITE_API_BASE_URL}/api/events`


export async function getEvents() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}
