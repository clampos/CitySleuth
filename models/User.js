const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    require: true,
    min: 2,
    max: 256,
  },
  lname: {
    type: String,
    require: true,
    min: 2,
    max: 256,
  },
  title: {
    type: String,
    require: true,
    min: 2,
    max: 8,
  },
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

const User = mongoose.model("User", userSchema);
module.exports = User;
