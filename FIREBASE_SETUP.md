# Firebase Setup Guide

## Firestore Security Rules Setup

### Problem
You're getting "Missing or insufficient permissions" because Firestore security rules aren't configured.

### Solution

#### Step 1: Install Firebase CLI (if not already installed)
```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase
```bash
firebase login
```

#### Step 3: Initialize Firebase in your project (if not done)
```bash
firebase init firestore
```

#### Step 4: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

This will deploy the `firestore.rules` file to your Firebase project.

---

## Create Admin Allowlist Document

After deploying the rules, you need to create an `admin/allowlist` document in Firestore:

### Option 1: Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click **+ Start collection**
5. Collection ID: `admin`
6. Document ID: `allowlist`
7. Add field:
   - Field name: `uids`
   - Type: `Array`
   - Value: Add your Firebase UID (from the error message)
   - Example: `["RyTrbyMwS6gNkKPlzAyNRgGIxqo1"]`

### Option 2: Firebase Admin SDK Script
Create `setup-firestore.js`:
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function setupAllowlist() {
  await db.collection('admin').doc('allowlist').set({
    uids: ['RyTrbyMwS6gNkKPlzAyNRgGIxqo1']
  });
  console.log('Allowlist created!');
  process.exit(0);
}

setupAllowlist();
```

Then run:
```bash
node setup-firestore.js
```

---

## Troubleshooting

**Still getting permission errors?**
1. Make sure `admin/allowlist` document exists with your UID in the array
2. Verify your Firebase project ID matches in `src/config/firebase.js`
3. Check that you're logged in with the correct Firebase account
4. Try logging out and logging back in: `firebase logout && firebase login`

**Rules not updating?**
1. Wait a few seconds after deployment
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the deploy output for any errors
