
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Manejar todas las rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en http://0.0.0.0:${PORT}`);
});
