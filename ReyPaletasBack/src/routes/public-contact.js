const express = require('express');
const { sendContactEmail } = require('../config/resend');

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email y message son requeridos' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  try {
    const result = await sendContactEmail({ name, email, message });

    if (!result.success) {
      return res.status(500).json({ error: 'Error enviando mensaje' });
    }

    res.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
