// Datos de productos
let products = [
    // TENIS CASUALES NIKE (10)
    {
        id: 1,
        name: "Nike Air Force 1 '07",
        description: "Tenis clásicos con estilo urbano y suela de goma antideslizante",
        price: 450000,
        rating: 4.8,
        colors: ["Negro", "Blanco", "Gris"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 2,
        name: "Nike Blazer Mid '77",
        description: "Estilo retro con un toque moderno, ideales para el día a día",
        price: 420000,
        rating: 4.6,
        colors: ["Blanco", "Negro", "Beige"],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 3,
        name: "Nike Cortez",
        description: "Un clásico renovado con detalles premium y gran comodidad",
        price: 380000,
        rating: 4.5,
        colors: ["Blanco/Rojo", "Negro", "Azul/Blanco"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 4,
        name: "Nike Air Max 90",
        description: "Icónicos tenis con amortiguación visible y estilo atemporal",
        price: 520000,
        rating: 4.7,
        colors: ["Negro", "Blanco", "Gris", "Verde"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 5,
        name: "Nike Dunk Low",
        description: "Diseño versátil con toques retro y construcción premium",
        price: 480000,
        rating: 4.9,
        colors: ["Negro/Blanco", "Azul/Blanco", "Verde/Blanco"],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 6,
        name: "Nike Air Huarache",
        description: "Comodidad excepcional con ajuste tipo calcetín y suela ligera",
        price: 490000,
        rating: 4.5,
        colors: ["Blanco", "Negro", "Gris"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 7,
        name: "Nike Air Force 1 Low",
        description: "Versión baja del clásico Air Force 1, perfectos para el día a día",
        price: 430000,
        rating: 4.8,
        colors: ["Blanco", "Negro", "Azul marino"],
        sizes: [38, 39, 40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 8,
        name: "Nike Killshot 2",
        description: "Inspirados en tenis de squash con un toque minimalista y elegante",
        price: 400000,
        rating: 4.6,
        colors: ["Blanco/Azul", "Crema/Marrón"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 9,
        name: "Nike SB Check Solarsoft",
        description: "Comodidad excepcional con tecnología Solarsoft y diseño urbano",
        price: 350000,
        rating: 4.7,
        colors: ["Negro", "Gris", "Azul marino"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 10,
        name: "Nike Tanjun",
        description: "Diseño minimalista y ligero para uso diario, máxima comodidad",
        price: 320000,
        rating: 4.4,
        colors: ["Negro", "Blanco", "Gris"],
        sizes: [38, 39, 40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "casual",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    
    // TENIS DEPORTIVOS NIKE (10)
    {
        id: 11,
        name: "Nike Air Zoom Pegasus 38",
        description: "Amortiguación reactiva para corredores de todos los niveles",
        price: 580000,
        rating: 4.8,
        colors: ["Negro/Blanco", "Azul/Verde", "Rojo/Negro"],
        sizes: [40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 12,
        name: "Nike React Infinity Run",
        description: "Diseñados para reducir lesiones con máxima amortiguación",
        price: 650000,
        rating: 4.7,
        colors: ["Negro", "Blanco", "Azul"],
        sizes: [39, 40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1576672843344-f01907a9d40c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 13,
        name: "Nike ZoomX Vaporfly NEXT%",
        description: "Máximo rendimiento para competidores, ultraligeros con placa de carbono",
        price: 980000,
        rating: 4.9,
        colors: ["Verde/Rosa", "Negro/Blanco"],
        sizes: [40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 14,
        name: "Nike Metcon 7",
        description: "Estabilidad y durabilidad para entrenamiento funcional y CrossFit",
        price: 550000,
        rating: 4.7,
        colors: ["Negro/Rojo", "Gris/Verde", "Azul/Amarillo"],
        sizes: [40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 15,
        name: "Nike Air Zoom SuperRep",
        description: "Diseñados para clases de HIIT con amortiguación estratégica",
        price: 520000,
        rating: 4.6,
        colors: ["Negro", "Azul", "Rojo"],
        sizes: [39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1580902215262-9b941bc6eab3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 16,
        name: "Nike Free Run 5.0",
        description: "Sensación natural de correr con flexibilidad mejorada",
        price: 480000,
        rating: 4.5,
        colors: ["Negro", "Gris", "Azul marino"],
        sizes: [39, 40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 17,
        name: "Nike Renew Run",
        description: "Suaves y estables para corredores principiantes y medios",
        price: 450000,
        rating: 4.4,
        colors: ["Negro/Blanco", "Azul/Negro", "Gris/Rojo"],
        sizes: [38, 39, 40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1562183241-b937e95585b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 18,
        name: "Nike Joyride Run Flyknit",
        description: "Innovadora amortiguación con esferas que se adaptan a tu pisada",
        price: 620000,
        rating: 4.8,
        colors: ["Negro", "Blanco", "Multicolor"],
        sizes: [40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 19,
        name: "Nike Wildhorse 7",
        description: "Trail running con agarre excepcional y protección para terrenos difíciles",
        price: 590000,
        rating: 4.7,
        colors: ["Verde/Marrón", "Negro/Gris", "Azul/Rojo"],
        sizes: [40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 20,
        name: "Nike Air Zoom Tempo NEXT%",
        description: "Entrenamiento de velocidad con respuesta energética y durabilidad",
        price: 750000,
        rating: 4.9,
        colors: ["Negro/Verde", "Azul/Naranja"],
        sizes: [40, 41, 42, 43, 44, 45],
        imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        category: "deportivos",
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 21,
        name: "TBS Urban Classic",
        category: "casual",
        description: "Zapatillas clásicas urbanas",
        price: 189000,
        rating: 4.5,
        colors: ["Negro", "Blanco", "Gris"],
        sizes: [39, 40, 41, 42, 43],
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 22,
        name: "TBS Performance Pro",
        category: "deportivos",
        description: "Zapatillas de alto rendimiento",
        price: 240000,
        rating: 4.8,
        colors: ["Azul", "Negro", "Rojo"],
        sizes: [40, 41, 42, 43, 44],
        imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570",
        inStock: true,
        isNew: true,
        isFeatured: true
    }
];

// Función para formatear precios
function formatPrice(price) {
    return "$" + price.toLocaleString('es-CO');
}

// Función para filtrar productos por categoría
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Función para obtener productos destacados
function getFeaturedProducts() {
    return products.filter(product => product.isFeatured);
}

// Función para obtener nuevos productos
function getNewProducts() {
    return products.filter(product => product.isNew);
}

// Función para buscar productos
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );
}

// Función para obtener un producto por ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}


// Datos de pedidos
let orders = [
  {
    id: "TBS-2058",
    date: "15/03/2025",
    customerName: "Carlos Rodríguez",
    status: "processing",
    total: 210000,
    items: [
      { productId: 1, quantity: 1, price: 189000 }
    ]
  },
  {
    id: "TBS-2057",
    date: "14/03/2025",
    customerName: "Ana López",
    status: "completed",
    total: 290000,
    items: [
      { productId: 2, quantity: 1, price: 240000 }
    ]
  }
];

// Datos de clientes
let customers = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    email: "carlos@email.com",
    phone: "+57 300 123 4567",
    orders: ["TBS-2058"]
  },
  {
    id: 2,
    name: "Ana López",
    email: "ana@email.com",
    phone: "+57 311 234 5678",
    orders: ["TBS-2057"]
  }
];

//Nuevas funciones para manejar pedidos y clientes

function getOrders(){
    return orders;
}

function getCustomers(){
    return customers;
}

function getOrderById(orderId){
    return orders.find(order => order.id === orderId);
}

function getCustomerById(customerId){
    return customers.find(customer => customer.id === customerId);
}

function getOrderByCustomerId(customerId){
    return orders.filter(order => order.customerName === getCustomerById(customerId).name)
}