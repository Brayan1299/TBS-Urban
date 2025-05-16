// ====== FUNCIONES GENERALES ======

// Cerrar anuncio superior
function closeAnnouncement() {
    document.getElementById('announcement-bar').style.display = 'none';
}

// Menú móvil
// Función para ocultar el preloader
function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Aumentar la duración del preloader a 4 segundos
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 1.5s';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 1500);
        }, 4000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Ocultar preloader después de cargar la página
    hidePreloader();
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const overlay = document.getElementById('overlay');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            overlay.style.display = 'block';
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            overlay.style.display = 'none';
        });
    }

    // Búsqueda
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `busqueda.html?q=${encodeURIComponent(query)}`;
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Inicialización específica para cada página
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === '' || currentPage === 'index.html') {
        initHomePage();
    } else if (currentPage === 'producto.html') {
        initProductPage();
    } else if (currentPage === 'categoria.html') {
        initCategoryPage();
    } else if (currentPage === 'busqueda.html') {
        initSearchPage();
    } else if (currentPage === 'crm-login.html') {
        initLoginPage();
    } else if (currentPage === 'crm-admin.html') {
        initAdminPage();
    } else if (currentPage === 'crm-cliente.html') {
        initCustomerPage();
    }

    // Inicializar datos en localStorage si no existen
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify(customers));
    }

    // Inicializar carrito
    initCart();

    // Inicializar formulario de newsletter en todas las páginas
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Gracias por suscribirte! Pronto recibirás nuestras novedades.');
            newsletterForm.reset();
        });
    }
});

// ====== CARRITO DE COMPRAS ======
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initCart() {
    updateCartCount();
    renderCartItems();

    // Botón de finalizar compra
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                checkout();
            } else {
                alert('Tu carrito está vacío');
            }
        });
    }
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('overlay').style.display = 'block';
    renderCartItems();
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('overlay').style.display = 'none';
}

