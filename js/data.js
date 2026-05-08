const CATEGORIAS = {
  hogar:        { label: "Hogar",        icon: "🏠" },
  tecnologia:   { label: "Tecnología",   icon: "💻" },
  deportes:     { label: "Deportes",     icon: "⚽" },
  alimentacion: { label: "Alimentación", icon: "🥗" },
  jardineria:   { label: "Jardinería",   icon: "🌱" },
  bienestar:    { label: "Bienestar",    icon: "🧘" },
};

const STOCK_MAX = 15;

const inventarioBase = [
  { id:  1, nombre: "Bamboo Desk Organizer",      precio:  38.90, categoria: "hogar",        stock: 10, imagen: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",  descripcion: "Organizador de escritorio en bambú sostenible. Incluye porta lápices, bandeja y compartimentos modulares." },
  { id:  2, nombre: "Teclado Mecánico Táctil",    precio: 149.00, categoria: "tecnologia",   stock:  7, imagen: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",  descripcion: "Teclado mecánico compacto TKL con switches táctiles, retroiluminación RGB y carcasa de aluminio." },
  { id:  3, nombre: "Pelota de Yoga Pro",          precio:  55.50, categoria: "deportes",     stock: 12, imagen: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",  descripcion: "Pelota anti-burst de 65 cm ideal para pilates y rehabilitación. Incluye bomba manual." },
  { id:  4, nombre: "Kit Semillas Hortalizas",     precio:  22.00, categoria: "jardineria",   stock: 15, imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",  descripcion: "20 variedades de semillas orgánicas certificadas: tomate, albahaca, lechuga, cilantro y más." },
  { id:  5, nombre: "Auriculares Noise Cancelling",precio: 210.00, categoria: "tecnologia",   stock:  5, imagen: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",  descripcion: "Auriculares inalámbricos con cancelación activa de ruido, 30 h de batería y plegado compacto." },
  { id:  6, nombre: "Termo Acero Inoxidable",      precio:  45.00, categoria: "hogar",        stock:  9, imagen: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",  descripcion: "500 ml en acero inoxidable 18/8. Mantiene temperatura 12 h frío / 8 h caliente. Libre de BPA." },
  { id:  7, nombre: "Proteína Vegana Vainilla",    precio:  89.90, categoria: "alimentacion", stock:  8, imagen: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&q=80",  descripcion: "Proteína de guisante y arroz integral, 25 g por porción, sin gluten ni lactosa. Envase 1 kg." },
  { id:  8, nombre: "Colchoneta de Meditación",    precio:  67.00, categoria: "bienestar",    stock:  6, imagen: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&q=80",  descripcion: "Colchoneta 60×60 cm de algodón orgánico para meditación y yoga. Incluye funda lavable." },
  { id:  9, nombre: "Maceta Autorregante 3 L",     precio:  29.00, categoria: "jardineria",   stock: 14, imagen: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",  descripcion: "Sistema de riego por capilaridad con indicador de nivel de agua. Apta para interior y exterior." },
  { id: 10, nombre: "Mancuernas Hexagonales 5 kg", precio:  75.00, categoria: "deportes",     stock:  3, imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",  descripcion: "Par de mancuernas recubiertas en goma. Agarre antideslizante y base plana estable." },
  { id: 11, nombre: "Aceite de Coco Orgánico",     precio:  18.50, categoria: "alimentacion", stock:  0, imagen: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&q=80",  descripcion: "Virgen extra prensado en frío 500 ml. Certificación orgánica. Ideal para cocinar y cosmética." },
  { id: 12, nombre: "Difusor Ultrasónico Bambú",   precio:  53.00, categoria: "bienestar",    stock: 11, imagen: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80",  descripcion: "Difusor de aroma 300 ml con carcasa de bambú, 7 colores LED y temporizador ajustable." },
  { id: 13, nombre: "Smart Watch Eco Edition",      precio: 185.00, categoria: "tecnologia",   stock:  4, imagen: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",  descripcion: "Monitor cardíaco, GPS, IP68 y 7 días de batería. Correa fabricada con materiales reciclados." },
  { id: 14, nombre: "Set Cuchillos Bambú",          precio:  62.00, categoria: "hogar",        stock:  8, imagen: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=400&q=80",  descripcion: "5 cuchillos con mango ergonómico de bambú y hojas de acero inoxidable alemán en bloque." },
];
