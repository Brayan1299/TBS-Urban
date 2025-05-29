
// Panel de Cliente - TBS Urban
console.log('Cargando datos del sistema...');

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || currentUser.role !== 'cliente') {
        window.location.href = 'crm-login.html';
        return;
    }

    // Inicializar interfaz
    initClientInterface();
    loadClientData();
    setupNavigation();
    setupEventListeners();
});

function initClientInterface() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Actualizar información del usuario en la interfaz
    const clientName = document.getElementById('clientName');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profilePicture = document.getElementById('profilePicture');
    
    if (clientName) clientName.textContent = currentUser.name || 'Cliente';
    if (profileName) profileName.textContent = currentUser.name || 'Cliente';
    
    // Configurar avatar con primera letra del nombre
    const avatarLetter = (currentUser.name || 'C').charAt(0).toUpperCase();
    if (profileAvatar) profileAvatar.textContent = avatarLetter;
    if (profilePicture) profilePicture.textContent = avatarLetter;
    
    // Mostrar fecha actual
    const currentDate = document.getElementById('currentDate');
    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString('es-CO', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function loadClientData() {
    // Cargar estadísticas del cliente
    loadClientStats();
    
    // Cargar pedidos recientes
    loadRecentOrders();
    
    // Cargar todos los pedidos
    loadAllClientOrders();
    
    // Cargar perfil
    loadClientProfile();
    
    // Cargar mensajes
    loadClientMessages();
    
    // Cargar lista de deseos
    loadWishlist();
    
    // Cargar recompensas
    loadRewards();
}

function loadClientStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Filtrar pedidos del cliente actual (asumiendo que es cliente ID 3 para demo)
    const clientOrders = orders.filter(order => order.customerId === 3);
    
    const totalOrders = clientOrders.length;
    const totalSpent = clientOrders.reduce((sum, order) => sum + order.total, 0);
    const favoriteProducts = 5; // Simulado
    const clientPoints = Math.floor(totalSpent / 1000); // 1 punto por cada $1000
    
    // Actualizar elementos DOM
    document.getElementById('totalClientOrders').textContent = totalOrders;
    document.getElementById('totalClientSpent').textContent = formatPrice(totalSpent);
    document.getElementById('favoriteProducts').textContent = favoriteProducts;
    document.getElementById('clientPoints').textContent = clientPoints;
    document.getElementById('currentPoints').textContent = clientPoints;
    document.getElementById('nextReward').textContent = Math.max(0, 100 - (clientPoints % 100));
}

