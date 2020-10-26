/* eslint-disable consistent-return */
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const requireLogin = require('../middleware/requireLogin');

const User = mongoose.model('User');

const router = express.Router();

router.get('/protected', requireLogin, (req, res) => {
  res.send('hello user');
});

router.post('/sign-up', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: 'please add all fields' });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User already exists' });
      }
      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            email,
            name,
            password: hashedPassword,
          });
          user.save()
            .then(() => {
              res.json({ msg: 'saved successfully' });
            })
            .catch((err) => console.log(err));
        });
    })

    .catch((err) => {
      console.log(err);
    });
});

router.post('/sign-in', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: 'Please provide email or password' });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status.json({ error: 'invalid email or password' });
      }
      bcrypt.compare(password, savedUser.password)
        .then((isMatch) => {
          if (isMatch) {
            // eslint-disable-next-line no-underscore-dangle
            const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
            res.json({ token });
          } else {
            return res.status(422).json({ error: 'Invalid email or password' });
          }
        });
    });
});

module.exports = router;
