# 📊 Google Sheets Setup Guide for Bawaliya Seva Sansthan

## Your Google Sheet Structure

You need to create **7 sheets** in your Google Spreadsheet. Here's exactly what to add:

---

## Sheet 1: **Appointments** (Already exists)
**Purpose:** Store customer booking appointments

| Column A | Column B | Column C | Column D | Column E | Column F | Column G | Column H | Column I | Column J |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| Timestamp | Customer Name | Phone | Email | Latitude | Longitude | Status | Start Time | End Time | Notes |

**Note:** This is auto-filled by the system when customers book. No manual entry needed.

---

## Sheet 2: **Settings** (Already exists)
**Purpose:** Store business configuration

| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Business Name | Latitude | Longitude | Radius (meters) |
| Bawaliya Seva Sansthan | 28.7041 | 77.1025 | 500 |

**Example Row 2:**
```
Bawaliya Seva Sansthan    28.7041    77.1025    500
```

---

## Sheet 3: **Gallery** (NEW - You need to create this)
**Purpose:** Store cow shelter images for the image slider

### Header Row (Row 1):
| Column A | Column B |
|----------|----------|
| Image URL | Caption |

### Example Data (Row 2 onwards):
```
https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80    Cows resting in our shelter
https://images.unsplash.com/photo-1585116805642-02d8e02ef96c?w=1920&q=80    Daily care and feeding
https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80    Medical treatment in progress
https://images.unsplash.com/photo-1600965962102-9d260a71890d?w=1920&q=80    Happy and healthy cows
```

**How to add your own images:**
1. Upload photos to Google Drive or Imgur
2. Get the public link
3. Paste in Column A
4. Add description in Column B

---

## Sheet 4: **DonationPackages** (NEW - You need to create this)
**Purpose:** Different seva packages customers can choose from

### Header Row (Row 1):
| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| Title | Description | Amount | Image URL | Benefits |

### Example Data (Row 2 onwards):
```
First Roti for Cow    Offer the first roti of the day to sacred cows    ₹100    https://example.com/roti.jpg    Get blessings of Gau Mata

Adopt Cow for 1 Month    Take care of one cow for entire month    ₹7500    https://example.com/cow.jpg    Monthly updates, photos, 80G certificate

Nandi Seva    Special seva for Nandi    ₹500    https://example.com/nandi.jpg    Receive prasad, blessings

Cow Treatment Seva    Help treat injured or sick cows    ₹2000    https://example.com/treatment.jpg    Save a life, earn punya

Feed 20 Cows    Provide fresh fodder for 20 cows    ₹1500    https://example.com/feed.jpg    Feed multiple cows daily

Green Fodder Seva    Provide fresh green grass    ₹800    https://example.com/fodder.jpg    Nutritious meals for cows
```

---

## Sheet 5: **RecentDonors** (NEW - You need to create this)
**Purpose:** Show recent contributors on the website

### Header Row (Row 1):
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Name | Amount | Timestamp | Message |

### Example Data (Row 2 onwards):
```
Sonam Bhavnani    ₹511    2024-12-10 10:30 AM    
Anirudh Maan    ₹101    2024-12-10 09:15 AM    For Gau Seva
Uma Sharma    ₹541    2024-12-10 08:45 AM    
Vinayak Ramakant    ₹112    2024-12-10 07:20 AM    Blessed to serve
Ritik Patel    ₹110    2024-12-09 11:30 PM    
Deepa Vijay Joshi    ₹10001    2024-12-09 10:15 PM    In memory of my mother
```

**Note:** 
- Add new donors at the top (Row 2)
- The website shows the most recent ones first
- Message column is optional

---

## Sheet 6: **Statistics** (NEW - You need to create this)
**Purpose:** Display key numbers on the website

### Header Row (Row 1):
| Column A | Column B |
|----------|----------|
| Stat Name | Value |

### Required Data (Row 2 onwards):
```
totalCows    20000
underTreatment    1500
healed    13000
totalDonors    5000
amountRaised    2458626
goalAmount    10332530
```