function addToCart(productId, quantity = 1, size = null, color = null) {
    const product = getProductById(productId);
    if (!product) return;

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            quantity,
            size,
            color,
            price: product.price
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    openCart(); // Mostrar carrito después de añadir
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');

    if (!cartItemsContainer || !cartEmpty || !cartFooter) return;

    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        cartEmpty.style.display = 'flex';
        cartFooter.style.display = 'none';
        return;
    }

    cartItemsContainer.style.display = 'block';
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';

    cartItemsContainer.innerHTML = '';

    let subtotal = 0;

    cart.forEach((item, index) => {
        const product = getProductById(item.productId);
        if (!product) return;

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-options">
                    ${item.color ? `Color: ${item.color}` : ''}
                    ${item.size ? `Talla: ${item.size}` : ''}
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">${formatPrice(itemTotal)}</div>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Actualizar totales
    const shipping = subtotal > 100000 ? 0 : 15000;
    const total = subtotal + shipping;

    document.getElementById('cartSubtotal').textContent = formatPrice(subtotal);
    document.getElementById('cartShipping').textContent = shipping === 0 ? 'Gratis' : formatPrice(shipping);
    document.getElementById('cartTotal').textContent = formatPrice(total);
}

function updateCartItemQuantity(index, change) {
    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function checkout() {
    // Aquí se gestionaría el proceso de pago
    // Como es una demo, simplemente generaremos un pedido y limpiaremos el carrito

    const orderNumber = generateOrderReference();
    const orderTotal = cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return total + (product.price * item.quantity);
    }, 0);

    const shipping = orderTotal > 100000 ? 0 : 15000;
    const finalTotal = orderTotal + shipping;

    // Generar HTML para la factura
    const invoiceHTML = `
        <div class="invoice">
            <div class="invoice-header">
                <h2>Factura de compra</h2>
                <p>Número de pedido: ${orderNumber}</p>
                <p>Fecha: ${new Date().toLocaleDateString('es-CO')}</p>
            </div>
            <div class="invoice-items">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cart.map(item => {
                            const product = getProductById(item.productId);
                            return `
                                <tr>
                                    <td>${product.name} ${item.color ? `(${item.color})` : ''} ${item.size ? `Talla ${item.size}` : ''}</td>
                                    <td>${item.quantity}</td>
                                    <td>${formatPrice(product.price)}</td>
                                    <td>${formatPrice(product.price * item.quantity)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div class="invoice-totals">
                <div class="invoice-total-line">
                    <span>Subtotal:</span>
                    <span>${formatPrice(orderTotal)}</span>
                </div>
                <div class="invoice-total-line">
                    <span>Envío:</span>
                    <span>${shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div class="invoice-total-line invoice-grand-total">
                    <span>Total:</span>
                    <span>${formatPrice(finalTotal)}</span>
                </div>
            </div>
        </div>
    `;

    // Crear ventana modal para mostrar la factura
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content invoice-modal">
            <div class="modal-header">
                <h2>¡Gracias por tu compra!</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                ${invoiceHTML}
                <button class="btn primary-btn print-btn">Imprimir factura</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Mostrar modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);

    // Eventos modal
    const closeModalBtn = modal.querySelector('.close-modal');
    const printBtn = modal.querySelector('.print-btn');

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });

    printBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Factura de compra - TBS Urban</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .invoice { max-width: 800px; margin: 20px auto; }
                        .invoice-header { text-align: center; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                        .invoice-totals { margin-top: 30px; }
                        .invoice-total-line { display: flex; justify-content: space-between; margin-bottom: 10px; }
                        .invoice-grand-total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #000; padding-top: 10px; }
                    </style>
                </head>
                <body>
                    ${invoiceHTML}
                    <script>window.onload = function() { window.print(); window.close(); }</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    });

    // Limpiar carrito
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
    closeCart();
}

function generateOrderReference() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let reference = "TBS-";

    // Agregar dos letras aleatorias
    for (let i = 0; i < 2; i++) {
        reference += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Agregar 4 números aleatorios
    reference += Math.floor(1000 + Math.random() * 9000);

    return reference;
}

// ====== PÁGINA DE INICIO ======
function initHomePage() {
    // Cargar productos destacados
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (featuredProductsContainer) {
        const featuredProducts = getFeaturedProducts();

        featuredProducts.slice(0, 4).forEach(product => {
            featuredProductsContainer.appendChild(createProductCard(product));
        });
    }

    // Cargar nuevos productos
    const newProductsContainer = document.getElementById('newProducts');
    if (newProductsContainer) {
        const newProducts = getNewProducts();

        newProducts.slice(0, 4).forEach(product => {
            newProductsContainer.appendChild(createProductCard(product));
        });
    }
}

// ====== PÁGINA DE PRODUCTO ======
function initProductPage() {
    // Obtener ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const product = getProductById(productId);

    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Actualizar elementos del DOM con la información del producto
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productRating').textContent = `${product.rating} (${Math.floor(product.rating * 10)} reseñas)`;
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productImage').src = product.imageUrl;
    document.getElementById('productCategory').textContent = product.category === 'casual' ? 'Casual' : 'Deportivos';
    document.getElementById('productAvailability').textContent = product.inStock ? 'En stock' : 'Agotado';

    // Mostrar colores disponibles
    const colorOptions = document.getElementById('colorOptions');
    if (colorOptions) {
        product.colors.forEach(color => {
            const colorElement = document.createElement('div');
            colorElement.className = 'color-option';
            colorElement.textContent = color;
            colorElement.setAttribute('data-color', color);

            colorElement.addEventListener('click', function() {
                // Deseleccionar todos los colores
                document.querySelectorAll('.color-option').forEach(el => {
                    el.classList.remove('selected');
                });

                // Seleccionar el color actual
                this.classList.add('selected');
            });

            colorOptions.appendChild(colorElement);
        });

        // Seleccionar el primer color por defecto
        if (product.colors.length > 0) {
            colorOptions.querySelector('.color-option').classList.add('selected');
        }
    }

    // Mostrar tallas disponibles
    const sizeOptions = document.getElementById('sizeOptions');
    if (sizeOptions) {
        product.sizes.forEach(size => {
            const sizeElement = document.createElement('div');
            sizeElement.className = 'size-option';
            sizeElement.textContent = size;
            sizeElement.setAttribute('data-size', size);

            sizeElement.addEventListener('click', function() {
                // Deseleccionar todas las tallas
                document.querySelectorAll('.size-option').forEach(el => {
                    el.classList.remove('selected');
                });

                // Seleccionar la talla actual
                this.classList.add('selected');
            });

            sizeOptions.appendChild(sizeElement);
        });

        // Seleccionar la primera talla por defecto
        if (product.sizes.length > 0) {
            sizeOptions.querySelector('.size-option').classList.add('selected');
        }
    }

    // Configurar botón de agregar al carrito
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const selectedColor = document.querySelector('.color-option.selected');
            const selectedSize = document.querySelector('.size-option.selected');
            const quantity = parseInt(document.getElementById('quantity').value) || 1;

            if (!selectedColor || !selectedSize) {
                alert('Por favor selecciona color y talla');
                return;
            }

            addToCart(
                parseInt(productId), 
                quantity, 
                selectedSize.getAttribute('data-size'), 
                selectedColor.getAttribute('data-color')
            );
        });
    }

    // Configurar controles de cantidad
    function increaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = Math.min(10, parseInt(quantityInput.value) + 1);
    }

    function decreaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = Math.max(1, parseInt(quantityInput.value) - 1);
    }

    // Hacer globales las funciones de cantidad para acceder desde onclick en el HTML
    window.increaseQuantity = increaseQuantity;
    window.decreaseQuantity = decreaseQuantity;

    // Cargar productos similares
    const similarProductsContainer = document.getElementById('similarProducts');
    if (similarProductsContainer) {
        const categoryProducts = getProductsByCategory(product.category);
        const similarProducts = categoryProducts
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        similarProducts.forEach(product => {
            similarProductsContainer.appendChild(createProductCard(product));
        });
    }
}

// ====== PÁGINA DE CATEGORÍA ======
function initCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');

    const productsGrid = document.getElementById('categoryProducts');
    const categoryTitle = document.getElementById('categoryTitle');

    if (!productsGrid) return;

    let products = [];

    if (category) {
        products = getProductsByCategory(category);
        if (categoryTitle) {
            categoryTitle.textContent = category === 'casual' ? 'Tenis Casuales' : 'Tenis Deportivos';
        }
    } else {
        products = getProducts();
        if (categoryTitle) {
            categoryTitle.textContent = 'Todos los Productos';
        }
    }

    productsGrid.innerHTML = '';

    products.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
}

// ====== PÁGINA DE BÚSQUEDA ======
function initSearchPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    const resultsGrid = document.getElementById('searchResults');
    const searchQuery = document.getElementById('searchQuery');
    const resultsCount = document.getElementById('resultsCount');

    if (!resultsGrid || !query) return;

    if (searchQuery) {
        searchQuery.textContent = query;
    }

    const results = searchProducts(query);

    if (resultsCount) {
        resultsCount.textContent = results.length;
    }

    resultsGrid.innerHTML = '';

    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No encontramos resultados para "<strong>${query}</strong>"</p>
                <p>Intenta con otro término o navega por nuestras categorías</p>
            </div>
        `;
        return;
    }

    results.forEach(product => {
        resultsGrid.appendChild(createProductCard(product));
    });
}

// ====== PÁGINA DE LOGIN / REGISTRO ======
function initLoginPage() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (!loginTab || !registerTab || !loginForm || !registerForm) return;

    // Cambiar entre formularios con las pestañas
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Cambiar entre formularios con los enlaces
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            registerTab.click();
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            loginTab.click();
        });
    }

    // Procesar formulario de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!username || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Accesos administrativos fijos
        if (username === 'admin' && password === 'admin') {
            // Guardar info de sesión
            localStorage.setItem('currentUser', JSON.stringify({
                username: 'admin',
                role: 'admin',
                name: 'Administrador'
            }));
            window.location.href = 'crm-admin.html';
            return;
        } 

        if (username === 'cliente' && password === 'cliente') {
            // Guardar info de sesión
            localStorage.setItem('currentUser', JSON.stringify({
                username: 'cliente',
                role: 'cliente',
                name: 'Cliente Demo'
            }));
            window.location.href = 'crm-cliente.html';
            return;
        }

        // Verificar usuarios registrados en localStorage
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = users.find(u => u.email === username && u.password === password);

        if (user) {
            // Guardar info de sesión
            localStorage.setItem('currentUser', JSON.stringify({
                username: user.email,
                role: 'cliente',
                name: user.fullName,
                isNewUser: true // Marcar como usuario nuevo
            }));
            window.location.href = 'crm-cliente.html';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });

    // Procesar formulario de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value.trim();
        const confirmPassword = document.getElementById('regPasswordConfirm').value.trim();

        if (!fullName || !email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Obtener usuarios registrados
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

        // Verificar si el usuario ya existe
        if (users.some(user => user.email === email)) {
            alert('Este correo electrónico ya está registrado');
            return;
        }

        // Agregar nuevo usuario
        users.push({
            fullName,
            email,
            password,
            createdAt: new Date().toISOString()
        });

        // Guardar en localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        alert('¡Registro exitoso! Por favor inicia sesión con tus credenciales');
        loginTab.click();
        document.getElementById('loginEmail').value = email;
    });
}

