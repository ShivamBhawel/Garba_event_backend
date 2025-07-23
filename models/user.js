const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  contact: String,
  password: String,
  role: { type: String, enum: ['participant', 'leader'], default: 'participant' }
});

module.exports = mongoose.model('User', userSchema);
