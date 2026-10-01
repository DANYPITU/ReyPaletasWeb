const express = require('express');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data: salesPoints, error } = await supabase
      .from('sales_points')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!salesPoints || salesPoints.length === 0) {
      return res.json([]);
    }

    const cityIds = [...new Set(salesPoints.map(s => s.city_id))];
    let citiesMap = {};

    if (cityIds.length > 0) {
      const citiesRes = await supabase.from('cities').select('id, name').in('id', cityIds);
      if (citiesRes.error) throw citiesRes.error;
      (citiesRes.data || []).forEach(c => {
        citiesMap[c.id] = { id: c.id, name: c.name };
      });
    }

    const salesPointsWithCity = salesPoints.map(s => ({
      sales_point: {
        id: s.id,
        city_id: s.city_id,
        name: s.name,
        latitude: s.latitude ? parseFloat(s.latitude) : null,
        longitude: s.longitude ? parseFloat(s.longitude) : null,
        streets: s.streets,
        photo_url: s.photo_url,
        created_at: s.created_at,
        updated_at: s.updated_at
      },
      city: citiesMap[s.city_id]
    }));

    const groupedByCity = salesPointsWithCity.reduce((acc, item) => {
      if (!item.city) return acc;
      const cityId = item.city.id;
      if (!acc[cityId]) {
        acc[cityId] = {
          city: item.city,
          sales_points: []
        };
      }
      acc[cityId].sales_points.push(item.sales_point);
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
  const { city_id, name, latitude, longitude, streets, photo_url } = req.body;

  if (!city_id || !name) {
    return res.status(400).json({ error: 'city_id y name son requeridos' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('sales_points')
      .insert([{
        city_id,
        name,
        latitude: latitude || null,
        longitude: longitude || null,
        streets: streets || null,
        photo_url: photo_url || null
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
  const { city_id, name, latitude, longitude, streets, photo_url } = req.body;

  try {
    const updates = {};
    if (city_id !== undefined) updates.city_id = city_id;
    if (name !== undefined) updates.name = name;
    if (latitude !== undefined) updates.latitude = latitude;
    if (longitude !== undefined) updates.longitude = longitude;
    if (streets !== undefined) updates.streets = streets;
    if (photo_url !== undefined) updates.photo_url = photo_url;

    const { data, error } = await supabaseAdmin
      .from('sales_points')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Punto de venta no encontrado' });

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
      .from('sales_points')
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
