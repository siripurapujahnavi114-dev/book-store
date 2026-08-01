const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');
const Review = require('./models/Review');

const seedDatabase = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({})
  ]);

  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@bookstore.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '9999999999',
    address: 'Admin Office'
  });

  const customer = await User.create({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'Password123',
    role: 'user',
    phone: '8888888888',
    address: '123 Main Street'
  });

  const books = await Book.insertMany([
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      genre: 'Self Help',
      price: 499,
      description: 'A practical guide to building good habits and breaking bad ones.',
      stock: 25,
      rating: 4.8,
      reviews_count: 0
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      genre: 'Fiction',
      price: 299,
      description: 'An inspiring story about following your dreams.',
      stock: 20,
      rating: 4.6,
      reviews_count: 0
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Programming',
      price: 799,
      description: 'A handbook of agile software craftsmanship.',
      stock: 15,
      rating: 4.7,
      reviews_count: 0
    },
    {
      title: 'Deep Work',
      author: 'Cal Newport',
      genre: 'Productivity',
      price: 450,
      description: 'Rules for focused success in a distracted world.',
      stock: 18,
      rating: 4.5,
      reviews_count: 0
    },
    {
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      genre: 'Psychology',
      price: 650,
      description: 'Insights into the two systems that drive our thinking.',
      stock: 12,
      rating: 4.4,
      reviews_count: 0
    },
    {
      title: 'Rich Dad Poor Dad',
      author: 'Robert T. Kiyosaki',
      genre: 'Finance',
      price: 350,
      description: 'Lessons on financial literacy and wealth building.',
      stock: 30,
      rating: 4.3,
      reviews_count: 0
    },
    {
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      genre: 'Finance',
      price: 520,
      description: 'Timeless lessons on wealth, greed, and happiness.',
      stock: 22,
      rating: 4.9,
      reviews_count: 0
    },
    {
      title: 'Ikigai',
      author: 'Héctor García',
      genre: 'Lifestyle',
      price: 380,
      description: 'Discovering your reason for being.',
      stock: 16,
      rating: 4.2,
      reviews_count: 0
    },
    {
      title: 'You Don’t Know JS',
      author: 'Kyle Simpson',
      genre: 'Programming',
      price: 699,
      description: 'A deep dive into the core mechanisms of JavaScript.',
      stock: 10,
      rating: 4.6,
      reviews_count: 0
    },
    {
      title: 'Sapiens',
      author: 'Yuval Noah Harari',
      genre: 'History',
      price: 599,
      description: 'A brief history of humankind.',
      stock: 14,
      rating: 4.7,
      reviews_count: 0
    }
  ]);

  const sampleOrder = await Order.create({
    userId: customer._id,
    books: [
      {
        bookId: books[0]._id,
        title: books[0].title,
        quantity: 1,
        price: books[0].price
      },
      {
        bookId: books[2]._id,
        title: books[2].title,
        quantity: 1,
        price: books[2].price
      }
    ],
    totalAmount: books[0].price + books[2].price,
    status: 'processing',
    address: customer.address,
    paymentMethod: 'cash_on_delivery'
  });

  await Review.create([
    {
      userId: customer._id,
      bookId: books[0]._id,
      rating: 5,
      comment: 'Excellent and practical.'
    },
    {
      userId: customer._id,
      bookId: books[1]._id,
      rating: 4,
      comment: 'Beautifully written.'
    }
  ]);

  console.log('Database seeded successfully');
  console.log(`Admin: ${adminUser.email} / Admin@123`);
  console.log(`Sample order: ${sampleOrder._id}`);
  process.exit(0);
};

if (require.main === module) {
  seedDatabase().catch(error => {
    console.error('Seeding failed', error);
    process.exit(1);
  });
}

module.exports = seedDatabase;
