const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos desde la carpeta raíz
app.use(express.static('./'));

// Manejar todas las rutas
app.get('*', (req, res) => {
  // Si la ruta no coincide con un archivo, servir index.html
  if (!req.path.includes('.')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).send('Archivo no encontrado');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor ejecutándose en http://0.0.0.0:${PORT}`);
});