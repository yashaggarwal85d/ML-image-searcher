const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  hash: {
    type: Number,
    required: true,
  },
  search: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", UserSchema);
