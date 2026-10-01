const express = require('express');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data: franchises, error } = await supabase
      .from('franchises')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!franchises || franchises.length === 0) {
      return res.json([]);
    }

    const cityIds = [...new Set(franchises.map(f => f.city_id))];
    const franchiseIds = franchises.map(f => f.id);

    let citiesMap = {};
    let photosMap = {};

    if (cityIds.length > 0) {
      const citiesRes = await supabase.from('cities').select('id, name').in('id', cityIds);
      if (citiesRes.error) throw citiesRes.error;
      (citiesRes.data || []).forEach(c => {
        citiesMap[c.id] = { id: c.id, name: c.name };
      });
    }

    if (franchiseIds.length > 0) {
      const photosRes = await supabase.from('franchise_photos').select('id, franchise_id, url').in('franchise_id', franchiseIds);
      if (photosRes.error) throw photosRes.error;
      (photosRes.data || []).forEach(p => {
        if (!photosMap[p.franchise_id]) photosMap[p.franchise_id] = [];
        photosMap[p.franchise_id].push({ id: p.id, url: p.url });
      });
    }

    const franchisesWithCity = franchises.map(f => ({
      franchise: {
        id: f.id,
        city_id: f.city_id,
        latitude: f.latitude ? parseFloat(f.latitude) : null,
        longitude: f.longitude ? parseFloat(f.longitude) : null,
        streets: f.streets,
        created_at: f.created_at,
        updated_at: f.updated_at,
        photos: photosMap[f.id] || []
      },
      city: citiesMap[f.city_id]
    }));

    const groupedByCity = franchisesWithCity.reduce((acc, item) => {
      if (!item.city) return acc;
      const cityId = item.city.id;
      if (!acc[cityId]) {
        acc[cityId] = {
          city: item.city,
          franchises: []
        };
      }
      acc[cityId].franchises.push(item.franchise);
      return acc;
    }, {});

    const result = Object.values(groupedByCity).sort((a, b) =>
      a.city.name.localeCompare(b.city.name)
    );

    res.json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { city_id, latitude, longitude, streets } = req.body;

  if (!city_id) {
    return res.status(400).json({ error: 'city_id es requerido' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('franchises')
      .insert([{
        city_id,
        latitude: latitude || null,
        longitude: longitude || null,
        streets: streets || null
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
  const { city_id, latitude, longitude, streets } = req.body;

  try {
    const updates = {};
    if (city_id !== undefined) updates.city_id = city_id;
    if (latitude !== undefined) updates.latitude = latitude;
    if (longitude !== undefined) updates.longitude = longitude;
    if (streets !== undefined) updates.streets = streets;

    const { data, error } = await supabaseAdmin
      .from('franchises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Franquicia no encontrada' });

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
      .from('franchises')
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
