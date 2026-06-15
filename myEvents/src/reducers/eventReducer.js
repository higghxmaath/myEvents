export const initialState = {
  events: [],
  rsvps: {},
  isAuthenticated: false,
  user: null,
  token: null
};

export function eventReducer(state, action) {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.payload };
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "SET_RSVPS":
      return { ...state, rsvps: action.payload || {} };
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null, token: null, rsvps: {} };
    case "UPDATE_EVENT": {
      const updated = action.payload;
      const updatedId = updated._id || updated.id;
      return {
        ...state,
        events: state.events.map((e) =>
          String(e._id || e.id) === String(updatedId) ? updated : e
        ),
      };
    }
    case "RSVP_EVENT":
      return {
        ...state,
        rsvps: { ...state.rsvps, [action.payload]: true },
      };
    case "CANCEL_RSVP": {
      const nextRsvps = { ...state.rsvps };
      delete nextRsvps[action.payload];
      return { ...state, rsvps: nextRsvps };
    }
    default:
      return state;
  }
}
