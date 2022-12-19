global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
require('dotenv')
  .config();
const mongoose = require('mongoose');
const {
  getUserByName,
  updateUserById
} = require('../db/controller/user');
const {
  getGroupByName,
  updateGroupById
} = require('../db/controller/group');

let session;

const USERNAME1 = 'asdfasdf';
const PASSWORD1 = '12345678';
const SEQQUE1 = 'asdfasdf';

const USERNAME2 = 'asdfffff';
const PASSWORD2 = '12341234';
const SEQQUE2 = 'asdfffff';

const GROUP_NAME = 'testGroup';
const ISPUBLIC = false;
const TAGS = [];
const DESCRIPTION = 'desc';

let app;
let server;

beforeAll(() => {
  const express = require('../server');
  app = express.app;
  server = express.server;
});

beforeEach(async () => {
  session = request.agent(app);
  await session
    .put('/api/user/register')
    .send({
      username: USERNAME1,
      password: PASSWORD1,
      securityQuestionAnswer: SEQQUE1
    })
    .expect(201);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

afterAll(async () => {
  server.close();
});

describe('group routes', () => {
  it('create success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
  });

  it('leave success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    const session2 = request.agent(app);
    await session2
      .put('/api/user/register')
      .send({
        username: USERNAME2,
        password: PASSWORD2,
        securityQuestionAnswer: SEQQUE2
      })
      .expect(201);
    const userId2 = (await getUserByName(USERNAME2))._id;
    const groupId = (await getGroupByName(GROUP_NAME))._id;
    await updateUserById(userId2, {
      groups: [{
        admin: false,
        group: groupId
      }]
    });
    await session2
      .put('/api/group/leave')
      .send({ group: GROUP_NAME })
      .expect(200);
  });

  it('admin leave success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    const session2 = request.agent(app);
    await session2
      .put('/api/user/register')
      .send({
        username: USERNAME2,
        password: PASSWORD2,
        securityQuestionAnswer: SEQQUE2
      })
      .expect(201);
    const userId2 = (await getUserByName(USERNAME2))._id;
    const groupId = (await getGroupByName(GROUP_NAME))._id;
    await updateUserById(userId2, {
      groups: [{
        admin: true,
        group: groupId
      }]
    });
    await updateGroupById(groupId, { admins: [userId2] });
    await session2
      .put('/api/group/leave')
      .send({ group: GROUP_NAME })
      .expect(200);
  });

  it('get group by name success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    await session
      .get(`/api/group/group/${GROUP_NAME}?hashtags=${encodeURIComponent(JSON.stringify(['Tech']))}`)
      .send()
      .expect(200);
  });

  it('get group by id success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    const groupId = (await getGroupByName(GROUP_NAME))._id;
    await session
      .get(`/api/group/byid/${groupId}?hashtags=${encodeURIComponent(JSON.stringify(['Tech']))}`)
      .send()
      .expect(200);
  });

  it('promote/demote admin success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    const session2 = request.agent(app);
    await session2
      .put('/api/user/register')
      .send({
        username: USERNAME2,
        password: PASSWORD2,
        securityQuestionAnswer: SEQQUE2
      })
      .expect(201);
    const userId2 = (await getUserByName(USERNAME2))._id;
    const groupId = (await getGroupByName(GROUP_NAME))._id;
    await updateUserById(userId2, {
      groups: [{
        admin: false,
        group: groupId
      }]
    });
    await session
      .put('/api/group/changeAdmin')
      .send({
        group: GROUP_NAME,
        user: USERNAME2
      })
      .expect(200);
    await session
      .put('/api/group/changeAdmin')
      .send({
        group: GROUP_NAME,
        user: USERNAME2
      })
      .expect(200);
  });

  it('get public groups success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    await session
      .get(`/api/group/groups/public?tags=${encodeURIComponent(JSON.stringify(['Tech']))}`)
      .send()
      .expect(200);
  });

  it('get personal groups success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    await session
      .get(`/api/group/groups/me`)
      .send()
      .expect(200);
  });

  it('get recommended groups success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    await session
      .get(`/api/group/groups/recommended`)
      .send()
      .expect(200);
  });

  it('get feed success', async () => {
    await session
      .post('/api/group/create')
      .send({
        name: GROUP_NAME,
        isPublic: ISPUBLIC,
        description: DESCRIPTION,
        tags: TAGS,
      })
      .expect(201);
    await session
      .get(`/api/group/feed`)
      .send()
      .expect(200);
  });
});