// ====== PÁGINA DE ADMIN ======
function initAdminPage() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'crm-login.html';
        return;
    }

    // Activar todas las pestañas del panel
    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase activa de todos los links
            tabLinks.forEach(l => l.classList.remove('active'));

            // Agregar clase activa al link actual
            this.classList.add('active');

            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            const tabContents = document.querySelectorAll('.tab-content');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Activar búsqueda de clientes
    const customerSearch = document.getElementById('customerSearch');
    if (customerSearch) {
        customerSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#customers table tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }

    // Activar funcionalidad de los botones de acción
    document.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;

        const action = actionBtn.classList.contains('view') ? 'ver' :
                      actionBtn.classList.contains('edit') ? 'editar' :
                      actionBtn.classList.contains('delete') ? 'eliminar' : '';

        if (action) {
            const row = actionBtn.closest('tr');
            const id = row.cells[0].textContent;
            handleAction(action, id);
        }
    });

    // Botón de cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'crm-login.html';
        });
    }

    // Cargar datos del dashboard
    loadAdminDashboard();

    // Manejar navegación entre secciones
    const menuItems = document.querySelectorAll('.admin-menu a');
    const sections = document.querySelectorAll('.admin-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetSection = this.getAttribute('data-section');

            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Mostrar la sección seleccionada
            document.getElementById(targetSection).classList.add('active');

            // Actualizar menú activo
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });

            this.classList.add('active');
        });
    });
}

