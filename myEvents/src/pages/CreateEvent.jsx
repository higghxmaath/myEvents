import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";

function CreateEvent() {
  const navigate = useNavigate();
  const { dispatch } = useEventContext();

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setEvent({ ...event, [e.target.name]: e.target.value });

  const handleImageUpload = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", event.title);
      formData.append("description", event.description);
      formData.append("location", event.location);
      formData.append("date", event.date);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch("http://localhost:4000/api/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      // safe parse: if server returns HTML (error page), avoid crashing
      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await res.json() : null;

      if (!res.ok) {
        setError((data && data.message) || "Failed to create event");
        return;
      }

      dispatch({ type: "ADD_EVENT", payload: data });
      navigate("/events");
    } catch (err) {
      console.error("Create event error:", err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input type="text" name="title" value={event.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={event.location} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={event.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Upload Event Image</label>
          <div
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("event-image").click()}
            role="button"
            tabIndex={0}
          >
            <p>Drag and drop image here or click to select</p>

            <input
              id="event-image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />
          </div>

          {preview && <img src={preview} alt="preview" style={{ marginTop: 10, borderRadius: 8, width: 220 }} />}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={event.description} onChange={handleChange} required />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="submit-btn" style={{ display: "block", margin: "16px auto 0", background: "var(--color-accent)" }}>
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
