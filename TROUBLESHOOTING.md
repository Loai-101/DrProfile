# 🔧 Troubleshooting Guide

## 🚨 **Common Errors and Solutions**

### **Error: "Uncaught SyntaxError: Unexpected token '<'"**

This error occurs when the JavaScript bundle tries to load but receives HTML instead (usually a 404 error page).

#### **Solutions:**

##### **1. Clear Browser Cache**
- **Press Ctrl+Shift+R** (or Cmd+Shift+R on Mac) to hard refresh
- **Or clear browser cache** completely

##### **2. Restart Development Server**
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

##### **3. Rebuild the Project**
```bash
npm run build
npm start
```

##### **4. Check Port Availability**
- **Default port**: 3000
- **Alternative port**: 3001
- **If port is busy**: The server will automatically use the next available port

##### **5. Check File Paths**
- **Ensure all files are in correct locations**
- **Check that `src/index.js` exists**
- **Verify `public/index.html` exists**

##### **6. Update Dependencies**
```bash
npm install
npm start
```

### **Error: "Module not found"**

#### **Solutions:**
1. **Check import paths** in your components
2. **Ensure all dependencies are installed**: `npm install`
3. **Check file extensions** (.js, .jsx, .css)

### **Error: "Port already in use"**

#### **Solutions:**
1. **Kill the process using the port**:
   ```bash
   # Find process using port 3000
   netstat -ano | findstr :3000
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

2. **Use a different port**:
   ```bash
   npx webpack serve --mode development --port 3001
   ```

### **Error: "Build failed"**

#### **Solutions:**
1. **Check for syntax errors** in your code
2. **Ensure all imports are correct**
3. **Check webpack configuration**
4. **Clear node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## ✅ **Quick Fixes**

### **For Development Server Issues:**
```bash
# Stop server (Ctrl+C)
npm run build
npm start
```

### **For Build Issues:**
```bash
npm run build
```

### **For Dependency Issues:**
```bash
npm install
```

## 🔍 **Debugging Steps**

1. **Check browser console** for specific error messages
2. **Check terminal** for build errors
3. **Verify file paths** are correct
4. **Ensure all dependencies** are installed
5. **Check webpack configuration** is correct

## 📞 **If Issues Persist**

1. **Check the terminal output** for specific error messages
2. **Verify all files** are in the correct locations
3. **Ensure Node.js and npm** are up to date
4. **Try running** `npm install` again

---

**Most issues can be resolved by restarting the development server and clearing browser cache.**
