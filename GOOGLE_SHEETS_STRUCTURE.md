# 📊 Google Sheets Setup Guide for Bawaliya Seva Sansthan

## 🎯 Complete Sheet Structure

You need to create **7 sheets** in your Google Spreadsheet. Here's the complete structure:

---

## Sheet 1: **Appointments**
*(Already exists - for booking appointments)*

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| Timestamp | Customer Name | Phone | Email | Latitude | Longitude | Status | Start Time | End Time | Notes |

**Example Data:**
```
2024-12-10 10:30:00 | Rajesh Kumar | +919876543210 | rajesh@email.com | 28.6139 | 77.2090 | waiting | | | First time visitor
```

---

## Sheet 2: **Settings**
*(Already exists - for vendor settings)*

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Business Name | Latitude | Longitude | Radius (meters) |

**Example Data:**
```
Bawaliya Seva Sansthan | 28.6139 | 77.2090 | 500
```

---

## Sheet 3: **SevaPackages**
*(Seva donation packages like First Roti, Adopt Cow, etc.)*

| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| Seva Name | Description | Amount | Image URL | Category |

**Example Data:**
```
First Roti for Cow | पहली रोटी गाय के नाम - Offer first roti to holy cows | 51 | https://example.com/roti.jpg | Daily Seva
Adopt Cow for 1 Month | Sponsor complete care of one cow for a month | 2500 | https://example.com/adopt-cow.jpg | Monthly Seva
Nandi Seva | Special seva for Nandi bulls | 501 | https://example.com/nandi.jpg | Special Seva
Cow Treatment Seva | Medical treatment and care for sick cows | 1000 | https://example.com/treatment.jpg | Medical
Cow Shed Seva | Help build shelter for cows | 5000 | https://example.com/shed.jpg | Infrastructure
Feed 20 Cows | Provide food for 20 cows for one day | 1500 | https://example.com/feed.jpg | Daily Seva
Adopt Calf for 1 Month | Sponsor complete care of one calf | 1800 | https://example.com/calf.jpg | Monthly Seva
Medicines Kit for Cows | Essential medicines for cow healthcare | 3000 | https://example.com/medicine.jpg | Medical
Green Fodder Seva | Fresh green fodder for healthy nutrition | 750 | https://example.com/fodder.jpg | Daily Seva
```

---

## Sheet 4: **Contributors**
*(Recent donations/contributors)*

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Donor Name | Amount | Timestamp | Message |

**Example Data:**
```
Sonam Bhavnani | 511 | 2024-12-10 09:30:00 | Jai Shree Krishna
Anirudh Maan | 101 | 2024-12-10 06:45:00 | For cow welfare
Uma | 541 | 2024-12-10 06:20:00 | Radhe Radhe
Vinayak Ramakant Shastri | 112 | 2024-12-10 05:15:00 | Gau Mata ki jai
Ritik | 110 | 2024-12-09 14:30:00 | Om Namah Shivaya
Hymavathi Yellawar | 110 | 2024-12-09 16:25:00 | Blessings for family
Vimal Sharma | 103 | 2024-12-09 15:40:00 | Nandi seva
sumeru gebise | 1021 | 2024-12-09 04:50:00 | Happy to help
Deepa Vijay Joshi | 10001 | 2024-12-09 04:25:00 | For gaushala development
Ankur Singh | 110 | 2024-12-08 18:45:00 | Jai Gau Mata
```

---

## Sheet 5: **GalleryImages**
*(Gallery photos of gaushala, cows, seva activities)*

| Column A | Column B | Column C |
|----------|----------|----------|
| Image URL | Caption | Category |

**Example Data:**
```
https://example.com/cow1.jpg | Our beautiful indigenous cows | Cows
https://example.com/shelter1.jpg | Clean and spacious cow shelter | Shelter
https://example.com/feeding1.jpg | Daily feeding seva | Activities
https://example.com/treatment1.jpg | Medical care for cows | Medical
https://example.com/cow2.jpg | Happy and healthy cows | Cows
https://example.com/volunteers1.jpg | Our dedicated volunteers | Team
https://example.com/shelter2.jpg | Indoor resting area | Shelter
https://example.com/fodder1.jpg | Fresh green fodder | Food
```

---

## Sheet 6: **Services**
*(Gaushala welfare services with details)*

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Service Name | Short Description | Long Description | Icon/Image URL |

