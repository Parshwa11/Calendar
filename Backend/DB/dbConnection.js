const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://ParshwaWorkStation:ParshwaWorkStation@cluster0.bjx9moh.mongodb.net/all_in_one_db?retryWrites=true&w=majority" );
  } catch (err) {
    console.log("Error In Establising Connection", err);
    process.exit(1);
  }
};

module.exports = connectDB;
