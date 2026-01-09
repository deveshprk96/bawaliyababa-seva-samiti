const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Check if credentials.json exists, otherwise use in-memory DB
let db;
if (fs.existsSync('./credentials.json')) {
  db = require('./googleSheetsDB');
} else {
  console.log('⚠️  credentials.json not found - Running in DEMO MODE');
  db = require('./inMemoryDB');
}

const { isWithinRadius } = require('./utils');
const whatsappService = require('./whatsappService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Auth middleware for protected routes
const checkAuth = (req, res, next) => {
  const { username, password } = req.headers;
  if (username !== process.env.VENDOR_USERNAME || password !== process.env.VENDOR_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Initialize database
let isDbReady = false;
db.initialize().then(() => {
  isDbReady = true;
  // Setup sheets structure on first run (commented out since sheets are manually created)
  // db.setupSheets();
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Routes

// Home - Customer booking page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Vendor admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API: Get vendor settings (for location check)
app.get('/api/vendor-settings', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const settings = await db.getVendorSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get page customization
app.get('/api/page-customization', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const customization = await db.getPageCustomization();
    res.json(customization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Update page customization (admin only)
app.post('/api/page-customization', checkAuth, async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    await db.updatePageCustomization(req.body);
    res.json({ success: true, message: 'Page customization updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Update vendor settings (admin only)
app.post('/api/vendor-settings', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    
    // Simple auth check
    const { username, password } = req.headers;
    if (username !== process.env.VENDOR_USERNAME || password !== process.env.VENDOR_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await db.updateVendorSettings(req.body);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Verify location
app.post('/api/verify-location', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }

    const { latitude, longitude } = req.body;
    const settings = await db.getVendorSettings();
    
    const result = isWithinRadius(
      latitude,
      longitude,
      settings.latitude,
      settings.longitude,
      settings.radiusMeters
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Book appointment
app.post('/api/book-appointment', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }

    const { customerName, customerPhone, customerEmail, customerLat, customerLng, notes } = req.body;

    // Verify location
    const settings = await db.getVendorSettings();
    const locationCheck = isWithinRadius(
      customerLat,
      customerLng,
      settings.latitude,
      settings.longitude,
      settings.radiusMeters
    );

    if (!locationCheck.allowed) {
      return res.status(400).json({
        error: 'You are too far from our location',
        distance: locationCheck.distance,
        maxDistance: locationCheck.radius
      });
    }

    // Book appointment
    const result = await db.addAppointment({
      customerName,
      customerPhone,
      customerEmail,
      customerLat,
      customerLng,
      notes
    });

    // Get queue position
    const appointments = await db.getAppointments();
    const waitingAppointments = appointments.filter(a => a.status === 'waiting');
    const queuePosition = waitingAppointments.length;
    const peopleAhead = queuePosition - 1;

    // Send WhatsApp confirmation if enabled
    let whatsappSent = false;
    if (whatsappService.isEnabled() && customerPhone) {
      const message = whatsappService.formatBookingConfirmation({
        customerName,
        queuePosition,
        peopleAhead,
        businessName: settings.businessName
      });
      
      const whatsappResult = await whatsappService.sendWhatsAppMessage(customerPhone, message);
      whatsappSent = whatsappResult.sent;
    }

    res.json({
      ...result,
      queuePosition,
      peopleAhead,
      whatsappSent,
      businessName: settings.businessName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get all appointments (admin only)
app.get('/api/appointments', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }

    // Simple auth check
    const { username, password } = req.headers;
    if (username !== process.env.VENDOR_USERNAME || password !== process.env.VENDOR_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appointments = await db.getAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Start appointment (admin only)
app.post('/api/appointments/:id/start', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }

    // Simple auth check
    const { username, password } = req.headers;
    if (username !== process.env.VENDOR_USERNAME || password !== process.env.VENDOR_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const startTime = new Date().toISOString();
    await db.updateAppointmentStatus(req.params.id, 'in-progress', startTime, '');
    res.json({ success: true, message: 'Appointment started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Complete appointment (admin only)
app.post('/api/appointments/:id/complete', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }

    // Simple auth check
    const { username, password } = req.headers;
    if (username !== process.env.VENDOR_USERNAME || password !== process.env.VENDOR_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const endTime = new Date().toISOString();
    
    // Get current appointment to preserve start time
    const appointments = await db.getAppointments();
    const appointment = appointments.find(a => a.id == req.params.id);
    
    await db.updateAppointmentStatus(
      req.params.id,
      'completed',
      appointment?.startTime || '',
      endTime
    );
    
    res.json({ success: true, message: 'Appointment completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Vendor login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === process.env.VENDOR_USERNAME && password === process.env.VENDOR_PASSWORD) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// API: Get gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const gallery = await db.getGallery();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get seva services
app.get('/api/seva-services', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const services = await db.getSevaServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get contributors
app.get('/api/contributors', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const contributors = await db.getContributors();
    res.json(contributors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get stats
app.get('/api/stats', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get services
app.get('/api/services', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const services = await db.getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Get expenses
app.get('/api/expenses', async (req, res) => {
  try {
    if (!isDbReady) {
      return res.status(503).json({ error: 'Database not ready' });
    }
    const expenses = await db.getExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD API Endpoints for Admin Panel
// Note: These endpoints directly append to Google Sheets
// For edit/delete, you'll need to manually update in Google Sheets

// Add new gallery item
app.post('/api/admin/gallery', checkAuth, async (req, res) => {
  try {
    const { imageUrl, caption, category } = req.body;
    await db.addToSheet('GalleryImages', [imageUrl, caption, category]);
    res.json({ success: true, message: 'Gallery item added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new seva package
app.post('/api/admin/sevaPackages', checkAuth, async (req, res) => {
  try {
    const { sevaName, description, amount, imageUrl, category } = req.body;
    await db.addToSheet('SevaPackages', [sevaName, description, amount, imageUrl, category]);
    res.json({ success: true, message: 'Seva package added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new contributor
app.post('/api/admin/contributors', checkAuth, async (req, res) => {
  try {
    const { name, amount, timestamp, message } = req.body;
    await db.addToSheet('Contributors', [name, amount, timestamp, message]);
    res.json({ success: true, message: 'Contributor added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new statistic
app.post('/api/admin/statistics', checkAuth, async (req, res) => {
  try {
    const { statName, count } = req.body;
    await db.addToSheet('Statistics', [statName, count]);
    res.json({ success: true, message: 'Statistic added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new service
app.post('/api/admin/services', checkAuth, async (req, res) => {
  try {
    const { serviceName, shortDescription, longDescription, iconImageUrl } = req.body;
    await db.addToSheet('Services', [serviceName, shortDescription, longDescription, iconImageUrl]);
    res.json({ success: true, message: 'Service added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
app.post('/api/admin/expenses', checkAuth, async (req, res) => {
  try {
    const { materialItem, quantity, pricePerUnit, totalAmount } = req.body;
    await db.addToSheet('ExpenseBreakdown', [materialItem, quantity, pricePerUnit, totalAmount]);
    res.json({ success: true, message: 'Expense added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE endpoints for admin panel
app.delete('/api/admin/gallery/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    await db.deleteFromSheet('GalleryImages', index);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/sevaPackages/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    await db.deleteFromSheet('SevaPackages', index);
    res.json({ success: true, message: 'Seva package deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/contributors/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    await db.deleteFromSheet('Contributors', index);
    res.json({ success: true, message: 'Contributor deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/statistics/:name', checkAuth, async (req, res) => {
  try {
    const name = req.params.name;
    // Get all statistics
    const response = await db.sheets.spreadsheets.values.get({
      spreadsheetId: db.spreadsheetId,
      range: 'Statistics!A2:B',
    });
    
    const rows = response.data.values || [];
    const index = rows.findIndex(row => row[0] === name);
    
    if (index !== -1) {
      await db.deleteFromSheet('Statistics', index);
      res.json({ success: true, message: 'Statistic deleted' });
    } else {
      res.status(404).json({ error: 'Statistic not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/services/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    await db.deleteFromSheet('Services', index);
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/expenses/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    await db.deleteFromSheet('ExpenseBreakdown', index);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoints for editing (update existing items)
app.put('/api/admin/gallery/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { imageUrl, caption, category } = req.body;
    await db.updateInSheet('GalleryImages', index, [imageUrl, caption, category]);
    res.json({ success: true, message: 'Gallery item updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/sevaPackages/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { sevaName, description, amount, imageUrl, category } = req.body;
    await db.updateInSheet('SevaPackages', index, [sevaName, description, amount, imageUrl, category]);
    res.json({ success: true, message: 'Seva package updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/contributors/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { name, amount, timestamp, message } = req.body;
    await db.updateInSheet('Contributors', index, [name, amount, timestamp, message]);
    res.json({ success: true, message: 'Contributor updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/statistics/:name', checkAuth, async (req, res) => {
  try {
    const oldName = req.params.name;
    const { statName, count } = req.body;
    
    // Get all statistics
    const response = await db.sheets.spreadsheets.values.get({
      spreadsheetId: db.spreadsheetId,
      range: 'Statistics!A2:B',
    });
    
    const rows = response.data.values || [];
    const index = rows.findIndex(row => row[0] === oldName);
    
    if (index !== -1) {
      await db.updateInSheet('Statistics', index, [statName, count]);
      res.json({ success: true, message: 'Statistic updated' });
    } else {
      res.status(404).json({ error: 'Statistic not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/services/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { serviceName, shortDescription, longDescription, iconImageUrl } = req.body;
    await db.updateInSheet('Services', index, [serviceName, shortDescription, longDescription, iconImageUrl]);
    res.json({ success: true, message: 'Service updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/expenses/:index', checkAuth, async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const { materialItem, quantity, pricePerUnit, totalAmount } = req.body;
    await db.updateInSheet('ExpenseBreakdown', index, [materialItem, quantity, pricePerUnit, totalAmount]);
    res.json({ success: true, message: 'Expense updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server (only in local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Customer page: http://localhost:${PORT}`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
  });
}

// Export for Vercel
module.exports = app;
