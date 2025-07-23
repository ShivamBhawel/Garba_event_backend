const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/message');
const User = require('./models/user');
const UserRoutes = require('./routes/messageRoutes');

require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use('/user' , UserRoutes);

// Connect DB
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Database connected'))
.catch((err) => console.error('❌ Database connection error:', err));


// SOCKET.IO
io.on('connection', async (socket) => {
  const token = socket.handshake.query.token;
  let user;

  try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  user = await User.findById(decoded.id);

  if (!user) {
    socket.disconnect();
    return;
  }
} catch (err) {
  socket.disconnect();
  return;
}


  // Send all messages with full sender info
  const messages = await Message.find().populate('senderId', 'contact name _id');
  socket.emit('allMessages', messages);

  socket.on('sendMessage', async (data) => {
    const newMsg = await Message.create({
      text: data.text,
      senderId: user._id
    });

    const populatedMsg = await newMsg.populate('senderId', 'contact name _id');
    io.emit('newMessage', populatedMsg);
  });
});


server.listen(5000, () => console.log('Server running on port 5000'));
