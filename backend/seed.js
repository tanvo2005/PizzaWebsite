// seed.js - Script để tạo dữ liệu mẫu
// Chạy: node seed.js

require('dotenv').config();
const { sequelize, Product, User } = require('./src/models');

const seedData = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced');

    // Tạo admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@pizza.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Tạo user thường
    const user = await User.create({
      name: 'Test User',
      email: 'user@pizza.com',
      password: 'user123',
      role: 'user'
    });
    console.log('✅ Test user created');

    // Tạo sản phẩm mẫu
    const products = [
      {
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil leaves',
        price: 12.99,
        category: 'vegetarian',
        image: '/images/margherita.jpg',
        isAvailable: true
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni slices with mozzarella cheese and tomato sauce',
        price: 14.99,
        category: 'meat',
        image: '/images/pepperoni.jpg',
        isAvailable: true
      },
      {
        name: 'Vegetarian Supreme',
        description: 'Bell peppers, mushrooms, olives, onions, and fresh mozzarella',
        price: 13.99,
        category: 'vegetarian',
        image: '/images/vegetarian.jpg',
        isAvailable: true
      },
      {
        name: 'Hawaiian Pizza',
        description: 'Ham, pineapple chunks, mozzarella cheese, and tomato sauce',
        price: 15.99,
        category: 'meat',
        image: '/images/hawaiian.jpg',
        isAvailable: true
      },
      {
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
        price: 16.99,
        category: 'meat',
        image: '/images/bbq-chicken.jpg',
        isAvailable: true
      },
      {
        name: 'Four Cheese Pizza',
        description: 'Mozzarella, parmesan, gorgonzola, and ricotta cheeses',
        price: 15.49,
        category: 'vegetarian',
        image: '/images/four-cheese.jpg',
        isAvailable: true
      }
    ];

    for (const productData of products) {
      await Product.create(productData);
    }
    console.log(`✅ Created ${products.length} products`);

    console.log('🎉 Seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@pizza.com / admin123');
    console.log('User: user@pizza.com / user123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();