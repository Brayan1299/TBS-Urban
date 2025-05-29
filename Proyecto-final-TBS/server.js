
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos
app.use(express.static('.'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// Ruta para el panel de cliente
app.get('/cliente', (req, res) => {
    res.sendFile(path.join(__dirname, 'crm-cliente.html'));
});

// Ruta para login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'crm-login.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
