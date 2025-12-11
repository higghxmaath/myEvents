import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useEventContext } from "../../context/EventContext";

function Login() {
  const navigate = useNavigate();
  const { dispatch, loadUserRsvps } = useEventContext();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://myevents-2.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Persist token + user locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Dispatch into context
      dispatch({
        type: "LOGIN",
        payload: { user: data.user, token: data.token }
      });

      // Load RSVPs for the user 
      if (loadUserRsvps) {
        await loadUserRsvps(data.user.id || data.user._id, data.token);
      }

      navigate("/events");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="auth-error">{error}</p>}

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account?
          <span onClick={() => navigate("/signup")} className="auth-link">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
