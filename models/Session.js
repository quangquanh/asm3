const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  chatRoomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true,
  },
  chatMessages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatMessage",
    },
  ],
  lastActiveTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