function loadAdminDashboard() {
    // Verificar autenticación
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'crm-login.html';
        return;
    }

    // Cargar datos del dashboard
    const dashboardStats = {
        products: { total: 6, new: 2 },
        orders: { total: 28, increase: 15 },
        customers: { total: 45, new: 8 },
        revenue: { total: 4950000, increase: 12 }
    };

    // Actualizar estadísticas
    updateDashboardStats(dashboardStats);

    // Cargar tablas
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    if (ordersTableBody) {
        ordersTableBody.innerHTML = '';

        const orders = getOrders();

        orders.forEach(order => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.customerName}</td>
                <td><span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></td>
                <td>${formatPrice(order.total)}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;

            ordersTableBody.appendChild(row);
        });
    }

    // Cargar clientes
    const customersTableBody = document.querySelector('#customersTable tbody');
    if (customersTableBody) {
        customersTableBody.innerHTML = '';

        const customers = getCustomers();

        customers.forEach(customer => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.orders.length}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewCustomer(${customer.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editCustomer(${customer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;

            customersTableBody.appendChild(row);
        });
    }

    // Cargar productos
    const productsTableBody = document.querySelector('#productsTable tbody');
    if (productsTableBody) {
        productsTableBody.innerHTML = '';

        const products = getProducts(); // Usamos todos los productos

        products.forEach(product => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <div class="product-cell">
                        <img src="${product.imageUrl}" alt="${product.name}">
                        <span>${product.name}</span>
                    </div>
                </td>
                <td>${product.category === 'casual' ? 'Casual' : 'Deportivo'}</td>
                <td>${formatPrice(product.price)}</td>
                <td><span class="status-badge ${product.inStock ? 'instock' : 'outstock'}">${product.inStock ? 'En stock' : 'Agotado'}</span></td>
                <td>
                    <button class="action-btn view-btn" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;

            productsTableBody.appendChild(row);
        });
    }

    // Variables para almacenar funciones que necesitamos globalizar para el HTML
    window.viewOrder = function(orderId) {
        const order = getOrderById(orderId);
        if (!order) return;

        const modalContent = `
            <div class="modal-header">
                <h2>Detalle de Pedido</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-detail">
                    <div class="order-info">
                        <p><strong>Número depedido:</strong> ${order.id}</p>
                        <p><strong>Fecha:</strong> ${order.date}</p>
                        <p><strong>Cliente:</strong> ${order.customerName}</p>
                        <p><strong>Estado:</strong> <span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></p>
                    </div>

                    <h3>Productos</h3>
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
                            ${order.items.map(item => {
                                const product = getProductById(item.productId);
                                return `
                                    <tr>
                                        <td>${product ? product.name : 'Producto no disponible'}</td>
                                        <td>${item.quantity}</td>
                                        <td>${formatPrice(item.price)}</td>
                                        <td>${formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div class="order-totals">
                        <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                    </div>
                </div>
            </div>
        `;

        showModal(modalContent);
    };

    window.editOrder = function(orderId) {
        const order = getOrderById(orderId);
        if (!order) return;

        const modalContent = `
            <div class="modal-header">
                <h2>Editar Pedido</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editOrderForm">
                    <div class="form-group">
                        <label>Número de pedido</label>
                        <input type="text" value="${order.id}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Cliente</label>
                        <input type="text" value="${order.customerName}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select id="orderStatus">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Procesando</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                            <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completado</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                        </select>
                    </div>
                    <button type="submit" class="btn primary-btn">Guardar cambios</button>
                </form>
            </div>
        `;

        showModal(modalContent);

        // Manejar formulario
        document.getElementById('editOrderForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const newStatus = document.getElementById('orderStatus').value;

            // Aquí actualizaríamos el estado del pedido
            // Como es una demo, solo mostramos mensaje
            alert(`Estado de pedido actualizado a: ${getOrderStatusText(newStatus)}`);

            // Cerrar modal
            closeModal();

            // Recargar dashboard
            loadAdminDashboard();
        });
    };

    window.viewCustomer = function(customerId) {
        const customer = getCustomerById(customerId);
        if (!customer) return;

        const customerOrders = getOrderByCustomerId(customerId);

        const modalContent = `
            <div class="modal-header">
                <h2>Detalle de Cliente</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="customer-detail">
                    <div class="customer-info">
                        <p><strong>ID Cliente:</strong> ${customer.id}</p>
                        <p><strong>Nombre:</strong> ${customer.name}</p>
                        <p><strong>Email:</strong> ${customer.email}</p>
                        <p><strong>Teléfono:</strong> ${customer.phone}</p>
                    </div>

                    <h3>Pedidos Realizados</h3>
                    <table class="detail-table">
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customerOrders.length > 0 ? 
                                customerOrders.map(order => `
                                    <tr>
                                        <td>${order.id}</td>
                                        <td>${order.date}</td>
                                        <td><span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></td>
                                        <td>${formatPrice(order.total)}</td>
                                    </tr>
                                `).join('') : 
                                '<tr><td colspan="4" class="text-center">Este cliente no tiene pedidos</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        showModal(modalContent);
    };

    window.editCustomer = function(customerId) {
        const customer = getCustomerById(customerId);
        if (!customer) return;

        const modalContent = `
            <div class="modal-header">
                <h2>Editar Cliente</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editCustomerForm">
                    <div class="form-group">
                        <label>ID Cliente</label>
                        <input type="text" value="${customer.id}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="customerName" value="${customer.name}">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="customerEmail" value="${customer.email}">
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" id="customerPhone" value="${customer.phone}">
                    </div>
                    <button type="submit" class="btn primary-btn">Guardar cambios</button>
                </form>
            </div>
        `;

        showModal(modalContent);

        // Manejar formulario
        document.getElementById('editCustomerForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Aquí actualizaríamos los datos del cliente
            // Como es una demo, solo mostramos mensaje
            alert('Datos del cliente actualizados correctamente');

            // Cerrar modal
            closeModal();

            // Recargar dashboard
            loadAdminDashboard();
        });
    };

    window.viewProduct = function(productId) {
        const product = getProductById(productId);
        if (!product) return;

        const modalContent = `
            <div class="modal-header">
                <h2>Detalle de Producto</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-detail">
                    <div class="product-detail-image">
                        <img src="${product.imageUrl}" alt="${product.name}">
                    </div>
                    <div class="product-detail-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p><strong>Categoría:</strong> ${product.category === 'casual' ? 'Casual' : 'Deportivo'}</p>
                        <p><strong>Precio:</strong> ${formatPrice(product.price)}</p>
                        <p><strong>Calificación:</strong> ${product.rating}/5</p>
                        <p><strong>Estado:</strong> <span class="status-badge ${product.inStock ? 'instock' : 'outstock'}">${product.inStock ? 'En stock' : 'Agotado'}</span></p>

                        <div class="product-detail-options">
                            <p><strong>Colores disponibles:</strong></p>
                            <div class="admin-colors">
                                ${product.colors.map(color => `<span class="admin-color">${color}</span>`).join('')}
                            </div>

                            <p><strong>Tallas disponibles:</strong></p>
                            <div class="admin-sizes">
                                ${product.sizes.map(size => `<span class="admin-size">${size}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        showModal(modalContent);
    };

    window.editProduct = function(productId) {
        const product = getProductById(productId);
        if (!product) return;

        const modalContent = `
            <div class="modal-header">
                <h2>Editar Producto</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="editProductForm">
                    <div class="form-group">
                        <label>ID Producto</label>
                        <input type="text" value="${product.id}" disabled>
                    </div>
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" id="productName" value="${product.name}">
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="productDescription">${product.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="productCategory">
                            <option value="casual" ${product.category === 'casual' ? 'selected' : ''}>Casual</option>
                            <option value="deportivos" ${product.category === 'deportivos' ? 'selected' : ''}>Deportivo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Precio</label>
                        <input type="number" id="productPrice" value="${product.price}">
                    </div>
                    <div class="form-group">
                        <label>Estado</label>
                        <select id="productStock">
                            <option value="true" ${product.inStock ? 'selected' : ''}>En stock</option>
                            <option value="false" ${!product.inStock ? 'selected' : ''}>Agotado</option>
                        </select>
                    </div>
                    <button type="submit" class="btn primary-btn">Guardar cambios</button>
                </form>
            </div>
        `;

        showModal(modalContent);

        // Manejar formulario
        document.getElementById('editProductForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Aquí actualizaríamos los datos del producto
            // Como es una demo, solo mostramos mensaje
            alert('Datos del producto actualizados correctamente');

            // Cerrar modal
            closeModal();

            // Recargar dashboard
            loadAdminDashboard();
        });
    };
}

