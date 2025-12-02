// Base de datos simulada en memoria
let products = [
  // Instrumentos Musicales
  {
    id: '1',
    name: 'Guitarra Acústica Yamaha FG800',
    category: 'instrumento',
    subcategory: 'cuerda',
    price: 299.99,
    stock: 15,
    description: 'Guitarra acústica de calidad profesional con tapa de abeto sólido',
    brand: 'Yamaha',
    image: 'https://example.com/guitar.jpg'
  },
  {
    id: '2',
    name: 'Piano Digital Casio CDP-S100',
    category: 'instrumento',
    subcategory: 'teclas',
    price: 449.99,
    stock: 8,
    description: 'Piano digital compacto con 88 teclas pesadas',
    brand: 'Casio',
    image: 'https://example.com/piano.jpg'
  },
  {
    id: '3',
    name: 'Batería Acústica Pearl Export',
    category: 'instrumento',
    subcategory: 'percusión',
    price: 899.99,
    stock: 5,
    description: 'Set completo de batería de 5 piezas con platillos',
    brand: 'Pearl',
    image: 'https://example.com/drums.jpg'
  },
  {
    id: '4',
    name: 'Saxofón Alto Yamaha YAS-280',
    category: 'instrumento',
    subcategory: 'viento',
    price: 1299.99,
    stock: 3,
    description: 'Saxofón alto ideal para estudiantes y profesionales',
    brand: 'Yamaha',
    image: 'https://example.com/sax.jpg'
  },
  // Libros
  {
    id: '5',
    name: 'Teoría Musical Completa',
    category: 'libro',
    subcategory: 'educación musical',
    price: 34.99,
    stock: 50,
    description: 'Guía completa de teoría musical desde básico hasta avanzado',
    brand: 'Editorial Música',
    image: 'https://example.com/book1.jpg'
  },
  {
    id: '6',
    name: 'Historia del Arte Moderno',
    category: 'libro',
    subcategory: 'arte',
    price: 45.99,
    stock: 30,
    description: 'Análisis detallado del arte moderno del siglo XX',
    brand: 'Editorial Arte',
    image: 'https://example.com/book2.jpg'
  },
  {
    id: '7',
    name: 'Técnicas de Pintura al Óleo',
    category: 'libro',
    subcategory: 'técnicas',
    price: 29.99,
    stock: 40,
    description: 'Manual práctico para dominar la pintura al óleo',
    brand: 'Editorial Arte',
    image: 'https://example.com/book3.jpg'
  },
  // Arte y Materiales
  {
    id: '8',
    name: 'Set de Pinceles Profesionales',
    category: 'arte',
    subcategory: 'pintura',
    price: 59.99,
    stock: 25,
    description: 'Kit de 15 pinceles de diferentes tamaños y formas',
    brand: 'Windsor & Newton',
    image: 'https://example.com/brushes.jpg'
  },
  {
    id: '9',
    name: 'Caballete de Estudio Ajustable',
    category: 'arte',
    subcategory: 'equipo',
    price: 89.99,
    stock: 12,
    description: 'Caballete de madera ajustable en altura',
    brand: 'ArtMaster',
    image: 'https://example.com/easel.jpg'
  },
  {
    id: '10',
    name: 'Acuarelas Winsor & Newton',
    category: 'arte',
    subcategory: 'pintura',
    price: 75.99,
    stock: 20,
    description: 'Set de 24 colores de acuarelas profesionales',
    brand: 'Winsor & Newton',
    image: 'https://example.com/watercolors.jpg'
  }
];

let orders = [];
let users = [
  {
    id: '1',
    email: 'juan@example.com',
    name: 'Juan Pérez',
    address: 'Av. Principal 123, Santiago',
    phone: '+56912345678'
  }
];

module.exports = {
  products,
  orders,
  users
};