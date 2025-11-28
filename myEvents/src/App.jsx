import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent"; // <- imported
import Profile from "./pages/Profile";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