// Función para actualizar las estadísticas del dashboard
function updateDashboardStats(stats) {
    document.getElementById('totalProducts').textContent = stats.products.total;
    document.getElementById('newProducts').textContent = stats.products.new;
    document.getElementById('totalOrders').textContent = stats.orders.total;
    document.getElementById('increaseOrders').textContent = stats.orders.increase + '%';
    document.getElementById('totalCustomers').textContent = stats.customers.total;
    document.getElementById('newCustomers').textContent = stats.customers.new;
    document.getElementById('totalRevenue').textContent = formatPrice(stats.revenue.total);
    document.getElementById('increaseRevenue').textContent = stats.revenue.increase + '%';
}

// ====== PÁGINA DE CLIENTE ======
function initCustomerPage() {
    // Cargar pedidos del cliente
    loadCustomerOrders();

    // Manejar navegación entre secciones
    const menuItems = document.querySelectorAll('.customer-menu a');
    const sections = document.querySelectorAll('.customer-section');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            const targetSection = this.getAttribute('data-section');

            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Mostrar la sección seleccionada
            document.getElementById(targetSection).classList.add('active');

            // Actualizar menú activo
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });

            this.classList.add('active');
        });
    });
}

function loadCustomerOrders() {
    const ordersTableBody = document.querySelector('#customerOrdersTable tbody');
    if (!ordersTableBody) return;

    // Para la demo, usamos un ID de cliente fijo (2 - Ana López)
    const customerId = 2;
    const customerOrders = getOrderByCustomerId(customerId);

    ordersTableBody.innerHTML = '';

    if (customerOrders.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No tienes pedidos realizados</td></tr>';
        return;
    }

    customerOrders.forEach(order => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td><span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></td>
            <td>${formatPrice(order.total)}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewCustomerOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;

        ordersTableBody.appendChild(row);
    });

    // Función para ver detalle de pedido
    window.viewCustomerOrder = function(orderId) {
        const order = getOrderById(orderId);
        if (!order) return;

        const modalContent = `
            <div class="modal-header">
                <h2>Detalle de Pedido</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-detail">
                    <div class="order-info">
                        <p><strong>Número de pedido:</strong> ${order.id}</p>
                        <p><strong>Fecha:</strong> ${order.date}</p>
                        <p><strong>Estado:</strong> <span class="status-badge ${order.status}">${getOrderStatusText(order.status)}</span></p>
                    </div>

                    <h3>Productos</h3>
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
                            ${order.items.map(item => {
                                const product = getProductById(item.productId);
                                return `
                                    <tr>
                                        <td>${product ? product.name : 'Producto no disponible'}</td>
                                        <td>${item.quantity}</td>
                                        <td>${formatPrice(item.price)}</td>
                                        <td>${formatPrice(item.price * item.quantity)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div class="order-totals">
                        <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                    </div>
                </div>
            </div>
        `;

        showModal(modalContent);
    };
}

// ====== UTILIDADES ======

// Crear una tarjeta de producto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.imageUrl}" alt="${product.name}">
            ${product.isNew ? '<span class="product-badge">Nuevo</span>' : ''}
            <div class="product-preview">
                <p class="product-preview-text">${product.description}</p>
                <a href="producto.html?id=${product.id}" class="btn secondary-btn">Ver detalle</a>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Agregar
            </button>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
                <span class="product-price">${formatPrice(product.price)}</span>
                <div class="product-rating">
                    ${renderStarRating(product.rating)}
                </div>
            </div>
        </div>
    `;

    return card;
}

// Renderizar estrellas de calificación
function renderStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// Obtener texto de estado de pedido
function getOrderStatusText(status) {
    switch (status) {
        case 'pending':
            return 'Pendiente';
        case 'processing':
            return 'Procesando';
        case 'shipped':
            return 'Enviado';
        case 'completed':
            return 'Completado';
        case 'cancelled':
            return 'Cancelado';

function handleAction(action, id, type = 'elemento') {
    switch(action) {
        case 'ver':
            switch(type) {
                case 'producto':
                    const producto = getProductById(parseInt(id));
                    if (producto) {
                        showModal(`
                            <div class="modal-header">
                                <h2>Detalles del Producto</h2>
                                <button class="close-modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <img src="${producto.imageUrl}" alt="${producto.name}" style="max-width: 200px;">
                                <h3>${producto.name}</h3>
                                <p>${producto.description}</p>
                                <p>Precio: ${formatPrice(producto.price)}</p>
                                <p>Categoría: ${producto.category}</p>
                                <p>Stock: ${producto.inStock ? 'Disponible' : 'Agotado'}</p>
                            </div>
                        `);
                    }
                    break;
                case 'pedido':
                    showModal(`
                        <div class="modal-header">
                            <h2>Detalles del Pedido #${id}</h2>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p>Estado: En proceso</p>
                            <p>Fecha: ${new Date().toLocaleDateString()}</p>
                            <p>Cliente: Cliente #${id}</p>
                            <p>Total: ${formatPrice(Math.random() * 1000000)}</p>
                        </div>
                    `);
                    break;
                default:
                    alert(`Visualizando ${type} #${id}`);
            }
            break;
        case 'editar':
            switch(type) {
                case 'producto':
                    showModal(`
                        <div class="modal-header">
                            <h2>Editar Producto</h2>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="editForm" onsubmit="event.preventDefault(); saveChanges(${id});">
                                <div class="form-group">
                                    <label>Nombre</label>
                                    <input type="text" id="editName" required>
                                </div>
                                <div class="form-group">
                                    <label>Precio</label>
                                    <input type="number" id="editPrice" required>
                                </div>
                                <div class="form-group">
                                    <label>Stock</label>
                                    <select id="editStock">
                                        <option value="true">Disponible</option>
                                        <option value="false">Agotado</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn primary-btn">Guardar Cambios</button>
                            </form>
                        </div>
                    `);
                    break;
                default:
                    alert(`Editando ${type} #${id}`);
            }
            break;
        case 'eliminar':
            if (confirm(`¿Estás seguro de eliminar este ${type}?`)) {
                // Aquí implementaríamos la eliminación real
                alert(`${type} #${id} eliminado correctamente`);
                // Actualizar la vista
                window.location.reload();
            }
            break;
    }
}

function saveChanges(id) {
    alert('Cambios guardados correctamente');
    closeModal();
    window.location.reload();
}

        default:
            return 'Desconocido';
    }
}

// Mostrar modal
function showModal(content) {
    let modal = document.querySelector('.modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `<div class="modal-content">${content}</div>`;

    // Mostrar modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 100);

    // Manejar cierre
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Cerrar al hacer clic en el fondo
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Cerrar modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Exportar funciones necesarias para acceso global desde HTML
window.openCart = openCart;
window.closeCart = closeCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.closeAnnouncement = closeAnnouncement;

// Los productos y pedidos se importan desde data.js

// Variables globales para el carrito

// Usar los datos de customers desde data.js

// Funciones para obtener datos (simulación)
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || products;
}

function getProductById(id) {
    const products = getProducts();
    return products.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    const products = getProducts();
    return products.filter(product => product.category === category);
}

function searchProducts(query) {
    const products = getProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

function getFeaturedProducts() {
    const products = getProducts();
    return products.filter(product => product.rating >= 4.5);
}

function getNewProducts() {
    const products = getProducts();
    return products.filter(product => product.isNew);
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || orders;
}

function getOrderById(id) {
    const orders = getOrders();
    return orders.find(order => order.id === id);
}

function getOrderByCustomerId(customerId) {
    const orders = getOrders();
    return orders.filter(order => order.customerId === customerId);
}

function getCustomers() {
    return JSON.parse(localStorage.getItem('customers')) || customers;
}

function getCustomerById(id) {
    const customers = getCustomers();
    return customers.find(customer => customer.id === parseInt(id));
}

// Formatear precio
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

// Función para cambiar al siguiente slide
    function nextSlide() {
        const slides = document.querySelectorAll('.slide');
        const activeSlide = document.querySelector('.slide.active');
        activeSlide.classList.remove('active');

        const nextSlide = activeSlide.nextElementSibling || slides[0];
        nextSlide.classList.add('active');
    }

    // Cambiar slide cada 5 segundos
    setInterval(nextSlide, 5000);