function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const clientOrders = orders.filter(order => order.customerId === 3).slice(-3);
    
    const tableBody = document.getElementById('recentClientOrdersTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (clientOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No tienes pedidos recientes</td></tr>';
        return;
    }
    
    clientOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewClientOrder('${order.id}')">
                    Ver Detalles
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadAllClientOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const clientOrders = orders.filter(order => order.customerId === 3);
    
    const tableBody = document.getElementById('clientOrdersTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (clientOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No tienes pedidos realizados</td></tr>';
        return;
    }
    
    clientOrders.forEach(order => {
        const row = document.createElement('tr');
        const productNames = order.items.map(item => item.name).join(', ');
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${productNames}</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewClientOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${order.trackingNumber ? `<button class="btn btn-sm btn-secondary" onclick="trackOrder('${order.trackingNumber}')">
                    <i class="fas fa-truck"></i>
                </button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadClientProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const clientData = customers.find(c => c.id === 3) || {};
    
    // Llenar formulario de perfil
    document.getElementById('profileNameInput').value = clientData.name || currentUser.name || '';
    document.getElementById('profileEmail').value = clientData.email || currentUser.username || '';
    document.getElementById('profilePhone').value = clientData.phone || '';
    document.getElementById('profileDocument').value = '12345678'; // Simulado
    document.getElementById('profileAddress').value = clientData.address || '';
    
    // Fecha de registro
    document.getElementById('memberSince').textContent = '2023';
}

function loadClientMessages() {
    const messagesContainer = document.getElementById('messagesHistory');
    if (!messagesContainer) return;
    
    // Cargar mensajes del localStorage o usar predeterminados
    let messages = JSON.parse(localStorage.getItem('clientMessages') || '[]');
    
    if (messages.length === 0) {
        messages = [
            {
                id: 1,
                subject: "Bienvenido a TBS Urban",
                content: "¡Gracias por registrarte! Estamos emocionados de tenerte como parte de nuestra comunidad.",
                date: "2024-01-15",
                read: false,
                type: "welcome"
            },
            {
                id: 2,
                subject: "Tu pedido ha sido enviado",
                content: "Tu pedido TBS-005 ha sido enviado y llegará en 2-3 días hábiles.",
                date: "2024-03-01",
                read: false,
                type: "order"
            }
        ];
        localStorage.setItem('clientMessages', JSON.stringify(messages));
    }
    
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message-box ${message.read ? 'read' : 'unread'}`;
        messageElement.innerHTML = `
            <div class="message-header">
                <div class="message-info">
                    <div class="message-subject">
                        ${!message.read ? '<span class="unread-indicator"></span>' : ''}
                        ${message.subject}
                    </div>
                    <div class="message-type ${message.type}">${getMessageTypeText(message.type)}</div>
                </div>
                <div class="message-date">${formatDate(message.date)}</div>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-actions">
                <button class="btn btn-sm btn-primary" onclick="markAsRead(${message.id})">
                    ${message.read ? 'Marcar como no leído' : 'Marcar como leído'}
                </button>
                <button class="btn btn-sm btn-secondary" onclick="deleteMessage(${message.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        messagesContainer.appendChild(messageElement);
    });
}

function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlistProducts');
    if (!wishlistContainer) return;
    
    // Productos favoritos simulados
    const wishlistProducts = getProducts().slice(0, 4);
    
    wishlistContainer.innerHTML = '';
    
    wishlistProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="price">${formatPrice(product.price)}</div>
            <div class="product-actions">
                <button class="btn btn-sm btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
                <button class="btn btn-sm btn-secondary" onclick="removeFromWishlist(${product.id})">
                    <i class="fas fa-heart-broken"></i> Quitar
                </button>
            </div>
        `;
        wishlistContainer.appendChild(productCard);
    });
}

function loadRewards() {
    // Las recompensas ya están definidas en el HTML
    // Aquí podríamos agregar lógica adicional si fuera necesario
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Actualizar navegación activa
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar título de página
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = this.textContent.trim();
            }
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function setupEventListeners() {
    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'crm-login.html';
            }
        });
    }
    
    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const profileData = {
                name: document.getElementById('profileNameInput').value,
                email: document.getElementById('profileEmail').value,
                phone: document.getElementById('profilePhone').value,
                address: document.getElementById('profileAddress').value
            };
            
            // Guardar en localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            currentUser.profile = profileData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Actualizar clientes en localStorage
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            const customerIndex = customers.findIndex(c => c.id === 3);
            if (customerIndex !== -1) {
                customers[customerIndex] = { ...customers[customerIndex], ...profileData };
                localStorage.setItem('customers', JSON.stringify(customers));
            }
            
            showSuccessMessage('Perfil actualizado correctamente');
        });
    }
    
    // Formulario de soporte
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('messageSubject').value;
            const content = document.getElementById('messageContent').value;
            
            if (subject && content) {
                // Crear nuevo mensaje de soporte
                const messages = JSON.parse(localStorage.getItem('clientMessages') || '[]');
                const newMessage = {
                    id: Date.now(),
                    subject: `Soporte: ${subject}`,
                    content: `Tu consulta: ${content}\n\nRespuesta: Hemos recibido tu mensaje y te responderemos dentro de 24 horas.`,
                    date: new Date().toISOString().split('T')[0],
                    read: false,
                    type: 'support'
                };
                
                messages.unshift(newMessage);
                localStorage.setItem('clientMessages', JSON.stringify(messages));
                
                showSuccessMessage('Mensaje enviado correctamente. Te responderemos pronto.');
                this.reset();
                
                // Recargar mensajes si estamos en esa sección
                if (document.getElementById('mensajes').classList.contains('active')) {
                    loadClientMessages();
                }
            }
        });
    }
    
    // Menú móvil
    const menuToggle = document.getElementById('adminMenuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const sidebar = document.querySelector('.admin-sidebar');
            sidebar.classList.toggle('mobile-active');
        });
    }
}

