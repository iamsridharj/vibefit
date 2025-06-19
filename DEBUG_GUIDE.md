# 🐛 Vibefit Debugging Guide

Complete debugging ecosystem for Expo React Native development.

## 🚀 Quick Start Debugging

### 1. **For Expo Go (Physical Device)**
```bash
# Start development server
npm run start:dev

# Or use tunnel for remote debugging
npm run start:tunnel
```

### 2. **For Simulators/Emulators**
```bash
# iOS Simulator
npm run ios

# Android Emulator  
npm run android
```

## 🛠️ Debugging Methods

### **Method 1: Expo Go + Chrome DevTools** ⭐ (BEST FOR EXPO GO)

1. **Start Expo with tunnel:**
   ```bash
   npm run start:tunnel
   ```

2. **Connect your phone to Expo Go app**

3. **In your phone app, shake device** or use developer menu

4. **Select "Debug Remote JS"** ⚠️ This is the key option for Expo Go

5. **Chrome will open automatically** with debugger

### **Method 2: React DevTools** 

1. **Install React DevTools globally:**
   ```bash
   npm install -g react-devtools
   ```

2. **Start debugging:**
   ```bash
   npm run start:debug
   ```

3. **React DevTools will open** in separate window

### **Method 3: VS Code Debugging**

1. **Install React Native Tools extension**

2. **Open VS Code in project root**

3. **Go to Debug panel (Ctrl/Cmd+Shift+D)**

4. **Select "Debug in Expo Go"**

5. **Press F5 to start debugging**

### **Method 4: In-App Debug Panel**

```typescript
// In any component, access global debug helpers:
import { logger, DebugPanel } from '@/utils/debugger';

// Log different types
logger.info('User logged in', { userId: '123' });
logger.api('/api/login', 'POST', { email: 'test@test.com' });
logger.redux('LOGIN_SUCCESS', { user: userData });

// Show debug panel
DebugPanel.show(); // Shows last 10 logs
DebugPanel.showNetworkLogs(); // Shows API calls only
```

## 🔧 Debug Console Commands

When debugging, access these global commands in console:

```javascript
// View logs
logger.getLogs()

// Clear all logs  
logger.clearLogs()

// Export logs for sharing
logger.exportLogs()

// Performance monitoring
perf.start('api-call')
// ... your code ...
perf.end('api-call')

// Debug panels
debugPanel.show()
debugPanel.showNetworkLogs()
debugPanel.showReduxLogs()
```

## 📱 Device-Specific Instructions

### **iPhone (Expo Go)**
1. Download Expo Go from App Store
2. Scan QR code from terminal
3. Shake device → "Debug Remote JS"
4. Chrome opens with debugger

### **Android (Expo Go)**  
1. Download Expo Go from Play Store
2. Scan QR code from terminal
3. Shake device → "Debug Remote JS"
4. Chrome opens with debugger

### **iOS Simulator**
1. `npm run ios`
2. Cmd+D for developer menu
3. "Debug Remote JS"

### **Android Emulator**
1. `npm run android` 
2. Cmd+M for developer menu
3. "Debug Remote JS"

## 🌐 Network Debugging

### **API Calls**
```typescript
// All API calls are automatically logged
// Check Network tab in Chrome DevTools
// Or use: debugPanel.showNetworkLogs()
```

### **WebSocket Debugging**
```typescript
// WebSocket connections logged automatically
// Check console for WebSocket events:
// 🔌 WebSocket connected
// 📨 WebSocket message received
```

## 🔄 Redux Debugging

### **Redux DevTools**
1. Install Redux DevTools browser extension
2. Already configured in store
3. Open DevTools → Redux tab

### **Manual Redux Debugging**
```typescript
// All Redux actions are logged
// Check console or use:
debugPanel.showReduxLogs()

// Manual action logging:
logger.redux('CUSTOM_ACTION', payload);
```

## ⚡ Performance Debugging

### **Component Performance**
```typescript
import { PerformanceMonitor } from '@/utils/debugger';

const MyComponent = () => {
  useEffect(() => {
    PerformanceMonitor.start('component-mount');
    
    return () => {
      PerformanceMonitor.end('component-mount');
    };
  }, []);
};
```

### **API Performance**
```typescript
// Automatically measured for all API calls
// Check logs for response times
```

## 🚨 Common Issues & Solutions

### **"Remote Debugger not connecting"**
```bash
# Solution 1: Restart with clean cache
npm run clean

# Solution 2: Use tunnel mode
npm run start:tunnel

# Solution 3: Check network (both devices same WiFi)
```

### **"Hermes debugging not working"**
- **Expo Go doesn't support Hermes debugging**
- **Use "Debug Remote JS" instead**
- **For full Hermes debugging, use EAS development build**

### **"Breakpoints not hitting"**
- **Make sure "Debug Remote JS" is enabled**
- **Use VS Code React Native debugger**
- **Check source maps are working**

### **"Console.log not showing"**
```typescript
// Use enhanced logger instead:
import { logger } from '@/utils/debugger';
logger.info('This will show in console');
```

## 📋 Debug Checklist

**Before Debugging:**
- [ ] Expo development server running
- [ ] Device connected to same network
- [ ] "Debug Remote JS" enabled in app
- [ ] Chrome DevTools open

**For API Issues:**
- [ ] Check Network tab in DevTools
- [ ] Verify API endpoint URLs
- [ ] Check authentication headers
- [ ] Use `debugPanel.showNetworkLogs()`

**For Redux Issues:**
- [ ] Redux DevTools installed
- [ ] Check Redux tab in DevTools  
- [ ] Use `debugPanel.showReduxLogs()`

**For Performance Issues:**
- [ ] Use Performance tab in DevTools
- [ ] Enable performance monitoring
- [ ] Check for memory leaks

## 🔧 Advanced Debugging

### **Custom Debugging Panel**
```typescript
// Create custom debug overlay
import { DebugPanel } from '@/utils/debugger';

const DebugOverlay = () => {
  if (!__DEV__) return null;
  
  return (
    <View style={styles.debugOverlay}>
      <Button onPress={DebugPanel.show} title="Show Logs" />
      <Button onPress={logger.clearLogs} title="Clear" />
    </View>
  );
};
```

### **Remote Debugging Production Issues**
```typescript
// Use remote logging service
logger.error('Production error', {
  userId: user.id,
  action: 'login',
  error: error.message
});
```

## 📞 Getting Help

1. **Check this guide first**
2. **Search console for error messages**
3. **Export logs:** `logger.exportLogs()`
4. **Include device info, OS version, and steps to reproduce**

---

**Happy Debugging! 🐛➡️✨** 