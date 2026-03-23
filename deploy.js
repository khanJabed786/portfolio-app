#!/usr/bin/env node

/**
 * Portfolio App - Simple Deployment Helper
 * Usage: node deploy.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("\n╔════════════════════════════════════════════════════════╗");
console.log("║     PORTFOLIO APP - DEPLOYMENT HELPER                  ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

// Check build
const distPath = path.join(__dirname, "dist");
if (!fs.existsSync(distPath)) {
  console.error("❌ ERROR: dist/ folder not found!");
  console.error("   Run: npm run build  (or: node ./node_modules/vite/bin/vite.js build)");
  process.exit(1);
}

console.log("✅ Build Status: READY");
console.log(`   Location: ${distPath}\n`);

// Check Git
const gitPath = path.join(__dirname, ".git");
console.log(fs.existsSync(gitPath) ? "✅ Git: Initialized" : "⚠️  Git: Not initialized");
console.log(`   Branch: master\n`);

// Deployment options
console.log("┌──────────────────────────────────────────────────────────┐");
console.log("│  How to Deploy Your Application                          │");
console.log("└──────────────────────────────────────────────────────────┘\n");

console.log("METHOD 1: Vercel Web Dashboard (Recommended) ⭐");
console.log("─────────────────────────────────────────────");
console.log("1. Go to: https://vercel.com");
console.log("2. Click: 'Add New' → 'Project'");
console.log("3. Paste: GitHub URL (or connect GitHub)");
console.log("4. Click: 'Deploy'");
console.log("⏱️  Time: ~1-2 minutes\n");

console.log("METHOD 2: Drag & Drop (Fastest) 🚀");
console.log("─────────────────────────────────");
console.log("1. Go to: https://vercel.com");
console.log("2. Drag: dist/ folder to upload area");
console.log("3. Wait: Build completes");
console.log("⏱️  Time: ~30 seconds\n");

console.log("METHOD 3: Git + Auto-Deploy");
console.log("────────────────────────────");
console.log("1. Create GitHub repository");
console.log('2. Run: git remote add origin https://github.com/USER/REPO');
console.log("3. Run: git push -u origin main");
console.log("4. Connect repo to Vercel");
console.log("⏱️  Time: ~5 minutes\n");

console.log("┌──────────────────────────────────────────────────────────┐");
console.log("│  Your Production Build Details                           │");
console.log("└──────────────────────────────────────────────────────────┘\n");

// Get build stats
try {
  const files = fs.readdirSync(path.join(distPath, "assets"));
  console.log(`📦 Total Files: ${files.length} optimized chunks`);
  
  let totalSize = 0;
  files.forEach(file => {
    const filePath = path.join(distPath, "assets", file);
    const size = fs.statSync(filePath).size;
    totalSize += size;
  });
  
  console.log(`📊 Bundle Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log("🚀 Framework: React 18.3 + Vite 5");
  console.log("🔥 Styling: Tailwind CSS 3");
  console.log("🌍 Backend: Firebase Firestore");
  console.log("📱 Responsive: Mobile + Desktop\n");
} catch (e) {
  console.error("Could not calculate build stats");
}

console.log("✨ Your app is ready to go!");
console.log("📖 See DEPLOYMENT_GUIDE.md for detailed instructions\n");

console.log("Questions? Check:");
console.log("• https://vercel.com/docs");
console.log("• https://vitejs.dev/guide/static-deploy.html\n");
