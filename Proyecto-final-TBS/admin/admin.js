
// Variables globales del panel administrativo
let currentSection = 'dashboard';
let currentUser = null;
let charts = {};

// Variables para evitar múltiples inicializaciones
let adminPanelInitialized = false;

// Inicialización del panel administrativo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando panel de administración...');
    
    if (adminPanelInitialized) {
        console.log('Panel ya inicializado, cancelando...');
        return;
    }
    
    adminPanelInitialized = true;
    
    // Pequeño delay para asegurar que el DOM esté completamente listo
    setTimeout(() => {
        initializeAdminPanel();
    }, 100);
});

function initializeAdminPanel() {
    console.log('Verificando autenticación...');
    
    if (!verificarAutenticacion()) {
        console.log('Autenticación fallida, redirigiendo...');
        return;
    }
    
    console.log('Autenticación exitosa, configurando panel...');
    
    try {
        setupAdminEventListeners();
        loadAdminData();
        updateCurrentDate();
        console.log('Panel de administración configurado correctamente');
    } catch (error) {
        console.error('Error al inicializar panel:', error);
    }
}

// Verificar autenticación de administrador
function verificarAutenticacion() {
    // Verificar ambas claves para compatibilidad
    let user = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    if (!user) {
        user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    
    currentUser = user;

    if (!currentUser || (currentUser.rol !== 'admin' && currentUser.role !== 'admin')) {
        // Limpiar cualquier sesión corrupta
        localStorage.removeItem('usuarioActual');
        localStorage.removeItem('currentUser');
        sessionStorage.setItem('preventAutoRedirect', 'true');
        window.location.href = '../crm-login.html';
        return false;
    }

    // Actualizar información del usuario
    const adminNameElement = document.getElementById('adminName');
    const profileAvatar = document.getElementById('profileAvatar');

    const userName = currentUser.nombre || currentUser.name || 'Admin';
    
    if (adminNameElement) adminNameElement.textContent = userName;
    if (profileAvatar) profileAvatar.textContent = userName.charAt(0).toUpperCase();

    return true;
}

// Configurar event listeners
function setupAdminEventListeners() {
    // Navegación del sidebar
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Toggle del sidebar móvil
    const menuToggle = document.getElementById('adminMenuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileSidebar);
    }

    // Botones de logout
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutBtnTop = document.getElementById('logoutBtnTop');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (logoutBtnTop) logoutBtnTop.addEventListener('click', logout);

    // Búsquedas
    setupSearchListeners();

    // Formularios
    setupFormListeners();
}

function setupSearchListeners() {
    // Búsqueda de productos
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', debounce(function() {
            filterProducts(this.value);
        }, 300));
    }

    // Búsqueda de pedidos
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', debounce(function() {
            filterOrders(this.value);
        }, 300));
    }

    // Filtro de estado de pedidos
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', function() {
            filterOrdersByStatus(this.value);
        });
    }

    // Búsqueda de clientes
    const clientSearch = document.getElementById('clientSearch');
    if (clientSearch) {
        clientSearch.addEventListener('input', debounce(function() {
            filterClients(this.value);
        }, 300));
    }
}

function setupFormListeners() {
    // Los formularios se configurarán dinámicamente según sea necesario
}

// Gestión de secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Actualizar navegación
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }

    // Actualizar título
    const titles = {
        'dashboard': 'Dashboard',
        'productos': 'Gestión de Productos',
        'pedidos': 'Gestión de Pedidos',
        'clientes': 'Gestión de Clientes',
        'categorias': 'Gestión de Categorías',
        'reportes': 'Reportes y Análisis',
        'inventario': 'Control de Inventario'
    };

    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionName] || 'Panel Administrativo';
    }
    currentSection = sectionName;

    // Cargar datos específicos de la sección
    loadSectionData(sectionName);
}

// Cargar datos del panel
function loadAdminData() {
    loadDashboardStats();
    loadRecentOrders();
    loadAllSections();
}

