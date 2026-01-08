# Quick Setup for Dynamic Page Customization

## 🚀 Quick Start (3 Steps)

### Step 1: Create PageCustomization Sheet in Google Sheets

1. Open your Google Spreadsheet (the one specified in your .env file)
2. Create a new sheet (tab) named exactly: **PageCustomization**
3. Add these headers in row 1:
   - Column A: `Setting Key`
   - Column B: `Setting Value (JSON)`

That's it! The system will automatically populate this sheet when you save customizations.

### Step 2: Access Admin Panel

1. Open: http://localhost:3000/admin
2. Login with your credentials (from .env file)
3. Click "🎨 Page Customization" in the sidebar

### Step 3: Customize & Save

1. Fill in your desired customizations:
   - Header details
   - Hero section content
   - Colors
   - Section visibility
2. Click "💾 Save Page Customization"
3. Open http://localhost:3000 to see your changes!

## 📋 What You Can Customize

### ✅ Header
- Logo emoji (🐄, 🕉️, ⭐, etc.)
- Organization name
- Tagline/subtitle

### ✅ Hero Section
- Main heading text
- Inspirational quote
- Quote attribution
- Background slider images (up to 4)
- 4 feature cards (icon, title, description each)

### ✅ Booking Form
- Form title
- Subtitle
- Button text
- Floating button text

### ✅ Sections (Show/Hide + Customize)
- Gallery Section
- Services Section
- Seva Options Section
- Statistics Section
- Contributors Section

### ✅ Colors
- Primary color (main brand color)
- Secondary color
- Accent color
- Background color

## 🎨 Example Customization

Try this to test:

**Header:**
- Logo: 🕉️
- Title: Your Custom Organization Name
- Subtitle: Serving humanity with love

**Colors:**
- Primary: #2C3E50 (Dark Blue)
- Secondary: #3498DB (Light Blue)
- Accent: #E74C3C (Red)
- Background: #ECF0F1 (Light Gray)

**Hero:**
- Main Heading: Welcome to Our Service
- Quote: "Service to mankind is service to God"
- Disable one section to test (uncheck Gallery)

Click Save and refresh the customer page!

## 🔧 Troubleshooting

**Problem: "PageCustomization sheet not found" error**
- Solution: Create the sheet manually in Google Sheets

**Problem: Changes not showing on customer page**
- Solution: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

**Problem: Colors not changing**
- Solution: Make sure to use valid hex colors (#RRGGBB format)

**Problem: Images not loading**
- Solution: Verify image URLs are publicly accessible and use HTTPS

## 📖 Full Documentation

See `CUSTOMIZATION_GUIDE.md` for complete details.

## ✨ Tips

1. **Save Often**: Click save after each major change
2. **Test Mobile**: Check how it looks on mobile devices
3. **Use Good Images**: Use high-quality images from free stock sites
4. **Readable Colors**: Ensure good contrast between text and background
5. **Consistent Branding**: Keep your color scheme consistent

## 🎯 Next Steps

1. ✅ Create PageCustomization sheet
2. ✅ Login to admin panel
3. ✅ Customize your page
4. ✅ Save and preview
5. ✅ Share with your team!

Your system is now fully dynamic and customizable! 🎉
