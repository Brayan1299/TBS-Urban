
// Base de datos de productos expandida
const products = [
    // Tenis Casuales (10 productos)
    {
        id: 1,
        name: "Nike Air Force 1",
        description: "Clásicos tenis casuales con diseño icónico y comodidad superior para uso diario.",
        price: 250000,
        originalPrice: 300000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
        rating: 4.8,
        reviews: 156,
        inStock: true,
        featured: true,
        new: false,
        discount: 17,
        colors: ["Blanco", "Negro", "Rojo"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["nike", "casual", "urbano"]
    },
    {
        id: 2,
        name: "Adidas Stan Smith",
        description: "Tenis minimalistas perfectos para cualquier ocasión casual con estilo atemporal.",
        price: 180000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500&h=500&fit=crop",
        rating: 4.6,
        reviews: 89,
        inStock: true,
        featured: true,
        new: false,
        colors: ["Blanco", "Verde"],
        sizes: ["38", "39", "40", "41", "42", "43"],
        tags: ["adidas", "casual", "clásico"]
    },
    {
        id: 3,
        name: "Converse Chuck Taylor",
        description: "Icónicos tenis de lona con estilo vintage que nunca pasa de moda.",
        price: 150000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500&h=500&fit=crop",
        rating: 4.5,
        reviews: 203,
        inStock: true,
        featured: false,
        new: true,
        colors: ["Negro", "Blanco", "Rojo", "Azul"],
        sizes: ["37", "38", "39", "40", "41", "42", "43"],
        tags: ["converse", "casual", "vintage"]
    },
    {
        id: 7,
        name: "Vans Old Skool",
        description: "Tenis skate clásicos con la icónica raya lateral y suela de goma.",
        price: 190000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
        rating: 4.4,
        reviews: 142,
        inStock: true,
        featured: true,
        new: false,
        colors: ["Negro", "Blanco", "Azul marino"],
        sizes: ["38", "39", "40", "41", "42", "43"],
        tags: ["vans", "casual", "skate"]
    },
    {
        id: 8,
        name: "New Balance 574",
        description: "Tenis retro con excelente amortiguación y diseño clásico de los años 80.",
        price: 220000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
        rating: 4.3,
        reviews: 98,
        inStock: true,
        featured: false,
        new: false,
        colors: ["Gris", "Negro", "Azul"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["newbalance", "casual", "retro"]
    },
    {
        id: 9,
        name: "Reebok Club C 85",
        description: "Tenis de tenis vintage con estilo limpio y minimalista.",
        price: 170000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&h=500&fit=crop",
        rating: 4.2,
        reviews: 76,
        inStock: true,
        featured: false,
        new: true,
        colors: ["Blanco", "Negro"],
        sizes: ["38", "39", "40", "41", "42", "43"],
        tags: ["reebok", "casual", "tennis"]
    },
    {
        id: 10,
        name: "Nike Blazer Mid",
        description: "Tenis de baloncesto retro con corte medio y estilo urbano atemporal.",
        price: 210000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&h=500&fit=crop",
        rating: 4.5,
        reviews: 134,
        inStock: true,
        featured: true,
        new: false,
        colors: ["Blanco", "Negro", "Rojo"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["nike", "casual", "basketball"]
    },
    {
        id: 11,
        name: "Fila Disruptor II",
        description: "Tenis chunky con suela gruesa y diseño llamativo de los años 90.",
        price: 160000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500&h=500&fit=crop",
        rating: 4.1,
        reviews: 87,
        inStock: true,
        featured: false,
        new: false,
        colors: ["Blanco", "Negro"],
        sizes: ["37", "38", "39", "40", "41", "42"],
        tags: ["fila", "casual", "chunky"]
    },
    {
        id: 12,
        name: "Superga 2750",
        description: "Tenis de lona italianos con suela de goma natural y estilo mediterráneo.",
        price: 140000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&h=500&fit=crop",
        rating: 4.0,
        reviews: 45,
        inStock: true,
        featured: false,
        new: true,
        colors: ["Blanco", "Negro", "Azul", "Rojo"],
        sizes: ["37", "38", "39", "40", "41", "42"],
        tags: ["superga", "casual", "italiano"]
    },
    {
        id: 13,
        name: "Lacoste L001",
        description: "Tenis modernos con el icónico cocodrilo y diseño contemporáneo francés.",
        price: 290000,
        category: "casual",
        imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&h=500&fit=crop",
        rating: 4.6,
        reviews: 62,
        inStock: true,
        featured: true,
        new: true,
        isNew: true,
        isFeatured: true,
        colors: ["Blanco", "Negro", "Azul marino"],
        sizes: ["38", "39", "40", "41", "42", "43"],
        tags: ["lacoste", "casual", "elegante"]
    },

    // Tenis Deportivos (10 productos)
    {
        id: 4,
        name: "Nike Air Max 270",
        description: "Tenis deportivos con tecnología Air Max para máxima comodidad durante el ejercicio.",
        price: 320000,
        originalPrice: 400000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        rating: 4.7,
        reviews: 124,
        inStock: true,
        featured: true,
        new: false,
        discount: 20,
        colors: ["Negro", "Blanco", "Azul"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["nike", "deportivo", "running"]
    },
    {
        id: 5,
        name: "Adidas Ultraboost 22",
        description: "Tenis de running con tecnología Boost para máximo retorno de energía.",
        price: 380000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500&h=500&fit=crop",
        rating: 4.9,
        reviews: 87,
        inStock: true,
        featured: true,
        new: true,
        colors: ["Negro", "Blanco", "Gris"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["adidas", "deportivo", "boost"]
    },
    {
        id: 6,
        name: "Puma RS-X",
        description: "Tenis deportivos con diseño futurista y tecnología de amortiguación avanzada.",
        price: 280000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&h=500&fit=crop",
        rating: 4.4,
        reviews: 65,
        inStock: true,
        featured: false,
        new: false,
        colors: ["Blanco", "Negro", "Azul", "Rojo"],
        sizes: ["38", "39", "40", "41", "42", "43"],
        tags: ["puma", "deportivo", "futurista"]
    },
    {
        id: 14,
        name: "Nike React Infinity Run",
        description: "Tenis de running diseñados para reducir lesiones con tecnología React.",
        price: 350000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&h=500&fit=crop",
        rating: 4.6,
        reviews: 156,
        inStock: true,
        featured: true,
        new: true,
        colors: ["Negro", "Blanco", "Azul", "Gris"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["nike", "deportivo", "running", "react"]
    },
    {
        id: 15,
        name: "Asics Gel-Kayano 29",
        description: "Tenis de running con máxima estabilidad y tecnología GEL para absorción de impacto.",
        price: 420000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&h=500&fit=crop",
        rating: 4.8,
        reviews: 234,
        inStock: true,
        featured: true,
        new: false,
        colors: ["Negro", "Azul", "Gris"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["asics", "deportivo", "running", "gel"]
    },
    {
        id: 16,
        name: "Under Armour HOVR Phantom",
        description: "Tenis con tecnología HOVR para retorno de energía y conectividad digital.",
        price: 310000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&h=500&fit=crop",
        rating: 4.5,
        reviews: 98,
        inStock: true,
        featured: false,
        new: true,
        colors: ["Blanco", "Negro", "Gris"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["underarmour", "deportivo", "hovr", "conectividad"]
    },
    {
        id: 17,
        name: "Brooks Ghost 15",
        description: "Tenis de running con amortiguación suave y transición fluida para corredores neutrales.",
        price: 340000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop",
        rating: 4.7,
        reviews: 187,
        inStock: true,
        featured: true,
        new: false,
        colors: ["Azul", "Negro", "Gris"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["brooks", "deportivo", "running", "ghost"]
    },
    {
        id: 18,
        name: "New Balance Fresh Foam X",
        description: "Tenis con espuma Fresh Foam X para máxima comodidad y rendimiento deportivo.",
        price: 290000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop",
        rating: 4.4,
        reviews: 123,
        inStock: true,
        featured: false,
        new: false,
        colors: ["Negro", "Blanco", "Azul"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["newbalance", "deportivo", "freshfoam", "running"]
    },
    {
        id: 19,
        name: "Salomon Speedcross 5",
        description: "Tenis de trail running con tracción agresiva para terrenos difíciles.",
        price: 360000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0c4b4de0d15?w=500&h=500&fit=crop",
        rating: 4.6,
        reviews: 145,
        inStock: true,
        featured: true,
        new: true,
        colors: ["Negro", "Azul", "Verde"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["salomon", "deportivo", "trail", "speedcross"]
    },
    {
        id: 20,
        name: "Mizuno Wave Rider 26",
        description: "Tenis de running con tecnología Wave para estabilidad y amortiguación dinámica.",
        price: 330000,
        category: "deportivos",
        imageUrl: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&h=500&fit=crop",
        rating: 4.5,
        reviews: 167,
        inStock: true,
        featured: false,
        new: false,
        colors: ["Azul", "Negro", "Blanco"],
        sizes: ["38", "39", "40", "41", "42", "43", "44"],
        tags: ["mizuno", "deportivo", "wave", "running"]
    }
];

// Datos de clientes
const customers = [
    {
        id: 1,
        name: "Juan Carlos Pérez",
        email: "juan.perez@email.com",
        phone: "+57 300 123 4567",
        address: "Calle 123 #45-67, Medellín",
        orders: 3,
        totalSpent: 540000,
        registrationDate: "2023-08-15"
    },
    {
        id: 2,
        name: "María García",
        email: "maria.garcia@email.com",
        phone: "+57 301 234 5678",
        address: "Carrera 70 #25-30, Bogotá",
        orders: 2,
        totalSpent: 380000,
        registrationDate: "2023-09-20"
    },
    {
        id: 3,
        name: "Cliente Demo",
        email: "cliente@tbsurban.com",
        phone: "+57 302 345 6789",
        address: "Avenida Principal #100-50, Medellín",
        orders: 5,
        totalSpent: 850000,
        registrationDate: "2023-07-10"
    }
];

// Datos de pedidos expandidos
const orders = [
    {
        id: "TBS-001",
        date: "2024-02-25",
        customerName: "Juan Carlos Pérez",
        customerId: 1,
        status: "completed",
        total: 315000,
        items: [
            { productId: 1, quantity: 1, price: 180000, name: "Nike Air Force 1" },
            { productId: 5, quantity: 1, price: 120000, name: "Puma Suede Classic" }
        ],
        shippingAddress: "Calle 123 #45-67, Medellín",
        paymentMethod: "credit_card",
        trackingNumber: "TBS123456789"
    },
    {
        id: "TBS-002",
        date: "2024-02-26",
        customerName: "María García",
        customerId: 2,
        status: "shipped",
        total: 235000,
        items: [
            { productId: 2, quantity: 1, price: 220000, name: "Adidas Stan Smith" }
        ],
        shippingAddress: "Carrera 70 #25-30, Bogotá",
        paymentMethod: "paypal",
        trackingNumber: "TBS123456790"
    },
    {
        id: "TBS-003",
        date: "2024-02-27",
        customerName: "Cliente Demo",
        customerId: 3,
        status: "processing",
        total: 420000,
        items: [
            { productId: 3, quantity: 1, price: 190000, name: "Converse Chuck Taylor" },
            { productId: 15, quantity: 1, price: 240000, name: "Asics Gel-Kayano 29" }
        ],
        shippingAddress: "Avenida Principal #100-50, Medellín",
        paymentMethod: "credit_card",
        trackingNumber: "TBS123456791"
    },
    {
        id: "TBS-004",
        date: "2024-02-28",
        customerName: "Cliente Demo",
        customerId: 3,
        status: "pending",
        total: 320000,
        items: [
            { productId: 13, quantity: 1, price: 290000, name: "Lacoste L001" }
        ],
        shippingAddress: "Avenida Principal #100-50, Medellín",
        paymentMethod: "credit_card",
        trackingNumber: "TBS123456792"
    },
    {
        id: "TBS-005",
        date: "2024-03-01",
        customerName: "Cliente Demo",
        customerId: 3,
        status: "completed",
        total: 380000,
        items: [
            { productId: 7, quantity: 1, price: 190000, name: "Vans Old Skool" },
            { productId: 8, quantity: 1, price: 220000, name: "New Balance 574" }
        ],
        shippingAddress: "Avenida Principal #100-50, Medellín",
        paymentMethod: "paypal",
        trackingNumber: "TBS123456793"
    }
];

// Categorías para el sistema
const categorias = [
    {
        id: 1,
        nombre: "Casual",
        descripcion: "Tenis para uso diario y ocasiones casuales",
        icono: "fas fa-walking",
        activa: true
    },
    {
        id: 2,
        nombre: "Deportivos",
        descripcion: "Tenis especializados para actividades deportivas",
        icono: "fas fa-running",
        activa: true
    }
];

// Sistema de sincronización de datos
window.dataStore = {
    productos: products,
    usuarios: customers,
    pedidos: orders,
    categorias: categorias
};

window.dataSync = {
    save: function() {
        localStorage.setItem('productos', JSON.stringify(window.dataStore.productos));
        localStorage.setItem('usuarios', JSON.stringify(window.dataStore.usuarios));
        localStorage.setItem('pedidos', JSON.stringify(window.dataStore.pedidos));
        localStorage.setItem('categorias', JSON.stringify(window.dataStore.categorias));
    },
    load: function() {
        const productos = localStorage.getItem('productos');
        const usuarios = localStorage.getItem('usuarios');
        const pedidos = localStorage.getItem('pedidos');
        const categorias = localStorage.getItem('categorias');

        if (productos) window.dataStore.productos = JSON.parse(productos);
        if (usuarios) window.dataStore.usuarios = JSON.parse(usuarios);
        if (pedidos) window.dataStore.pedidos = JSON.parse(pedidos);
        if (categorias) window.dataStore.categorias = JSON.parse(categorias);
    }
};

// Hacer disponibles globalmente
if (typeof window !== 'undefined') {
    // Solo asignar si no existen ya para evitar redeclaraciones
    if (!window.products) window.products = products;
    if (!window.customers) window.customers = customers;
    if (!window.orders) window.orders = orders;
    if (!window.categorias) window.categorias = categorias;
    
    // Cargar datos guardados al inicializar
    if (window.dataSync) {
        window.dataSync.load();
    }
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, customers, orders, categorias };
}
