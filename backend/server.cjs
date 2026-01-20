const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads folder
app.use('/uploads', express.static(uploadsDir));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

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
    clientID: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would find or create user in DB
    return done(null, profile);
  }
));

app.use(passport.initialize());

// Google OAuth - verify token from frontend and create/login user
app.post('/api/auth/google', async (req, res) => {
  const { credential, clientId } = req.body;
  
  try {
    // Decode the JWT token from Google (in production, verify with Google's public keys)
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());
    
    const { email, name, sub: googleId, picture } = payload;
    
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, googleId], (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (existingUser) {
        // User exists - update google_id if needed and login
        if (!existingUser.google_id) {
          db.run('UPDATE users SET google_id = ? WHERE id = ?', [googleId, existingUser.id]);
        }
        
        const token = jwt.sign(
          { id: existingUser.id, email: existingUser.email, name: existingUser.name, role: existingUser.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return res.json({
          token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role
          }
        });
      } else {
        // Create new user with Google account
        const randomPassword = Math.random().toString(36).slice(-12) + 'Aa1!';
        bcrypt.hash(randomPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }
          
          db.run(
            'INSERT INTO users (name, email, password, google_id, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, googleId, 'user'],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Error creating user' });
              }
              
              const userId = this.lastID;
              const token = jwt.sign(
                { id: userId, email, name, role: 'user' },
                JWT_SECRET,
                { expiresIn: '7d' }
              );
              
              return res.json({
                token,
                user: { id: userId, email, name, role: 'user' },
                isNewUser: true
              });
            }
          );
        });
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
});

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
    category TEXT,
    tags TEXT,
    date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Add columns if they don't exist (for existing databases)
  db.run(`ALTER TABLE posts ADD COLUMN category TEXT`, () => {});
  db.run(`ALTER TABLE posts ADD COLUMN tags TEXT`, () => {});
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
    return res.status(400).json({ error: 'Please fill in all required fields: name, email, and password.' });
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
      return res.status(400).json({ error: 'An account with this email address already exists. Please use a different email or try logging in instead.' });
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
      return res.status(401).json({ error: 'No account found with this email address. Please check your email or register first.' });
    }

    console.log('✅ USER FOUND:', user.email);

    try {
      console.log('🔐 COMPARING PASSWORD...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('🔐 PASSWORD COMPARISON RESULT:', isValidPassword);

      if (!isValidPassword) {
        console.log('❌ INVALID PASSWORD');
        return res.status(401).json({ error: 'Incorrect password. Please check your password and try again.' });
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

// Cart
app.get('/api/cart', authenticateToken, (req, res) => {
  db.all(`
    SELECT cart.id, cart.quantity, cart.product_id,
           products.name, products.price, products.image_url, products.stock
    FROM cart 
    JOIN products ON cart.product_id = products.id 
    WHERE cart.user_id = ?
  `, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ cart: rows || [] });
  });
});

app.post('/api/cart', authenticateToken, (req, res) => {
  const { product_id, quantity } = req.body;
  
  // Check if item already in cart
  db.get('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, product_id], (err, existing) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (existing) {
      // Update quantity
      db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: existing.id, updated: true });
      });
    } else {
      // Insert new
      db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [req.user.id, product_id, quantity], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ id: this.lastID });
      });
    }
  });
});

app.put('/api/cart/:id', authenticateToken, (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ deleted: true });
    });
  } else {
    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ updated: true });
    });
  }
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

app.delete('/api/cart', authenticateToken, (req, res) => {
  db.run('DELETE FROM cart WHERE user_id = ?', [req.user.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ cleared: this.changes });
  });
});

// Checkout / Create Order
app.post('/api/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Get cart items
  db.all(`
    SELECT cart.id, cart.quantity, cart.product_id,
           products.name, products.price, products.stock
    FROM cart 
    JOIN products ON cart.product_id = products.id 
    WHERE cart.user_id = ?
  `, [userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    // Check stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${item.name}` });
      }
    }
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order
    db.run('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)', [userId, total, 'pending'], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      const orderId = this.lastID;
      
      // Insert order items
      const insertStmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
      const updateStockStmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
      
      for (const item of cartItems) {
        insertStmt.run(orderId, item.product_id, item.quantity, item.price);
        updateStockStmt.run(item.quantity, item.product_id);
      }
      
      insertStmt.finalize();
      updateStockStmt.finalize();
      
      // Clear cart
      db.run('DELETE FROM cart WHERE user_id = ?', [userId], function(err) {
        if (err) {
          console.error('Error clearing cart:', err);
        }
        res.json({ 
          success: true, 
          orderId: orderId, 
          total: total,
          message: 'Order placed successfully!' 
        });
      });
    });
  });
});

// Get user orders
app.get('/api/orders', authenticateToken, (req, res) => {
  db.all(`
    SELECT o.*, 
           GROUP_CONCAT(p.name || ' x' || oi.quantity) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ orders: rows || [] });
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
  db.all(`
    SELECT posts.id, posts.title, posts.content, posts.category, posts.tags, posts.date,
    users.name,
    (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) as comment_count
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    ORDER BY date DESC
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ posts: rows });
  });
});

