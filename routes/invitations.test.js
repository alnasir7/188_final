global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
require('dotenv')
  .config();
const mongoose = require('mongoose');
const {
  updateUserById,
  getUserByName
} = require('../db/controller/user');
const {
  getGroupByName,
  getGroupById,
  updateGroupById
} = require('../db/controller/group');

let session;
let session2;

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
let userId2;
let groupId;

beforeAll(() => {
  const express = require('../server');
  app = express.app;
  server = express.server;
});

beforeEach(async () => {
  session = request.agent(app);
  session2 = request.agent(app);
  await session
    .put('/api/user/register')
    .send({
      username: USERNAME1,
      password: PASSWORD1,
      securityQuestionAnswer: SEQQUE1
    })
    .expect(201);
  await session
    .post('/api/group/create')
    .send({
      name: GROUP_NAME,
      isPublic: ISPUBLIC,
      description: DESCRIPTION,
      tags: TAGS,
    })
    .expect(201);
  await session2
    .put('/api/user/register')
    .send({
      username: USERNAME2,
      password: PASSWORD2,
      securityQuestionAnswer: SEQQUE2
    })
    .expect(201);
  userId2 = (await getUserByName(USERNAME2))._id;
  groupId = (await getGroupByName(GROUP_NAME))._id;
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

describe('invitations route', () => {
  it('new invite success', async () => {
    await session
      .post('/api/invitations/invite')
      .send({
        receiver: USERNAME2,
        group: groupId
      })
      .expect(201);
  });

  it('approve invite', async () => {
    const { body: result } = await session
      .post('/api/invitations/invite')
      .send({
        receiver: USERNAME2,
        group: groupId
      })
      .expect(201);
    await session
      .post(`/api/invitations/invite/approve/${result._id}`)
      .send()
      .expect(200);
  });

  it('request invite success', async () => {
    await updateGroupById(groupId, { public: true });
    const { body: result } = await session2
      .post('/api/invitations/request')
      .send({ group: groupId })
      .expect(201);
  });

  it('get invites success', async () => {
    await session
      .get('/api/invitations/invite')
      .send()
      .expect(200);
  });

  it('get group invites success', async () => {
    await session
      .get(`/api/invitations/invite/${groupId}`)
      .send()
      .expect(200);
  });

  it('get group requests success', async () => {
    await session
      .get(`/api/invitations/requested/${groupId}`)
      .send()
      .expect(200);
  });

  it('get if user requested success', async () => {
    await session
      .get(`/api/invitations/request/${groupId}`)
      .send()
      .expect(200);
  });

  it('handle invite accept success', async () => {
    const { body: result } = await session
      .post('/api/invitations/invite')
      .send({
        receiver: USERNAME2,
        group: groupId
      })
      .expect(201);
    await session
      .post(`/api/invitations/invite/approve/${result._id}`)
      .send()
      .expect(200);
    await session2
      .post(`/api/invitations/handle_invite/${result._id}`)
      .send({ accept: true })
      .expect(200);
  });

  it('handle invite decline success', async () => {
    const { body: result } = await session
      .post('/api/invitations/invite')
      .send({
        receiver: USERNAME2,
        group: groupId
      })
      .expect(201);
    await session
      .post(`/api/invitations/invite/approve/${result._id}`)
      .send()
      .expect(200);
    await session2
      .post(`/api/invitations/handle_invite/${result._id}`)
      .send({ accept: false })
      .expect(200);
  });

  it('handle request accept success', async () => {
    await updateGroupById(groupId, { public: true });
    const { body: result } = await session2
      .post('/api/invitations/request')
      .send({ group: groupId })
      .expect(201);
    await session
      .post(`/api/invitations/handle_request/${result._id}`)
      .send({ accept: true })
      .expect(200);
  });

  it('handle request decline success', async () => {
    await updateGroupById(groupId, { public: true });
    const { body: result } = await session2
      .post('/api/invitations/request')
      .send({ group: groupId })
      .expect(201);
    await session
      .post(`/api/invitations/handle_request/${result._id}`)
      .send({ accept: false })
      .expect(200);
  });
});
