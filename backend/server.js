const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database(path.join(__dirname, 'cashodds.db'));

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'subscriber',
    verified INTEGER DEFAULT 0,
    bio TEXT,
    avatar TEXT,
    followers_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tips table
  db.run(`CREATE TABLE IF NOT EXISTS tips (
    id TEXT PRIMARY KEY,
    tipster_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    total_odds REAL NOT NULL,
    is_premium INTEGER DEFAULT 0,
    custom_price REAL,
    status TEXT DEFAULT 'pending',
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipster_id) REFERENCES users(id)
  )`);

  // Booking codes table
  db.run(`CREATE TABLE IF NOT EXISTS booking_codes (
    id TEXT PRIMARY KEY,
    tip_id TEXT NOT NULL,
    company TEXT NOT NULL,
    code TEXT NOT NULL,
    FOREIGN KEY (tip_id) REFERENCES tips(id) ON DELETE CASCADE
  )`);

  // Verification requests table
  db.run(`CREATE TABLE IF NOT EXISTS verification_requests (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    experience TEXT NOT NULL,
    expertise TEXT NOT NULL,
    social_links TEXT,
    why_verify TEXT NOT NULL,
    id_image_url TEXT,
    selfie_image_url TEXT,
    status TEXT DEFAULT 'pending',
    applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Followers table
  db.run(`CREATE TABLE IF NOT EXISTS followers (
    id TEXT PRIMARY KEY,
    follower_id TEXT NOT NULL,
    tipster_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, tipster_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (tipster_id) REFERENCES users(id)
  )`);

  // Notifications table
  db.run(`CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Purchases table for tracking purchased tips
  db.run(`CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    tip_id TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_method TEXT DEFAULT 'mpesa',
    transaction_id TEXT,
    status TEXT DEFAULT 'completed',
    purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (tip_id) REFERENCES tips(id),
    UNIQUE(user_id, tip_id)
  )`);

  console.log('Database tables created successfully');
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ========== AUTH ROUTES ==========

// Register
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone, role = 'subscriber' } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    db.run(
      'INSERT INTO users (id, name, email, password, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, phone, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: 'Error creating user', error: err.message });
        }
        
        const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
          message: 'User created successfully',
          user: { id, name, email, role, phone },
          token
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        verified: user.verified === 1,
        bio: user.bio
      },
      token
    });
  });
});

// ========== TIPS ROUTES ==========

// Get all tips (with optional filters)
app.get('/api/tips', (req, res) => {
  const { is_premium, tipster_id, status } = req.query;
  let query = `
    SELECT t.*, u.name as tipster_name, u.verified as tipster_verified,
           (SELECT COUNT(*) FROM booking_codes WHERE tip_id = t.id) as booking_code_count
    FROM tips t
    JOIN users u ON t.tipster_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (is_premium !== undefined) {
    query += ' AND t.is_premium = ?';
    params.push(is_premium === 'true' ? 1 : 0);
  }
  if (tipster_id) {
    query += ' AND t.tipster_id = ?';
    params.push(tipster_id);
  }
  if (status) {
    query += ' AND t.status = ?';
    params.push(status);
  }

  query += ' ORDER BY t.created_at DESC';

  db.all(query, params, (err, tips) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tips', error: err.message });
    }

    // Fetch booking codes for each tip
    const tipIds = tips.map(t => t.id);
    if (tipIds.length === 0) {
      return res.json({ tips: [] });
    }

    const placeholders = tipIds.map(() => '?').join(',');
    db.all(`SELECT * FROM booking_codes WHERE tip_id IN (${placeholders})`, tipIds, (err, codes) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching booking codes', error: err.message });
      }

      const tipsWithCodes = tips.map(tip => ({
        ...tip,
        is_premium: tip.is_premium === 1,
        tipster_verified: tip.tipster_verified === 1,
        booking_codes: codes.filter(c => c.tip_id === tip.id)
      }));

      res.json({ tips: tipsWithCodes });
    });
  });
});

// Get single tip with booking codes
app.get('/api/tips/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT t.*, u.name as tipster_name, u.verified as tipster_verified
     FROM tips t
     JOIN users u ON t.tipster_id = u.id
     WHERE t.id = ?`,
    [id],
    (err, tip) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching tip', error: err.message });
      }
      if (!tip) {
        return res.status(404).json({ message: 'Tip not found' });
      }

      // Increment views
      db.run('UPDATE tips SET views = views + 1 WHERE id = ?', [id]);

      // Get booking codes
      db.all('SELECT * FROM booking_codes WHERE tip_id = ?', [id], (err, codes) => {
        if (err) {
          return res.status(500).json({ message: 'Error fetching booking codes', error: err.message });
        }

        res.json({
          tip: {
            ...tip,
            is_premium: tip.is_premium === 1,
            tipster_verified: tip.tipster_verified === 1,
            booking_codes: codes
          }
        });
      });
    }
  );
});