**Update these numbers regularly!**
- `totalCows` - Total cows being served
- `underTreatment` - Cows currently under medical care
- `healed` - Cows that were treated and healed
- `totalDonors` - Number of people who donated
- `amountRaised` - Total money collected (in ₹)
- `goalAmount` - Your fundraising goal (in ₹)

---

## Sheet 7: **Services** (NEW - You need to create this)
**Purpose:** Gaushala welfare services information

### Header Row (Row 1):
| Column A | Column B | Column C | Column D |
|----------|----------|----------|----------|
| Title | Description | Image URL | Icon |

### Example Data (Row 2 onwards):
```
Nourish Cows    Fresh green fodder, dry fodder, concentrate feed delivered daily    https://example.com/fodder.jpg    🌾

Cow Care    Daily health monitoring, veterinary checkups, and loving care    https://example.com/care.jpg    🏥

Cow Treatment    Emergency medical treatment, surgery, and medicines for sick cows    https://example.com/treatment.jpg    💊

Cow Protection    Safe shelter, clean water, and protection from harsh weather    https://example.com/shelter.jpg    🏠
```

---

## 🎨 How to Get Image URLs

### Option 1: Google Drive (Recommended)
1. Upload image to Google Drive
2. Right-click → Share → Change to "Anyone with the link"
3. Copy link
4. Change: `https://drive.google.com/file/d/FILE_ID/view` 
   To: `https://drive.google.com/uc?export=view&id=FILE_ID`

### Option 2: Imgur
1. Go to imgur.com
2. Upload image
3. Right-click on image → Copy image address
4. Use that URL

### Option 3: Use placeholder images
- For testing, use Unsplash URLs provided in examples above

---

## 📝 Quick Checklist

- [ ] Created "Gallery" sheet with at least 4 images
- [ ] Created "DonationPackages" sheet with seva packages
- [ ] Created "RecentDonors" sheet (can start empty)
- [ ] Created "Statistics" sheet with all 6 stats
- [ ] Created "Services" sheet with 4 services
- [ ] Updated business name in "Settings" sheet
- [ ] Updated location (Latitude/Longitude) in "Settings"
- [ ] Shared the entire spreadsheet with your service account email

---

## 🔄 How to Update

### Adding New Donor:
1. Open "RecentDonors" sheet
2. Insert new row at Row 2 (right-click Row 2 → Insert 1 above)
3. Fill in: Name, Amount, Current date/time, Optional message

### Updating Statistics:
1. Open "Statistics" sheet
2. Change the values in Column B
3. Save (auto-saves)
4. Refresh your website to see changes

### Adding New Seva Package:
1. Open "DonationPackages" sheet
2. Add new row at the bottom
3. Fill all 5 columns
4. Save

### Changing Gallery Images:
1. Open "Gallery" sheet
2. Replace image URLs
3. Update captions
4. Save

---

## ✅ Testing

After setting up all sheets:
1. Restart your server: `npm start`
2. Visit: http://localhost:3000
3. You should see:
   - ✅ Gallery slider with your images
   - ✅ Statistics numbers
   - ✅ Seva packages cards
   - ✅ Recent donors list
   - ✅ Services information

---

## 🆘 Troubleshooting

**Images not showing?**
- Check if image URLs are publicly accessible
- Try opening the URL in incognito browser
- Make sure Google Drive images are shared publicly

**Data not updating?**
- Verify sheet names are EXACTLY as mentioned (case-sensitive)
- Check column order matches the guide
- Restart your server after adding sheets

**Empty sections on website?**
- Make sure you have at least Row 2 with data in each sheet
- Header row (Row 1) should match exactly

---

## 📞 Need Help?

If you're stuck, check:
1. All 7 sheets exist with correct names
2. Header rows (Row 1) match exactly
3. At least one data row (Row 2) exists in each sheet
4. Service account has Editor access to the spreadsheet

---

**Your spreadsheet should have these sheets:**
1. Appointments ✓
2. Settings ✓
3. Gallery ← Create this
4. DonationPackages ← Create this
5. RecentDonors ← Create this
6. Statistics ← Create this
7. Services ← Create this

Once all sheets are created and filled with data, the website will automatically load and display everything beautifully!
