/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const {
  hash,
  compare,
} = require('bcrypt');
const { sign } = require('jsonwebtoken');
const express = require('express');
const auth = require('../middleware/auth');
const {
  createUser,
  getUsers,
  getUserByName,
  getUserById,
  deleteUserById,
  getUserByIdAndPopulate,
  getUserByNameAndPopulate,
  deleteUserByName,
  clearUsers,
  updateUserById,
} = require('../db/controller/user');
const Post = require('../db/schemas/posts');
const Message = require('../db/schemas/message');
const Invitation = require('../db/schemas/invitation');
const {
  getGroupById,
  updateGroupById,
} = require('../db/controller/group');

const router = express.Router();
require('dotenv')
  .config();

// get all Users for testing purposes

// router.get('/', async (_, res) => {
//   try {
//     getUsers()
//       .then((users) => {
//         res.status(200).json(users);
//       });
//   } catch (err) {
//     res.sendStatus(404);
//   }
// });

router.put('/register', async (req, res) => {
  try {
    const {
      username,
      password,
      securityQuestionAnswer,
    } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string' || !password.match(/^[a-zA-Z0-9!?$%^*)(+=._-]{6,16}$/g) || !username.match(/^[a-zA-Z0-9._-]{6,16}$/g)
      || typeof securityQuestionAnswer !== 'string' || !securityQuestionAnswer.match(/^[a-zA-Z]{2,16}$/g)) {
      return res.status(400)
        .send('improper username, security question answer, or password');
    }

    const usernameExist = await getUserByName(username);
    if (usernameExist) {
      return res.status(400)
        .send('Username already taken');
    }

    const hashedPassword = await hash(password, 10);
    const hashedSecurityQuestionAnswer = await hash(securityQuestionAnswer, 10);

    return createUser(username, hashedPassword, hashedSecurityQuestionAnswer)
      .then((id) => {
        // eslint-disable-next-line object-shorthand
        const token = sign({
          _id: id,
          username,
        }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        res.cookie('authToken', token, {
          maxAge: 86400000,
          httpOnly: true,
        });
        return res.sendStatus(201);
      })
      .catch(async (err) => {
        await deleteUserByName(username);
        return res.sendStatus(400);
      });
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.put('/login', async (req, res) => {
  try {
    if (req.cookies.authToken) {
      return res.status(400)
        .send('A user is already logged in.');
    }
    const {
      username,
      password,
    } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400)
        .send('improper username or password');
    }

    let user = await getUserByName(username);
    if (!user) {
      return res.status(401)
        .send('invalid username or password');
    }
    if (user.lockUntil > Date.now() || user.lockUntil === -1) {
      return res.status(401)
        .send('account locked out');
    }
    return compare(password, user.password, async (err, result) => {
      if (err || !(result)) {
        let update;
        if (user.loginAttempts >= 9) {
          update = {
            $set: {
              loginAttempts: 0,
              lockUntil: Date.now() + 1800000,
            },
          };
        } else {
          update = { $set: { loginAttempts: user.loginAttempts + 1 } };
        }
        await updateUserById(user._id, update);
        return res.status(401)
          .send('invalid username or password');
      }
      if (result) {
        const token = sign({
          _id: user._id,
          username: user.username,
        }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });
        res.cookie('authToken', token, {
          maxAge: 86400000,
          httpOnly: true,
        });
        user = user.toObject();
        delete user.password;
        delete user.securityQuestionAnswer;
        delete user.loginAttempts;
        delete user.lockUntil;
        const update = { $set: { loginAttempts: 0 } };
        await updateUserById(user._id, update);
        return res.status(200)
          .json(user);
      }
      return res.sendStatus(401);
    });
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.put('/logout', async (_req, res) => {
  try {
    await res.clearCookie('authToken', { httpOnly: true });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.put('/deactivate', auth, async (req, res) => {
  try {
    const update = {
      $set: {
        lockUntil: -1,
        myPosts: [],
        flaggedPosts: [],
        likedPosts: [],
        hiddenPosts: [],
        groups: [],
        invitations: [],
      },
    };
    const user = await getUserById(req.user._id);
    // eslint-disable-next-line no-return-await
    user.myPosts.forEach(async (p) => await Post.findByIdAndDelete(p));
    // eslint-disable-next-line no-return-await
    user.invitations.forEach(async (i) => await Invitation.findByIdAndDelete(i));
    user.groups.forEach(async (g) => {
      const group = await getGroupById(g.group);
      const groupUpdate = {
        $pull: { admins: user._id },
        $set: { memberCount: group.memberCount - 1 },
      };
      await updateGroupById(group._id, groupUpdate);
    });

    await Message.deleteMany({ $or: [{ sender: user._id }, { receiver: user._id }] });
    await updateUserById(user._id, update);
    await res.clearCookie('authToken', { httpOnly: true });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    let currUser = await getUserByIdAndPopulate(req.user._id);
    currUser = currUser.toObject();
    delete currUser.password;
    delete currUser.securityQuestionAnswer;
    delete currUser.loginAttempts;
    delete currUser.lockUntil;
    return res.status(200)
      .json(currUser);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.get('/profile/:user', auth, async (req, res) => {
  const queryUserName = req.params.user;
  const currUser = req.user;
  let queryUser;
  if (!queryUserName) {
    return res.sendStatus(400);
  }
  try {
    if (currUser.username === queryUserName) {
      queryUser = await getUserByIdAndPopulate(currUser._id);
      queryUser = queryUser.toObject();
    } else {
      queryUser = await getUserByNameAndPopulate(queryUserName);
      if (!queryUser || queryUser.lockUntil === -1) {
        return res.sendStatus(404);
      }
      queryUser = queryUser.toObject();
      delete queryUser.flaggedPosts;
      delete queryUser.hiddenPosts;
      delete queryUser.invitations;
      delete queryUser.registrationDate;
    }
    delete queryUser.loginAttempts;
    delete queryUser.lockUntil;
    delete queryUser.password;
    delete queryUser.securityQuestionAnswer;
    return res.status(200)
      .json(queryUser);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.put('/notifications/clear', auth, async (req, res) => {
  try {
    const update = { $set: { notifications: [] } };
    await updateUserById(req.user._id, update);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await getUserById(req.user._id);
    return res.status(200)
      .json(user.notifications);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.put('/password', auth, async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;
    if (typeof newPassword !== 'string' || typeof oldPassword !== 'string' || !newPassword.match(/^[a-zA-Z0-9!?$%^*)(+=._-]{6,16}$/g)) {
      return res.status(400)
        .send('invalid new password');
    }
    const user = await getUserById(req.user._id);
    if (!user) {
      return res.sendStatus(400);
    }
    const result = await compare(oldPassword, user.password);
    if (!result) {
      return res.status(401)
        .send('invalid password');
    }
    if (newPassword === oldPassword) {
      return res.status(400)
        .send('new password must be different');
    }
    const hashedPassword = await hash(newPassword, 10);
    const update = { $set: { password: hashedPassword } };
    await updateUserById(req.user._id, update);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
});

router.put('/reset', async (req, res) => {
  try {
    const {
      username,
      securityQuestionAnswer,
      newPassword,
    } = req.body;
    if (typeof username !== 'string' || typeof securityQuestionAnswer !== 'string' || typeof newPassword !== 'string' || !newPassword.match(/^[a-zA-Z0-9!?$%^*)(+=._-]{6,16}$/g)) {
      return res.sendStatus(400);
    }
    const user = await getUserByName(username);
    if (!user) {
      return res.sendStatus(401);
    }
    const result = await compare(securityQuestionAnswer, user.securityQuestionAnswer);
    if (!result) {
      return res.status(401)
        .send('invalid security answer');
    }
    const hashedPassword = await hash(newPassword, 10);
    const update = { $set: { password: hashedPassword } };
    await updateUserById(user._id, update);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
});

router.put('/edit/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (typeof avatar !== 'string') {
      return res.sendStatus(400);
    }
    const av = avatar;
    let newUser = await updateUserById(req.user._id, { $set: { avatar: av } });
    newUser = newUser.toObject();
    delete newUser.loginAttempts;
    delete newUser.lockUntil;
    delete newUser.password;
    delete newUser.securityQuestionAnswer;
    return res.status(200)
      .json(newUser);
  } catch (err) {
    return res.sendStatus(500);
  }
});

module.exports = router;
