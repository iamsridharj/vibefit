#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🐛 Setting up Vibefit debugging environment...\n");

// Check if required debugging packages are installed
const requiredPackages = [
  "react-devtools",
  "@react-native-community/cli-debugger-ui",
  "react-native-debugger-open",
];

console.log("📦 Checking debugging packages...");
requiredPackages.forEach((pkg) => {
  try {
    require.resolve(pkg);
    console.log(`✅ ${pkg} is installed`);
  } catch (error) {
    console.log(`❌ ${pkg} is missing`);
  }
});

// Check VS Code configuration
const vscodeDir = path.join(__dirname, "..", ".vscode");
const launchJsonPath = path.join(vscodeDir, "launch.json");
const settingsJsonPath = path.join(vscodeDir, "settings.json");

console.log("\n🔧 Checking VS Code configuration...");
if (fs.existsSync(launchJsonPath)) {
  console.log("✅ VS Code launch.json exists");
} else {
  console.log("❌ VS Code launch.json missing");
}

if (fs.existsSync(settingsJsonPath)) {
  console.log("✅ VS Code settings.json exists");
} else {
  console.log("❌ VS Code settings.json missing");
}

// Check app.json debugging configuration
const appJsonPath = path.join(__dirname, "..", "app.json");
console.log("\n📱 Checking app.json configuration...");
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
  if (appJson.expo.debuggerHost) {
    console.log("✅ Debugger host configured");
  } else {
    console.log("❌ Debugger host not configured");
  }
} else {
  console.log("❌ app.json not found");
}

// Check if debugging utilities exist
const debuggerUtilPath = path.join(__dirname, "..", "utils", "debugger.ts");
console.log("\n🛠️ Checking debugging utilities...");
if (fs.existsSync(debuggerUtilPath)) {
  console.log("✅ Debugging utilities exist");
} else {
  console.log("❌ Debugging utilities missing");
}

// Print debugging instructions
console.log("\n📋 DEBUGGING SETUP COMPLETE");
console.log("═".repeat(50));
console.log("\n🚀 To start debugging:");
console.log("1. Run: npm run start:tunnel");
console.log("2. Open Expo Go app on your phone");
console.log("3. Scan the QR code");
console.log('4. In the app, shake device → "Debug Remote JS"');
console.log("5. Chrome DevTools will open automatically");
console.log("\n🔍 Available debug commands in console:");
console.log("• logger.getLogs() - View all logs");
console.log("• debugPanel.show() - Show debug panel");
console.log("• debugPanel.showNetworkLogs() - Show API calls");
console.log("• debugPanel.showReduxLogs() - Show Redux actions");
console.log("\n📖 For detailed instructions, see: DEBUG_GUIDE.md");
console.log("\n✨ Happy debugging!");
