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
const mongoose = require('mongoose');
const userDbFuncs = require('./user');
const User = require('../schemas/user');

const USERNAME = "user1";
const PASSWORD = "somehash";
const SEQQUESTION = "somehash2";

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

describe( 'users db integration tests', () => {
    it('createUser', async () => {
      const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
      expect(await User.findById(userId)).not.toBeNull();
    });

  it('getUsers', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    const users = await userDbFuncs.getUsers();
    expect(users).not.toHaveLength(0);
  });

  it('getUserByName', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    const user = await userDbFuncs.getUserByName(USERNAME);
    expect(user).not.toBeNull();
  });

  it('getUserByName', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    const user = await userDbFuncs.getUserById(userId);
    expect(user).not.toBeNull();
  });

  it('deleteUserByName', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    const deletionResult = await userDbFuncs.deleteUserByName(USERNAME);
    expect(deletionResult.deletedCount).toEqual(1);
  });

  it('deleteUserById', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    const user = await userDbFuncs.deleteUserById(userId);
    expect(await User.findById(userId)).toBeNull();
  });

  it('clearUsers', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    await userDbFuncs.clearUsers();
    expect(await User.findById(userId)).toBeNull();
  });

  it('updateUserById', async () => {
    const userId = await userDbFuncs.createUser(USERNAME, PASSWORD, SEQQUESTION)
    const user = await userDbFuncs.updateUserById(userId, { username: "updatedName" });
    expect((await User.findById(userId)).username).toEqual('updatedName');
  });
  }
);


