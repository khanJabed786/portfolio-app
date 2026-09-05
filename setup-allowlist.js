import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.join(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const envVars = {};

envContent.split("\n").forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...valueParts] = line.split("=");
    const value = valueParts.join("=").replace(/"/g, "");
    envVars[key.trim()] = value.trim();
  }
});

const firebaseConfig = {
  apiKey: envVars.VITE_FIREBASE_API_KEY,
  authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: envVars.VITE_FIREBASE_PROJECT_ID,
  storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: envVars.VITE_FIREBASE_APP_ID,
};

console.log("🔧 Firebase Config Loaded:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupAllowlist() {
  try {
    const YOUR_UID = "O9lkelJcUQVLjPQ8JS5vVJDCV9g2";
    
    await setDoc(doc(db, "admins", YOUR_UID), {
      uid: YOUR_UID,
      email: "javed.khan1foru@gmail.com",
      createdAt: new Date().toISOString()
    });
    
    console.log("✅ Admin allowlist created with UID:", YOUR_UID);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

setupAllowlist();
