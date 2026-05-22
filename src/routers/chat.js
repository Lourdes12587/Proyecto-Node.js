// routes/chat.js
const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const n8nResponse = await fetch('https://tu-instancia.n8n.cloud/webhook/tu-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await n8nResponse.json();
    res.json({ reply: data.output || data.message });

  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con el chatbot' });
  }
});

module.exports = router;