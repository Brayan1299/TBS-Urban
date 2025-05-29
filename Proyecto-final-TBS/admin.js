// Funciones utilitarias para el panel de administración

// Verificar la sesión del administrador
function verificarSesionAdmin() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual || usuarioActual.rol !== 'admin') {
        window.location.href = '../crm-login.html';
        return false;
    }
    return true;
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = '../crm-login.html';
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${mensaje}</span>
        </div>
        <button class="cerrar-notificacion">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notificacion);
    
    // Mostrar la notificación con animación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    // Configurar cierre de notificación
    const cerrarBtn = notificacion.querySelector('.cerrar-notificacion');
    cerrarBtn.addEventListener('click', () => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notificacion)) {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }
    }, 5000);
}

// Función para confirmar acción
function confirmarAccion(mensaje, callback) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Crear diálogo de confirmación
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
        <div class="confirm-header">
            <div class="confirm-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 class="confirm-title">Confirmar acción</h3>
        </div>
        <div class="confirm-message">${mensaje}</div>
        <div class="confirm-actions">
            <button class="admin-btn btn-secondary" id="cancelBtn">Cancelar</button>
            <button class="admin-btn btn-danger" id="confirmBtn">Confirmar</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Configurar botones
    const cancelBtn = dialog.querySelector('#cancelBtn');
    const confirmBtn = dialog.querySelector('#confirmBtn');
    
    cancelBtn.addEventListener('click', () => {
        overlay.remove();
        dialog.remove();
    });
    
    confirmBtn.addEventListener('click', () => {
        overlay.remove();
        dialog.remove();
        if (typeof callback === 'function') {
            callback();
        }
    });
}

// Función para formatear fecha
function formatoFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Función para formatear precio
function formatoPrecio(precio) {
    return `$${precio.toLocaleString()}`;
}

// Función para capitalizar la primera letra
function capitalizarPrimeraLetra(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Obtener parámetros de la URL
function obtenerParametroURL(nombre) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nombre);
}

// Función para generar ID único
function generarID() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Función para guardar productos
function guardarProductos(productos) {
    localStorage.setItem('productos', JSON.stringify(productos));
}

// Función para guardar pedidos
function guardarPedidos(pedidos) {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Función para guardar clientes
function guardarClientes(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

// Función para cargar productos
function cargarProductos() {
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        return JSON.parse(productosGuardados);
    }
    // Si no hay productos guardados, usar los predeterminados del dataStore
    localStorage.setItem('productos', JSON.stringify(window.dataStore.productos));
    return window.dataStore.productos;
}

// Función para cargar pedidos
function cargarPedidos() {
    const pedidosGuardados = localStorage.getItem('pedidos');
    if (pedidosGuardados) {
        return JSON.parse(pedidosGuardados);
    }
    // Si no hay pedidos guardados, usar los predeterminados del dataStore
    localStorage.setItem('pedidos', JSON.stringify(window.dataStore.pedidos));
    return window.dataStore.pedidos;
}

// Función para cargar clientes
function cargarClientes() {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
        return JSON.parse(clientesGuardados);
    }
    // Si no hay clientes guardados, usar los predeterminados del dataStore
    localStorage.setItem('clientes', JSON.stringify(window.dataStore.clientes));
    return window.dataStore.clientes;
}

// Función para buscar productos
function buscarProductos(termino) {
    const productos = cargarProductos();
    const terminoLower = termino.toLowerCase();
    
    return productos.filter(producto => 
        producto.nombre.toLowerCase().includes(terminoLower) ||
        producto.descripcion.toLowerCase().includes(terminoLower) ||
        producto.categoria.toLowerCase().includes(terminoLower)
    );
}

// Función para buscar pedidos
function buscarPedidos(termino) {
    const pedidos = cargarPedidos();
    const clientes = cargarClientes();
    const terminoLower = termino.toLowerCase();
    
    return pedidos.filter(pedido => {
        const cliente = clientes.find(c => c.id === pedido.clienteId);
        return (
            pedido.id.toString().includes(terminoLower) ||
            (cliente && cliente.nombre.toLowerCase().includes(terminoLower)) ||
            pedido.estado.toLowerCase().includes(terminoLower)
        );
    });
}

// Función para buscar clientes
function buscarClientes(termino) {
    const clientes = cargarClientes();
    const terminoLower = termino.toLowerCase();
    
    return clientes.filter(cliente => 
        cliente.nombre.toLowerCase().includes(terminoLower) ||
        cliente.email.toLowerCase().includes(terminoLower) ||
        cliente.telefono.includes(terminoLower)
    );
}

// Función para filtrar pedidos por estado
function filtrarPedidosPorEstado(estado) {
    const pedidos = cargarPedidos();
    
    if (estado === 'todos') {
        return pedidos;
    }
    
    return pedidos.filter(pedido => pedido.estado.toLowerCase() === estado.toLowerCase());
}

// Función para filtrar productos por categoría
function filtrarProductosPorCategoria(categoria) {
    const productos = cargarProductos();
    
    if (categoria === 'todos') {
        return productos;
    }
    
    return productos.filter(producto => producto.categoria.toLowerCase() === categoria.toLowerCase());
}

