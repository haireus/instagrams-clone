const express = require('express');
const mongoose = require('mongoose');

const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

const Post = mongoose.model('Post');

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('postedBy', '_id name');
    res.json({ posts });
  } catch (error) {
    res.json({ error });
  }
});

router.post('/posts', requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(422).json({ error: 'please add all the filed' });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post.save().then((result) => {
    res.json({ post: result });
  }).catch((err) => {
    res.json({ err });
  });
});

router.get('/me/posts', requireLogin, async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id }).populate('postedBy', '_id name');
    res.json({ posts });
  } catch (error) {
    res.json({ error });
  }
});
module.exports = router;
