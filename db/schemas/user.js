const mongoose = require('mongoose');

const userSchama = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  password: { type: String, required: true },
  securityQuestionAnswer: { type: String, required: true },
  myPosts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], default: [] },
  flaggedPosts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], default: [] },
  likedPosts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], default: [] },
  hiddenPosts: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], default: [] },
  groups: { type: [{ admin: Boolean, group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' } }], default: [] },
  invitations: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }], default: [] },
  registrationDate: { type: Date, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  lockUntil: { type: Number, required: true, default: 0 },
  notifications: { type: [{ type: String }], required: true, default: [] },
});

const User = mongoose.model('User', userSchama);
module.exports = User;
