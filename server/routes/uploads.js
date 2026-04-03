const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const supabase = require('../supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIMETYPES.includes(file.mimetype)) {
      return cb(new Error('Only image files (jpg, png, gif, webp, svg) are allowed'));
    }
    cb(null, true);
  }
});

// POST /api/uploads - upload an image to Supabase Storage (admin)
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = crypto.randomBytes(16).toString('hex') + ext;
    const filePath = `images/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return res.status(500).json({ error: 'Upload failed: ' + uploadError.message });
    }

    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    res.json({ url: urlData.publicUrl, filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Error handler for multer
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large (max 5 MB).' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Upload failed.' });
});

module.exports = router;
