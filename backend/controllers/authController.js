const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  // 8-16 chars, at least 1 uppercase, at least 1 special character
  const lengthOk = password.length >= 8 && password.length <= 16;
  const upperOk = /[A-Z]/.test(password);
  const specialOk = /[^A-Za-z0-9]/.test(password);
  return lengthOk && upperOk && specialOk;
}

async function signup(req, res) {
  try {
    const { name, email, password, address } = req.body;

    if (!name || name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: 'Name must be 20-60 characters' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (address && address.length > 400) {
      return res.status(400).json({ message: 'Address must be under 400 characters' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be 8-16 characters with at least one uppercase letter and one special character',
      });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, passwordHash, address, role: 'user' });

    const token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: { id: userId, name, email, address, role: 'user' },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

module.exports = { signup, login };