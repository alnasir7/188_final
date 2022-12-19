global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
require('dotenv').config();
const dbString = process.env.TEST_DB_CONNECTION_STRING;
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
const groupDbFuncs = require('./group');
const mongoose = require('mongoose');
const Group = require('../schemas/group');


beforeAll( async () => {
  await mongoose.connect(
    dbString,
    opts,
    (err) => {
      if (err) {
        console.log('database connection failed');
      }
    },
  );
})

afterEach( async () =>{
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

const GROUP_NAME = 'testGroup';
const USER_ID = "61bf7325fb1acab3b443cee7";
const ISPUBLIC = false;
const TAGS = [];
const DESCRIPTION = 'desc';


describe( 'groups db integration tests', () => {
    it('createGroup', async () => {
      const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
      expect(await Group.findById(groupId)).not.toBeNull();
    });

  it('getGroups', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
    const groups = await groupDbFuncs.getGroups();
    expect(groups).not.toHaveLength(0);
  });

  it('getGroupByName', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
    const group = await groupDbFuncs.getGroupByName(GROUP_NAME);
    expect(group).not.toBeNull();
  });

  it('getGroupById', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, undefined, DESCRIPTION);
    const group = await groupDbFuncs.getGroupById(groupId);
    console.log(groupId)
    expect(group).not.toBeNull();
  });

  it('deleteGroupByName', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
    const deletionResult = await groupDbFuncs.deleteGroupByName(GROUP_NAME);
    expect(deletionResult.deletedCount).toEqual(1);
  });

  it('deleteGroupById', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
    const group = await groupDbFuncs.deleteGroupById(groupId);
    expect(await Group.findById(groupId)).toBeNull();
  });

  it('clearGroups', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
    await groupDbFuncs.clearGroups();
    expect(await Group.findById(groupId)).toBeNull();
  });

  it('updateGroupById', async () => {
    const groupId = await groupDbFuncs.createGroup(GROUP_NAME, USER_ID, ISPUBLIC, TAGS, DESCRIPTION);
    const group = await groupDbFuncs.updateGroupById(groupId, { name: "updatedName" });
    expect((await Group.findById(groupId)).name).toEqual('updatedName');
  });

  }
)
