const express = require("express");
const {
  getAllEvents,
  postEvents,
  updateEvents,
  deleteEvents
} = require("../controllers/calenderController");

const router = express.Router();

router.get("/events", getAllEvents);
router.post("/events", postEvents);
router.put("/events/:id", updateEvents);
router.delete("/events/:id", deleteEvents);

module.exports = router;
