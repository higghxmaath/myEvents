import { Navigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";

function ProtectedRoute({ children }) {
  const { state } = useEventContext();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
