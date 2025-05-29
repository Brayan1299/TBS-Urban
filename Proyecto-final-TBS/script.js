// ====== VARIABLES GLOBALES ======
let cart = [];
let currentSlide = 0;
let slideInterval;

// ====== INICIALIZACIÓN ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script principal cargado');

    // Inicializar carrito desde localStorage
    loadCart();
    updateCartCount();

    // Inicializar página según la URL
    initPage();

    // Configurar eventos globales
    setupGlobalEvents();

    console.log('App inicializada');
});

function initPage() {
    const currentPage = getCurrentPage();

    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            initSlider();
            break;
        case 'categoria.html':
            initCategoryPage();
            break;
        case 'producto.html':
            initProductPage();
            break;
        case 'crm-login.html':
            initLoginPage();
            break;
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop() || 'index.html';
}

// ====== FUNCIONES DE PRODUCTOS ======
function getAllProducts() {
    return window.products || [];
}

function getProductById(id) {
    const products = getAllProducts();
    return products.find(product => product.id === parseInt(id));
}

function getProductsByCategory(category) {
    const products = getAllProducts();
    return products.filter(product => product.category === category);
}

function getFeaturedProducts() {
    const products = getAllProducts();
    return products.filter(product => product.featured || product.isFeatured);
}

function getNewProducts() {
    const products = getAllProducts();
    return products.filter(product => product.new || product.isNew);
}

