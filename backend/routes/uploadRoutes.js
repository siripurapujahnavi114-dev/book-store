const express = require('express');
const upload = require('../config/multer');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

/**
 * POST /api/upload
 * Upload a single image file
 * Returns the filename and path
 */
router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    url: fileUrl,
    path: req.file.path
  });
}));

/**
 * POST /api/upload/multiple
 * Upload multiple image files
 * Returns array of filenames and paths
 */
router.post('/multiple', upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    url: `${req.protocol}://${req.get('host')}/api/uploads/${file.filename}`,
    path: file.path
  }));

  res.status(200).json({
    success: true,
    message: 'Images uploaded successfully',
    files: uploadedFiles
  });
}));

module.exports = router;
