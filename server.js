const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const userRouter = require('./routes/user');
const groupRouter = require('./routes/group');
const invitationsRouter = require('./routes/invitations');
const auth = require('./middleware/auth');
const messageRouter = require('./routes/messages');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(cors());
const dbString = process.env.DB_CONNECTION_STRING
  ? process.env.TEST_DB_CONNECTION_STRING
  : "mongodb+srv://188_final:188_final@188.rqvnir6.mongodb.net/?retryWrites=true&w=majority"
const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};
mongoose.connect(
  dbString,
  opts,
  (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      // console.log('database connection failed');
      // eslint-disable-next-line no-console
    } else { console.log('succesfully connected to the database'); }
  },
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/post', postRouter);
app.use('/api/user', userRouter);
app.use('/api/group', groupRouter);
app.use('/api/comment', commentRouter);
app.use('/api/invitations', invitationsRouter);
app.use('/api/message', messageRouter);
app.use('/api/s3', require('react-s3-uploader/s3router')({
  bucket: 'chitchat-cis557',
  region: 'us-east-2', // optional
  headers: { 'Access-Control-Allow-Origin': '*' }, // optional
  ACL: 'private',
}));

app.use(express.static(path.join(__dirname, './chitchat/build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'chitchat/build/index.html'));
});

app.use(auth);
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`listening on port ${PORT}...`);
});

module.exports = { app, server };
