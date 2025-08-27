# Font Customization Feature

## Overview

The Font Customization feature allows users to personalize their coding experience by customizing font settings in the CodeSync collaborative code editor. Users can now set **global font settings** that apply to all files by default, and **per-file font settings** for individual files, providing maximum flexibility and personalization.

## Features

### 🌍 Global Font Settings
- **Default for all files** - Set once, applies to all files
- **Fallback system** - Used when individual files don't have specific settings
- **Persistent storage** - Saved to both localStorage and server
- **Easy management** - Centralized control for consistent experience

### 📄 Per-File Font Settings
- **Individual customization** - Different fonts for different files
- **File-specific preferences** - Perfect for different project types
- **Smart inheritance** - Files can use global settings or override them
- **Visual indicators** - Clear indication when files have custom settings

### 🎨 Font Family Selection
- **Consolas** - Default monospace font with excellent readability
- **Courier New** - Classic monospace font
- **Fira Code** - Programming font with ligatures
- **JetBrains Mono** - Modern programming font
- **Source Code Pro** - Adobe's open-source monospace font
- **Roboto Mono** - Google's monospace font
- **Ubuntu Mono** - Ubuntu's monospace font
- **Inconsolata** - Clean and readable monospace font
- **Monaco** - Apple's monospace font
- **Menlo** - Another Apple monospace font

### 📏 Font Size Control
- **Range**: 8px to 24px
- **Real-time preview** - See changes immediately
- **Precise control** - 1px increments for perfect sizing

### ⚖️ Font Weight Options
- **Normal** - Standard weight
- **Bold** - Emphasized text
- **Numeric weights** - 100 (Thin) to 900 (Black)
- **Flexible styling** - Perfect for different coding styles

### 📐 Advanced Typography
- **Line Height** - 1.0 to 3.0 (affects readability)
- **Letter Spacing** - -2px to 4px (affects character spacing)
- **Fine-tuned control** - 0.1 increments for precision

## How It Works

### Global vs Per-File Settings

1. **Global Settings (Default)**
   - Set once and apply to all files
   - Stored in user profile
   - Used as fallback for files without specific settings

2. **Per-File Settings (Optional)**
   - Override global settings for specific files
   - Stored with individual file metadata
   - Can be reset to use global settings

### Setting Management

```javascript
// Global settings (affects all files)
{
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 14,
  lineHeight: 1.5,
  fontWeight: 'normal',
  letterSpacing: 0
}

// Per-file settings (overrides global)
{
  fontFamily: 'Fira Code, "Courier New", monospace',
  fontSize: 16,
  lineHeight: 1.6,
  fontWeight: '500',
  letterSpacing: 0.5
}
```

## User Interface

### Font Settings Modal

The font settings modal provides an intuitive interface for managing both global and per-file settings:

#### Header
- Shows "Global Font Settings" or "Font Settings - [Filename]"
- Clear indication of current context

#### File-Specific Toggle
- Checkbox to enable/disable file-specific settings
- Visual feedback when file has custom settings
- Easy switching between global and file-specific modes

#### Settings Tabs
1. **General Tab**
   - Font Family selection with preview
   - Font Size slider (8-24px)
   - Font Weight dropdown

2. **Advanced Tab**
   - Line Height slider (1.0-3.0)
   - Letter Spacing slider (-2px to 4px)

#### Preview Section
- Real-time preview of current settings
- Sample code with applied typography
- Immediate visual feedback

#### Action Buttons
- **Apply Global to All Files** - Reset all files to global settings
- **Reset** - Reset current context to defaults
- **Save** - Apply and save current settings

## API Endpoints

### Global Font Settings

#### GET `/api/font/settings`
Retrieve user's global font settings

**Response:**
```json
{
  "success": true,
  "fontSettings": {
    "fontFamily": "Consolas, \"Courier New\", monospace",
    "fontSize": 14,
    "lineHeight": 1.5,
    "fontWeight": "normal",
    "letterSpacing": 0
  }
}
```

#### PUT `/api/font/settings`
Update user's global font settings

**Request Body:**
```json
{
  "fontFamily": "Fira Code, \"Courier New\", monospace",
  "fontSize": 16,
  "lineHeight": 1.6,
  "fontWeight": "500",
  "letterSpacing": 0.5
}
```

#### POST `/api/font/settings/reset`
Reset global font settings to defaults

### Per-File Font Settings

#### GET `/api/font/file/:fileId/settings`
Get font settings for a specific file

**Response:**
```json
{
  "success": true,
  "fontSettings": {
    "fontFamily": "JetBrains Mono, \"Courier New\", monospace",
    "fontSize": 15,
    "lineHeight": 1.7,
    "fontWeight": "600",
    "letterSpacing": 0.2
  },
  "isUsingGlobal": {
    "fontFamily": false,
    "fontSize": false,
    "lineHeight": false,
    "fontWeight": false,
    "letterSpacing": false
  }
}
```

#### PUT `/api/font/file/:fileId/settings`
Update font settings for a specific file

