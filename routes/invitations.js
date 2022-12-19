/* eslint-disable no-underscore-dangle */
const express = require('express');
const { ObjectId } = require('mongoose').Types;
const auth = require('../middleware/auth');
const {
  getUserByName,
  getUserById,
  updateUserById,
} = require('../db/controller/user');
const Invitation = require('../db/schemas/invitation');
const Group = require('../db/schemas/group');
const User = require('../db/schemas/user');

const router = express.Router();

router.post('/invite', auth, async (req, res) => {
  const { username } = req.user;
  const {
    receiver,
    group,
  } = req.body;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  const newInvitation = new Invitation();

  if (!receiver || typeof receiver !== 'string') {
    return res.status(404)
      .send({
        success: 'false',
        message: 'receiver or group not found',
      });
  }
  const recObj = await getUserByName(receiver);
  if (!recObj) {
    return res.status(404)
      .send({
        success: 'false',
        message: 'receiver or group not found',
      });
  }

  const receiverId = recObj._id;

  newInvitation.sender = senderId;
  newInvitation.receiver = receiverId;
  // if (!ObjectId.isValid(receiver) || !ObjectId.isValid(group)) {
  //  res.status(404).send({ success: 'false', message: 'receiver or group not found' });
  // }
  // const recExist = await getUserById(receiver);
  const groupRes = await Group.findById(group);
  if (!groupRes) {
    return res.status(404)
      .send({
        success: 'false',
        message: 'receiver or group not found',
      });
  }
  // if (!groupRes.admins.includes(senderId)) {
  //  res.status(401).send({"success": "false", "message" : "You are not an admin to this group"})
  // }

  if (groupRes.public) {
    return res.status(400)
      .send({
        success: false,
        message: 'cannot invite to a public group',
      });
  }

  if (!(sender.groups.some((g) => (g.group.toString() === groupRes._id.toString())))) {
    return res.status(401)
      .send({
        success: false,
        message: 'you need to be a member of the group to invite someone',
      });
  }

  newInvitation.group = group;
  newInvitation.type = 'invite';
  const result = await newInvitation.save();
  const userUpdate = { $push: { notifications: `${sender.username} has invited ${recObj.username} to join ${groupRes.name}` } };
  await Promise.all(groupRes.admins.map(async (a) => updateUserById(a, userUpdate)));
  return res.status(201)
    .send(result);
});

router.post('/invite/approve/:id', auth, async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  // const user = await getUserById(userId)
  const invite = await Invitation.findById(id);
  const groupId = invite.group;
  if (!ObjectId.isValid(groupId)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'receiver or group not found',
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

  if (!group.admins.includes(userId)) {
    res.status(401)
      .send({
        success: 'false',
        message: 'you are not an admin to this group',
      });
    return;
  }
  const result = await Invitation.findByIdAndUpdate(id, { approved: true });
  const userUpdate = { $push: { notifications: `You have been invited to join ${group.name}` } };
  await updateUserById(invite.receiver, userUpdate);
  res.status(200)
    .send(result);
});

