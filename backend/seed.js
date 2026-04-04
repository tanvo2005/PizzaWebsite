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
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil leaves',
        price: 129000,
        category: 'vegetarian',
        image: '/pizza-placeholder.svg',
        ingredients: ['Mozzarella', 'Tomato', 'Basil'],
        isAvailable: true
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni slices with mozzarella cheese and tomato sauce',
        price: 149000,
        category: 'meat',
        image: '/pizza-placeholder.svg',
        ingredients: ['Pepperoni', 'Mozzarella', 'Tomato sauce'],
        isAvailable: true
      },
      {
        name: 'Vegetarian Supreme',
        description: 'Bell peppers, mushrooms, olives, onions, and fresh mozzarella',
        price: 139000,
        category: 'vegetarian',
        image: '/pizza-placeholder.svg',
        ingredients: ['Bell peppers', 'Mushrooms', 'Olives', 'Onions'],
        isAvailable: true
      },
      {
        name: 'Hawaiian Pizza',
        description: 'Ham, pineapple chunks, mozzarella cheese, and tomato sauce',
        price: 159000,
        category: 'meat',
        image: '/pizza-placeholder.svg',
        ingredients: ['Ham', 'Pineapple', 'Mozzarella'],
        isAvailable: true
      },
      {
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
        price: 169000,
        category: 'meat',
        image: '/pizza-placeholder.svg',
        ingredients: ['Chicken', 'BBQ sauce', 'Red onion'],
        isAvailable: true
      },
      {
        name: 'Four Cheese Pizza',
        description: 'Mozzarella, parmesan, gorgonzola, and ricotta cheeses',
        price: 155000,
        category: 'special',
        image: '/pizza-placeholder.svg',
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
