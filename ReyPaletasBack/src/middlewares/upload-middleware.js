const multer = require('multer');

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

class UnsupportedFileTypeError extends Error {
  constructor(mimetype) {
    super(`Tipo de archivo no permitido: ${mimetype}`);
    this.name = 'UnsupportedFileTypeError';
    this.code = 'UNSUPPORTED_FILE_TYPE';
    this.mimetype = mimetype;
  }
}

function fileFilter(req, file, callback) {
  if (!file.mimetype.startsWith('image/')) {
    return callback(new UnsupportedFileTypeError(file.mimetype));
  }

  callback(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter,
});

function handleUploadError(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'El archivo excede el límite de 4 MB' });
      }

      if (err instanceof UnsupportedFileTypeError) {
        return res.status(415).json({ error: 'Solo se permiten archivos de imagen' });
      }

      next(err);
    });
  };
}

const uploadSingle = handleUploadError(upload.single('file'));
const uploadMultiple = handleUploadError(upload.array('files'));

module.exports = {
  MAX_FILE_SIZE_BYTES,
  uploadSingle,
  uploadMultiple,
};
