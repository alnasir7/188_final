const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  datePosted: Date,
  likes: Number,
  replyCount: Number,
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
