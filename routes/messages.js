/* eslint-disable no-underscore-dangle */
const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Message = require('../db/schemas/message');
const User = require('../db/schemas/user');
const auth = require('../middleware/auth');
const {
  getUserByName,
  getUserById,
} = require('../db/controller/user');

const router = express.Router();

router.get('/contacts', auth, async (req, res) => {
  const { username } = req.user;
  const user = await getUserByName(username);
  const userGroups = user.groups.map((group) => group.group);
  const mutuals = await User.find({
    $and: [
      { groups: { $elemMatch: { group: { $in: userGroups } } } },
      { _id: { $ne: req.user._id } },
    ],
  });
  try {
    res.send(mutuals);
  } catch (err) {
    res.status(500)
      .send({
        success: 'false',
        message: 'some users could not be found',
      });
  }
});

router.post('/', auth, async (req, res) => {
  if (typeof req.body.body !== 'string') {
    res.status(400)
      .send({
        success: 'false',
        message: 'invalid inputs',
      });
    return;
  }
  const { username } = req.user;
  const newMessage = await Object.assign(new Message(), req.body);
  newMessage.dateSent = Date.now();
  newMessage.read = false;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  newMessage.sender = senderId;
  if (!ObjectId.isValid(req.body.receiver)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'receiver not found',
      });
  }
  const recObj = await getUserById(req.body.receiver);
  if (!recObj) {
    res.status(404)
      .send({
        success: 'false',
        message: 'receiver not found',
      });
  }

  const userGroups = sender.groups;
  const recGroups = recObj.groups;
  const commonGroupExists = userGroups.map(
    (group) => group.group.toString(),
  )
    .some((elem) => recGroups.map((group) => group.group.toString())
      .includes(elem));
  if (!commonGroupExists) {
    res.status(401)
      .send({
        success: 'false',
        message: 'you can\'t send a message to this user',
      });
  } else {
    const result = await newMessage.save();
    res.status(201)
      .send(result);
  }
});

router.post('/read/:messageId', auth, async (req, res) => {
  const { username } = req.user;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  const { messageId } = req.params;
  if (!ObjectId.isValid(messageId)) {
    return res.status(404)
      .send({
        success: 'false',
        message: 'message not found',
      });
  }
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404)
      .send({
        success: 'false',
        message: 'receiver not found',
      });
  }

  if (!message.receiver.equals(senderId)) {
    return res.status(403)
      .send({
        success: 'false',
        message: 'this user cannot read this message',
      });
  }

  const result = await Message.findByIdAndUpdate(messageId, { read: true });
  return res.status(200)
    .send(result);
});

router.get('/:id', auth, async (req, res) => {
  const { username } = req.user;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'message not found',
      });
    return;
  }
  const receiver = await User.findById(id);
  if (!receiver) {
    res.status(404)
      .send({
        success: 'false',
        message: 'receiver not found',
      });
    return;
  }
  const receiverId = receiver._id;

  const result = await Message.find(
    {
      $or: [
        { $and: [{ sender: senderId }, { receiver: receiverId }] },
        { $and: [{ receiver: senderId }, { sender: receiverId }] },
      ],
    },
  )
    .sort({ dateSent: -1 });

  res.status(200)
    .send(result);
});

// router.put('/:id', auth, async (req, res) => {
//   const { username } = req.user;
//   const sender = await getUserByName(username);
//   const senderId = sender._id;
//   const { id } = req.params;
//   if (!ObjectId.isValid(id)) {
//     res.status(404).send({ success: 'false', message: 'message not found' });
//     return;
//   }
//   const message = await Message.findById(id);
//   if (!message) {
//     res.status(404).send({ success: 'false', message: 'receiver not found' });
//     return;
//   }
//
//   if (!senderId.equals(message.sender)) {
//     res.status(403).send({ success: 'false', message: 'this user cannot edit this message' });
//     return;
//   }
//
//   const result = await Message.findByIdAndUpdate(id, req.body);
//   res.status(200).send(result);
// });

// router.delete('/:id', auth, async (req, res) => {
//   const { username } = req.user;
//   const sender = await getUserByName(username);
//   const senderId = sender._id;
//   const { id } = req.params;
//   if (!ObjectId.isValid(id)) {
//     res.status(404).send({ success: 'false', message: 'message not found' });
//     return;
//   }
//   const message = await Message.findById(id);
//   if (!message) {
//     res.status(404).send({ success: 'false', message: 'message not found' });
//     return;
//   }
//
//   if (!senderId.equals(message.sender)) {
//     res.status(403).send({ success: 'false', message: 'this user cannot delete this message' });
//     return;
//   }
//
//   const result = await Message.findByIdAndDelete(id);
//   res.status(200).send(result);
// });

module.exports = router;
