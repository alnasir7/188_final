/* eslint-disable no-underscore-dangle */
const User = require('../schemas/user');

async function createUser(name, pword, hashedSecurityQuestionAnswer) {
  const newUser = new User({
    username: name,
    password: pword,
    securityQuestionAnswer: hashedSecurityQuestionAnswer,
    registrationDate: Date.now(),
  });
  await newUser.save();
  return newUser._id;
}

const getUsers = async () => User.find({}).exec();

const getUserByName = async (reqName) => User.findOne({ username: reqName }).exec();

const getUserByNameAndPopulate = async (reqName) => User.findOne({ username: reqName })
  .populate('myPosts')
  .populate('likedPosts')
  .populate('hiddenPosts')
  .populate({
    path: 'groups',
    populate: { path: 'group' },
  })
  .populate('invitations')
  .exec();

const getUserById = async (id) => User.findById(id).exec();

const getUserByIdAndPopulate = async (id) => User.findById(id)
  .populate('myPosts')
  .populate('likedPosts')
  .populate('hiddenPosts')
  .populate({
    path: 'groups',
    populate: { path: 'group' },
  })
  .populate('invitations')
  .exec();

const deleteUserById = async (id) => User.findByIdAndDelete(id).exec();

const deleteUserByName = async (reqName) => User.deleteOne({ username: reqName }).exec();

const clearUsers = async () => User.deleteMany({}).exec();

const updateUserById = async (id, updates) => User.findByIdAndUpdate(
  id,
  updates,
  { returnDocument: 'after' },
).exec();

module.exports = {
  createUser,
  getUsers,
  getUserByName,
  getUserByNameAndPopulate,
  getUserById,
  getUserByIdAndPopulate,
  deleteUserById,
  deleteUserByName,
  clearUsers,
  updateUserById,
};
