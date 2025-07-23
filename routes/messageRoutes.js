const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const User = require('../models/user');
require('dotenv').config();

router.post('/signup', async (req, res) => {
  const { name, contact, password, role } = req.body;
  if (!/^\d{10}$/.test(contact)) return res.status(400).json({ error: "Contact must be 10 digits" });
const existing = await User.findOne({ contact });
if (existing) return res.status(400).json({ error: "Phone number already registered" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, contact, password: hashed, role });
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
});


router.post('/login', async (req, res) => {
  const { contact, password } = req.body;
  const user = await User.findOne({ contact });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Incorrect Number or password' });

const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
res.json({ token, role: user.role });

});



// Route to fetch users
router.get('/list',  async (req, res) => {
  try {
    const users = await User.find({}, 'name contact');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