**Example Data:**
```
Nourish Cows | Fresh green fodder daily | We provide fresh green fodder, hay, and nutritious feed to ensure our cows stay healthy and strong. Our feeding program includes seasonal vegetables and natural supplements. | https://example.com/nourish.jpg
Cow Care | Regular health checkups | Daily monitoring by trained staff, regular veterinary visits, vaccination programs, and preventive healthcare measures to keep all cows disease-free. | https://example.com/care.jpg
Cow Treatment | Medical emergency services | 24/7 emergency medical care, surgery facilities, medicines, and specialized treatment for injured or sick cows by qualified veterinarians. | https://example.com/treatment-service.jpg
Cow Protection Services | Safe shelter and security | Providing safe, clean, and comfortable shelter with proper ventilation, protection from weather, and round-the-clock security for all cows. | https://example.com/protection.jpg
```

---

## Sheet 7: **Statistics**
*(Impact numbers - cows served, treated, healed)*

| Column A | Column B |
|----------|----------|
| Stat Name | Count |

**Example Data:**
```
Serving with Love & Care | 20000
Under Treatment: Fighting for Life | 1500
Healed & Given a New Chance | 13000
Total Cows in Shelter | 500
Volunteers Active | 50
Daily Fodder (kg) | 5000
Monthly Medical Budget | 150000
Acres of Land | 25
```

---

## Sheet 8: **ExpenseBreakdown**
*(Where donations are spent - for transparency)*

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Material/Item | Quantity | Price Per Unit | Total Amount |

**Example Data:**
```
Shed Construction Material | 2000 | 650 | 1300000
Medical Kit | 2971 | 640 | 1901440
Green Fodder Bundle (100Kg) | 2971 | 500 | 1485500
Jaggery | 1981 | 600 | 1188600
Animal Calcium (10L) | 2476 | 500 | 1238000
Dry Fodder Bundle (45Kg) | 2476 | 540 | 1337040
Daliya | 1981 | 550 | 1089550
Sugar Cane Bundle | 1981 | 400 | 792400
Water Tank Maintenance | 50 | 5000 | 250000
Veterinary Services | 365 | 3000 | 1095000
Electricity Bills | 12 | 25000 | 300000
Staff Salaries | 15 | 15000 | 225000
```

---

## 🎨 How to Add Image URLs

Since you're using Google Sheets, you have a few options for images:

### Option 1: Use Google Drive
1. Upload images to Google Drive
2. Right-click image → Get link → Share → Anyone with link can view
3. Copy the link and use it in the sheet
4. Format: `https://drive.google.com/uc?id=FILE_ID`

### Option 2: Use Image Hosting Services (Recommended)
- **Imgur** (free): Upload → Copy direct link
- **ImgBB** (free): Upload → Copy direct link
- **Cloudinary** (free tier): Upload → Copy URL

### Option 3: Use Placeholder Images (For Testing)
Use these placeholder URLs:
- `https://via.placeholder.com/400x300/8B4513/FFFFFF?text=Cow+Image`
- `https://via.placeholder.com/400x300/A0522D/FFFFFF?text=Shelter`

---

## 📝 Quick Setup Checklist

- [ ] Create all 8 sheets in your Google Spreadsheet
- [ ] Add column headers (Row 1) for each sheet
- [ ] Add sample/real data (Row 2 onwards)
- [ ] Upload your images and get URLs
- [ ] Update image URLs in sheets
- [ ] Make sure Google Sheet is shared with your service account email: `bbss-685@bbss-480811.iam.gserviceaccount.com`
- [ ] Restart your server to load new data

---

## 🚀 After Setup

Once you add all this data, the website will automatically display:
- ✅ Gallery slider with your images
- ✅ Seva packages with donation options
- ✅ Recent contributors list
- ✅ Gaushala services cards
- ✅ Impact statistics
- ✅ Expense breakdown transparency section

**All data will be live and dynamically loaded from your Google Sheet!**

---

## 💡 Tips

1. **Keep URLs Clean**: Make sure image URLs don't have spaces or special characters
2. **Update Regularly**: You can update the sheet anytime, and it will reflect on the website
3. **Use INR Symbol**: You can use ₹ symbol in amounts if needed (₹1000)
4. **Add More Rows**: You can add unlimited rows - website will display all of them
5. **Categories**: Use consistent category names for better filtering

Need help with any specific sheet setup? Let me know!
