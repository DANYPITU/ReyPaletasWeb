const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son requeridos' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      user: {
        email: data.user.email,
      },
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/products', async (req, res) => {
  const { category_id, available } = req.query;

  try {
    let query = supabase
      .from('products')
      .select('id, name, price, image_url, price_varies, exists, category_id');

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (available !== undefined) {
      query = query.eq('exists', available === 'true');
    } else {
      query = query.eq('exists', true);
    }

    const { data: products, error } = await query.order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Error obteniendo productos' });
    }

    if (!products || products.length === 0) {
      return res.json([]);
    }

    const productIds = products.map(p => p.id);

    const { data: variants } = await supabase
      .from('product_variants')
      .select('product_id, name, price')
      .in('product_id', productIds);

    const variantsMap = {};
    variants.forEach(v => {
      if (!variantsMap[v.product_id]) {
        variantsMap[v.product_id] = [];
      }
      variantsMap[v.product_id].push({
        name: v.name,
        price: parseFloat(v.price)
      });
    });

    const result = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price_varies ? null : parseFloat(p.price),
      image_url: p.image_url,
      price_varies: p.price_varies,
      category_id: p.category_id,
      variants: variantsMap[p.id] || []
    }));

    res.json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({ error: 'Error obteniendo categorías' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/announcements', async (req, res) => {
  const { active } = req.query;

  const daysMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  const today = daysMap[new Date().getDay()];

  try {
    let query = supabase
      .from('announcements')
      .select('title, description, image_url, active, days')
      .order('created_at', { ascending: false });

    if (active !== undefined) {
      query = query.eq('active', active === 'true');
    } else {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    const filtered = data.filter(a => {
      if (!a.days || a.days.length === 0) return true;
      return a.days.includes(today);
    });

    const result = filtered.map(({ days, ...rest }) => rest);
    res.json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/cities', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('id, name')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/franchises', async (req, res) => {
  try {
    const { data: franchises, error } = await supabase
      .from('franchises')
      .select('id, latitude, longitude, streets, city_id');

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
        latitude: parseFloat(f.latitude),
        longitude: parseFloat(f.longitude),
        streets: f.streets,
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

router.get('/sales-points', async (req, res) => {
  try {
    const { data: salesPoints, error } = await supabase
      .from('sales_points')
      .select('*');

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
        photo_url: s.photo_url
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

module.exports = router;