function loadDashboardStats() {
    if (!window.dataStore) return;

    const stats = calcularEstadisticas();

    // Actualizar las tarjetas de estadísticas
    const totalSales = document.getElementById('totalSales');
    const totalOrders = document.getElementById('totalOrders');
    const totalProducts = document.getElementById('totalProducts');
    const totalCustomers = document.getElementById('totalCustomers');

    if (totalSales) totalSales.textContent = formatPrice(stats.ventasTotales);
    if (totalOrders) totalOrders.textContent = stats.totalPedidos;
    if (totalProducts) totalProducts.textContent = window.dataStore.productos.length;
    if (totalCustomers) totalCustomers.textContent = window.dataStore.usuarios.filter(u => u.rol === 'cliente').length;
}

function calcularEstadisticas() {
    const pedidos = window.dataStore.pedidos || [];
    const productos = window.dataStore.productos || [];
    const usuarios = window.dataStore.usuarios || [];

    const ventasTotales = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    const totalPedidos = pedidos.length;
    const totalProductos = productos.length;
    const totalClientes = usuarios.filter(u => u.rol === 'cliente').length;

    return {
        ventasTotales,
        totalPedidos,
        totalProductos,
        totalClientes
    };
}

function loadRecentOrders() {
    const ordersTable = document.getElementById('recentOrdersTable');
    if (!ordersTable || !window.dataStore) return;

    const pedidos = window.dataStore.pedidos.slice(-5).reverse(); // Últimos 5 pedidos

    ordersTable.innerHTML = pedidos.map(pedido => {
        const cliente = window.dataStore.usuarios.find(u => u.id === pedido.clienteId);
        return `
            <tr>
                <td>#${pedido.id}</td>
                <td>${cliente ? cliente.nombre : 'Cliente no encontrado'}</td>
                <td>${formatDate(pedido.fecha)}</td>
                <td>${formatPrice(pedido.total)}</td>
                <td><span class="status-badge status-${pedido.estado}">${pedido.estado}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn view" onclick="viewOrder(${pedido.id})" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="editOrder(${pedido.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function loadSectionData(section) {
    switch(section) {
        case 'productos':
            loadProductsTable();
            break;
        case 'pedidos':
            loadOrdersTable();
            break;
        case 'clientes':
            loadClientsTable();
            break;
        case 'categorias':
            loadCategoriesGrid();
            break;
        case 'reportes':
            loadReports();
            break;
        case 'inventario':
            loadInventoryTable();
            break;
    }
}

function loadAllSections() {
    loadProductsTable();
    loadOrdersTable();
    loadClientsTable();
    loadCategoriesGrid();
    loadInventoryTable();
}

// Gestión de productos
function loadProductsTable() {
    const productsTable = document.getElementById('productsTable');
    if (!productsTable || !window.dataStore) return;

    const productos = window.dataStore.productos;

    productsTable.innerHTML = productos.map(producto => `
        <tr>
            <td>
                <img src="${producto.imageUrl}" alt="${producto.name}" class="product-image">
            </td>
            <td>
                <strong>${producto.name}</strong><br>
                <small class="text-muted">${producto.description.substring(0, 50)}...</small>
            </td>
            <td>${capitalizeFirst(producto.category)}</td>
            <td>${formatPrice(producto.price)}</td>
            <td>
                <span class="${producto.inStock ? 'text-success' : 'text-warning'}">
                    ${producto.inStock ? 'En Stock' : 'Agotado'}
                </span>
            </td>
            <td>
                <span class="status-badge status-activo">
                    Activo
                </span>
            </td>
            <td>
                <div class="row-actions">
                    <button class="action-btn view" onclick="viewProduct(${producto.id})" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editProduct(${producto.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct(${producto.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function filterProducts(searchTerm) {
    if (!window.dataStore) return;

    const productos = window.dataStore.productos.filter(producto =>
        producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productsTable = document.getElementById('productsTable');
    if (productsTable) {
        productsTable.innerHTML = productos.map(producto => `
            <tr>
                <td><img src="${producto.imageUrl}" alt="${producto.name}" class="product-image"></td>
                <td><strong>${producto.name}</strong><br><small>${producto.description.substring(0, 50)}...</small></td>
                <td>${capitalizeFirst(producto.category)}</td>
                <td>${formatPrice(producto.price)}</td>
                <td><span class="${producto.inStock ? 'text-success' : 'text-warning'}">${producto.inStock ? 'En Stock' : 'Agotado'}</span></td>
                <td><span class="status-badge status-activo">Activo</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn view" onclick="viewProduct(${producto.id})"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="editProduct(${producto.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="deleteProduct(${producto.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

// Funciones de acción para productos
function viewProduct(id) {
    const producto = window.dataStore.productos.find(p => p.id === id);
    if (!producto) {
        showAdminNotification('Producto no encontrado', 'error');
        return;
    }

    const productDetails = `
        <div class="product-details">
            <h3>Producto #${producto.id}</h3>
            <img src="${producto.imageUrl}" alt="${producto.name}" style="max-width: 200px; margin-bottom: 15px;">
            <p><strong>Nombre:</strong> ${producto.name}</p>
            <p><strong>Descripción:</strong> ${producto.description}</p>
            <p><strong>Categoría:</strong> ${capitalizeFirst(producto.category)}</p>
            <p><strong>Precio:</strong> ${formatPrice(producto.price)}</p>
            <p><strong>Stock:</strong> ${producto.inStock ? 'Disponible' : 'Agotado'}</p>
        </div>
    `;

    showAdminModal('Detalles del Producto', productDetails);
}

function editProduct(id) {
    const producto = window.dataStore.productos.find(p => p.id === id);
    if (!producto) {
        showAdminNotification('Producto no encontrado', 'error');
        return;
    }

    const editForm = `
        <form id="editProductForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="productName">Nombre del Producto</label>
                    <input type="text" id="productName" class="form-input" value="${producto.name}" required>
                </div>
                <div class="form-group">
                    <label for="productCategory">Categoría</label>
                    <select id="productCategory" class="form-input" required>
                        <option value="casual" ${producto.category === 'casual' ? 'selected' : ''}>Casual</option>
                        <option value="deportivos" ${producto.category === 'deportivos' ? 'selected' : ''}>Deportivos</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="productPrice">Precio</label>
                    <input type="number" id="productPrice" class="form-input" value="${producto.price}" required>
                </div>
                <div class="form-group">
                    <label for="productStock">Stock</label>
                    <select id="productStock" class="form-input" required>
                        <option value="true" ${producto.inStock ? 'selected' : ''}>En Stock</option>
                        <option value="false" ${!producto.inStock ? 'selected' : ''}>Agotado</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="productDescription">Descripción</label>
                <textarea id="productDescription" class="form-input" rows="3">${producto.description}</textarea>
            </div>
            <div class="form-group">
                <label for="productImage">URL de Imagen</label>
                <input type="url" id="productImage" class="form-input" value="${producto.imageUrl}">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Actualizar Producto</button>
            </div>
        </form>
    `;

    showAdminModal('Editar Producto', editForm);

    const form = document.getElementById('editProductForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Actualizar datos del producto
            producto.name = document.getElementById('productName').value;
            producto.category = document.getElementById('productCategory').value;
            producto.price = parseInt(document.getElementById('productPrice').value);
            producto.inStock = document.getElementById('productStock').value === 'true';
            producto.description = document.getElementById('productDescription').value;
            producto.imageUrl = document.getElementById('productImage').value;

            // Guardar cambios
            window.dataSync.save();

            // Recargar tabla
            loadProductsTable();

            closeAdminModal();
            showAdminNotification('Producto actualizado exitosamente', 'success');
        });
    }
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        const index = window.dataStore.productos.findIndex(p => p.id === id);
        if (index !== -1) {
            window.dataStore.productos.splice(index, 1);
            window.dataSync.save();
            loadProductsTable();
            showAdminNotification('Producto eliminado exitosamente', 'success');
        }
    }
}

// Gestión de pedidos
function loadOrdersTable() {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable || !window.dataStore) return;

    const pedidos = window.dataStore.pedidos;

    ordersTable.innerHTML = pedidos.map(pedido => {
        const cliente = window.dataStore.usuarios.find(u => u.id === pedido.customerId);
        const cantidadProductos = pedido.items ? pedido.items.reduce((total, item) => total + item.quantity, 0) : 0;

        return `
            <tr>
                <td>#${pedido.id}</td>
                <td>${cliente ? cliente.name : pedido.customerName || 'Cliente no encontrado'}</td>
                <td>${formatDate(pedido.date)}</td>
                <td>${cantidadProductos} producto${cantidadProductos !== 1 ? 's' : ''}</td>
                <td>${formatPrice(pedido.total)}</td>
                <td><span class="status-badge status-${pedido.status}">${getOrderStatusText(pedido.status)}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn view" onclick="viewOrder('${pedido.id}')" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="editOrder('${pedido.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewOrder(id) {
    const pedido = window.dataStore.pedidos.find(p => p.id === id);
    if (!pedido) {
        showAdminNotification('Pedido no encontrado', 'error');
        return;
    }

    const cliente = window.dataStore.usuarios.find(u => u.id === pedido.customerId);

    const orderDetails = `
        <div class="order-details">
            <h3>Pedido #${pedido.id}</h3>
            <p><strong>Cliente:</strong> ${cliente ? cliente.name : pedido.customerName}</p>
            <p><strong>Email:</strong> ${cliente ? cliente.email : 'No disponible'}</p>
            <p><strong>Fecha:</strong> ${formatDate(pedido.date)}</p>
            <p><strong>Estado:</strong> <span class="status-badge status-${pedido.status}">${getOrderStatusText(pedido.status)}</span></p>
            <p><strong>Total:</strong> ${formatPrice(pedido.total)}</p>
            <h4>Productos:</h4>
            <ul>
                ${pedido.items ? pedido.items.map(item => 
                    `<li>${item.name} - Cantidad: ${item.quantity} - ${formatPrice(item.price)}</li>`
                ).join('') : '<li>No hay información de productos</li>'}
            </ul>
            <p><strong>Dirección de envío:</strong> ${pedido.shippingAddress || 'No especificada'}</p>
        </div>
    `;

    showAdminModal('Detalles del Pedido', orderDetails);
}

function editOrder(id) {
    const pedido = window.dataStore.pedidos.find(p => p.id === id);
    if (!pedido) {
        showAdminNotification('Pedido no encontrado', 'error');
        return;
    }

    const estados = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
    const estadoOptions = estados.map(estado => 
        `<option value="${estado}" ${pedido.status === estado ? 'selected' : ''}>${getOrderStatusText(estado)}</option>`
    ).join('');

    const editForm = `
        <form id="editOrderForm">
            <div class="form-group">
                <label for="orderStatus">Estado del Pedido</label>
                <select id="orderStatus" class="form-input">
                    ${estadoOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="trackingNumber">Número de Seguimiento</label>
                <input type="text" id="trackingNumber" class="form-input" value="${pedido.trackingNumber || ''}" placeholder="Opcional">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Actualizar Pedido</button>
            </div>
        </form>
    `;

    showAdminModal('Editar Pedido #' + id, editForm);

    const form = document.getElementById('editOrderForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const nuevoEstado = document.getElementById('orderStatus').value;
            const numeroSeguimiento = document.getElementById('trackingNumber').value;

            // Actualizar el estado del pedido
            pedido.status = nuevoEstado;
            if (numeroSeguimiento) {
                pedido.trackingNumber = numeroSeguimiento;
            }

            // Guardar cambios
            window.dataSync.save();

            // Recargar tablas
            loadOrdersTable();
            loadRecentOrders();

            closeAdminModal();
            showAdminNotification('Estado del pedido actualizado exitosamente', 'success');
        });
    }
}

// Gestión de clientes
function loadClientsTable() {
    const clientsTable = document.getElementById('clientsTable');
    if (!clientsTable || !window.dataStore) return;

    const clientes = window.dataStore.usuarios;

    clientsTable.innerHTML = clientes.map(cliente => {
        const pedidosCliente = window.dataStore.pedidos.filter(p => p.customerId === cliente.id);
        const totalGastado = pedidosCliente.reduce((total, pedido) => total + pedido.total, 0);

        return `
            <tr>
                <td>${cliente.name}</td>
                <td>${cliente.email}</td>
                <td>${cliente.phone || 'N/A'}</td>
                <td>${pedidosCliente.length}</td>
                <td>${formatPrice(totalGastado)}</td>
                <td>${cliente.registrationDate ? formatDate(cliente.registrationDate) : 'N/A'}</td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn view" onclick="viewClient(${cliente.id})" title="Ver perfil">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="editClient(${cliente.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function viewClient(id) {
    const cliente = window.dataStore.usuarios.find(u => u.id === id);
    if (!cliente) {
        showAdminNotification('Cliente no encontrado', 'error');
        return;
    }

    const pedidosCliente = window.dataStore.pedidos.filter(p => p.customerId === cliente.id);
    const totalGastado = pedidosCliente.reduce((total, pedido) => total + pedido.total, 0);

    const clientDetails = `
        <div class="client-details">
            <h3>Cliente #${cliente.id}</h3>
            <p><strong>Nombre:</strong> ${cliente.name}</p>
            <p><strong>Email:</strong> ${cliente.email}</p>
            <p><strong>Teléfono:</strong> ${cliente.phone || 'No especificado'}</p>
            <p><strong>Fecha de registro:</strong> ${formatDate(cliente.registrationDate)}</p>
            <hr>
            <h4>Estadísticas de compras</h4>
            <p><strong>Pedidos realizados:</strong> ${pedidosCliente.length}</p>
            <p><strong>Total gastado:</strong> ${formatPrice(totalGastado)}</p>
            <h4>Últimos pedidos</h4>
            <ul>
                ${pedidosCliente.slice(-3).map(pedido => 
                    `<li>Pedido #${pedido.id} - ${formatDate(pedido.date)} - ${formatPrice(pedido.total)} - ${getOrderStatusText(pedido.status)}</li>`
                ).join('') || '<li>No hay pedidos registrados</li>'}
            </ul>
        </div>
    `;

    showAdminModal('Perfil del Cliente', clientDetails);
}

function editClient(id) {
    const cliente = window.dataStore.usuarios.find(u => u.id === id);
    if (!cliente) {
        showAdminNotification('Cliente no encontrado', 'error');
        return;
    }

    const editForm = `
        <form id="editClientForm">
            <div class="form-row">
                <div class="form-group">
                    <label for="clientName">Nombre</label>
                    <input type="text" id="clientName" class="form-input" value="${cliente.name}" required>
                </div>
                <div class="form-group">
                    <label for="clientEmail">Email</label>
                    <input type="email" id="clientEmail" class="form-input" value="${cliente.email}" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="clientPhone">Teléfono</label>
                    <input type="tel" id="clientPhone" class="form-input" value="${cliente.phone || ''}">
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Actualizar Cliente</button>
            </div>
        </form>
    `;

    showAdminModal('Editar Cliente', editForm);

    document.getElementById('editClientForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Actualizar datos del cliente
        cliente.name = document.getElementById('clientName').value;
        cliente.email = document.getElementById('clientEmail').value;
        cliente.phone = document.getElementById('clientPhone').value;

        window.dataSync.save();
        loadClientsTable();
        closeAdminModal();
        showAdminNotification('Cliente actualizado exitosamente', 'success');
    });
}

// Gestión de categorías
function loadCategoriesGrid() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid || !window.dataStore) return;

    const categorias = window.dataStore.categorias;

    categoriesGrid.innerHTML = categorias.map(categoria => {
        const productosCategoria = window.dataStore.productos.filter(p => p.category === categoria.nombre.toLowerCase());
        const ventasCategoria = window.dataStore.pedidos.reduce((total, pedido) => {
            return total + (pedido.items ? pedido.items.reduce((subtotal, item) => {
                const producto = window.dataStore.productos.find(p => p.id === item.productId);
                return subtotal + (producto && producto.category === categoria.nombre.toLowerCase() ? item.price * item.quantity : 0);
            }, 0) : 0);
        }, 0);

        return `
            <div class="category-card">
                <div class="category-header">
                    <div class="category-icon">
                        <i class="${categoria.icono}"></i>
                    </div>
                    <div class="category-info">
                        <h4>${categoria.nombre}</h4>
                        <p>${categoria.descripcion}</p>
                    </div>
                </div>
                <div class="category-stats">
                    <div class="category-stat">
                        <div class="category-stat-value">${productosCategoria.length}</div>
                        <div class="category-stat-label">Productos</div>
                    </div>
                    <div class="category-stat">
                        <div class="category-stat-value">${formatPrice(ventasCategoria)}</div>
                        <div class="category-stat-label">Ventas</div>
                    </div>
                </div>
                <div class="row-actions">
                    <button class="action-btn edit" onclick="editCategory(${categoria.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCategory(${categoria.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function editCategory(id) {
    const categoria = window.dataStore.categorias.find(c => c.id === id);
    if (!categoria) {
        showAdminNotification('Categoría no encontrada', 'error');
        return;
    }

    const editForm = `
        <form id="editCategoryForm">
            <div class="form-group">
                <label for="categoryName">Nombre</label>
                <input type="text" id="categoryName" class="form-input" value="${categoria.nombre}" required>
            </div>
            <div class="form-group">
                <label for="categoryDescription">Descripción</label>
                <textarea id="categoryDescription" class="form-input" rows="3" required>${categoria.descripcion}</textarea>
            </div>
            <div class="form-group">
                <label for="categoryIcon">Icono (clase Font Awesome)</label>
                <input type="text" id="categoryIcon" class="form-input" value="${categoria.icono}" placeholder="fas fa-walking">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAdminModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Actualizar Categoría</button>
            </div>
        </form>
    `;

    showAdminModal('Editar Categoría', editForm);

    document.getElementById('editCategoryForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // Actualizar datos de la categoría
        categoria.nombre = document.getElementById('categoryName').value;
        categoria.descripcion = document.getElementById('categoryDescription').value;
        categoria.icono = document.getElementById('categoryIcon').value;

        window.dataSync.save();
        loadCategoriesGrid();
        closeAdminModal();
        showAdminNotification('Categoría actualizada exitosamente', 'success');
    });
}

function deleteCategory(id) {
    const categoria = window.dataStore.categorias.find(c => c.id === id);
    if (!categoria) return;

    // Verificar si hay productos en esta categoría
    const productosEnCategoria = window.dataStore.productos.filter(p => p.category === categoria.nombre.toLowerCase());

    if (productosEnCategoria.length > 0) {
        showAdminNotification(`No se puede eliminar la categoría "${categoria.nombre}" porque tiene ${productosEnCategoria.length} productos asociados`, 'error');
        return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
        const index = window.dataStore.categorias.findIndex(c => c.id === id);
        if (index !== -1) {
            window.dataStore.categorias.splice(index, 1);
            window.dataSync.save();
            loadCategoriesGrid();
            showAdminNotification('Categoría eliminada exitosamente', 'success');
        }
    }
}

// Gestión de inventario
function loadInventoryTable() {
    const inventoryTable = document.getElementById('inventoryTable');
    const lowStockCount = document.getElementById('lowStockCount');
    const outOfStockCount = document.getElementById('outOfStockCount');

    if (!inventoryTable || !window.dataStore) return;

    const productos = window.dataStore.productos;
    const stockBajo = productos.filter(p => p.inStock && Math.random() < 0.3); // Simulado
    const sinStock = productos.filter(p => !p.inStock);

    // Actualizar alertas
    if (lowStockCount) lowStockCount.textContent = `${stockBajo.length} productos con stock bajo`;
    if (outOfStockCount) outOfStockCount.textContent = `${sinStock.length} productos agotados`;

    inventoryTable.innerHTML = productos.map(producto => {
        let stockStatus = 'normal';
        let stockClass = 'text-success';
        let stockQuantity = Math.floor(Math.random() * 50) + 1; // Simulado

        if (!producto.inStock) {
            stockStatus = 'agotado';
            stockClass = 'text-danger';
            stockQuantity = 0;
        } else if (stockQuantity < 10) {
            stockStatus = 'bajo';
            stockClass = 'text-warning';
        }

        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center;">
                        <img src="${producto.imageUrl}" alt="${producto.name}" class="product-image" style="margin-right: 10px;">
                        <strong>${producto.name}</strong>
                    </div>
                </td>
                <td><span class="${stockClass}">${stockQuantity}</span></td>
                <td>5</td>
                <td><span class="status-badge status-${stockStatus}">${stockStatus}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn edit" onclick="updateStock(${producto.id})" title="Actualizar stock">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function updateStock(id) {
    const producto = window.dataStore.productos.find(p => p.id === id);
    if (!producto) return;

    const newStock = prompt(`¿El producto "${producto.name}" está en stock?`, producto.inStock ? 'Si' : 'No');

    if (newStock !== null) {
        const isInStock = newStock.toLowerCase() === 'si' || newStock.toLowerCase() === 'yes' || newStock.toLowerCase() === 'true';
        producto.inStock = isInStock;
        window.dataSync.save();
        loadInventoryTable();
        loadProductsTable();
        showAdminNotification('Stock actualizado exitosamente', 'success');
    }
}

// Función de reportes
function loadReports() {
    showAdminNotification('Sección de reportes cargada exitosamente', 'info');
}

// Sistema de modales y notificaciones mejorado
function showAdminModal(title, content) {
    // Crear modal si no existe
    let modal = document.getElementById('adminModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'adminModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3 id="adminModalTitle"></h3>
                    <button class="modal-close" onclick="closeAdminModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" id="adminModalBody">
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    document.getElementById('adminModalTitle').textContent = title;
    document.getElementById('adminModalBody').innerHTML = content;
    modal.classList.add('active');
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Sistema de notificaciones mejorado
function showAdminNotification(message, type = 'info') {
    // Crear contenedor de notificaciones si no existe
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icon = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';

    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Funciones de utilidad
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('mobile-active');
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('usuarioActual');
        window.location.href = '../crm-login.html';
    }
}

function updateCurrentDate() {
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        const now = new Date();
        currentDate.textContent = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getOrderStatusText(status) {
    switch (status) {
        case 'pending': return 'Pendiente';
        case 'processing': return 'Procesando';
        case 'shipped': return 'Enviado';
        case 'completed': return 'Completado';
        case 'cancelled': return 'Cancelado';
        default: return 'Desconocido';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Funciones para filtros y búsquedas adicionales
function filterOrders(searchTerm) {
    if (!window.dataStore) return;

    const pedidos = window.dataStore.pedidos.filter(pedido => {
        const cliente = window.dataStore.usuarios.find(u => u.id === pedido.customerId);
        return pedido.id.toString().includes(searchTerm) ||
               (cliente && cliente.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
               getOrderStatusText(pedido.status).toLowerCase().includes(searchTerm.toLowerCase());
    });

    renderOrdersTable(pedidos);
}

function filterOrdersByStatus(status) {
    if (!window.dataStore) return;

    const pedidos = status === 'todos' 
        ? window.dataStore.pedidos 
        : window.dataStore.pedidos.filter(pedido => pedido.status === status);

    renderOrdersTable(pedidos);
}

function renderOrdersTable(pedidos) {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;

    ordersTable.innerHTML = pedidos.map(pedido => {
        const cliente = window.dataStore.usuarios.find(u => u.id === pedido.customerId);
        const cantidadProductos = pedido.items ? pedido.items.reduce((total, item) => total + item.quantity, 0) : 0;

        return `
            <tr>
                <td>#${pedido.id}</td>
                <td>${cliente ? cliente.name : pedido.customerName || 'Cliente no encontrado'}</td>
                <td>${formatDate(pedido.date)}</td>
                <td>${cantidadProductos} producto${cantidadProductos !== 1 ? 's' : ''}</td>
                <td>${formatPrice(pedido.total)}</td>
                <td><span class="status-badge status-${pedido.status}">${getOrderStatusText(pedido.status)}</span></td>
                <td>
                    <div class="row-actions">
                        <button class="action-btn view" onclick="viewOrder('${pedido.id}')"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit" onclick="editOrder('${pedido.id}')"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function filterClients(searchTerm) {
    if (!window.dataStore) return;

    const clientes = window.dataStore.usuarios.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone && u.phone.includes(searchTerm))
    );

    const clientsTable = document.getElementById('clientsTable');
    if (clientsTable) {
        clientsTable.innerHTML = clientes.map(cliente => {
            const pedidosCliente = window.dataStore.pedidos.filter(p => p.customerId === cliente.id);
            const totalGastado = pedidosCliente.reduce((total, pedido) => total + pedido.total, 0);

            return `
                <tr>
                    <td>${cliente.name}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.phone || 'N/A'}</td>
                    <td>${pedidosCliente.length}</td>
                    <td>${formatPrice(totalGastado)}</td>
                    <td>${cliente.registrationDate ? formatDate(cliente.registrationDate) : 'N/A'}</td>
                    <td>
                        <div class="row-actions">
                            <button class="action-btn view" onclick="viewClient(${cliente.id})"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit" onclick="editClient(${cliente.id})"><i class="fas fa-edit"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// Exponer funciones globales
window.adminPanel = {
    showSection,
    editProduct,
    deleteProduct,
    viewOrder,
    editOrder,
    viewClient,
    editClient,
    updateStock
};
