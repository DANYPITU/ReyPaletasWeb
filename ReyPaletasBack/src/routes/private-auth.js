const express = require('express');
const supabaseAdmin = require('../config/supabase-admin');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router.post('/refresh-token', verifyToken, async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token es requerido' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      status: 'success',
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
      },
    });
  } catch (err) {
    console.error('Error refreshing token:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
