const express = require('express');
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabase-admin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category_id, exists } = req.query;

    let query = supabase
      .from('products')
      .select('*');

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (exists !== undefined) {
      query = query.eq('exists', exists === 'true');
    }

    const { data: products, error } = await query.order('name');

    if (error) throw error;

    if (!products || products.length === 0) {
      return res.json([]);
    }

    const productIds = products.map(p => p.id);

    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .in('product_id', productIds)
      .order('name');

    const variantsMap = {};
    variants.forEach(v => {
      if (!variantsMap[v.product_id]) {
        variantsMap[v.product_id] = [];
      }
      variantsMap[v.product_id].push({
        id: v.id,
        name: v.name,
        price: parseFloat(v.price),
        created_at: v.created_at,
        updated_at: v.updated_at
      });
    });

    const result = products.map(p => ({
      ...p,
      price: p.price ? parseFloat(p.price) : null,
      variants: variantsMap[p.id] || []
    }));

    res.json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { name, price, exists, category_id, price_varies, image_url } = req.body;

  if (!name || !category_id) {
    return res.status(400).json({ error: 'name y category_id son requeridos' });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([{
        name,
        price: price || null,
        exists: exists !== undefined ? exists : true,
        category_id,
        price_varies: price_varies || false,
        image_url: image_url || null
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
  const { name, price, exists, category_id, price_varies, image_url } = req.body;

  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = price;
    if (exists !== undefined) updates.exists = exists;
    if (category_id !== undefined) updates.category_id = category_id;
    if (price_varies !== undefined) updates.price_varies = price_varies;
    if (image_url !== undefined) updates.image_url = image_url;

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Producto no encontrado' });

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
      .from('products')
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