app.post('/api/posts', (req, res) => {
  const { title, content, category, tags } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    db.run('INSERT INTO posts (user_id, title, content, category, tags, date) VALUES (?, ?, ?, ?, ?, datetime("now"))', 
      [decoded.id, title, content, category || '', tags || ''], function(err) {
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

// Admin: Delete post
app.delete('/api/admin/posts/:id', requireAdmin, (req, res) => {
  const postId = req.params.id;
  // First delete associated comments
  db.run('DELETE FROM comments WHERE post_id = ?', [postId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Then delete the post
    db.run('DELETE FROM posts WHERE id = ?', [postId], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json({ message: 'Post deleted' });
    });
  });
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
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, name, email, role, blocked, created_at FROM users ORDER BY id ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.put('/api/admin/users/:id/block', authenticateToken, requireAdmin, (req, res) => {
  const { blocked } = req.body;
  db.run('UPDATE users SET blocked = ? WHERE id = ?', [blocked ? 1 : 0, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User updated' });
  });
});

app.put('/api/admin/users/:id/role', authenticateToken, requireAdmin, (req, res) => {
  const { role } = req.body;
  db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'User role updated' });
  });
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
  const userId = req.params.id;
  // Don't allow deleting yourself
  if (parseInt(userId) === req.user.userId) {
    return res.status(400).json({ error: 'Cannot delete your own account from admin panel' });
  }
  db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  });
});

app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
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

app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Order status updated' });
  });
});

app.delete('/api/admin/orders/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Order deleted' });
  });
});

// Education posts endpoint
app.get('/api/education', (req, res) => {
  db.all('SELECT * FROM education_posts ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// Image upload endpoint
app.post('/api/upload', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url: imageUrl, filename: req.file.filename });
});

// Product CRUD for admin
app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
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

app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
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

app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product deleted' });
  });
});

// Get user stats
app.get('/api/user/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  // Get various stats for the user
  const queries = {
    // Total orders count
    ordersCount: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Completed challenges count
    challengesCompleted: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_challenges WHERE user_id = ? AND completed = 1', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Total challenges joined
    challengesJoined: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_challenges WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Total activities logged
    activitiesCount: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_activities WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Total CO2 impact from activities
    totalCo2Saved: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(impact), 0) as total FROM user_activities WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
      });
    }),
    // Cart items count
    cartCount: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Forum posts count
    postsCount: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM posts WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    // Recent activities
    recentActivities: new Promise((resolve, reject) => {
      db.all('SELECT * FROM user_activities WHERE user_id = ? ORDER BY date DESC LIMIT 5', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    }),
    // User creation date
    userCreatedAt: new Promise((resolve, reject) => {
      db.get('SELECT created_at FROM users WHERE id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.created_at || null);
      });
    }),
    // Total money spent
    totalSpent: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE user_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
      });
    })
  };
  
  Promise.all(Object.values(queries))
    .then(results => {
      const keys = Object.keys(queries);
      const stats = {};
      keys.forEach((key, index) => {
        stats[key] = results[index];
      });
      
      // Calculate eco points based on activities
      // 10 points per activity + 50 points per completed challenge + 5 points per order
      stats.ecoPoints = (stats.activitiesCount * 10) + (stats.challengesCompleted * 50) + (stats.ordersCount * 5);
      
      // Calculate streak (consecutive days with activities)
      stats.streak = calculateStreak(stats.recentActivities);
      
      // Calculate level based on eco points
      stats.level = Math.floor(stats.ecoPoints / 100) + 1;
      stats.currentXP = stats.ecoPoints % 100;
      stats.nextLevelXP = 100;
      
      res.json(stats);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Helper function to calculate streak
function calculateStreak(activities) {
  if (!activities || activities.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get unique dates
  const dates = [...new Set(activities.map(a => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }))].sort((a, b) => b - a);
  
  if (dates.length === 0) return 0;
  
  // Check if the most recent activity is today or yesterday
  const mostRecent = dates[0];
  const diffDays = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0; // Streak broken
  
  streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.floor((dates[i - 1] - dates[i]) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

// Get global site stats (public)
app.get('/api/stats/global', (req, res) => {
  const queries = {
    totalUsers: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalCo2Saved: new Promise((resolve, reject) => {
      db.get('SELECT COALESCE(SUM(impact), 0) as total FROM user_activities', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.total || 0);
      });
    }),
    totalProducts: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalOrders: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalForumPosts: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM posts', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalActivities: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_activities', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    }),
    totalChallengesCompleted: new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM user_challenges WHERE completed = 1', [], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    })
  };
  
  Promise.all(Object.values(queries))
    .then(results => {
      const keys = Object.keys(queries);
      const stats = {};
      keys.forEach((key, index) => {
        stats[key] = results[index];
      });
      
      // Calculate trees planted equivalent (1 tree absorbs ~21kg CO2/year, so we estimate 1 tree per 20kg saved)
      stats.treesPlanted = Math.floor(stats.totalCo2Saved / 20);
      
      res.json(stats);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});