// ====== RENDERIZADO DE PRODUCTOS ======
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';

    const imageUrl = product.imageUrl || product.image;
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;

    productCard.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" loading="lazy">
            ${hasDiscount ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
            ${product.new || product.isNew ? '<span class="new-badge">Nuevo</span>' : ''}
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">
                ${generateStars(product.rating)}
                <span class="rating-count">(${product.reviews || 0})</span>
            </div>
            <div class="product-price">
                <span class="current-price">${formatPrice(product.price)}</span>
                ${hasDiscount ? `<span class="original-price">${formatPrice(product.originalPrice)}</span>` : ''}
            </div>
            <div class="product-actions">
                <a href="producto.html?id=${product.id}" class="btn primary-btn">
                    Ver detalles
                </a>
            </div>
        </div>
    `;

    return productCard;
}

function renderProducts(products, container) {
    if (!container) return;

    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="no-products">No se encontraron productos</p>';
        return;
    }

    products.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// ====== UTILIDADES ======
function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(price);
}

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// ====== PÁGINA DE INICIO ======
function initHomePage() {
    // Cargar productos destacados
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (featuredProductsContainer) {
        const casualProducts = getProductsByCategory('casual').slice(0, 4);
        const deportivosProducts = getProductsByCategory('deportivos').slice(0, 4);
        const allFeatured = [...casualProducts, ...deportivosProducts];
        renderProducts(allFeatured, featuredProductsContainer);
    }

    // Cargar nuevos productos
    const newProductsContainer = document.getElementById('newProducts');
    if (newProductsContainer) {
        const casualNew = getProductsByCategory('casual').filter(p => p.new || p.isNew).slice(0, 3);
        const deportivosNew = getProductsByCategory('deportivos').filter(p => p.new || p.isNew).slice(0, 3);
        const allNew = [...casualNew, ...deportivosNew];
        renderProducts(allNew, newProductsContainer);
    }
}

// ====== PÁGINA DE CATEGORÍA ======
function initCategoryPage() {
    const categoryParam = getURLParameter('cat');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryProducts = document.getElementById('categoryProducts');

    if (categoryParam && categoryProducts) {
        let products = [];
        let title = '';

        switch (categoryParam) {
            case 'casual':
                products = getProductsByCategory('casual');
                title = 'Tenis Casuales';
                break;
            case 'deportivos':
                products = getProductsByCategory('deportivos');
                title = 'Tenis Deportivos';
                break;
            default:
                products = getAllProducts();
                title = 'Todos los Productos';
        }

        if (categoryTitle) {
            categoryTitle.textContent = title;
        }

        renderProducts(products, categoryProducts);
    }
}

// ====== PÁGINA DE PRODUCTO ======
function initProductPage() {
    const productId = getURLParameter('id');
    if (productId) {
        loadProductDetails(productId);
    } else {
        window.location.href = 'index.html';
    }
}

function loadProductDetails(productId) {
    const product = getProductById(parseInt(productId));
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Actualizar título de la página
    document.title = `${product.name} | TBS Urban`;

    // Actualizar elementos del producto
    updateElement('productName', product.name);
    updateElement('productDescription', product.description);
    updateElement('productPrice', formatPrice(product.price));
    updateElement('productRating', product.rating);
    updateElement('productCategory', product.category.charAt(0).toUpperCase() + product.category.slice(1));
    updateElement('productAvailability', product.inStock ? 'En stock' : 'Agotado');

    const productImage = document.getElementById('productImage');
    if (productImage) {
        productImage.src = product.imageUrl || product.image;
        productImage.alt = product.name;
    }

    // Configurar opciones del producto
    if (product.colors) renderOptions('colorOptions', product.colors, 'color');
    if (product.sizes) renderOptions('sizeOptions', product.sizes, 'size');

    // Configurar botón de añadir al carrito
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => addToCart(product.id);
    }
}

function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

function renderOptions(containerId, options, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = `${type}-option ${index === 0 ? 'selected' : ''}`;
        button.textContent = option;
        button.onclick = () => selectOption(button, type);
        container.appendChild(button);
    });
}

function selectOption(button, type) {
    const container = button.parentElement;
    const buttons = container.querySelectorAll(`.${type}-option`);
    buttons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

// ====== SLIDER ======
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevArrow = document.querySelector('.slider-arrow.prev');
    const nextArrow = document.querySelector('.slider-arrow.next');

    if (slides.length === 0) return;

    // Configurar eventos de navegación
    if (prevArrow) prevArrow.addEventListener('click', () => changeSlide(-1));
    if (nextArrow) nextArrow.addEventListener('click', () => changeSlide(1));

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });

    // Iniciar slider automático
    startAutoSlider();
}

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + direction + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startAutoSlider() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function stopAutoSlider() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// ====== CARRITO DE COMPRAS ======
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.imageUrl || product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    updateCartDisplay();
    showNotification('Producto añadido al carrito');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');

    if (!cartItems) return;

    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
        return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="item-controls">
                <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100000 ? 0 : 15000;
    const total = subtotal + shipping;

    updateElement('cartSubtotal', formatPrice(subtotal));
    updateElement('cartShipping', shipping === 0 ? 'Gratis' : formatPrice(shipping));
    updateElement('cartTotal', formatPrice(total));
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    if (cartSidebar) cartSidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');

    updateCartDisplay();
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    if (cartSidebar) cartSidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// ====== PÁGINA DE LOGIN ======
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

// ====== EVENTOS GLOBALES ======
function setupGlobalEvents() {
    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.add('active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    }

    // Búsqueda
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('¡Gracias por suscribirte!');
        });
    }

    // Cerrar carrito al hacer clic en overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }

    // Checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        window.location.href = `busqueda.html?q=${encodeURIComponent(searchTerm)}`;
    }
}

function showNotification(message) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #BF953F;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function processCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    // Obtener opciones seleccionadas si estamos en página de producto
    let selectedOptions = {};
    if (window.location.pathname.includes('producto.html')) {
        const selectedColor = document.querySelector('.color-option.selected')?.textContent;
        const selectedSize = document.querySelector('.size-option.selected')?.textContent;
        if (selectedColor) selectedOptions.color = selectedColor;
        if (selectedSize) selectedOptions.talla = selectedSize;
    }

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100000 ? 0 : 15000;
    const total = subtotal + shipping;
    const orderRef = generateOrderReference();

    // Crear factura HTML
    const invoiceHTML = generateInvoiceHTML(orderRef, cart, subtotal, shipping, total, selectedOptions);
    
    // Mostrar factura en modal
    showInvoiceModal(invoiceHTML);

    // Limpiar carrito después de mostrar factura
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
}

function generateOrderReference() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let reference = "TBS-";

    for (let i = 0; i < 2; i++) {
        reference += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    reference += Math.floor(1000 + Math.random() * 9000);

    return reference;
}

function generateInvoiceHTML(orderRef, items, subtotal, shipping, total, selectedOptions = {}) {
    const currentDate = new Date().toLocaleDateString('es-CO');
    const currentTime = new Date().toLocaleTimeString('es-CO');
    
    return `
        <div class="invoice-container" style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div class="invoice-header" style="text-align: center; border-bottom: 2px solid #BF953F; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #BF953F; margin: 0;">TBS URBAN</h1>
                <p style="margin: 5px 0;">Factura de Venta</p>
                <p style="margin: 5px 0;">Referencia: ${orderRef}</p>
                <p style="margin: 5px 0;">Fecha: ${currentDate} - ${currentTime}</p>
            </div>
            
            <div class="customer-info" style="margin-bottom: 20px;">
                <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Información del Cliente</h3>
                <p><strong>Cliente:</strong> Cliente TBS Urban</p>
                <p><strong>Email:</strong> cliente@example.com</p>
                <p><strong>Dirección:</strong> Dirección de entrega</p>
            </div>
            
            <div class="invoice-items" style="margin-bottom: 20px;">
                <h3 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Productos</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f8f9fa;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Producto</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Cantidad</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Precio Unit.</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">
                                    ${item.name}
                                    ${selectedOptions.color ? `<br><small>Color: ${selectedOptions.color}</small>` : ''}
                                    ${selectedOptions.talla ? `<br><small>Talla: ${selectedOptions.talla}</small>` : ''}
                                </td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatPrice(item.price)}</td>
                                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${formatPrice(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="invoice-totals" style="border-top: 2px solid #ddd; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Subtotal:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Envío:</span>
                    <span>${shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; border-top: 1px solid #ddd; padding-top: 10px;">
                    <span>Total:</span>
                    <span style="color: #BF953F;">${formatPrice(total)}</span>
                </div>
            </div>
            
            <div class="invoice-footer" style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="margin: 5px 0; color: #666;">¡Gracias por tu compra!</p>
                <p style="margin: 5px 0; color: #666;">TBS Urban - Tu tienda de tenis favorita</p>
                <p style="margin: 5px 0; color: #666;">www.tbsurban.com | info@tbsurban.com</p>
            </div>
        </div>
    `;
}

function showInvoiceModal(invoiceHTML) {
    const modal = document.createElement('div');
    modal.className = 'invoice-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div class="invoice-modal-content" style="background: white; border-radius: 8px; max-width: 700px; max-height: 90vh; overflow-y: auto; position: relative;">
            <button class="close-invoice" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
            ${invoiceHTML}
            <div style="text-align: center; padding: 20px; border-top: 1px solid #ddd; margin-top: 20px;">
                <button class="print-invoice" style="background: #BF953F; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px; font-size: 16px;">
                    <i class="fas fa-print"></i> Imprimir Factura
                </button>
                <button class="download-invoice" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                    <i class="fas fa-download"></i> Descargar PDF
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Eventos
    modal.querySelector('.close-invoice').addEventListener('click', () => {
        document.body.removeChild(modal);
        showNotification('¡Compra realizada exitosamente!');
    });
    
    modal.querySelector('.print-invoice').addEventListener('click', () => {
        const printContent = modal.querySelector('.invoice-container').innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Factura ${generateOrderReference()}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        @media print { 
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>${printContent}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    });
    
    modal.querySelector('.download-invoice').addEventListener('click', () => {
        showNotification('Funcionalidad de descarga PDF próximamente disponible');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            showNotification('¡Compra realizada exitosamente!');
        }
    });
}

// ====== UTILERÍAS ADICIONALES ======
function closeAnnouncement() {
    const announcementBar = document.getElementById('announcement-bar');
    if (announcementBar) {
        announcementBar.style.display = 'none';
    }
}

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// ====== FUNCIONES GENERALES ======

// Menú móvil
// Función para ocultar el preloader

// Búsqueda

// Inicialización específica para cada página

// Inicializar datos en localStorage si no existen

// Inicializar carrito

// Inicializar formulario de newsletter en todas las páginas

// ====== CARRITO DE COMPRAS ======

// Botón de finalizar compra

// ====== PÁGINA DE INICIO ======

// ====== PÁGINA DE PRODUCTO ======

// ====== PÁGINA DE CATEGORÍA ======

// Función para renderizar productos

// Función para obtener todos los productos

// Función auxiliar para obtener parámetros de URL

// ====== PÁGINA DE BÚSQUEDA ======

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
                    <div class="form-group">
                        <label>Número de seguimiento</label>
                        <input type="text" id="trackingNumber" value="${order.trackingNumber || ''}" placeholder="Ingrese número de seguimiento">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn primary-btn">Guardar cambios</button>
                        ${order.status === 'processing' || order.status === 'pending' ? 
                            `<button type="button" class="btn secondary-btn" onclick="shipOrder('${orderId}')">Enviar Pedido</button>` 
                            : ''}
                    </div>
                </form>
            </div>
        `;

        showModal(modalContent);

        // Manejar formulario
        document.getElementById('editOrderForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const newStatus = document.getElementById('orderStatus').value;
            const trackingNumber = document.getElementById('trackingNumber').value;

            // Actualizar el pedido en localStorage
            updateOrderStatus(orderId, newStatus, trackingNumber);

            alert(`Estado de pedido actualizado a: ${getOrderStatusText(newStatus)}`);

            // Cerrar modal
            closeModal();

            // Recargar dashboard
            loadAdminDashboard();
        });
    };

    // Función para enviar pedido
    window.shipOrder = function(orderId) {
        const trackingNumber = document.getElementById('trackingNumber').value;
        
        if (!trackingNumber) {
            alert('Por favor ingrese un número de seguimiento antes de enviar el pedido');
            return;
        }

        updateOrderStatus(orderId, 'shipped', trackingNumber);
        alert('Pedido enviado exitosamente');
        closeModal();
        loadAdminDashboard();
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

// Renderizar estrellas de calificación

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
        default:
            return 'Desconocido';
    }
}

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

