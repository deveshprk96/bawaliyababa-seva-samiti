const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

class GoogleSheetsDB {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  }

  async initialize() {
    try {
      // Load credentials from environment variable or file
      let credentials;
      
      if (process.env.GOOGLE_CREDENTIALS) {
        // Production: Read from environment variable
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      } else {
        // Development: Read from file
        credentials = JSON.parse(fs.readFileSync('./credentials.json'));
      }
      
      this.auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('✅ Google Sheets connected successfully');
    } catch (error) {
      console.error('❌ Error initializing Google Sheets:', error.message);
      throw error;
    }
  }

  // Get all appointments
  async getAppointments() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Appointments!A2:J',
      });

      const rows = response.data.values || [];
      return rows.map((row, index) => ({
        id: index + 2, // Row number (starting from 2)
        timestamp: row[0] || '',
        customerName: row[1] || '',
        customerPhone: row[2] || '',
        customerEmail: row[3] || '',
        customerLat: row[4] || '',
        customerLng: row[5] || '',
        status: row[6] || 'waiting', // waiting, in-progress, completed
        startTime: row[7] || '',
        endTime: row[8] || '',
        notes: row[9] || ''
      }));
    } catch (error) {
      console.error('Error getting appointments:', error);
      return [];
    }
  }

  // Add new appointment
  async addAppointment(data) {
    try {
      const timestamp = new Date().toISOString();
      const values = [[
        timestamp,
        data.customerName,
        data.customerPhone,
        data.customerEmail,
        data.customerLat,
        data.customerLng,
        'waiting',
        '',
        '',
        data.notes || ''
      ]];

      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Appointments!A:J',
        valueInputOption: 'RAW',
        resource: { values },
      });

      return { success: true, message: 'Appointment booked successfully!' };
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  }

  // Update appointment status
  async updateAppointmentStatus(rowId, status, startTime = '', endTime = '') {
    try {
      const range = `Appointments!G${rowId}:I${rowId}`;
      const values = [[status, startTime, endTime]];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: { values },
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  // Get vendor settings
  async getVendorSettings() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Settings!A2:D2',
      });

      const row = response.data.values?.[0] || [];
      return {
        businessName: row[0] || 'My Business',
        latitude: parseFloat(row[1]) || parseFloat(process.env.VENDOR_LATITUDE),
        longitude: parseFloat(row[2]) || parseFloat(process.env.VENDOR_LONGITUDE),
        radiusMeters: parseInt(row[3]) || parseInt(process.env.LOCATION_RADIUS_METERS)
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        businessName: 'My Business',
        latitude: parseFloat(process.env.VENDOR_LATITUDE),
        longitude: parseFloat(process.env.VENDOR_LONGITUDE),
        radiusMeters: parseInt(process.env.LOCATION_RADIUS_METERS)
      };
    }
  }

  // Get page customization settings
  async getPageCustomization() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'PageCustomization!A2:B1000',
      });

      const rows = response.data.values || [];
      const customization = {};
      rows.forEach(row => {
        if (row[0]) {
          try {
            customization[row[0]] = JSON.parse(row[1] || '{}');
          } catch (e) {
            customization[row[0]] = row[1] || '';
          }
        }
      });
      
      // Return default if empty
      if (Object.keys(customization).length === 0) {
        return this.getDefaultPageCustomization();
      }
      
      return customization;
    } catch (error) {
      console.error('Error getting page customization:', error);
      return this.getDefaultPageCustomization();
    }
  }

  // Update page customization
  async updatePageCustomization(customization) {
    try {
      const values = Object.entries(customization).map(([key, value]) => {
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : value;
        return [key, valueStr];
      });

      // Clear existing data first
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: 'PageCustomization!A2:B1000',
      });

      // Update with new values
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'PageCustomization!A2:B',
        valueInputOption: 'RAW',
        resource: { values },
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating page customization:', error);
      throw error;
    }
  }

  // Get default page customization
  getDefaultPageCustomization() {
    return {
      header: {
        logo: '🐄',
        title: 'Bawaliya Seva Sansthan',
        subtitle: 'Serving with devotion and care',
        navLinks: ['Home', 'Services', 'Gallery', 'Contributors']
      },
      hero: {
        mainHeading: '🙏 Gau Seva - A Sacred Service',
        quote: '"Whoever feeds the cow with grass and water every day derives the benefit equivalent to performing Ashwamedha Yajna. There is no doubt about this."',
        quoteSource: '- Brihat Parasara Smriti 5:26-27',
        sliderImages: [
          'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80',
          'https://images.unsplash.com/photo-1585116805642-02d8e02ef96c?w=1920&q=80',
          'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80',
          'https://images.unsplash.com/photo-1600965962102-9d260a71890d?w=1920&q=80'
        ],
        features: [
          { icon: '🌾', title: 'Fresh Fodder', description: 'Daily green grass & quality feed' },
          { icon: '🏥', title: 'Medical Care', description: 'Regular health checkups' },
          { icon: '🏠', title: 'Clean Shelter', description: 'Hygienic indoor & outdoor space' },
          { icon: '💧', title: 'Fresh Water', description: '24/7 clean water supply' }
        ]
      },
      booking: {
        title: '📅 Book Gau Poshana Seva',
        subtitle: 'Join us in this noble service',
        buttonText: 'Book Seva Appointment',
        floatingButtonText: 'Book Seva'
      },
      sections: {
        gallery: {
          enabled: true,
          title: 'Gallery',
          description: ''
        },
        services: {
          enabled: true,
          title: 'Gaushala Welfare Services',
          description: 'Support our Noble Cause to care for and Benefit Cows—Guardians of our Well-Being. Your Donation ensures Nutritious Meals, Vital Health Care, and a Loving Territory for these Gentle Beings.'
        },
        sevaOptions: {
          enabled: true,
          title: 'GAUSHALA SEVA'
        },
        stats: {
          enabled: true,
          title: 'A Mission of Love and Healing',
          description: 'Providing Care and Hope to Cows & Bulls—Together, We Can Make a Difference!'
        },
        contributors: {
          enabled: true,
          title: 'Respected Contributors'
        }
      },
      colors: {
        primary: '#1e3c72',
        secondary: '#2a5298',
        accent: '#667eea',
        background: '#f5f5f5'
      },
      fonts: {
        primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }
    };
  }

  // Update vendor settings
  async updateVendorSettings(settings) {
    try {
      const values = [[
        settings.businessName,
        settings.latitude,
        settings.longitude,
        settings.radiusMeters
      ]];

      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Settings!A2:D2',
        valueInputOption: 'RAW',
        resource: { values },
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Get gallery images
  async getGallery() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'GalleryImages!A2:C',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        imageUrl: row[0] || '',
        caption: row[1] || '',
        category: row[2] || ''
      }));
    } catch (error) {
      console.error('Error getting gallery images:', error);
      return [];
    }
  }

  // Get seva services (donation packages)
  async getSevaServices() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'SevaPackages!A2:F',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        sevaName: row[0] || '',
        description: row[1] || '',
        amount: row[2] || '',
        imageUrl: row[3] || '',
        category: row[4] || ''
      }));
    } catch (error) {
      console.error('Error getting seva services:', error);
      return [];
    }
  }

  // Get contributors (recent donors)
  async getContributors() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Contributors!A2:D',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        name: row[0] || '',
        amount: parseFloat(row[1]) || 0,
        timestamp: row[2] || '',
        message: row[3] || ''
      }));
    } catch (error) {
      console.error('Error getting contributors:', error);
      return [];
    }
  }

  // Get statistics
  async getStats() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Statistics!A2:B',
      });

      const rows = response.data.values || [];
      const stats = {};
      rows.forEach(row => {
        if (row[0]) {
          stats[row[0]] = row[1] || '0';
        }
      });
      return stats;
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalCows: '0',
        underTreatment: '0',
        healed: '0',
        totalDonors: '0',
        amountRaised: '0'
      };
    }
  }

  // Get services/welfare information
  async getServices() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'Services!A2:D',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        serviceName: row[0] || '',
        shortDescription: row[1] || '',
        longDescription: row[2] || '',
        iconImageUrl: row[3] || ''
      }));
    } catch (error) {
      console.error('Error getting services:', error);
      return [];
    }
  }

  // Get expense breakdown
  async getExpenses() {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: 'ExpenseBreakdown!A2:D',
      });

      const rows = response.data.values || [];
      return rows.map(row => ({
        materialItem: row[0] || '',
        quantity: parseFloat(row[1]) || 0,
        pricePerUnit: parseFloat(row[2]) || 0,
        totalAmount: parseFloat(row[3]) || 0
      }));
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  }

  // Generic method to add data to any sheet
  async addToSheet(sheetName, values) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        resource: { values: [values] },
      });

      return { success: true };
    } catch (error) {
      console.error(`Error adding to ${sheetName}:`, error);
      throw error;
    }
  }

  // Delete methods for admin panel
  async deleteFromSheet(sheetName, rowIndex) {
    try {
      // Get all data from the sheet
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z`,
      });

      const rows = response.data.values || [];
      
      // Remove the row at the specified index
      rows.splice(rowIndex, 1);

      // Clear all data (except header)
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z`,
      });

      // Write back the remaining data if any
      if (rows.length > 0) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${sheetName}!A2:Z`,
          valueInputOption: 'RAW',
          resource: { values: rows },
        });
      }

      return { success: true };
    } catch (error) {
      console.error(`Error deleting from ${sheetName}:`, error);
      throw error;
    }
  }

  async updateInSheet(sheetName, rowIndex, values) {
    try {
      // Get all data from the sheet
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z`,
      });

      const rows = response.data.values || [];
      
      // Update the row at the specified index
      if (rowIndex < rows.length) {
        rows[rowIndex] = values;
      }

      // Write back all data
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A2:Z`,
        valueInputOption: 'RAW',
        resource: { values: rows },
      });

      return { success: true };
    } catch (error) {
      console.error(`Error updating ${sheetName}:`, error);
      throw error;
    }
  }

  // Initialize sheet structure if needed
  async setupSheets() {
    try {
      // Create Appointments sheet header
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Appointments!A1:J1',
        valueInputOption: 'RAW',
        resource: {
          values: [[
            'Timestamp',
            'Customer Name',
            'Phone',
            'Email',
            'Latitude',
            'Longitude',
            'Status',
            'Start Time',
            'End Time',
            'Notes'
          ]]
        },
      });

      // Create Settings sheet header
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Settings!A1:D1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Business Name', 'Latitude', 'Longitude', 'Radius (meters)']]
        },
      });

      // Add default settings
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Settings!A2:D2',
        valueInputOption: 'RAW',
        resource: {
          values: [['Bawaliya Seva Sansthan', '37.7749', '-122.4194', '500']]
        },
      });

      // Create PageCustomization sheet header
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'PageCustomization!A1:B1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Setting Key', 'Setting Value (JSON)']]
        },
      });

      // Create Gallery sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Gallery!A1:C1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Image URL', 'Title', 'Description']]
        },
      });

      // Create SevaServices sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'SevaServices!A1:E1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Name', 'Description', 'Image URL', 'Amount', 'Active']]
        },
      });

      // Create Contributors sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Contributors!A1:D1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Timestamp', 'Name', 'Amount', 'Seva Type']]
        },
      });

      // Create Stats sheet
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Stats!A1:B1',
        valueInputOption: 'RAW',
        resource: {
          values: [['Label', 'Number']]
        },
      });

      console.log('✅ Sheets structure created successfully');
    } catch (error) {
      console.error('Error setting up sheets:', error);
    }
  }
}

module.exports = new GoogleSheetsDB();
