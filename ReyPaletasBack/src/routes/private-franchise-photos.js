const express = require('express');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  const { franchise_id } = req.query;

  try {
    let query = supabase
      .from('franchise_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (franchise_id) {
      query = query.eq('franchise_id', franchise_id);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { franchise_id, url } = req.body;

  if (!franchise_id || !url) {
    return res.status(400).json({ error: 'franchise_id y url son requeridos' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('franchise_photos')
      .insert([{
        franchise_id,
        url
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { url, franchise_id } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'url es requerido' });
  }

  try {
    const updates = { url };
    if (franchise_id !== undefined) {
      updates.franchise_id = franchise_id;
    }

    const { data, error } = await supabaseAdmin
      .from('franchise_photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Foto no encontrada' });

    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabaseAdmin
      .from('franchise_photos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;