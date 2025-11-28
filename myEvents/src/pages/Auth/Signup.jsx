import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useEventContext } from "../../context/EventContext";

function Signup() {
  const navigate = useNavigate();
  const { dispatch, loadUserRsvps } = useEventContext();

  const [form, setForm] = useState({
    name: "",
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
      const res = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      //auto-login after signup 
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "LOGIN", payload: { user: data.user, token: data.token } });
        if (loadUserRsvps) await loadUserRsvps(data.user.id || data.user._id, data.token);
        navigate("/events");
        return;
      }

      // Otherwise, go to login
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p>
          Already have an account?
          <span onClick={() => navigate("/login")} className="auth-link">
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
