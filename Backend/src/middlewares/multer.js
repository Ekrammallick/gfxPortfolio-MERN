import multer from 'multer';

// Configure storage (Memory or Disk)
const storage = multer.memoryStorage(); // In-memory storage for file processing

// Create upload instance
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit files to 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only image files are allowed!'), false); // Reject non-images
    }
  },
});

export default upload;
