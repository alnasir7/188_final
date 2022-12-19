/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { isValidObjectId } = require('mongoose');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const Post = require('../db/schemas/posts');
const Comment = require('../db/schemas/comment');
const auth = require('../middleware/auth');
const {
  getGroupById,
  updateGroupById,
} = require('../db/controller/group');
const Group = require('../db/schemas/group');
const User = require('../db/schemas/user');
const {
  getUserByName,
  getUserById,
  updateUserById,
} = require('../db/controller/user');

const router = express.Router();

// THIS IS A GET
router.put('/', auth, async (req, res) => {
  const user = await getUserByName(req.user.username);
  const userId = user._id;
  // const { filters } = req.body;

  const result = await Post.find({ author: userId })
    .sort({ datePosted: -1 })
    .populate('comments')
    .populate('group');
  // if (filters) {
  //   result = result.filter((item) => (filters.some((filter) => item.tags.includes(filter))));
  // }
  res.status(200)
    .send(result);
});

router.put('/group/:id', auth, async (req, res) => {
  const user = await getUserByName(req.user.username);
  const userId = user._id;
  const {
    filters,
    page,
    size,
  } = req.body;
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const group = await Group.findById(id);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }

  if ((!group.public) && (!user.groups.some((s) => s.group.equals(id)))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to post in this group',
      });
    return;
  }

  let result = await Post.find({ group: id })
    .sort({ datePosted: -1 })
    .populate('comments')
    .populate('group')
    .populate('author');
  // if (filters) {
  //   result = result.filter((item) => (filters.some((filter) => item.tags.includes(filter))));
  // }

  // result = result.filter((item) => !user.hiddenPosts.includes(item._id));

  if (page && size) {
    const start = size * (page - 1);
    const end = start + size - 1;
    result = result.slice(start, end);
  }

  res.status(200)
    .send(result);
});

router.put('/specific/:id', auth, async (req, res) => {
  const user = await getUserByName(req.user.username);
  const userId = user._id;
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const post = await Post.findById(id);
  if (!post) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }

  const postGroup = post.group;
  if (!ObjectId.isValid(postGroup)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const group = await Group.findById(postGroup);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  if (!user.groups.some((s) => s.group.equals(postGroup))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to view this post',
      });
    return;
  }

  const result = await Post.findById(id)
    .populate('group')
    .populate('comments')
    .populate('author');

  res.status(200)
    .send(result);
});

router.delete('/:id', auth, async (req, res) => {
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
  const post = await Post.findById(id);
  if (!post) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }

  const group = await getGroupById(post.group);

  if (!(user._id.toString() === post.author.toString())) {
    if (!group.admins.includes(user._id)) {
      res.status(401)
        .send('You don\'t have the credentials to delete this post');
      return;
    }
    const userUpdate = { $push: { notifications: `A post of yours has been deleted by an admin in ${group.name}` } };
    await updateUserById(post.author, userUpdate);
  }
  const deletePostUpdateUser = { $pull: { myPosts: post._id } };
  await updateUserById(post.author, deletePostUpdateUser);

  const deletePostUpdateGroup = { $pull: { posts: post._id } };
  await updateGroupById(post.group, deletePostUpdateGroup);

  const deletePostFromFlaggedPosts = { $pull: { flaggedPosts: post._id } };
  const deletePostFromLikedPosts = { $pull: { likedPosts: post._id } };
  const deletePostFromHiddenPosts = { $pull: { hiddenPosts: post._id } };

  await User.updateMany({}, deletePostFromFlaggedPosts)
    .exec();
  await User.updateMany({}, deletePostFromLikedPosts)
    .exec();
  await User.updateMany({}, deletePostFromHiddenPosts)
    .exec();

  await Comment.deleteMany({ author: group._id });
  const result = await Post.findByIdAndDelete(req.params.id);
  res.status(200)
    .send(result);
});

router.post('/', auth, async (req, res) => {
  if (!req.body.text || !req.body.group || typeof req.body.text !== 'string'
    || !req.body.title || typeof req.body.title !== 'string'
  ) {
    return res.status(400)
      .send({
        success: 'false',
        message: 'invalud inputs',
      });
  }

  const newPost = await Object.assign(new Post(), req.body);

  const author = await getUserByName(req.user.username);
  const authorId = author._id;
  newPost.author = authorId;

  const groupId = req.body.group;
  if (!ObjectId.isValid(groupId)) {
    return res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
  }
  const group = await Group.findById(groupId);
  if (!group) {
    return res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
  }

  if (!(author.groups.some((g) => (g.group.toString() === group._id.toString())))) {
    return res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to post in this group',
      });
  }

  const timestamp = Date.now();
  newPost.datePosted = timestamp;
  newPost.likes = 0;
  newPost.pinned = false;
  newPost.flagged = 0;
  newPost.comments = [];
  const result = await newPost.save();
  await updateGroupById(group._id, { $set: { mostRecent: timestamp } });
  await updateGroupById(group._id, { $push: { posts: newPost._id } });
  return res.status(201)
    .send(result);
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const post = await Post.findById(id);
  if (!post) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const user = await getUserByName(req.user.username);
  const userId = user._id;

  const { author } = await Post.findById(id);
  if (!userId.equals(author)) {
    res.status(401)
      .send('You don\'t have the credentials to edit this post');
    return;
  }
  const result = await Post.findByIdAndUpdate(id, req.body);
  res.status(200)
    .send(result);
});

