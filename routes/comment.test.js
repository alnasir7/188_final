global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
require('dotenv')
  .config();
const mongoose = require('mongoose');
const {} = require('../db/controller/user');
const {
  getGroupByName,
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

const POST_TEXT_CONTENT = 'content';
const POST_TEXT_TAGS = ['Tech'];
const POST_TEXT_TITLE = 'title';

const COMMENT_CONTENT = 'comment';

let app;
let server;
let groupId;

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
  await session
    .post('/api/group/create')
    .send({
      name: GROUP_NAME,
      isPublic: ISPUBLIC,
      description: DESCRIPTION,
      tags: TAGS,
    })
    .expect(201);
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

describe('comment route', () => {
  it('create comment success', async () => {
    const { body: post } = await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
    await session
      .post(`/api/comment/${post._id}`)
      .send({ text: COMMENT_CONTENT })
      .expect(201);
  });

  it('get comment success', async () => {
    const { body: post } = await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
    await session
      .post(`/api/comment/${post._id}`)
      .send({ text: COMMENT_CONTENT })
      .expect(201);
    const { body: response } = await session
      .get(`/api/comment/${post._id}`)
      .send()
      .expect(200);
    expect(response)
      .toHaveLength(1);
  });

  it('delete comment success', async () => {
    const { body: post } = await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
    const { body: comment } = await session
      .post(`/api/comment/${post._id}`)
      .send({ text: COMMENT_CONTENT })
      .expect(201);
    await session
      .delete(`/api/comment/${comment._id}`)
      .send({ text: COMMENT_CONTENT })
      .expect(200);
    const { body: response } = await session
      .get(`/api/comment/${post._id}`)
      .send()
      .expect(200);
    expect(response)
      .toHaveLength(0);
  });

  it('edit comment success', async () => {
    const { body: post } = await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
    const { body: comment } = await session
      .post(`/api/comment/${post._id}`)
      .send({ text: COMMENT_CONTENT })
      .expect(201);
    await session
      .put(`/api/comment/${comment._id}`)
      .send({ text: 'updated comment' })
      .expect(200);
    const { body: response } = await session
      .get(`/api/comment/${post._id}`)
      .send()
      .expect(200);
    expect(response[0].text)
      .toEqual('updated comment');
  });
});
