/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const {
  hash,
  compare,
} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const { isValidObjectId } = require('mongoose');
const auth = require('../middleware/auth');
const {
  createGroup,
  getGroups,
  getGroupByName,
  getGroupByNameSortPostsByDate,
  getGroupByIdSortPostsByDate,
  getGroupById,
  deleteGroupById,
  deleteGroupByName,
  clearGroups,
  updateGroupById,
} = require('../db/controller/group');

const {
  createUser,
  getUsers,
  getUserByName,
  getUserById,
  deleteUserById,
  deleteUserByName,
  clearUsers,
  updateUserById,
} = require('../db/controller/user');
const Post = require('../db/schemas/posts');

const router = express.Router();

require('dotenv')
  .config();

// // get all Groups for testing purposes
// router.get('/', async (_, res) => {
//   try {
//     getGroups()
//       .then((groups) => {
//         res.status(200).json(groups);
//       });
//   } catch (err) {
//     res.sendStatus(404);
//   }
// });

router.post('/create', auth, async (req, res) => {
  const {
    name,
    isPublic,
    description,
    tags,
  } = req.body;
  if (typeof name !== 'string' || typeof description !== 'string' || typeof isPublic !== 'boolean') {
    return res.sendStatus(400);
  }
  if (!name.match(/^([a-zA-Z0-9'_]+( [[a-zA-Z0-9'_])*){3,24}$/g)) {
    return res.status(400)
      .send('invalid group name');
  }
  if (description.length > 500 || description.length < 1) {
    return res.status(400)
      .send('invalid description');
  }
  if (await getGroupByName(name)) {
    return res.status(400)
      .send('name is already taken');
  }
  let validTags = true;
  if (tags) {
    if (Array.isArray(tags)) {
      tags.forEach((t) => {
        if (typeof t !== 'string' || !t.match(/^[a-zA-Z0-9]{1,24}$/g)) {
          validTags = false;
        }
      });
    }
  }
  if (!validTags) {
    return res.status(400)
      .send('invalid tags name');
  }
  try {
    const groupId = await createGroup(name, req.user._id, isPublic, tags, description);
    const update = {
      $push: {
        groups: {
          admin: true,
          group: groupId,
        },
      },
    };
    await updateUserById(req.user._id, update);
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.put('/leave', auth, async (req, res) => {
  try {
    const groupName = req.body.group;
    const group = await getGroupByName(groupName);
    if (!group) {
      return res.sendStatus(404);
    }
    const user = await getUserById(req.user._id);
    if (!user.groups.find((g) => g.group.equals(group._id))) {
      return res.status(400)
        .send('user is not a member of group');
    }
    let userUpdate;
    if (group.admins.includes(user._id)) {
      if (group.owner.toString() === user._id.toString()) {
        return res.status(400)
          .send('The owner cannot leave the group!');
      }
      const groupUpdate = { $pull: { admins: user._id } };
      await updateGroupById(group._id, groupUpdate);
      userUpdate = {
        $pull: {
          groups: {
            admin: true,
            group: group._id,
          },
        },
      };
      await updateUserById(user._id, userUpdate);
    } else {
      userUpdate = {
        $pull: {
          groups: {
            admin: false,
            group: group._id,
          },
        },
      };
      await updateUserById(user._id, userUpdate);
    }
    const newCnt = group.memberCount - 1;
    const countUpdate = { $set: { memberCount: newCnt } };
    await updateGroupById(group._id, countUpdate);
    const adminUpdate = { $push: { notifications: `${user.username} has left ${group.name}` } };
    await Promise.all(group.admins.map(async (a) => updateUserById(a, adminUpdate)));
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.get('/group/:name', auth, async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    let { page } = req.query;
    let { hashtags } = req.query;
    if (hashtags && typeof hashtags === 'string') {
      hashtags = JSON.parse(decodeURIComponent(hashtags));
    }
    page = page || 1;
    const group = await getGroupByNameSortPostsByDate(name);
    if (!group) {
      return res.sendStatus(404);
    }
    const user = await getUserById(req.user._id);
    if (!group.public && !user.groups.find((g) => g.group.toString() === group._id.toString())) {
      return res.sendStatus(401);
    }
    let postsDisplayed = group.posts;
    postsDisplayed = postsDisplayed.filter((p) => !user.hiddenPosts.includes(p._id));
    let populatedPosts = [];
    await Promise.all(postsDisplayed.map(async (p) => {
      populatedPosts.push(await Post.findById(p._id)
        .populate([
          {
            path: 'comments',
            populate: {
              path: 'author',
              select: 'username avatar',
            },
            options: { sort: { datePosted: -1 } },
          }, {
            path: 'author group',
            select: 'username name',
          }])
        .exec());
    }));
    if (hashtags && typeof hashtags === 'object' && hashtags.length > 0) {
      populatedPosts = populatedPosts.filter((p) => {
        let currHashtags = p.text.match(/#\w+/g);
        p.comments.forEach((c) => {
          currHashtags = currHashtags.concat(c.text.match(/#\w+/g));
        });
        return (hashtags.some((h) => (currHashtags && currHashtags.includes(`#${h}`))));
      });
    }
    const size = populatedPosts.length;
    page = (page - 1) * 5 >= size ? 1 : page;
    populatedPosts.sort((a, b) => b.datePosted - a.datePosted);
    populatedPosts = populatedPosts.slice((page - 1) * 5, ((page - 1) * 5) + 5);
    group.posts = populatedPosts;
    return res.status(200)
      .json({
        group,
        postCnt: size,
      });
  } catch (err) {
    return res.sendStatus(400);
  }
});

// this is a workaround, delete if there is time
router.get('/byid/:id', auth, async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.id);

    let { page } = req.query;
    let { hashtags } = req.query;
    if (hashtags && typeof hashtags === 'string') {
      hashtags = JSON.parse(decodeURIComponent(hashtags));
    }
    page = page || 1;

    const intermed = await getGroupById(id);

    const { name } = intermed;
    const group = await getGroupByNameSortPostsByDate(name);
    if (!group) {
      return res.sendStatus(404);
    }
    const user = await getUserById(req.user._id);
    if (!group.public && !user.groups.find((g) => g.group.toString() === group._id.toString())) {
      return res.sendStatus(401);
    }
    let postsDisplayed = group.posts;
    postsDisplayed = postsDisplayed.filter((p) => !user.hiddenPosts.includes(p._id));
    if (hashtags && typeof hashtags === 'object' && hashtags.length > 0) {
      postsDisplayed = postsDisplayed.filter((p) => {
        const currHashtags = p.text.match(/#\w+/g);
        return (hashtags.some((h) => (currHashtags && currHashtags.includes(`#${h}`))));
      });
    }
    const size = postsDisplayed.length;
    page = (page - 1) * 5 >= size ? 1 : page;
    postsDisplayed = postsDisplayed.slice((page - 1) * 5, ((page - 1) * 5) + 5);
    group.posts = postsDisplayed;
    return res.status(200)
      .json({
        group,
        postCnt: size,
      });
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.put('/changeAdmin', auth, async (req, res) => {
  try {
    const {
      group,
      user,
    } = req.body;
    if (!group || !user) {
      return res.sendStatus(400);
    }
    const recipient = await getUserByName(user);
    const currGroup = await getGroupByName(group);
    const currUser = await getUserById(req.user._id);
    if (!recipient || !currGroup || recipient.lockUntil === -1) {
      return res.sendStatus(404);
    }
    if (!recipient.groups.find((g) => g.group.toString() === currGroup._id.toString())) {
      return res.status(403)
        .send('target is not a member of group');
    }
    if (!currGroup.admins.includes(currUser._id)) {
      return res.status(401)
        .send('user is not an administrator');
    }
    if (currGroup.admins.includes(recipient._id)) {
      if (currGroup.owner.toString() === recipient._id.toString()) {
        return res.status(403)
          .send('target is owner of the group');
      }
      const groupUpdate = { $pull: { admins: recipient._id } };
      await updateGroupById(currGroup._id, groupUpdate);
      let userUpdate = {
        $pull: {
          groups: {
            admin: true,
            group: currGroup._id,
          },
        },
      };
      await updateUserById(recipient._id, userUpdate);
      userUpdate = {
        $push: {
          groups: {
            admin: false,
            group: currGroup._id,
          },
        },
      };
      await updateUserById(recipient._id, userUpdate);
      userUpdate = { $push: { notifications: `You have been demoted from admin in ${currGroup.name} by ${currUser.username}` } };
      await updateUserById(recipient._id, userUpdate);
      return res.sendStatus(200);
    }
    const groupUpdate = { $push: { admins: recipient._id } };
    await updateGroupById(currGroup._id, groupUpdate);
    let userUpdate = {
      $pull: {
        groups: {
          admin: false,
          group: currGroup._id,
        },
      },
    };
    await updateUserById(recipient._id, userUpdate);
    userUpdate = {
      $push: {
        groups: {
          admin: true,
          group: currGroup._id,
        },
      },
    };
    await updateUserById(recipient._id, userUpdate);
    userUpdate = { $push: { notifications: `You have been promoted to admin in ${currGroup.name} by ${currUser.username}` } };
    await updateUserById(recipient._id, userUpdate);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.get('/groups/public', auth, async (req, res) => {
  try {
    let groups = await getGroups();
    let {
      tags,
      order,
    } = req.query;
    if (!order) {
      order = '';
    }
    if (tags && typeof tags === 'string') {
      tags = JSON.parse(decodeURIComponent(tags));
    }
    const user = await getUserById(req.user._id);
    groups = groups.filter((group) => group.public
      && !user.groups.find((g) => g.group.toString() === group._id.toString()));
    if (tags && typeof tags === 'object' && tags.length > 0) {
      groups = groups.filter((g) => (tags.some((tag) => (g.tags.includes(tag)))));
    }
    if (order === 'recent') {
      groups.sort((a, b) => b.mostRecent - a.mostRecent);
    } else if (order === 'posts') {
      groups.sort((a, b) => b.posts.length - a.posts.length);
    } else if (order === 'members') {
      groups.sort((a, b) => b.memberCount - a.memberCount);
    }
    return res.status(200)
      .json(groups);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.get('/groups/me', auth, async (req, res) => {
  try {
    const groups = [];
    const user = await getUserById(req.user._id);
    await Promise.all(user.groups.map(async (g) => {
      const curr = await getGroupById(g.group);
      groups.push(curr);
    }));
    return res.status(200)
      .json(groups);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.get('/groups/recommended', auth, async (req, res) => {
  try {
    let groups = await getGroups();
    const user = await getUserById(req.user._id);
    groups = groups.filter((group) => group.public
      && !user.groups.find((g) => g.group.toString() === group._id.toString()));
    groups.sort((a, b) => 0.5 - Math.random());
    groups = groups.slice(0, 3);
    return res.status(200)
      .json(groups);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const user = await getUserById(req.user._id);
    const { groups } = user;
    let posts = [];
    await Promise.all(groups.map(async (g) => {
      const curr = await getGroupByIdSortPostsByDate(g.group);
      const currPosts = curr.posts.filter((p) => !user.hiddenPosts.includes(p._id));
      posts = posts.concat(currPosts.slice(0, 20));
    }));
    posts = posts.sort((a, b) => b.datePosted.valueOf() - a.datePosted.valueOf())
      .slice(0, 20);
    return res.status(200)
      .json(posts);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = router;