// Funciones globales para acceso desde HTML
window.viewClientOrder = function(orderId) {
    const order = getOrderById(orderId);
    if (!order) return;
    
    const modalContent = `
        <div class="modal-header">
            <h3 class="modal-title">Detalles del Pedido ${order.id}</h3>
            <button class="modal-close" onclick="closeClientModal()">&times;</button>
        </div>
        <div class="modal-body">
            <div class="order-detail">
                <div class="order-info">
                    <p><strong>Número de pedido:</strong> ${order.id}</p>
                    <p><strong>Fecha:</strong> ${order.date}</p>
                    <p><strong>Estado:</strong> <span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></p>
                    ${order.trackingNumber ? `<p><strong>Número de seguimiento:</strong> ${order.trackingNumber}</p>` : ''}
                </div>
                
                <h4>Productos</h4>
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>${formatPrice(item.price)}</td>
                                <td>${formatPrice(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                
                <div class="order-totals">
                    <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                </div>
                
                ${order.trackingNumber ? `
                    <div class="tracking-box">
                        <div class="tracking-number">Número de seguimiento: ${order.trackingNumber}</div>
                        <div class="tracking-status">
                            <i class="fas fa-truck"></i>
                            Tu pedido está en camino
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    showClientModal(modalContent);
};

window.trackOrder = function(trackingNumber) {
    alert(`Rastreando pedido con número: ${trackingNumber}\n\nEsta funcionalidad se conectaría con el sistema de la transportadora.`);
};

window.removeFromWishlist = function(productId) {
    if (confirm('¿Quitar este producto de tu lista de deseos?')) {
        // Aquí se implementaría la lógica real
        alert('Producto removido de la lista de deseos');
        loadWishlist(); // Recargar lista
    }
};

window.claimReward = function(rewardType) {
    const currentPoints = parseInt(document.getElementById('currentPoints').textContent);
    let requiredPoints = 0;
    let rewardName = '';
    
    switch(rewardType) {
        case 'discount5':
            requiredPoints = 100;
            rewardName = 'Descuento 5%';
            break;
        case 'discount10':
            requiredPoints = 200;
            rewardName = 'Descuento 10%';
            break;
        case 'freeShipping':
            requiredPoints = 150;
            rewardName = 'Envío Gratis';
            break;
    }
    
    if (currentPoints >= requiredPoints) {
        if (confirm(`¿Canjear ${rewardName} por ${requiredPoints} puntos?`)) {
            alert(`¡${rewardName} canjeado exitosamente!`);
            // Aquí se actualizarían los puntos
            document.getElementById('currentPoints').textContent = currentPoints - requiredPoints;
        }
    } else {
        alert(`Necesitas ${requiredPoints - currentPoints} puntos más para canjear esta recompensa.`);
    }
};

window.closeClientModal = function() {
    const modal = document.getElementById('clientOrderModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.downloadInvoice = function() {
    alert('Descargando factura... Esta funcionalidad generaría un PDF.');
};

function showClientModal(content) {
    let modal = document.getElementById('clientOrderModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'clientOrderModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div id="clientOrderModalContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('clientOrderModalContent').innerHTML = content;
    modal.style.display = 'flex';
}

// Funciones auxiliares (importadas de script.js)
function getOrderById(id) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.find(order => order.id === id);
}

function getProducts() {
    return JSON.parse(localStorage.getItem('products') || '[]');
}

function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
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

function getMessageTypeText(type) {
    switch (type) {
        case 'welcome': return 'Bienvenida';
        case 'order': return 'Pedido';
        case 'promo': return 'Promoción';
        case 'support': return 'Soporte';
        default: return 'General';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function markAsRead(messageId) {
    const messages = JSON.parse(localStorage.getItem('clientMessages') || '[]');
    const messageIndex = messages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
        messages[messageIndex].read = !messages[messageIndex].read;
        localStorage.setItem('clientMessages', JSON.stringify(messages));
        loadClientMessages();
        showSuccessMessage(messages[messageIndex].read ? 'Mensaje marcado como leído' : 'Mensaje marcado como no leído');
    }
}

function deleteMessage(messageId) {
    if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
        const messages = JSON.parse(localStorage.getItem('clientMessages') || '[]');
        const filteredMessages = messages.filter(m => m.id !== messageId);
        localStorage.setItem('clientMessages', JSON.stringify(filteredMessages));
        loadClientMessages();
        showSuccessMessage('Mensaje eliminado correctamente');
    }
}

function showSuccessMessage(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
