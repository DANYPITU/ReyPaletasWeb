const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

router.get('/hero-images', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('id, url')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;