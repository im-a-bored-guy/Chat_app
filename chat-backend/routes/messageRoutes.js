const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Message = require('../models/Message');

router.post('/send', upload.array('files'), async (req, res) => {
  try {
    const { sender, recipient, text } = req.body;
    const fileData = req.files?.map(f => f.path) || [];

    const message = new Message({
      sender,
      recipient,
      text,
      files: fileData,
    });

    console.log("Received file");
    await message.save();
    res.status(200).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

router.get('/history/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
