require('dotenv').config();
const { sequelize, Product, User } = require('./src/models');

const seedData = async () => {
  try {
    console.log('Seeding database...');

    await sequelize.sync({ force: true });
    console.log('Database synced');

    await User.create({
      name: 'Admin',
      email: 'admin@pizza.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created');

    await User.create({
      name: 'Test User',
      email: 'user@pizza.com',
      password: 'user123',
      role: 'user'
    });
    console.log('Test user created');

    const products = [
      {
        name: 'Pizza Hải Sản Nhiệt Đới',
        description: 'Tôm, mực, ngao, dứa, phô mai Mozzarella và xốt cà chua',
        price: 169000,
        category: 'pizza', // Danh mục Pizza
        image: '/pizza.jpg',
        ingredients: ['Tôm', 'Mực', 'Dứa', 'Phô mai'],
        isAvailable: true
      },
      {
        name: 'Pizza Xúc Xích Phô Mai',
        description: 'Xúc xích Pepperoni cao cấp, phô mai Mozzarella thơm béo',
        price: 149000,
        category: 'pizza',
        image: '/pizza.jpg',
        ingredients: ['Xúc xích', 'Phô mai', 'Xốt cà chua'],
        isAvailable: true
      },
      {
        name: 'Pizza Nấm Thanh Đạm',
        description: 'Nấm tươi, ớt chuông, hành tây và phô mai',
        price: 129000,
        category: 'vegetarian', // Danh mục Chay
        image: '/chay.png',
        ingredients: ['Nấm', 'Ớt chuông', 'Hành tây'],
        isAvailable: true
      },
      {
        name: 'Gà Rán Giòn Cay (3 miếng)',
        description: 'Gà tẩm bột chiên giòn rụm, phủ xốt cay Hàn Quốc',
        price: 89000,
        category: 'gachien', // Danh mục Gà Chiên
        image: '/ga-chien.jpg',
        ingredients: ['Thịt gà', 'Bột chiên', 'Xốt cay'],
        isAvailable: true
      },
      {
        name: 'Khoai Tây Chiên Giòn',
        description: 'Khoai tây chiên vàng rụm, rắc muối tiêu',
        price: 49000,
        category: 'khaivi', // Danh mục Khai vị
        image: '/khai-vi.jpg',
        ingredients: ['Khoai tây', 'Muối'],
        isAvailable: true
      },
      {
        name: 'Nước Ngọt Coca Cola',
        description: 'Lon 330ml mát lạnh',
        price: 20000,
        category: 'thucuong', // Danh mục Thức uống
        image: '/thuc-uong.png',
        ingredients: [],
        isAvailable: true
      },
      {
        name: 'Combo Sinh Viên',
        description: '1 Pizza Nhỏ, 1 Gà rán, 2 Nước ngọt',
        price: 199000,
        category: 'compo', // Danh mục Combo
        image: '/pizza-placeholder.svg',
        ingredients: [],
        isAvailable: true
      },
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil leaves',
        price: 129000,
        category: 'vegetarian',
        image: '/chay.png',
        ingredients: ['Mozzarella', 'Tomato', 'Basil'],
        isAvailable: true
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni slices with mozzarella cheese and tomato sauce',
        price: 149000,
        category: 'meat',
        image: '/pizza.jpg',
        ingredients: ['Pepperoni', 'Mozzarella', 'Tomato sauce'],
        isAvailable: true
      },
      {
        name: 'Vegetarian Supreme',
        description: 'Bell peppers, mushrooms, olives, onions, and fresh mozzarella',
        price: 139000,
        category: 'vegetarian',
        image: '/chay.png',
        ingredients: ['Bell peppers', 'Mushrooms', 'Olives', 'Onions'],
        isAvailable: true
      },
      {
        name: 'Hawaiian Pizza',
        description: 'Ham, pineapple chunks, mozzarella cheese, and tomato sauce',
        price: 159000,
        category: 'meat',
        image: '/pizza.jpg',
        ingredients: ['Ham', 'Pineapple', 'Mozzarella'],
        isAvailable: true
      },
      {
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
        price: 169000,
        category: 'meat',
        image: '/pizza.jpg',
        ingredients: ['Chicken', 'BBQ sauce', 'Red onion'],
        isAvailable: true
      },
      {
        name: 'Four Cheese Pizza',
        description: 'Mozzarella, parmesan, gorgonzola, and ricotta cheeses',
        price: 155000,
        category: 'special',
        image: '/pizza.jpg',
        ingredients: ['Mozzarella', 'Parmesan', 'Gorgonzola', 'Ricotta'],
        isAvailable: true
      }
    ];

    for (const productData of products) {
      await Product.create(productData);
    }

    console.log(`Created ${products.length} products`);
    console.log('Seeding completed successfully');
    console.log('Admin: admin@pizza.com / admin123');
    console.log('User: user@pizza.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
