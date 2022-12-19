/* eslint-disable no-underscore-dangle */
const Group = require('../schemas/group');

async function createGroup(groupName, userOwner, publicStatus, tags, d) {
  const t = tags || [];
  const newGroup = new Group({
    name: groupName,
    owner: userOwner,
    public: publicStatus,
    admins: [userOwner],
    memberCount: 1,
    tags: t,
    description: d,
  });
  await newGroup.save();
  return newGroup._id;
}

const getGroups = async () => Group.find({}).exec();

const getGroupByName = async (reqName) => Group.findOne({ name: reqName }).exec();

const getGroupById = async (id) => Group.findById(id).exec();

const getGroupByIdSortPostsByDate = async (id) => Group.findById(id)
  .populate([
    {
      path: 'posts',
      populate: { path: 'author group', select: 'username name' },
      options: { sort: { datePosted: -1 } },
    }])
  .populate({ path: 'owner', select: '_id username' })
  .populate({ path: 'admins', select: '_id username' })
  .exec();

const getGroupByNameSortPostsByDate = async (reqName) => Group.findOne({ name: reqName })
  .populate([
    {
      path: 'posts',
      populate: { path: 'author' },
      options: { sort: { datePosted: -1 } },
    }])
  .populate({ path: 'owner', select: '_id username' })
  .populate({ path: 'admins', select: '_id username' })
  .exec();

const deleteGroupById = async (id) => Group.findByIdAndDelete(id).exec();

const deleteGroupByName = async (reqName) => Group.deleteOne({ name: reqName }).exec();

const clearGroups = async () => Group.deleteMany({}).exec();

const updateGroupById = async (id, updates) => Group.findByIdAndUpdate(
  id,
  updates,
  { returnDocument: 'after' },
).exec();

module.exports = {
  createGroup,
  getGroups,
  getGroupByName,
  getGroupById,
  getGroupByIdSortPostsByDate,
  getGroupByNameSortPostsByDate,
  deleteGroupById,
  deleteGroupByName,
  clearGroups,
  updateGroupById,
};
