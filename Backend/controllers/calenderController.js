const Event = require("../models/Event");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const postEvents = async (req, res, next) => {
  const event = new Event({
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateEvents = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    event.title = req.body.title;
    event.start = req.body.start;
    event.end = req.body.end;
    event.description = req.body.description;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteEvents = async (req, res, next) => {
  
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllEvents, postEvents, updateEvents, deleteEvents };
