import React, { useState, useEffect } from "react";
import axios from "axios";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import {
  Eventcalendar,
  Popup,
  Input,
  Button,
  setOptions,
  localeEn,
} from "@mobiscroll/react";

setOptions({
  locale: localeEn,
  theme: "ios",
  themeVariant: "light",
});

const App = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    description: "",
  });
  const [editEvent, setEditEvent] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3001/calender/events");
      const events = response.data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const { title, start, end } = newEvent;
    const newErrors = {};

    if (!title) newErrors.title = "Title is required";
    if (!start) newErrors.start = "Start date and time are required";
    if (!end) newErrors.end = "End date and time are required";
    if (start && end && new Date(start) >= new Date(end)) newErrors.end = "End date and time must be after the start date and time";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const eventToSave = {
      ...newEvent,
      start: new Date(newEvent.start).toISOString(),
      end: new Date(newEvent.end).toISOString(),
    };

    if (editEvent) {
      try {
        await axios.put(
          `http://localhost:3001/calender/events/${editEvent._id}`,
          eventToSave
        );
        setEvents(
          events.map((event) =>
            event._id === editEvent._id
              ? { ...eventToSave, _id: editEvent._id }
              : event
          )
        );
        setEditEvent(null);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/calender/events",
          eventToSave
        );
        setEvents([...events, response.data]);
      } catch (error) {
        console.error("Error creating event:", error);
      }
    }

    fetchEvents();
    setPopupOpen(false);
    setNewEvent({ title: "", start: "", end: "", description: "" });
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:3001/calender/events/${eventId}`);
      setEvents(events.filter((event) => event._id !== eventId));
      setPopupOpen(false);
      setNewEvent({ title: "", start: "", end: "", description: "" });
      setEditEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleEventClick = (event) => {
    setEditEvent(event.event);
    setNewEvent({
      ...event.event,
      start: formatDateForInput(new Date(event.event.start)),
      end: formatDateForInput(new Date(event.event.end)),
    });
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setEditEvent(null);
    setNewEvent({ title: "", start: "", end: "", description: "" });
    setPopupOpen(false);
  };

  const formatDateForInput = (date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="App">
      <Button onClick={() => setPopupOpen(true)}>Add Event</Button>
      <Eventcalendar
        data={events}
        view={{ calendar: { type: "year" } }}
        clickToCreate="double"
        dragToCreate={true}
        dragToMove={true}
        dragToResize={true}
        onEventClick={handleEventClick}
      />
      <Popup
        isOpen={isPopupOpen}
        onClose={handlePopupClose}
        buttons={[
          { text: "Cancel", handler: "cancel" },
          {
            text: "Save",
            handler: handleSubmit,
            cssClass: "mbsc-popup-button-primary",
          },
        ]}
      >
        <Input
          label="Title"
          name="title"
          value={newEvent.title}
          onChange={handleInputChange}
          error={errors.title}
          errorMessage={errors.title}
        />
        <Input
          label="Start"
          type="datetime-local"
          name="start"
          value={newEvent.start}
          onChange={handleInputChange}
          error={errors.start}
          errorMessage={errors.start}
        />
        <Input
          label="End"
          type="datetime-local"
          name="end"
          value={newEvent.end}
          onChange={handleInputChange}
          error={errors.end}
          errorMessage={errors.end}
        />
        <Input
          label="Description"
          name="description"
          value={newEvent.description}
          onChange={handleInputChange}
        />
        {editEvent && (
          <Button onClick={() => handleDelete(editEvent._id)}>Delete</Button>
        )}
      </Popup>
    </div>
  );
};

export default App;