router.post('/like/:id', auth, async (req, res) => {
  const { username } = req.user;
  const { id } = req.params;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  let prevLikedPost = sender.likedPosts;
  if (prevLikedPost == null) {
    prevLikedPost = [];
  }

  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const post = await Post.findById(id);
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
        message: 'post group not found',
      });
    return;
  }
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post group not found',
      });
    return;
  }

  if (!(sender.groups.some((g) => (g.group.toString() === group._id.toString())))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to like this post',
      });
    return;
  }

  if (prevLikedPost.includes(id)) {
    const newLikedPosts = prevLikedPost.filter((p) => (p !== id));
    const result = await Post.findByIdAndUpdate(id, { likes: post.likes ? post.likes - 1 : 0 });
    const userResult = await User.findByIdAndUpdate(senderId, { likedPosts: newLikedPosts });
    res.status(200)
      .send(result);
  } else {
    const newLikedPosts = prevLikedPost.concat([id]);
    const result = await Post.findByIdAndUpdate(id, { likes: post.likes ? post.likes + 1 : 1 });
    const userResult = await User.findByIdAndUpdate(senderId, { likedPosts: newLikedPosts });
    res.status(200)
      .send(result);
  }
});

router.post('/flag/:id', auth, async (req, res) => {
  const { username } = req.user;
  const { id } = req.params;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  let prevFlaggedPosts = sender.flaggedPosts;
  if (prevFlaggedPosts == null) {
    prevFlaggedPosts = [];
  }

  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const post = await Post.findById(id);
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
        message: 'post group not found',
      });
    return;
  }
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post group not found',
      });
    return;
  }

  if (!(sender.groups.some((g) => (g.group.toString() === group._id.toString())))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to flag this post',
      });
    return;
  }

  if (prevFlaggedPosts.includes(id)) {
    const newFlaggedPosts = prevFlaggedPosts.filter((p) => (!p.equals(id)));
    const result = await Post.findByIdAndUpdate(id, { flags: post.flags ? post.flags - 1 : 0 });
    const userResult = await User.findByIdAndUpdate(senderId, { flaggedPosts: newFlaggedPosts });
    res.status(200)
      .send(result);
  } else {
    const newFlaggedPosts = prevFlaggedPosts.concat([id]);
    const result = await Post.findByIdAndUpdate(id, { flags: post.flags ? post.flags + 1 : 1 });
    const userResult = await User.findByIdAndUpdate(senderId, { flaggedPosts: newFlaggedPosts });
    res.status(200)
      .send(result);
  }
});

router.post('/hide/:id', auth, async (req, res) => {
  const { username } = req.user;
  const { id } = req.params;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  const prevHiddenPosts = sender.hiddenPosts;

  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post not found',
      });
    return;
  }
  const post = await Post.findById(id);
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
        message: 'post group not found',
      });
    return;
  }
  const group = await Group.findById(groupId);
  if (!group) {
    res.status(404)
      .send({
        success: 'false',
        message: 'post group not found',
      });
    return;
  }

  if (!(sender.groups.some((g) => (g.group.toString() === group._id.toString())))) {
    res.status(401)
      .send({
        success: 'false',
        message: 'not authorized to hide this post',
      });
    return;
  }

  if (prevHiddenPosts.includes(id)) {
    // const newHiddenPosts = prevHiddenPosts.filter(p => (p!=id));
    // const userResult = await User.findByIdAndUpdate(senderId, {hiddenPosts:newHiddenPosts })
    // res.status(200).send(userResult)
    res.status(401)
      .send({
        success: 'false',
        message: 'unhiding posts is impossible!',
      });
  } else {
    const newHiddenPosts = prevHiddenPosts.concat([id]);
    const userResult = await User.findByIdAndUpdate(senderId, { hiddenPosts: newHiddenPosts });
    res.status(200)
      .send(userResult);
  }
});

// router.get('/:postId', auth, async (req, res) => {
//   try {
//     const { postId } = req.params;
//     let { hashtags } = req.query;
//     if (hashtags && typeof hashtags === 'string') {
//       hashtags = JSON.parse(decodeURIComponent(hashtags));
//     }
//     if (!postId || !isValidObjectId(postId)) {
//       return res.sendStatus(400);
//     }
//     const user = await getUserById(req.user._id);
//     const postFound = await Post.findById(mongoose.Types.ObjectId(postId))
//       .populate('group')
//       .populate('author')
//       .populate({ path: 'comments', options: { sort: { datePosted: -1 } } })
//       .exec();
//     if (!postFound) {
//       return res.status(404).send('post does not exist');
//     }
//     const postGroup = await getGroupById(postFound.group);
//     if (!postGroup) {
//       return res.status(500).send('post group does not exist');
//     }
//     if (!postGroup.public
//       && !user.groups.find((g) => g.group.toString() === postGroup._id.toString())) {
//       return res.status(401).send('user does not have access to group');
//     }
//     if (user.hiddenPosts.find((p) => p.toString() === postId)) {
//       return res.status(400).send('user has hidden the post');
//     }
//     let l = false;
//     if (!user.flaggedPosts.find((p) => p.toString() === postId)) {
//       l = true;
//     }
//     let f = false;
//     if (!user.likedPosts.find((p) => p.toString() === postId)) {
//       f = true;
//     }
//     let commentsDisplayed = postFound.comments;
//     if (hashtags && typeof hashtags === 'object' && hashtags.length > 0) {
//       commentsDisplayed = commentsDisplayed.filter((c) => {
//         const currHashtags = c.text.match(/#\w+/g);
//         return (hashtags.some((h) => (currHashtags.includes(`#${h}`))));
//       });
//     }
//     postFound.comments = commentsDisplayed;
//
//     return res.status(200).json({ liked: l, flagged: f, post: postFound });
//   } catch (err) {
//     return res.sendStatus(400);
//   }
// });

module.exports = router;
