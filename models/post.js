const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: 'no photo',
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

mongoose.model('Post', postSchema);
