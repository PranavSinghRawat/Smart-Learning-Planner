const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name || username,
      username,
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, username: user.username, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Support login by username OR email
    const user = await User.findOne({
      $or: [{ username }, { email: username.toLowerCase() }],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

module.exports = { register, login };
