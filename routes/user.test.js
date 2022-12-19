global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
require('dotenv')
  .config();
// const dbString = process.env.TEST_DB_CONNECTION_STRING;
// const opts = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   keepAlive: true,
//   keepAliveInitialDelay: 300000,
//   serverSelectionTimeoutMS: 5000,
//   socketTimeoutMS: 45000,
// };
const mongoose = require('mongoose');
const { agent } = require('supertest');
let app;
let server;

beforeAll(() => {
  const express = require('../server');
  app = express.app;
  server = express.server;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
//
afterAll(async () => {
  server.close();
});

const USERNAME = 'asdfasdf';
const PASSWORD = '12345678';
const SEQQUE = 'asdfasdf';

describe('user route test', () => {

  it('register success', async () => {
    await agent(app)
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
  });

  it('register bad form', async () => {
    await agent(app)
      .put('/api/user/register')
      .send({
        username: 'a',
        password: 'b',
        securityQuestionAnswer: 'c'
      })
      .expect(400);
  });

  it('register already taken', async () => {
    await agent(app)
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await agent(app)
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(400);
  });

  it('logout success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/logout')
      .send()
      .expect(200);
  });

  it('logout success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/logout')
      .send()
      .expect(200);
  });

  it('login success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/logout')
      .send()
      .expect(200);
    await session
      .put('/api/user/login')
      .send({
        username: USERNAME,
        password: PASSWORD
      })
      .expect(200);
  });

  it('login wrong password', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/logout')
      .send()
      .expect(200);
    await session
      .put('/api/user/login')
      .send({
        username: USERNAME,
        password: '12345612'
      })
      .expect(401);
  });

  it('deactivate success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/deactivate')
      .send()
      .expect(200);
  });

  it('profile success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .get(`/api/user/profile`)
      .send()
      .expect(200);
  });

  it('self profile success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .get(`/api/user/profile/${USERNAME}`)
      .send()
      .expect(200);
  });

  it('other profile success', async () => {
    await agent(app)
      .put('/api/user/register')
      .send({
        username: 'user2user',
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .get(`/api/user/profile/user2user`)
      .send()
      .expect(200);
  });

  it('get notifications success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .get('/api/user/notifications')
      .send()
      .expect(200);
  });

  it('clear notifications success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/notifications/clear')
      .send()
      .expect(200);
  });

  it('change password success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/password')
      .send({
        oldPassword: PASSWORD,
        newPassword: '12341234'
      })
      .expect(200);
  });

  it('resetPassword success', async () => {
    await agent(app)
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await agent(app)
      .put('/api/user/reset')
      .send({
        username: USERNAME,
        securityQuestionAnswer: SEQQUE,
        newPassword: '12341234'
      })
      .expect(200);
  });

  it('editAvatar success', async () => {
    const session = agent(app);
    await session
      .put('/api/user/register')
      .send({
        username: USERNAME,
        password: PASSWORD,
        securityQuestionAnswer: SEQQUE
      })
      .expect(201);
    await session
      .put('/api/user/edit/avatar')
      .send({ avatar: 'avatarURL' })
      .expect(200);
  });
});