router.post('/request', auth, async (req, res) => {
  const { username } = req.user;
  const { group } = req.body;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  const newInvitation = new Invitation();
  newInvitation.sender = senderId;
  if (!ObjectId.isValid(group)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const groupRes = await Group.findById(group);
  if (!groupRes) {
    res.status(404)
      .send({
        success: 'false',
        message: 'receiver or group not found',
      });
    return;
  }

  if (!groupRes.public) {
    res.status(401)
      .send({
        success: 'false',
        message: 'cannot request to join private groups',
      });
    return;
  }

  newInvitation.group = group;
  newInvitation.type = 'request';
  const result = await newInvitation.save();
  const userUpdate = { $push: { notifications: `${sender.username} has requested to join ${groupRes.name}` } };
  await Promise.all(groupRes.admins.map(async (a) => updateUserById(a, userUpdate)));
  res.status(201)
    .send(result);
});

// see all my invites
router.get('/invite', auth, async (req, res) => {
  const { username } = req.user;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  let result = await Invitation.find({
    receiver: senderId,
    type: 'invite',
  })
    .populate('group');
  result = result.filter((invite) => invite.approved);
  res.status(200)
    .send(result);
});

// see all invites to a group (for admins to approve)
router.get('/invite/:id', auth, async (req, res) => {
  const { username } = req.user;
  const { id } = req.params;
  const group = await Group.findById(id);
  const sender = await getUserByName(username);
  const senderId = sender._id;

  if (!group.admins.includes(senderId)) {
    res.status(401)
      .send({
        success: 'false',
        message: 'you need to be an admin',
      });
    return;
  }

  const result = await Invitation.find({
    group: id,
    type: 'invite',
  })
    .populate('sender')
    .populate('receiver');
  res.status(200)
    .send(result);
});

// see all requests to a group
router.get('/request/:group', auth, async (req, res) => {
  const { username } = req.user;
  const { group } = req.params;
  const sender = await getUserByName(username);
  const senderId = sender._id;
  if (!ObjectId.isValid(group)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const groupRes = await Group.findById(group);
  if (!groupRes) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  if (!groupRes.admins.includes(senderId)) {
    res.status(401)
      .send({
        success: 'false',
        message: 'You are not an admin to this group',
      });
    return;
  }

  const result = await Invitation.find({
    group,
    type: 'request',
  })
    .populate('group')
    .populate('sender');
  res.status(200)
    .send(result);
});

// get if a user has requested a group or not
router.get('/requested/:group', auth, async (req, res) => {
  const { username } = req.user;
  const { group } = req.params;
  const sender = await getUserByName(username);
  if (!ObjectId.isValid(group)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }
  const groupRes = await Group.findById(group);
  if (!groupRes) {
    res.status(404)
      .send({
        success: 'false',
        message: 'group not found',
      });
    return;
  }

  const result = await Invitation.find({
    group: groupRes._id,
    sender: sender._id,
    type: 'request',
  })
    .populate('group');
  if (result && result.length > 0) {
    res.status(200)
      .json({ found: true });
  } else {
    res.status(200)
      .json({ found: false });
  }
});

router.post('/handle_invite/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'invitation not found',
      });
    return;
  }
  const thisInvitation = await Invitation.findById(id);
  if (!thisInvitation || thisInvitation.type !== 'invite') {
    res.status(404)
      .send({
        success: 'false',
        message: 'invitation not found',
      });
    return;
  }

  if (!thisInvitation.approved) {
    res.status(401)
      .send({
        success: 'false',
        message: 'you need your invitation to be approved by an admin first',
      });
    return;
  }

  const {
    group,
    receiver,
    sender,
  } = thisInvitation;
  const groupObj = await Group.findById(group);
  const currUser = await getUserByName(username);
  const userWhoSent = await getUserById(sender);

  if (!receiver.equals(currUser._id)) {
    res.status(401)
      .send({
        success: 'false',
        message: 'You can\'t handle this invitation',
      });
    return;
  }

  const { accept } = req.body;

  if (!accept) {
    await Invitation.findByIdAndDelete(id);
    const userUpdate = { $push: { notifications: `${username} has rejected your invite to join ${groupObj.name}` } };
    await updateUserById(userWhoSent._id, userUpdate);
    res.status(200)
      .send('invitation decined succesfully');
  } else {
    let oldGroups = currUser.groups;
    if (!oldGroups) {
      oldGroups = [];
    }
    const newGroups = [...oldGroups, {
      admin: false,
      group: groupObj._id,
    }];
    await User.findByIdAndUpdate(currUser._id, { groups: newGroups });

    const newMemberCount = groupObj.memberCount ? groupObj.memberCount + 1 : 1;
    await Group.findByIdAndUpdate(group, { memberCount: newMemberCount });

    await Invitation.findByIdAndDelete(id);
    const userUpdate = { $push: { notifications: `${username} has accepted your invite to join ${groupObj.name}` } };
    await updateUserById(userWhoSent._id, userUpdate);
    res.status(200)
      .send('invitation accepted succesfully');
  }
});

router.post('/handle_request/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { username } = req.user;
  if (!ObjectId.isValid(id)) {
    res.status(404)
      .send({
        success: 'false',
        message: 'request not found',
      });
    return;
  }
  const thisInvitation = await Invitation.findById(id);
  if (!thisInvitation || thisInvitation.type !== 'request') {
    res.status(404)
      .send({
        success: 'false',
        message: 'request not found',
      });
    return;
  }

  const {
    group,
    sender,
  } = thisInvitation;
  const groupObj = await Group.findById(group);
  const currUser = await getUserByName(username);
  const senderObj = await getUserById(sender);

  if (!groupObj.admins.includes(currUser._id)) {
    res.status(401)
      .send({
        success: 'false',
        message: 'You can\'t handle this request',
      });
    return;
  }

  const { accept } = req.body;

  if (!accept) {
    await Invitation.findByIdAndDelete(id);
    const userUpdate = { $push: { notifications: `Your request to join ${groupObj.name} has been rejected` } };
    await updateUserById(senderObj._id, userUpdate);
    res.status(200)
      .send('request decined succesfully');
  } else {
    let oldGroups = senderObj.groups;
    if (!oldGroups) {
      oldGroups = [];
    }
    const newGroups = [...oldGroups, {
      admin: false,
      group: groupObj._id,
    }];
    await User.findByIdAndUpdate(sender, { groups: newGroups });

    const newMemberCount = groupObj.memberCount + 1;
    await Group.findByIdAndUpdate(group, { memberCount: newMemberCount });

    await Invitation.findByIdAndDelete(id);
    const userUpdate = { $push: { notifications: `Your request to join ${groupObj.name} has been accepted` } };
    await updateUserById(senderObj._id, userUpdate);
    res.status(200)
      .send('invitation accepted succesfully');
  }
});

module.exports = router;
