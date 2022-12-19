global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const request = require('supertest');
require('dotenv')
  .config();
const mongoose = require('mongoose');
const {} = require('../db/controller/user');
const {
  getGroupByName,
  getGroupById
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

describe('post route', () => {
  it('create text post success', async () => {
    await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
  });

  it('delete post success', async () => {
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
      .delete(`/api/post/${post._id}`)
      .send()
      .expect(200);
    const group = await getGroupById(groupId);
    expect(group.posts)
      .toHaveLength(0);
  });

  it('edit post success', async () => {
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
      .put(`/api/post/${post._id}`)
      .send({ text: 'updated' })
      .expect(200);
  });

  it('like post success', async () => {
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
      .post(`/api/post/like/${post._id}`)
      .send()
      .expect(200);
  });

  it('like/unlike post success', async () => {
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
      .post(`/api/post/like/${post._id}`)
      .send()
      .expect(200);
    await session
      .post(`/api/post/like/${post._id}`)
      .send()
      .expect(200);
  });

  it('flag/unflag post success', async () => {
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
      .post(`/api/post/flag/${post._id}`)
      .send()
      .expect(200);
    await session
      .post(`/api/post/flag/${post._id}`)
      .send()
      .expect(200);
  });

  it('hide post success', async () => {
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
      .post(`/api/post/hide/${post._id}`)
      .send()
      .expect(200);
  });

  it('putty get post personal posts success', async () => {
    await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
    await session
      .put('/api/post')
      .send()
      .expect(200);
  });

  it('putty get group posts success', async () => {
    await session
      .post('/api/post')
      .send({
        text: POST_TEXT_CONTENT,
        title: POST_TEXT_TITLE,
        tags: POST_TEXT_TAGS,
        group: groupId
      })
      .expect(201);
    await session
      .put(`/api/post/group/${groupId}`)
      .send()
      .expect(200);
  });

  it('putty get specific posts success', async () => {
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
      .put(`/api/post/specific/${post._id}`)
      .send()
      .expect(200);
  });
});
