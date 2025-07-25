const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 🔒 Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Validation Error:', err);
    res.status(400).json({
      error: err.errors ? err.errors[0].message : err.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      'your_jwt_secret', // Replace with process.env.JWT_SECRET in production
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
