const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./eco_pakalpojumi.db');

db.serialize(() => {
  // Add new columns to existing tables
  db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding role column:', err);
    }
  });

  db.run(`ALTER TABLE users ADD COLUMN blocked BOOLEAN DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding blocked column:', err);
    }
  });

  db.run(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding stock column:', err);
    }
  });

  db.run(`ALTER TABLE products ADD COLUMN image_url TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding image_url column:', err);
    }
  });

  db.run(`ALTER TABLE products ADD COLUMN lifecycle_info TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding lifecycle_info column:', err);
    }
  });

  // Rename lifecycle to lifecycle_info if it exists
  db.all("PRAGMA table_info(products)", (err, columns) => {
    if (!err) {
      const hasLifecycle = columns.some(col => col.name === 'lifecycle');
      const hasLifecycleInfo = columns.some(col => col.name === 'lifecycle_info');

      if (hasLifecycle && !hasLifecycleInfo) {
        db.run(`UPDATE products SET lifecycle_info = lifecycle WHERE lifecycle_info IS NULL`);
      }
    }
  });

  // Create orders table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);

  // Create admin user
  const bcrypt = require('bcryptjs');
  const adminPassword = bcrypt.hashSync('admin123', 10);

  db.get('SELECT id FROM users WHERE email = ?', ['admin@eco.com'], (err, row) => {
    if (!row) {
      db.run(`INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        ['admin@eco.com', adminPassword, 'Admin User', 'admin']);
      console.log('Admin user created: admin@eco.com / admin123');
    } else {
      db.run('UPDATE users SET role = ? WHERE email = ?', ['admin', 'admin@eco.com']);
      console.log('Admin user updated');
    }
  });

  console.log('Database migration completed');
});

db.close();