// Create new tip (tipster only)
app.post('/api/tips', authMiddleware, (req, res) => {
  const { title, description, total_odds, is_premium, custom_price, booking_codes } = req.body;
  const tipster_id = req.user.id;

  if (req.user.role !== 'tipster' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only tipsters can create tips' });
  }

  const tipId = uuidv4();

  db.run(
    `INSERT INTO tips (id, tipster_id, title, description, total_odds, is_premium, custom_price)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [tipId, tipster_id, title, description, total_odds, is_premium ? 1 : 0, custom_price || null],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error creating tip', error: err.message });
      }

      // Insert booking codes
      if (booking_codes && booking_codes.length > 0) {
        const stmt = db.prepare('INSERT INTO booking_codes (id, tip_id, company, code) VALUES (?, ?, ?, ?)');
        booking_codes.forEach(bc => {
          stmt.run(uuidv4(), tipId, bc.company, bc.code);
        });
        stmt.finalize();
      }

      // Create notifications for all users
      db.all('SELECT id FROM users WHERE id != ?', [tipster_id], (err, users) => {
        if (!err && users.length > 0) {
          const notifStmt = db.prepare(
            'INSERT INTO notifications (id, user_id, title, message, type) VALUES (?, ?, ?, ?, ?)'
          );
          users.forEach(user => {
            notifStmt.run(
              uuidv4(),
              user.id,
              is_premium ? '🔥 New VIP Tip Available!' : '✅ New Free Tip Posted!',
              `A tipster posted: ${title} (${total_odds} odds)`,
              'new_tip'
            );
          });
          notifStmt.finalize();
        }
      });

      res.status(201).json({
        message: 'Tip created successfully',
        tip: { id: tipId, title, total_odds, is_premium }
      });
    }
  );
});

// Update tip status (mark won/lost)
app.patch('/api/tips/:id/status', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'won', 'lost'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.get('SELECT tipster_id FROM tips WHERE id = ?', [id], (err, tip) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    if (tip.tipster_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    db.run('UPDATE tips SET status = ? WHERE id = ?', [status, id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating tip', error: err.message });
      }
      res.json({ message: 'Tip status updated', status });
    });
  });
});

// Delete tip
app.delete('/api/tips/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  db.get('SELECT tipster_id FROM tips WHERE id = ?', [id], (err, tip) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!tip) {
      return res.status(404).json({ message: 'Tip not found' });
    }
    if (tip.tipster_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    db.run('DELETE FROM tips WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting tip', error: err.message });
      }
      res.json({ message: 'Tip deleted successfully' });
    });
  });
});

// ========== VERIFICATION REQUESTS ROUTES ==========

// Submit verification request
app.post('/api/verification-requests', authMiddleware, (req, res) => {
  const { full_name, phone, email, experience, expertise, social_links, why_verify, id_image_url, selfie_image_url } = req.body;
  const user_id = req.user.id;

  if (req.user.role !== 'tipster') {
    return res.status(403).json({ message: 'Only tipsters can apply for verification' });
  }

  // Validate image URLs are provided
  if (!id_image_url || !selfie_image_url) {
    return res.status(400).json({ message: 'Please upload both National ID and your photo' });
  }

  // Check if already verified
  db.get('SELECT verified FROM users WHERE id = ?', [user_id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (user.verified === 1) {
      return res.status(400).json({ message: 'You are already verified' });
    }

    // Check for pending request
    db.get(
      'SELECT id FROM verification_requests WHERE user_id = ? AND status = ?',
      [user_id, 'pending'],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (existing) {
          return res.status(400).json({ message: 'You already have a pending verification request' });
        }

        const requestId = uuidv4();

        db.run(
          `INSERT INTO verification_requests 
           (id, user_id, full_name, phone, email, experience, expertise, social_links, why_verify, id_image_url, selfie_image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [requestId, user_id, full_name, phone, email, experience, expertise, social_links, why_verify, id_image_url, selfie_image_url],
          function(err) {
            if (err) {
              return res.status(500).json({
                message: 'Error creating verification request',
                error: err.message
              });
            }

            res.status(201).json({
              message: 'Verification request submitted successfully',
              request: { id: requestId, status: 'pending' }
            });
          }
        );
      }
    );
  });
});

