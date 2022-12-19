/* eslint-disable no-underscore-dangle */
const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Post = require('../db/schemas/posts');
const Group = require('../db/schemas/group');
const Comment = require('../db/schemas/comment');
const auth = require('../middleware/auth');
const { getUserById } = require('../db/controller/user');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  const user = await getUserById(req.user._id);
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const post = await Post.findById(id)
    .populate('comments');
  if (!post) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const groupId = post.group;
  if (!ObjectId.isValid(groupId)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  if (!(user.groups.some((g) => (g.group.toString() === group._id.toString())))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to view comments for this post',
      });
    return;
  }

  const result = post.comments.sort((a, b) => a.datePosted - b.datePosted);
  // const {username} = req.user
  // const result = await Post.find({author: username}).sort({datePosted: -1}).populate('comments');
  res.status(200)
    .send(result);
});

router.delete('/:id', auth, async (req, res) => {
  const userId = (await getUserById(req.user._id))._id;
  const { id } = req.params;
  const {
    author,
    parent,
  } = await Comment.findById(id)
    .populate('parent');
  if (!userId.equals(author)) {
    return res.status(401)
      .send('You don\'t have the credentials to delete this post');
  }
  const result = await Comment.findByIdAndDelete(id);
  const prevComments = parent.comments;
  const newComments = prevComments.filter((c) => c._id !== id);
  await Post.findByIdAndUpdate(parent._id, { comments: newComments });
  return res.status(200)
    .send(result);
});

router.post('/:id', auth, async (req, res) => {
  const newComment = await Object.assign(new Comment(), req.body);
  const user = await getUserById(req.user._id);
  newComment.author = user._id;
  const timestamp = Date.now();
  newComment.datePosted = timestamp;
  newComment.likes = 0;
  newComment.parent = req.params.id;

  const parentPost = await Post.findById(req.params.id);
  const groupId = parentPost.group;
  if (!ObjectId.isValid(groupId)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  if (!(user.groups.some((g) => (g.group.toString() === group._id.toString())))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to comment under this post',
      });
    return;
  }

  const result = await newComment.save();
  if (!parentPost) {
    res.status(404)
      .send({
        success: false,
        message: 'No parent post or comment',
      });
  } else {
    const prevComments = parentPost.comments;
    const newComments = [...prevComments, result._id];
    await Post.findByIdAndUpdate(req.params.id, { comments: newComments });
  }
  res.status(201)
    .send(result);
});

router.put('/:id', auth, async (req, res) => {
  const userId = (await getUserById(req.user._id))._id;
  const { id } = req.params;
  const inter = await Comment.findById(id);
  const { author } = inter;
  if (!userId.equals(author)) {
    return res.status(401)
      .send('You don\'t have the credentials to edit this post');
  }
  const result = await Comment.findByIdAndUpdate(id, req.body);
  return res.status(200)
    .send(result);
});

module.exports = router;
