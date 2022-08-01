const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  image: String,
  postImage: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      image: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      image: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = model('Post', postSchema);
