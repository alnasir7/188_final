const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  delivered: Boolean,
  body: String,
  img: String,
  video: String,
  audio: String,
  dateSent: Date,
  read: Boolean,
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;
