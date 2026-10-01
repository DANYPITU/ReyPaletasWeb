const express = require('express');
const supabaseAdmin = require('../config/supabase-admin');
const { uploadSingle, uploadMultiple } = require('../middlewares/upload-middleware');

const router = express.Router();

const ALLOWED_BUCKETS = ['Products', 'Announcements', 'Franchises', 'HeroImages', 'Associates'];

function validateBucket(bucket) {
  if (!bucket) return 'bucket es requerido';
  if (!ALLOWED_BUCKETS.includes(bucket)) return `bucket no permitido: ${bucket}`;

  return null;
}

function sanitizeSegment(segment) {
  const cleaned = segment.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_');
  return cleaned.replace(/^[._]+/, '');
}

function sanitizeFolder(folder) {
  if (!folder) return '';

  return String(folder)
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment !== '' && segment !== '.' && segment !== '..')
    .map(sanitizeSegment)
    .filter((segment) => segment !== '')
    .join('/');
}

function buildObjectPath(file, folder) {
  const fileName = sanitizeSegment(file.originalname) || 'archivo';
  const objectName = `${Date.now()}-${fileName}`;
  const safeFolder = sanitizeFolder(folder);

  return safeFolder ? `${safeFolder}/${objectName}` : objectName;
}

async function uploadFile({ file, bucket, folder }) {
  const path = buildObjectPath(file, folder);
  const bucketApi = supabaseAdmin.storage.from(bucket);

  const { error } = await bucketApi.upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) throw error;

  const { data } = bucketApi.getPublicUrl(path);

  return { url: data.publicUrl, path, bucket };
}

router.post('/upload', uploadSingle, async (req, res) => {
  const { bucket, folder } = req.body || {};
  const { file } = req;

  const bucketError = validateBucket(bucket);
  if (bucketError) return res.status(400).json({ error: bucketError });

  if (!file) {
    return res.status(400).json({ error: 'file es requerido' });
  }

  try {
    const result = await uploadFile({ file, bucket, folder });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error subiendo archivo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/upload-multiple', uploadMultiple, async (req, res) => {
  const { bucket, folder } = req.body || {};
  const { files } = req;

  const bucketError = validateBucket(bucket);
  if (bucketError) return res.status(400).json({ error: bucketError });

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Se requiere al menos un archivo' });
  }

  try {
    const results = [];

    for (const file of files) {
      results.push(await uploadFile({ file, bucket, folder }));
    }

    res.status(200).json({ data: results });
  } catch (err) {
    console.error('Error subiendo archivos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/', async (req, res) => {
  const { bucket, path } = req.body || {};

  const bucketError = validateBucket(bucket);
  if (bucketError) return res.status(400).json({ error: bucketError });

  if (typeof path !== 'string' || path.trim() === '') {
    return res.status(400).json({ error: 'path es requerido' });
  }

  if (/^https?:\/\//i.test(path)) {
    return res.status(400).json({ error: 'path no debe ser una URL completa' });
  }

  try {
    const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

    if (error) throw error;

    res.status(200).json({ deleted: true, path });
  } catch (err) {
    console.error('Error eliminando archivo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
