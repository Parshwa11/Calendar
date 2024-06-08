const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./DB/dbConnection");
const cookieParser = require("cookie-parser");
dotenv.config();
const Port = process.env.PORT;
const apiRoutes = require("./routes/mainRouteEntry");

app.use(cors());
app.use(express.json());
app.use(cookieParser());


connectDB()
  .then(() => {
    app.listen(Port, () => {
      console.log(`App is Listning on Port ${Port} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res, next) => {
  res.send("main file called");
});

app.use("/", apiRoutes);

app.get("/a", (req, res, next) => {
  try {
    aconsole.log("Hello error");
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack,
  });
});
