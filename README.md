# 📱 My Spending — Mobile Expense Tracker

A modern, fast, and privacy-first Progressive Web App (PWA) designed specifically for mobile phones to log expenditures on the go, track spending with date & time precision, and export full reports to CSV.

---

## 🌟 Key Features

1. **All 13 Custom Categories Pre-Configured**:
   - 🏠 **Rent**
   - ⚡ **Bills**
   - 🛒 **Groceries**
   - 🎓 **School**
   - ⛽ **Petrol**
   - 🔧 **Services**
   - 💊 **Medicine**
   - 🌐 **Pakistan**
   - 🚗 **Car Installment**
   - 🛍️ **Jeddah Groceries**
   - 👶 **Kids**
   - 💖 **Maria**
   - 🪪 **Iqama**

2. **Lightning-Fast Expenditure Entry**:
   - Tap amount with on-screen quick increment buttons (`+10`, `+50`, `+100`, `+500`, `Clear`) or mobile keypad (`inputmode="decimal"`).
   - One-tap category selection with distinct custom icons, glowing borders, and checkmarks.
   - Automatically records current **Date & Time** with seconds precision (with options for *Now*, *Yesterday*, or *Custom date & time* for backdating expenses).
   - Optional notes field for vendor names, item details, or memos.
   - Tactile feedback (haptic vibration on supported devices) and instant confirmation toast with an **Undo** button.

3. **Transaction History & Search**:
   - Grouped chronologically by day (*Today*, *Yesterday*, or formatted date) with daily spend totals.
   - Real-time search bar (by notes, category name, or amount).
   - Horizontal category filter chips to isolate specific expense categories (e.g., view only *Petrol* or *School*).
   - In-app **Edit** and **Delete** actions for any entry.

4. **Visual Analytics & Monthly Breakdown**:
   - Total spending for the active month.
   - Number of transactions and daily average burn rate.
   - Spending by category ranked from highest to lowest with visual percentage bars.

5. **RFC 4180 Compliant CSV Export**:
   - Instant 1-tap export of all transactions or filtered by timeframe (*All*, *This Month*, *Previous Month*).
   - Columns: `Date`, `Time`, `Category`, `Amount`, `Currency`, `Notes`, `Transaction_ID`.
   - **Native Mobile Share**: Uses the Web Share API (`navigator.share`) on iPhone/Android to directly send the CSV file to WhatsApp, email to yourself, or save to iCloud Drive / Google Drive / Files.
   - Automatic fallback to direct `.csv` file download.
   - Live CSV preview table directly in the app.

6. **100% Offline & Private**:
   - Runs completely offline without internet using Service Workers.
   - Data is stored securely in your browser's `localStorage`.
   - Full JSON **Backup & Restore** feature to safeguard your records or move them between phones.

7. **Customization**:
   - Default currency: **SAR (Saudi Riyal - ﷼)**, customizable to USD ($), PKR (₨), AED (د.إ), EUR (€), GBP (£), and more.
   - One-tap Dark Mode (OLED-optimized) / Light Mode toggle.

---

## 📲 How to Install as a Native App on Your Phone

### On iPhone (Safari):
1. Open the app link in **Safari**.
2. Tap the **Share** button (the square with an arrow pointing upward) in the bottom toolbar.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"** in the top right.
5. The **"My Spending"** icon will appear on your iPhone home screen and launches full screen without browser bars!

### On Android (Chrome):
1. Open the app link in **Google Chrome**.
2. Tap the **three-dot menu (⋮)** in the top right corner.
3. Tap **"Install App"** or **"Add to Home screen"**.
4. The app icon will be added to your home screen or app drawer.

---

## 💻 How to Run Locally

To run the app locally on your computer:

```bash
cd /Users/firstcity/GIT/my_spending
python3 -m http.server 3000
```

Then open your browser at:
```
http://localhost:3000
```

To access it on your phone over your local Wi-Fi network, find your computer's local IP address (e.g. `192.168.1.50`) and open:
```
http://192.168.1.50:3000
```

---

## 📁 Project Structure

```
my_spending/
├── index.html         # Accessible HTML5 structure with PWA meta tags
├── css/
│   └── style.css      # Modern mobile-first CSS with design tokens & dark/light themes
├── js/
│   └── app.js         # Reactive app controller (categories, storage, analytics, CSV export)
├── icons/
│   ├── icon-192.png   # PWA Home Screen icon (192x192)
│   └── icon-512.png   # High-resolution splash icon (512x512)
├── manifest.json      # Web App Manifest for mobile installation
├── sw.js              # Service Worker for offline caching
└── README.md          # Documentation and usage guide
```
