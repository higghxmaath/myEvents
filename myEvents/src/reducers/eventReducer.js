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
    default:
      return state;
  }
}
