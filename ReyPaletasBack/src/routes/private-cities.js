const express = require('express');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name es requerido' });
  }

  try {
    const { data: existing } = await supabase
      .from('cities')
      .select('id')
      .eq('name', name)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'La ciudad ya existe' });
    }

    const { data, error } = await supabaseAdmin
      .from('cities')
      .insert([{ name }])
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
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'name es requerido' });
  }

  try {
    const { data: existing } = await supabase
      .from('cities')
      .select('id')
      .eq('name', name)
      .neq('id', id)
      .single();

    if (existing) {
      return res.status(409).json({ error: 'Ya existe una ciudad con ese nombre' });
    }

    const { data, error } = await supabaseAdmin
      .from('cities')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Ciudad no encontrada' });

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
      .from('cities')
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
