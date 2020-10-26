/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: 'your must be logged in' });
  }
  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload._id);
  res.user = user;
  next();
};
