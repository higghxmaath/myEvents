import { eventReducer } from "../reducers/eventReducer";

describe("eventReducer", () => {
  test("SET_EVENTS updates the events list", () => {
    const initial = { events: [] };
    const mockEvents = [{ id: 1, title: "Test Event" }];
    const result = eventReducer(initial, { type: "SET_EVENTS", payload: mockEvents });
    expect(result.events).toEqual(mockEvents);
  });

  test("ADD_EVENT adds a new event", () => {
    const initial = { events: [] };
    const newEvent = { id: 2, title: "New Event" };
    const result = eventReducer(initial, { type: "ADD_EVENT", payload: newEvent });
    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toEqual(newEvent);
  });

  test("UPDATE_EVENT updates an existing event", () => {
    const initial = { events: [{ id: 1, title: "Old" }] };
    const updated = { id: 1, title: "Updated" };
    const result = eventReducer(initial, { type: "UPDATE_EVENT", payload: updated });
    expect(result.events[0].title).toBe("Updated");
  });

  test("RSVP_EVENT toggles RSVP correctly", () => {
    const initial = { rsvps: {} };
    const event = { id: 3 };
    const result = eventReducer(initial, { type: "RSVP_EVENT", payload: event.id });
    expect(result.rsvps[event.id]).toBe(true);
  });
});
