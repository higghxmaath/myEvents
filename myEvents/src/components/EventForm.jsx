import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../context/EventContext";

const API_BASE = "https://myevents-2.onrender.com/api/events";

function EventForm({ existingEvent }) {
  const navigate = useNavigate();
  const { dispatch } = useEventContext();

  const [title, setTitle] = useState(existingEvent?.title || "");
  const [date, setDate] = useState(existingEvent?.date || "");
  const [location, setLocation] = useState(existingEvent?.location || "");
  const [description, setDescription] = useState(existingEvent?.description || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(existingEvent?.image || null);
  const [errors, setErrors] = useState({});

  const fileRef = useRef();

  // Preview image when selected
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  // Basic validation
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!date.trim()) newErrors.date = "Date is required.";
    if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters long.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const method = existingEvent ? "PUT" : "POST";
      const url = existingEvent ? `${API_BASE}/${existingEvent._id || existingEvent.id}` : API_BASE;

      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("description", description);

      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert(data.message || "Failed to save event");
        return;
      }

      dispatch({
        type: existingEvent ? "UPDATE_EVENT" : "ADD_EVENT",
        payload: data
      });

      navigate("/events");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Something went wrong while saving your event.");
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <p className="error">{errors.date}</p>}
      </div>

      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Event location"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event description"
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label>Image</label>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => setImage(e.target.files[0])}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "180px",
              height: "120px",
              objectFit: "cover",
              marginTop: ".5rem",
              borderRadius: "8px",
            }}
          />
        )}
      </div>

      <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
        {existingEvent ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
}

export default EventForm;
