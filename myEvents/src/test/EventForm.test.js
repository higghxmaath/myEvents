import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useEventContext } from "../context/EventContext";
import EventForm from "../components/EventForm";

jest.mock("../context/EventContext", () => ({
  useEventContext: jest.fn(),
}));

global.fetch = jest.fn();

describe("EventForm Component", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useEventContext.mockReturnValue({ dispatch: mockDispatch });
  });

  const renderForm = (existingEvent = null) => {
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    render(
      <MemoryRouter>
        <EventForm existingEvent={existingEvent} />
      </MemoryRouter>
    );
  };

  test("renders all form fields", () => {
    renderForm();

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image/i)).toBeInTheDocument();
  });

  test("shows validation errors for empty required fields", async () => {
    renderForm();

    fireEvent.click(screen.getByRole("button", { name: /Create Event/i }));

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Description must be at least 10 characters long/i)
    ).toBeInTheDocument();
  });

  test("submits form successfully when valid", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    renderForm();

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "React Meetup" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2025-11-20" },
    });
    fireEvent.change(screen.getByLabelText(/Location/i), {
      target: { value: "Lagos" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "This is a great meetup for React devs!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Event/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "ADD_EVENT" })
      );
      expect(mockNavigate).toHaveBeenCalledWith("/events");
    });
  });

  test("renders existing event data when editing", () => {
    const existingEvent = {
      id: 1,
      title: "Edit Test",
      date: "2025-12-12",
      location: "Abuja",
      description: "Editing this event now.",
      image: "https://via.placeholder.com/300x200",
    };

    renderForm(existingEvent);

    expect(screen.getByDisplayValue("Edit Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2025-12-12")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Abuja")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Editing this event now.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update Event/i })).toBeInTheDocument();
  });
  test("updates image preview when a file is selected", async () => {
    renderForm();

    const fileInput = screen.getByLabelText(/Image/i);
    const testFile = new File(["test"], "test.jpg", { type: "image/jpeg" });

    // Mock URL.createObjectURL since jsdom doesn’t support it natively
    const mockObjectURL = "blob:http://localhost/test-preview";
    global.URL.createObjectURL = jest.fn(() => mockObjectURL);
    global.URL.revokeObjectURL = jest.fn();

    fireEvent.change(fileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      const previewImg = screen.getByAltText(/Preview/i);
      expect(previewImg).toBeInTheDocument();
      expect(previewImg).toHaveAttribute("src", mockObjectURL);
    });

    // Clean up
    expect(global.URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  test("shows error alert when fetch fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    window.alert = jest.fn();

    renderForm();

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "React Meetup" },
    });
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: "2025-11-20" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "This is a great meetup for React devs!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Event/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Something went wrong while saving your event."
      );
    });
  });
});
