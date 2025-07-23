const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: String,
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', messageSchema);
