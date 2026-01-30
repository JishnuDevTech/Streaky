# 🔥 COMPLETE FIREBASE SETUP GUIDE - STEP BY STEP

## ⚠️ IMPORTANT: Do This BEFORE Opening the App

### Step 1: Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `streaky-app` (or any name you want)
4. Click **Continue**
5. **Disable Google Analytics** (not needed) → Click **Create project**
6. Wait for project creation → Click **Continue**

---

### Step 2: Enable Authentication (2 minutes)

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"** button
3. Click on **"Sign-in method"** tab

**Enable Email/Password:**
4. Click **"Email/Password"**
5. Toggle **"Enable"** switch ON
6. Click **"Save"**

**Enable Google Sign-In:**
7. Click **"Google"**
8. Toggle **"Enable"** switch ON
9. Enter your email in "Project support email"
10. Click **"Save"**

---

### Step 3: Create Firestore Database (2 minutes)

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"** button
3. Select **"Start in test mode"** → Click **Next**
   (We'll add security rules later)
4. Choose your location (select closest to you) → Click **Enable**
5. Wait for database creation (30 seconds)

---

### Step 4: Add Security Rules (1 minute)

1. In Firestore Database, click **"Rules"** tab
2. **DELETE everything** in the editor
3. **Copy and paste this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /streaks/{streakId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click **"Publish"**

---

### Step 5: Get Firebase Config (3 minutes)

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If no apps exist, click the **web icon** `</>`
5. Enter app nickname: `Streaky Web`
6. **DO NOT** check "Firebase Hosting"
7. Click **"Register app"**

**You'll see something like this:**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "streaky-app-xxxxx.firebaseapp.com",
  projectId: "streaky-app-xxxxx",
  storageBucket: "streaky-app-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxx"
};
```

8. **COPY ALL OF THIS** (click the copy icon)

---

### Step 6: Add Authorized Domains (CRITICAL!)

1. Still in Firebase Console, click **"Authentication"**
2. Click **"Settings"** tab at the top
3. Scroll down to **"Authorized domains"**
4. You'll see `localhost` is already there
5. Click **"Add domain"**
6. Add: `127.0.0.1`
7. Click **"Add"**

**If deploying to web, also add:**
- Your actual domain (e.g., `streaky-app.web.app`)
- Without `https://` or `http://`

---

### Step 7: Update app.js with Your Config

1. Open `app.js` in a text editor
2. Find lines 3-9 (the firebaseConfig object)
3. **REPLACE the entire firebaseConfig with what you copied**

**Before:**
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    // ...
};
```

**After (with YOUR values):**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "streaky-app-xxxxx.firebaseapp.com",
    projectId: "streaky-app-xxxxx",
    storageBucket: "streaky-app-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:xxxxxxxxxxxxxxxx"
};
```

4. **Save the file**

---

### Step 8: Run the App

**Option A: Simple (just open the file)**
```bash
# Just double-click index.html
# or right-click → Open with → Chrome/Firefox
```

**Option B: Local Server (recommended)**
```bash
# Using Python
python3 -m http.server 8000
# or
python -m http.server 8000

# Then open: http://localhost:8000
```

**Option C: Using Node.js**
```bash
npx http-server
# Then open: http://localhost:8080
```

---

## ✅ Verification Checklist

After completing all steps:

- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Google authentication enabled (with support email)
- [ ] Firestore database created in test mode
- [ ] Security rules published
- [ ] Web app registered
- [ ] `127.0.0.1` added to authorized domains
- [ ] Firebase config copied to app.js
- [ ] app.js saved

---

## 🧪 Testing the Setup

### 1. Open Browser Console (F12)

You should see:
```
🔥 Initializing Firebase...
✅ Firebase initialized
📱 Getting DOM elements...
✅ DOM elements loaded
```

**If you see errors about Firebase config:**
- You didn't replace the config correctly
- Check that all values start with your actual values, not "YOUR_"

### 2. Test Signup

1. Click **"Create New Account"**
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm: test123
3. Click **"Create Account"**

**Expected:**
- Green success message: "✅ Account created successfully!"
- Returns to login screen
- Email is pre-filled

**If you get errors:**
- "Email already in use" = Account already exists, just sign in
- "Weak password" = Use at least 6 characters
- Permission denied = Check Firestore rules

### 3. Test Login

1. Enter email: test@example.com
2. Enter password: test123
3. Click **"Sign In"**

**Expected:**
- Dashboard loads
- You see "Quick Start" predefined streaks
- You see "Active Streaks" section (empty at first)

### 4. Test Creating Streak

1. Click any predefined streak (e.g., "Daily Coding")
2. A new streak card should appear
3. Click **"+ Mark Complete"**
4. Current streak should increase to 1

---

## 🐛 Common Errors and Solutions

### Error: "auth/invalid-credential"
**Cause:** Wrong email/password OR account doesn't exist
**Solution:** 
- Create account first (don't skip signup)
- Use correct password
- Check Firebase console → Authentication → Users to see if account exists

### Error: "domain is not authorized"
**Cause:** `127.0.0.1` not in authorized domains
**Solution:**
- Firebase Console → Authentication → Settings → Authorized domains
- Click "Add domain" → Enter `127.0.0.1` → Save

### Error: "popup-blocked"
**Cause:** Browser blocking Google sign-in popup
**Solution:**
- Allow popups for localhost/127.0.0.1 in browser settings
- Or use Email/Password instead

### Error: "permission-denied" in Firestore
**Cause:** Security rules not set correctly
**Solution:**
- Firebase Console → Firestore Database → Rules
- Copy rules from Step 4 above
- Click "Publish"

### Error: Password toggle not working
**Cause:** JavaScript not loaded
**Solution:**
- Check browser console for errors
- Make sure app.js is in same folder as index.html
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Nothing shows up / blank screen
**Cause:** CSS not loaded
**Solution:**
- Make sure style.css is in same folder as index.html
- Check browser console for 404 errors
- Hard refresh

---

## 📁 File Structure Check

Make sure you have these files in the SAME folder:
```
streaky/
├── index.html
├── style.css
├── app.js
├── README.md
└── FIRESTORE_RULES.txt (optional)
```

---

## 🎯 Quick Test Script

Run this in browser console after opening the app:

```javascript
// Check if Firebase is loaded
console.log('Firebase loaded:', typeof firebase !== 'undefined');

// Check if config is set
console.log('Auth domain:', firebase.app().options.authDomain);

// Should NOT show "YOUR_PROJECT_ID"
```

If you see "YOUR_PROJECT_ID", you haven't replaced the config!

---

## 🚀 You're Done!

If everything is working:
- ✅ You can create an account
- ✅ You can sign in
- ✅ Dashboard loads
- ✅ Streaks are saved
- ✅ No console errors

**Now enjoy using Streaky! 🔥**

---

## 💬 Still Having Issues?

1. **Check browser console** (F12) for specific errors
2. **Check Firebase Console** → Authentication → Users (any users created?)
3. **Check Firebase Console** → Firestore Database → Data (any streaks saved?)
4. **Try in incognito mode** (rules out browser extensions)
5. **Try different browser** (Chrome recommended)
6. **Check firebaseConfig** - make sure ALL values are replaced

---

## 📞 Support Checklist

If asking for help, provide:
1. Browser console screenshot (all errors)
2. Firebase Console screenshot (Authentication enabled?)
3. First line of firebaseConfig from app.js (hide sensitive parts)
4. What step you're stuck on
5. What you've already tried

---

**Made with 🔥 by Streaky Team**