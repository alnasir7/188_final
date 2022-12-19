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
  getGroupByName
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
  const groupId = (await getGroupByName(GROUP_NAME))._id;
  await updateUserById(userId2, {
    groups: [{
      admin: false,
      group: groupId
    }]
  });
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

describe('message route test', () => {
  it('getContacts success', async () => {
    const contacts = await session
      .get('/api/message/contacts')
      .send()
      .expect(200);
    expect(contacts.body)
      .toHaveLength(1);
  });

  it('new text message success', async () => {
    await session
      .post('/api/message')
      .send({
        receiver: userId2,
        body: 'content'
      })
      .expect(201);
  });

  it('read message success', async () => {
    const { body: message } = await session
      .post('/api/message')
      .send({
        receiver: userId2,
        body: 'content'
      })
      .expect(201);
    await session2
      .post(`/api/message/read/${message._id}`)
      .send()
      .expect(200);
  });

  it('get conversation success', async () => {
    await session
      .post('/api/message')
      .send({
        receiver: userId2,
        body: 'content'
      })
      .expect(201);
    const { body: messages } = await session
      .get(`/api/message/${userId2}`)
      .send()
      .expect(200);
    expect(messages)
      .toHaveLength(1);
  });

  it('get conversation success', async () => {
    await session
      .post('/api/message')
      .send({
        receiver: userId2,
        body: 'content'
      })
      .expect(201);
    const { body: messages } = await session
      .get(`/api/message/${userId2}`)
      .send()
      .expect(200);
    expect(messages)
      .toHaveLength(1);
  });
});
