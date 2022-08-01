const express = require('express');
const { ApolloError, gql, ApolloServer } = require('apollo-server-express');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} = require('apollo-server-core');

const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const Post = require('./models/Post');
const resolvers = require('./graphql/resolvers');
const User = require('./models/User');

const multer = require('multer');
const path = require('path');
const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.port || 5000;

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({}),
      ApolloServerPluginLandingPageDisabled(),
    ],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });

  await mongoose
    .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
      console.log('MongoDb Connected');
    });

  // add catch error here

  app.use(cors());
  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.url[req.url.length - 1] === 's') {
        cb(null, '../client/public/images/profiles');
      } else {
        cb(null, '../client/public/images/posts');
      }
    },
    filename: (req, file, cb) => {
      if (req.url[req.url.length - 1] === 's') {
        cb(null, file.originalname);
      } else {
        cb(null, Date.now() + '--' + file.originalname);
      }
    },
  });

  const maxSize = 1 * 1024 * 1024;
  const upload = multer({
    storage: fileStorageEngine,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == 'image/jpeg') {
        cb(null, true);
      } else {
        return cb(new Error('Only .jpeg fromat allowed'));
      }
    },
    limits: { fileSize: maxSize },
  });

  const uploadSingleImage = upload.single('image');

  app.post('/single', function (req, res) {
    uploadSingleImage(req, res, function (err) {
      if (err) {
        console.log(err.message);
        return res.status(400).send({ message: err.message });
      }
      res.send(req.file.filename);
    });
  });

  app.post('/profiless', function (req, res) {
    uploadSingleImage(req, res, function (err) {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      res.send(req.file.filename);
    });
  });

  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/client/build/index.html'))
  );

  app.listen(5000, () => console.log(`Server running at port 5000`));
}

startServer();
