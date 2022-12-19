const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  approved: { type: Boolean, default: false },
  type: String,
});

const Invitation = mongoose.model('Invitation', InvitationSchema);
module.exports = Invitation;