// Función para actualizar estado de pedido
function updateOrderStatus(orderId, newStatus, trackingNumber) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        if (trackingNumber) {
            orders[orderIndex].trackingNumber = trackingNumber;
        }
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

// Exportar funciones necesarias para acceso global desde HTML
window.openCart = openCart;
window.closeCart = closeCart;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.closeAnnouncement = closeAnnouncement;
window.showSection = showSection;
window.closeProductModal = function() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 300);
    }
    console.log('Modal cerrado');
};

// Función auxiliar para mostrar secciones
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

// Función para inicializar el slider
function initSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    let currentSlide = 0;
    let slideInterval;

    // Función para cambiar al slide específico
    function goToSlide(index) {
        // Ocultar el slide activo
        document.querySelector('.slide.active').classList.remove('active');
        document.querySelector('.slider-dot.active').classList.remove('active');
        
        // Mostrar el nuevo slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Actualizar índice actual
        currentSlide = index;
    }
    
    // Función para ir al siguiente slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }
    
    // Función para ir al slide anterior
    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        goToSlide(prevIndex);
    }
    
    // Iniciar el intervalo automático
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Detener el intervalo automático
    function stopSlideInterval() {
        clearInterval(slideInterval);
    }
    
    // Configurar los botones de control
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        stopSlideInterval();
        startSlideInterval();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        stopSlideInterval();
        startSlideInterval();
    });
    
    // Configurar los puntos indicadores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopSlideInterval();
            startSlideInterval();
        });
    });
    
    // Iniciar el slider automáticamente
    startSlideInterval();
}

// Inicializar el slider cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        initSlider();
    }
});