// Función para obtener estadísticas rápidas
function obtenerEstadisticas() {
    const pedidos = cargarPedidos();
    const productos = cargarProductos();
    const clientes = cargarClientes();
    
    // Calcular ventas totales
    const ventasTotales = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    
    // Calcular pedidos pendientes
    const pedidosPendientes = pedidos.filter(pedido => 
        pedido.estado.toLowerCase() === 'pendiente' || 
        pedido.estado.toLowerCase() === 'procesando' ||
        pedido.estado.toLowerCase() === 'preparando'
    ).length;
    
    // Calcular productos con stock bajo
    const stockBajo = productos.filter(producto => producto.stock < 10).length;
    
    // Calcular productos agotados
    const stockAgotado = productos.filter(producto => producto.stock <= 0).length;
    
    // Calcular total de clientes
    const totalClientes = clientes.length;
    
    // Calcular pedidos del mes actual
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const pedidosMes = pedidos.filter(pedido => new Date(pedido.fecha) >= inicioMes).length;
    
    return {
        ventasTotales,
        pedidosPendientes,
        stockBajo,
        stockAgotado,
        totalClientes,
        pedidosMes
    };
}

// Función para obtener productos más vendidos
function obtenerProductosMasVendidos(limite = 5) {
    const pedidos = cargarPedidos();
    const productos = cargarProductos();
    
    // Mapa para contar ventas por producto
    const ventasPorProducto = new Map();
    
    // Contar ventas para cada producto
    pedidos.forEach(pedido => {
        pedido.productos.forEach(item => {
            const productoId = item.productoId;
            const cantidadVendida = item.cantidad || 1;
            
            if (ventasPorProducto.has(productoId)) {
                ventasPorProducto.set(productoId, ventasPorProducto.get(productoId) + cantidadVendida);
            } else {
                ventasPorProducto.set(productoId, cantidadVendida);
            }
        });
    });
    
    // Crear array con la información de productos y sus ventas
    const productosMasVendidos = [];
    
    ventasPorProducto.forEach((cantidadVendida, productoId) => {
        const producto = productos.find(p => p.id === productoId);
        if (producto) {
            productosMasVendidos.push({
                ...producto,
                cantidadVendida
            });
        }
    });
    
    // Ordenar por cantidad vendida (mayor a menor)
    productosMasVendidos.sort((a, b) => b.cantidadVendida - a.cantidadVendida);
    
    // Devolver solo la cantidad solicitada
    return productosMasVendidos.slice(0, limite);
}

// Función para obtener clientes más activos
function obtenerClientesMasActivos(limite = 5) {
    const pedidos = cargarPedidos();
    const clientes = cargarClientes();
    
    // Mapa para contar pedidos por cliente
    const pedidosPorCliente = new Map();
    const gastoPorCliente = new Map();
    
    // Contar pedidos y gasto para cada cliente
    pedidos.forEach(pedido => {
        const clienteId = pedido.clienteId;
        
        // Contar pedidos
        if (pedidosPorCliente.has(clienteId)) {
            pedidosPorCliente.set(clienteId, pedidosPorCliente.get(clienteId) + 1);
        } else {
            pedidosPorCliente.set(clienteId, 1);
        }
        
        // Sumar gasto
        if (gastoPorCliente.has(clienteId)) {
            gastoPorCliente.set(clienteId, gastoPorCliente.get(clienteId) + pedido.total);
        } else {
            gastoPorCliente.set(clienteId, pedido.total);
        }
    });
    
    // Crear array con la información de clientes y sus pedidos
    const clientesActivos = [];
    
    pedidosPorCliente.forEach((cantidadPedidos, clienteId) => {
        const cliente = clientes.find(c => c.id === clienteId);
        if (cliente) {
            clientesActivos.push({
                ...cliente,
                cantidadPedidos,
                gastoTotal: gastoPorCliente.get(clienteId) || 0
            });
        }
    });
    
    // Ordenar por cantidad de pedidos (mayor a menor)
    clientesActivos.sort((a, b) => b.cantidadPedidos - a.cantidadPedidos);
    
    // Devolver solo la cantidad solicitada
    return clientesActivos.slice(0, limite);
}

// Función para obtener ventas por categoría
function obtenerVentasPorCategoria() {
    const pedidos = cargarPedidos();
    const productos = cargarProductos();
    
    // Mapa para sumar ventas por categoría
    const ventasPorCategoria = new Map();
    let totalVentas = 0;
    
    // Calcular ventas para cada categoría
    pedidos.forEach(pedido => {
        pedido.productos.forEach(item => {
            const producto = productos.find(p => p.id === item.productoId);
            if (producto) {
                const categoria = producto.categoria;
                const ventaItem = item.precio * (item.cantidad || 1);
                totalVentas += ventaItem;
                
                if (ventasPorCategoria.has(categoria)) {
                    ventasPorCategoria.set(categoria, ventasPorCategoria.get(categoria) + ventaItem);
                } else {
                    ventasPorCategoria.set(categoria, ventaItem);
                }
            }
        });
    });
    
    // Convertir a array y calcular porcentajes
    const resultado = [];
    
    ventasPorCategoria.forEach((ventas, categoria) => {
        const porcentaje = totalVentas > 0 ? Math.round((ventas / totalVentas) * 100) : 0;
        resultado.push({
            categoria: capitalizarPrimeraLetra(categoria),
            ventas,
            porcentaje
        });
    });
    
    // Ordenar por ventas (mayor a menor)
    resultado.sort((a, b) => b.ventas - a.ventas);
    
    return resultado;
}

