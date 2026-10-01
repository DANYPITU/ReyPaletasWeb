const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

router.get('/associates', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('associates')
      .select('id, name, logo_url')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const associates = (data || []).map(a => ({
      id: a.id,
      name: a.name,
      logoUrl: a.logo_url
    }));

    res.json({ data: associates });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;