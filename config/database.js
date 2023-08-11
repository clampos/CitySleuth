const mongoose = require("mongoose");
const joi = require("joi");

require("dotenv/config");

const conn = process.env.DB_CONNECTOR;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 6,
    max: 20,
  },
  email: {
    type: String,
    require: true,
    min: 7,
    max: 256,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 20,
  },
  visitedPlaces: [
    { type: mongoose.Schema.Types.ObjectId, ref: "VisitedPlace" },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const visitedPlaceSchema = new mongoose.Schema({
  placeName: String,
  placeAddress: String,
  userId: String,
});

const User = connection.model("User", userSchema);

const VisitedPlace = connection.model("VisitedPlace", visitedPlaceSchema);

module.exports = connection;
