const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Passport setup for Google
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would find or create user in DB
    return done(null, profile);
  }
));

app.use(passport.initialize());

// Database setup
const db = new sqlite3.Database('./eco_pakalpojumi.db');

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    blocked BOOLEAN DEFAULT 0,
    google_id TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    category TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    lifecycle_info TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS user_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    activity TEXT,
    date TEXT,
    impact REAL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    content TEXT,
    date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT,
    date TEXT,
    FOREIGN KEY(post_id) REFERENCES posts(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    reward TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS user_challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    challenge_id INTEGER,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(challenge_id) REFERENCES challenges(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS education_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    type TEXT,
    date TEXT
  )`);
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
});

// Routes
// Password validation function
const validatePassword = (password) => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }

  return null; // Valid password
};

// Auth
app.post('/api/auth/register', async (req, res) => {
  console.log('🔍 REGISTER REQUEST RECEIVED:', req.body);

  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    console.log('❌ MISSING REQUIRED FIELDS');
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Validate name length
  if (name.trim().length < 2) {
    console.log('❌ NAME TOO SHORT');
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ INVALID EMAIL FORMAT');
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Validate password strength
  const passwordError = validatePassword(password);
  if (passwordError) {
    console.log('❌ PASSWORD VALIDATION FAILED:', passwordError);
    return res.status(400).json({ error: passwordError });
  }

  console.log('✅ ALL VALIDATIONS PASSED');

  // Check if email exists
  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.log('❌ DATABASE ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (row) {
      console.log('❌ EMAIL ALREADY EXISTS');
      return res.status(400).json({ error: 'Email already registered' });
    }

    console.log('✅ EMAIL CHECK PASSED');

    try {
      console.log('🔐 HASHING PASSWORD...');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ PASSWORD HASHED');

      console.log('💾 INSERTING USER INTO DATABASE...');
      db.run('INSERT INTO users (email, password, name, role, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
        [email, hashedPassword, name, 'user'], function(err) {
        if (err) {
          console.log('❌ DATABASE INSERT ERROR:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }
        console.log('✅ USER CREATED SUCCESSFULLY, ID:', this.lastID);
        res.status(201).json({ message: 'User registered successfully' });
      });
    } catch (error) {
      console.log('❌ BCRYPT ERROR:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔍 LOGIN REQUEST RECEIVED:', req.body);

  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    console.log('❌ MISSING EMAIL OR PASSWORD');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log('✅ BASIC VALIDATION PASSED');

  db.get('SELECT id, email, password, name, role FROM users WHERE email = ? AND blocked = 0', [email], async (err, user) => {
    if (err) {
      console.log('❌ DATABASE ERROR:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      console.log('❌ USER NOT FOUND FOR EMAIL:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ USER FOUND:', user.email);

    try {
      console.log('🔐 COMPARING PASSWORD...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 PASSWORD COMPARISON RESULT:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ INVALID PASSWORD');
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      console.log('✅ PASSWORD VALID, GENERATING TOKEN...');

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ TOKEN GENERATED, LOGIN SUCCESSFUL');

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error) {
      console.log('❌ BCRYPT COMPARISON ERROR:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Create JWT for Google user
  const token = jwt.sign({ id: req.user.id, email: req.user.emails[0].value, name: req.user.displayName }, JWT_SECRET);
  res.redirect(`http://localhost:5173?token=${token}`);
});

// Products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ products: rows });
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category } = req.body;
  db.run('INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)', [name, description, price, category], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Cart
app.get('/api/cart', authenticateToken, (req, res) => {
  db.all('SELECT cart.*, products.name, products.price FROM cart JOIN products ON cart.product_id = products.id WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ cart: rows });
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { product_id, quantity } = req.body;
  db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.delete('/api/cart/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// Footprint
app.get('/api/footprint', authenticateToken, (req, res) => {
  db.all('SELECT * FROM user_activities WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ activities: rows });
  });
});

app.post('/api/footprint', authenticateToken, (req, res) => {
  const { activity, impact } = req.body;
  db.run('INSERT INTO user_activities (user_id, activity, date, impact) VALUES (?, ?, datetime("now"), ?)', [req.user.id, activity, impact], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Forum
app.get('/api/posts', (req, res) => {
  db.all('SELECT posts.*, users.name FROM posts JOIN users ON posts.user_id = users.id ORDER BY date DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ posts: rows });
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('INSERT INTO posts (user_id, title, content, date) VALUES (?, ?, ?, datetime("now"))', [decoded.id, title, content], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/posts/:id/comments', (req, res) => {
  db.all('SELECT comments.*, users.name FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = ? ORDER BY date ASC', [req.params.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ comments: rows });
  });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { content } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('INSERT INTO comments (post_id, user_id, content, date) VALUES (?, ?, ?, datetime("now"))', [req.params.id, decoded.id, content], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Challenges
app.get('/api/challenges', (req, res) => {
  db.all('SELECT * FROM challenges', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ challenges: rows });
  });
});

app.post('/api/user-challenges', (req, res) => {
  const { challenge_id } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('INSERT INTO user_challenges (user_id, challenge_id, completed) VALUES (?, ?, 1)', [decoded.id, challenge_id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Education
app.put('/api/user', (req, res) => {
  const { name, password } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    let updateFields = [];
    let values = [];
    if (name) {
      updateFields.push('name = ?');
      values.push(name);
    }
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    if (updateFields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(decoded.id);
    db.run(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values, function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Profile updated' });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.delete('/api/user', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('DELETE FROM users WHERE id = ?', [decoded.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Account deleted' });
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Admin routes
app.get('/api/admin/users', requireAdmin, (req, res) => {
  db.all('SELECT id, name, email, role, blocked FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/admin/users/:id/block', requireAdmin, (req, res) => {
  const { blocked } = req.body;
  db.run('UPDATE users SET blocked = ? WHERE id = ?', [blocked ? 1 : 0, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User updated' });
  });
});

app.put('/api/admin/users/:id/role', requireAdmin, (req, res) => {
  const { role } = req.body;
  db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User role updated' });
  });
});

app.get('/api/admin/orders', requireAdmin, (req, res) => {
  db.all(`
    SELECT o.*, u.name as user_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Order status updated' });
  });
});

app.delete('/api/admin/orders/:id', requireAdmin, (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Order deleted' });
  });
});

// Product CRUD for admin
app.post('/api/products', requireAdmin, (req, res) => {
  const { name, description, price, category, stock, image_url, lifecycle_info } = req.body;
  db.run(
    'INSERT INTO products (name, description, price, category, stock, image_url, lifecycle_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, price, category, stock || 0, image_url, lifecycle_info],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const { name, description, price, category, stock, image_url, lifecycle_info } = req.body;
  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, image_url = ?, lifecycle_info = ? WHERE id = ?',
    [name, description, price, category, stock, image_url, lifecycle_info, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Product updated' });
    }
  );
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});