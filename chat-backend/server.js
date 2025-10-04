const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const messageRoutes = require('./routes/messageRoutes');
const apiRoutes = require('./routes/auth');
const find_user = require('./routes/get_user');
const chatController = require('./routes/contactsRoute'); 
require("dotenv").config()
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use('/api/messages', messageRoutes);
app.use('/api', apiRoutes);
app.use('/find', find_user);
app.use('/contacts/:userId', chatController.getContacts); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});