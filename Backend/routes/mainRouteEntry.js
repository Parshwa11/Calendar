const express = require("express");
const app = express();

const calenderRoutes = require("./calenderRoutes");

app.use("/calender", calenderRoutes);

module.exports = app;
