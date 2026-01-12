const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./eco_pakalpojumi.db');

db.serialize(() => {
  // Create admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run(`INSERT OR IGNORE INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
    ['admin@eco.com', adminPassword, 'Admin User', 'admin']);

  // Add sample products
  const products = [
    {
      name: 'Bamboo Toothbrush',
      description: 'Eco-friendly bamboo toothbrush with biodegradable bristles',
      price: 3.99,
      category: 'Personal Care',
      stock: 100,
      image_url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400',
      lifecycle_info: 'Made from sustainable bamboo, fully biodegradable'
    },
    {
      name: 'Reusable Shopping Bag',
      description: 'Durable cotton shopping bag, reduces plastic waste',
      price: 8.99,
      category: 'Accessories',
      stock: 50,
      image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      lifecycle_info: 'Made from organic cotton, reusable for years'
    },
    {
      name: 'Solar Power Bank',
      description: 'Portable solar charger for eco-conscious travelers',
      price: 29.99,
      category: 'Electronics',
      stock: 25,
      image_url: 'https://images.unsplash.com/photo-1609592803951-77c3c0de4ae4?w=400',
      lifecycle_info: 'Solar-powered, reduces reliance on fossil fuels'
    },
    {
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable t-shirt made from 100% organic cotton',
      price: 19.99,
      category: 'Clothing',
      stock: 75,
      image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      lifecycle_info: 'Organic farming reduces water usage and chemical pollution'
    },
    {
      name: 'Recycled Plastic Water Bottle',
      description: 'Durable water bottle made from recycled ocean plastic',
      price: 12.99,
      category: 'Accessories',
      stock: 60,
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      lifecycle_info: 'Made from recycled ocean plastic, keeps plastic out of landfills'
    },
    {
      name: 'Beeswax Food Wraps',
      description: 'Natural alternative to plastic wrap, reusable and compostable',
      price: 15.99,
      category: 'Kitchen',
      stock: 40,
      image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      lifecycle_info: 'Made from beeswax and cotton, fully compostable'
    }
  ];

  products.forEach(product => {
    db.run(`INSERT OR IGNORE INTO products (name, description, price, category, stock, image_url, lifecycle_info)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product.name, product.description, product.price, product.category, product.stock, product.image_url, product.lifecycle_info]);
  });

  console.log('Database seeded with admin user and sample products');
  console.log('Admin login: admin@eco.com / admin123');
});

db.close();