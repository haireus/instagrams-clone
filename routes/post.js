const express = require('express');
const mongoose = require('mongoose');

const requireLogin = require('../middleware/requireLogin');

const router = express.Router();

const Post = mongoose.model('Post');

router.post('/posts', requireLogin, (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(422).json({ error: 'please add all the filed' });
  }
  console.log(req.user);
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  });
  post.save().then((result) => {
    res.json({ post: result });
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