// Función para obtener ventas mensuales
function obtenerVentasMensuales() {
    const pedidos = cargarPedidos();
    
    // Mapa para sumar ventas por mes
    const ventasPorMes = new Map();
    
    // Nombres de los meses
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    // Inicializar mapa con todos los meses (para asegurar que aparezcan todos)
    nombresMeses.forEach(mes => {
        ventasPorMes.set(mes, 0);
    });
    
    // Calcular ventas para cada mes
    pedidos.forEach(pedido => {
        const fecha = new Date(pedido.fecha);
        const mes = nombresMeses[fecha.getMonth()];
        
        ventasPorMes.set(mes, ventasPorMes.get(mes) + pedido.total);
    });
    
    // Convertir a array
    const resultado = [];
    
    nombresMeses.forEach(mes => {
        resultado.push({
            mes,
            ventas: ventasPorMes.get(mes)
        });
    });
    
    return resultado;
}

// Función para actualizar un pedido
function actualizarPedido(idPedido, nuevosDatos) {
    const pedidos = cargarPedidos();
    const index = pedidos.findIndex(p => p.id === idPedido);
    
    if (index !== -1) {
        pedidos[index] = { ...pedidos[index], ...nuevosDatos };
        guardarPedidos(pedidos);
        return true;
    }
    
    return false;
}

// Función para actualizar un producto
function actualizarProducto(idProducto, nuevosDatos) {
    const productos = cargarProductos();
    const index = productos.findIndex(p => p.id === idProducto);
    
    if (index !== -1) {
        productos[index] = { ...productos[index], ...nuevosDatos };
        guardarProductos(productos);
        return true;
    }
    
    return false;
}

// Función para actualizar un cliente
function actualizarCliente(idCliente, nuevosDatos) {
    const clientes = cargarClientes();
    const index = clientes.findIndex(c => c.id === idCliente);
    
    if (index !== -1) {
        clientes[index] = { ...clientes[index], ...nuevosDatos };
        guardarClientes(clientes);
        return true;
    }
    
    return false;
}

// Función para eliminar un producto
function eliminarProducto(idProducto) {
    const productos = cargarProductos();
    const nuevosProductos = productos.filter(p => p.id !== idProducto);
    
    if (nuevosProductos.length < productos.length) {
        guardarProductos(nuevosProductos);
        return true;
    }
    
    return false;
}

// Función para eliminar un cliente
function eliminarCliente(idCliente) {
    const clientes = cargarClientes();
    const nuevosClientes = clientes.filter(c => c.id !== idCliente);
    
    if (nuevosClientes.length < clientes.length) {
        guardarClientes(nuevosClientes);
        return true;
    }
    
    return false;
}

// Función para agregar un nuevo producto
function agregarProducto(nuevoProducto) {
    const productos = cargarProductos();
    
    // Generar ID único si no tiene uno
    if (!nuevoProducto.id) {
        nuevoProducto.id = generarID();
    }
    
    productos.push(nuevoProducto);
    guardarProductos(productos);
    return nuevoProducto.id;
}

// Función para agregar un nuevo cliente
function agregarCliente(nuevoCliente) {
    const clientes = cargarClientes();
    
    // Generar ID único si no tiene uno
    if (!nuevoCliente.id) {
        nuevoCliente.id = generarID();
    }
    
    clientes.push(nuevoCliente);
    guardarClientes(clientes);
    return nuevoCliente.id;
}

// Función para agregar un nuevo pedido
function agregarPedido(nuevoPedido) {
    const pedidos = cargarPedidos();
    
    // Generar ID único si no tiene uno
    if (!nuevoPedido.id) {
        nuevoPedido.id = generarID();
    }
    
    pedidos.push(nuevoPedido);
    guardarPedidos(pedidos);
    return nuevoPedido.id;
}

// Inicializar el panel de administración
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión de administrador
    if (!verificarSesionAdmin()) return;
    
    // Mostrar nombre del administrador
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const adminNameElement = document.getElementById('adminName');
    if (adminNameElement && usuarioActual) {
        adminNameElement.textContent = usuarioActual.nombre;
    }
    
    // Mostrar fecha actual
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const hoy = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateElement.textContent = hoy.toLocaleDateString('es-ES', opciones);
    }
    
    // Configurar evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }
    
    // Manejar apertura/cierre del menú en dispositivos móviles
    const menuToggle = document.getElementById('adminMenuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.querySelector('.admin-sidebar').classList.toggle('active');
        });
    }
    
    const sidebarClose = document.querySelector('.sidebar-close-mobile');
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            document.querySelector('.admin-sidebar').classList.remove('active');
        });
    }
});