// Get all verification requests (admin only)
app.get('/api/verification-requests', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const { status } = req.query;
  let query = `
    SELECT vr.*, u.name as user_name, u.email as user_email
    FROM verification_requests vr
    JOIN users u ON vr.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND vr.status = ?';
    params.push(status);
  }

  query += ' ORDER BY vr.applied_date DESC';

  db.all(query, params, (err, requests) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching requests', error: err.message });
    }
    res.json({ requests });
  });
});

// Get my verification request
app.get('/api/verification-requests/my', authMiddleware, (req, res) => {
  db.all(
    `SELECT * FROM verification_requests WHERE user_id = ? ORDER BY applied_date DESC`,
    [req.user.id],
    (err, requests) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching requests', error: err.message });
      }
      res.json({ requests });
    }
  );
});

// Update verification request status (admin only)
app.patch('/api/verification-requests/:id/status', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  db.get('SELECT user_id FROM verification_requests WHERE id = ?', [id], (err, request) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    db.run(
      'UPDATE verification_requests SET status = ? WHERE id = ?',
      [status, id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error updating request', error: err.message });
        }

        // If approved, update user verified status
        if (status === 'approved') {
          db.run('UPDATE users SET verified = 1 WHERE id = ?', [request.user_id]);
        }

        res.json({ message: `Verification request ${status}` });
      }
    );
  });
});

// ========== TIPSTERS ROUTES ==========

// Get all tipsters
app.get('/api/tipsters', (req, res) => {
  const { verified } = req.query;
  
  let query = `
    SELECT 
      u.id, u.name, u.bio, u.verified, u.followers_count,
      (SELECT COUNT(*) FROM tips WHERE tipster_id = u.id) as total_tips,
      (SELECT COUNT(*) FROM tips WHERE tipster_id = u.id AND status = 'won') as won_tips,
      (SELECT COUNT(*) FROM tips WHERE tipster_id = u.id AND status = 'lost') as lost_tips
    FROM users u
    WHERE u.role = 'tipster'
  `;
  const params = [];

  if (verified === 'true') {
    query += ' AND u.verified = 1';
  }

  query += ' ORDER BY u.verified DESC, u.followers_count DESC';

  db.all(query, params, (err, tipsters) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tipsters', error: err.message });
    }

    // Calculate win rates
    const tipstersWithStats = tipsters.map(t => {
      const total = t.total_tips || 0;
      const won = t.won_tips || 0;
      const winRate = total > 0 ? Math.round((won / total) * 100) : 0;
      
      return {
        ...t,
        verified: t.verified === 1,
        total_tips: total,
        won_tips: won,
        lost_tips: t.lost_tips || 0,
        win_rate: winRate
      };
    });

    res.json({ tipsters: tipstersWithStats });
  });
});

// Get tipster profile with recent tips
app.get('/api/tipsters/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT 
      u.id, u.name, u.bio, u.verified, u.followers_count,
      (SELECT COUNT(*) FROM tips WHERE tipster_id = u.id) as total_tips,
      (SELECT COUNT(*) FROM tips WHERE tipster_id = u.id AND status = 'won') as won_tips,
      (SELECT COUNT(*) FROM tips WHERE tipster_id = u.id AND status = 'lost') as lost_tips
    FROM users u
    WHERE u.id = ? AND u.role = 'tipster'`,
    [id],
    (err, tipster) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching tipster', error: err.message });
      }
      if (!tipster) {
        return res.status(404).json({ message: 'Tipster not found' });
      }

      const total = tipster.total_tips || 0;
      const won = tipster.won_tips || 0;
      const winRate = total > 0 ? Math.round((won / total) * 100) : 0;

      const tipsterWithStats = {
        ...tipster,
        verified: tipster.verified === 1,
        total_tips: total,
        won_tips: won,
        lost_tips: tipster.lost_tips || 0,
        win_rate: winRate
      };

      // Get recent tips
      db.all(
        `SELECT id, title, description, total_odds, status, created_at
         FROM tips
         WHERE tipster_id = ?
         ORDER BY created_at DESC
         LIMIT 10`,
        [id],
        (err, tips) => {
          if (err) {
            return res.status(500).json({ message: 'Error fetching tips', error: err.message });
          }

          res.json({
            tipster: {
              ...tipsterWithStats,
              recent_tips: tips
            }
          });
        }
      );
    }
  );
});

// ========== NOTIFICATIONS ROUTES ==========

// Get user notifications
app.get('/api/notifications', authMiddleware, (req, res) => {
  db.all(
    `SELECT * FROM notifications 
     WHERE user_id = ? OR user_id IS NULL
     ORDER BY created_at DESC
     LIMIT 50`,
    [req.user.id],
    (err, notifications) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching notifications', error: err.message });
      }
      res.json({ notifications });
    }
  );
});

