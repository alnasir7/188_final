const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  memberCount: { type: Number, required: true },
  posts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], default: [] },
  public: { type: Boolean, required: true },
  tags: { type: [String], required: true, default: [] },
  requests: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  mostRecent: { type: Number, required: true, default: -1 },
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