**Request Body:**
```json
{
  "fontFamily": "Source Code Pro, \"Courier New\", monospace",
  "fontSize": 14,
  "lineHeight": 1.5,
  "fontWeight": "normal",
  "letterSpacing": 0,
  "useGlobal": false
}
```

#### POST `/api/font/apply-global-to-all`
Apply global settings to all user files

**Response:**
```json
{
  "success": true,
  "message": "Global font settings applied to 15 files",
  "filesUpdated": 15
}
```

## Database Schema

### User Model (Global Settings)
```javascript
{
  profile: {
    fontSettings: {
      fontFamily: { type: String, default: 'Consolas, "Courier New", monospace' },
      fontSize: { type: Number, default: 14 },
      lineHeight: { type: Number, default: 1.5 },
      fontWeight: { type: String, default: 'normal' },
      letterSpacing: { type: Number, default: 0 }
    }
  }
}
```

### File Model (Per-File Settings)
```javascript
{
  fontSettings: {
    fontFamily: { type: String, default: null }, // null = use global
    fontSize: { type: Number, default: null },
    lineHeight: { type: Number, default: null },
    fontWeight: { type: String, default: null },
    letterSpacing: { type: Number, default: null }
  }
}
```

## Frontend Implementation

### FontContext
The `FontContext` manages both global and per-file font settings:

```javascript
const {
  // Global settings
  globalFontSettings,
  updateGlobalFontSettings,
  resetGlobalFontSettings,
  
  // Per-file settings
  currentFileId,
  setCurrentFile,
  fileFontSettings,
  updateFileFontSettings,
  
  // Utility functions
  getEffectiveFontSettings,
  getMonacoOptions,
  applyGlobalToAllFiles
} = useFont();
```

### Effective Settings Resolution
The system automatically resolves which settings to use:

1. **If file has specific settings**: Use file settings
2. **If file uses global settings**: Use global settings
3. **If no global settings**: Use defaults

```javascript
const getEffectiveFontSettings = () => {
  if (!currentFileId || !fileFontSettings[currentFileId]) {
    return globalFontSettings;
  }
  
  const fileSettings = fileFontSettings[currentFileId];
  const isUsingGlobal = fileSettings.isUsingGlobal;
  
  return {
    fontFamily: isUsingGlobal.fontFamily ? globalFontSettings.fontFamily : fileSettings.fontSettings.fontFamily,
    fontSize: isUsingGlobal.fontSize ? globalFontSettings.fontSize : fileSettings.fontSettings.fontSize,
    // ... other properties
  };
};
```

## Usage Examples

### Setting Global Font Settings
```javascript
// Set global font settings
await updateGlobalFontSettings({
  fontFamily: 'Fira Code, "Courier New", monospace',
  fontSize: 16,
  lineHeight: 1.6,
  fontWeight: '500',
  letterSpacing: 0.5
});
```

### Setting Per-File Font Settings
```javascript
// Set file-specific font settings
await updateFileFontSettings(fileId, {
  fontFamily: 'JetBrains Mono, "Courier New", monospace',
  fontSize: 15,
  lineHeight: 1.7,
  fontWeight: '600',
  letterSpacing: 0.2
}, false); // false = don't use global settings
```

### Resetting File to Global Settings
```javascript
// Reset file to use global settings
await updateFileFontSettings(fileId, {}, true); // true = use global settings
```

### Applying Global Settings to All Files
```javascript
// Apply global settings to all files
await applyGlobalToAllFiles();
```

## Benefits

### 🎯 **Personalization**
- Different fonts for different project types
- Custom settings for specific file formats
- Personalized coding experience

### 🔄 **Flexibility**
- Easy switching between global and file-specific settings
- Granular control over typography
- Non-destructive changes

### 💾 **Persistence**
- Settings saved to both localStorage and server
- Automatic synchronization across devices
- Backup and restore capabilities

### 🚀 **Performance**
- Efficient settings resolution
- Minimal impact on editor performance
- Optimized for real-time collaboration

### 👥 **Collaboration**
- Individual preferences don't affect others
- Settings are user-specific
- Maintains collaborative editing capabilities

## Future Enhancements

### Planned Features
- **Font presets** - Pre-configured font combinations
- **File type defaults** - Automatic font selection based on file extension
- **Theme integration** - Font settings that work with color themes
- **Import/Export** - Share font settings between users
- **Bulk operations** - Apply settings to multiple files at once

### Advanced Typography
- **Font ligatures** - Support for programming ligatures
- **Variable fonts** - Support for variable font weights
- **Custom fonts** - Upload and use custom font files
- **Font pairing** - Suggested font combinations

## Technical Notes

### Browser Compatibility
- Modern browsers with CSS Grid and Flexbox support
- Monaco Editor compatibility
- LocalStorage for offline functionality

### Performance Considerations
- Settings cached in localStorage for fast access
- Lazy loading of font settings
- Efficient state management with React Context

### Security
- Settings validated on both client and server
- User-specific data isolation
- Secure API endpoints with authentication

This comprehensive font customization system provides users with the flexibility to create their ideal coding environment while maintaining the collaborative nature of the CodeSync platform.
