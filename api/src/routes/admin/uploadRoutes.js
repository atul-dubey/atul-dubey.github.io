const express = require('express');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

// 1. The Route
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file selected!' });

  // Return the Cloudinary URL that the frontend can display and save
  res.json({
    message: 'File Uploaded!',
    imageUrl: req.file.path
  });
});

module.exports = router;