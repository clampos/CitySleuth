const mongoose = require("mongoose");

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
    max: 256,
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
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = connection.model("User", userSchema);

module.exports = connection;