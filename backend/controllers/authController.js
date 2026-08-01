const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');

const createToken = id => jwt.sign({ id }, env.jwtSecret, { expiresIn: '7d' });

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { username, email, password, phone, address } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ username, email, password, phone, address });

  res.status(201).json({
    message: 'Registration successful',
    token: createToken(user._id),
    user: user.toJSON()
  });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    token: createToken(user._id),
    user: user.toJSON()
  });
};

const profile = async (req, res) => {
  res.json({ user: req.user });
};

const logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};

module.exports = { register, login, profile, logout };
