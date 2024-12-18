const multer = require('multer');
const path = require('path');

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save files in 'backend/uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
  },
});

const upload = multer({ storage }).single('image'); // 'image' is the field name in the form

module.exports = upload;