// Mark notification as read
app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating notification', error: err.message });
      }
      res.json({ message: 'Notification marked as read' });
    }
  );
});

// Mark all notifications as read
app.post('/api/notifications/read-all', authMiddleware, (req, res) => {
  db.run(
    'UPDATE notifications SET is_read = 1 WHERE user_id = ? OR user_id IS NULL',
    [req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating notifications', error: err.message });
      }
      res.json({ message: 'All notifications marked as read' });
    }
  );
});

// ========== USER ROUTES ==========

// Get user profile
app.get('/api/users/profile', authMiddleware, (req, res) => {
  db.get(
    `SELECT id, name, email, phone, role, verified, bio, avatar, followers_count, created_at
     FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching profile', error: err.message });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({
        user: {
          ...user,
          verified: user.verified === 1
        }
      });
    }
  );
});

// Update user profile
app.patch('/api/users/profile', authMiddleware, (req, res) => {
  const { name, phone, bio } = req.body;
  
  db.run(
    'UPDATE users SET name = ?, phone = ?, bio = ? WHERE id = ?',
    [name, phone, bio, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating profile', error: err.message });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

// ========== PURCHASES / TIPS HISTORY ROUTES ==========

// Record a new purchase
app.post('/api/purchases', authMiddleware, (req, res) => {
  const { tip_id, amount, payment_method, transaction_id } = req.body;
  const user_id = req.user.id;

  // Check if already purchased
  db.get(
    'SELECT id FROM purchases WHERE user_id = ? AND tip_id = ?',
    [user_id, tip_id],
    (err, existing) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      if (existing) {
        return res.status(400).json({ message: 'You have already purchased this tip' });
      }

      const purchaseId = uuidv4();

      db.run(
        `INSERT INTO purchases (id, user_id, tip_id, amount, payment_method, transaction_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [purchaseId, user_id, tip_id, amount, payment_method || 'mpesa', transaction_id],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error recording purchase', error: err.message });
          }

          res.status(201).json({
            message: 'Purchase recorded successfully',
            purchase: { id: purchaseId, tip_id, amount }
          });
        }
      );
    }
  );
});

// Get user's purchase history with tip details
app.get('/api/purchases/my', authMiddleware, (req, res) => {
  const user_id = req.user.id;

  db.all(
    `SELECT 
      p.id as purchase_id,
      p.amount,
      p.payment_method,
      p.transaction_id,
      p.purchased_at,
      t.id as tip_id,
      t.title,
      t.description,
      t.total_odds,
      t.status as tip_status,
      u.name as tipster_name,
      u.verified as tipster_verified
    FROM purchases p
    JOIN tips t ON p.tip_id = t.id
    JOIN users u ON t.tipster_id = u.id
    WHERE p.user_id = ?
    ORDER BY p.purchased_at DESC`,
    [user_id],
    (err, purchases) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching purchases', error: err.message });
      }

      // Get booking codes for each tip
      const tipIds = purchases.map(p => p.tip_id);
      if (tipIds.length === 0) {
        return res.json({ purchases: [] });
      }

      const placeholders = tipIds.map(() => '?').join(',');
      db.all(
        `SELECT * FROM booking_codes WHERE tip_id IN (${placeholders})`,
        tipIds,
        (err, codes) => {
          if (err) {
            return res.status(500).json({ message: 'Error fetching booking codes', error: err.message });
          }

          const purchasesWithCodes = purchases.map(purchase => ({
            ...purchase,
            tipster_verified: purchase.tipster_verified === 1,
            booking_codes: codes.filter(c => c.tip_id === purchase.tip_id)
          }));

          res.json({ purchases: purchasesWithCodes });
        }
      );
    }
  );
});

// Check if user has purchased a specific tip
app.get('/api/purchases/check/:tip_id', authMiddleware, (req, res) => {
  const { tip_id } = req.params;
  const user_id = req.user.id;

  db.get(
    'SELECT * FROM purchases WHERE user_id = ? AND tip_id = ?',
    [user_id, tip_id],
    (err, purchase) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      res.json({ hasPurchased: !!purchase, purchase });
    }
  );
});

// Get all purchases (admin only)
app.get('/api/purchases', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  db.all(
    `SELECT 
      p.*,
      u.name as user_name,
      u.email as user_email,
      t.title as tip_title
    FROM purchases p
    JOIN users u ON p.user_id = u.id
    JOIN tips t ON p.tip_id = t.id
    ORDER BY p.purchased_at DESC`,
    [],
    (err, purchases) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching purchases', error: err.message });
      }
      res.json({ purchases });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
