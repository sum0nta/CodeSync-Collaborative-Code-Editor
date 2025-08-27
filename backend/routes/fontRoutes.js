const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../helper/authMiddleware');
const User = require('../models/User');
const File = require('../models/File');

// Get user's font settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('profile.fontSettings');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      fontSettings: user.profile.fontSettings || {
        fontFamily: 'Consolas, "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.5,
        fontWeight: 'normal',
        letterSpacing: 0
      }
    });
  } catch (error) {
    console.error('Error fetching font settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user's font settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { fontFamily, fontSize, lineHeight, fontWeight, letterSpacing } = req.body;

    // Validate input
    if (fontSize && (fontSize < 8 || fontSize > 24)) {
      return res.status(400).json({ message: 'Font size must be between 8 and 24' });
    }

    if (lineHeight && (lineHeight < 1 || lineHeight > 3)) {
      return res.status(400).json({ message: 'Line height must be between 1 and 3' });
    }

    if (letterSpacing && (letterSpacing < -2 || letterSpacing > 4)) {
      return res.status(400).json({ message: 'Letter spacing must be between -2 and 4' });
    }

    // Valid font families
    const validFontFamilies = [
      'Consolas, "Courier New", monospace',
      '"Courier New", Courier, monospace',
      '"Fira Code", "Courier New", monospace',
      '"JetBrains Mono", "Courier New", monospace',
      '"Source Code Pro", "Courier New", monospace',
      '"Roboto Mono", "Courier New", monospace',
      '"Ubuntu Mono", "Courier New", monospace',
      '"Inconsolata", "Courier New", monospace',
      '"Monaco", "Courier New", monospace',
      '"Menlo", "Courier New", monospace'
    ];

    if (fontFamily && !validFontFamilies.includes(fontFamily)) {
      return res.status(400).json({ message: 'Invalid font family' });
    }

    // Valid font weights
    const validFontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    if (fontWeight && !validFontWeights.includes(fontWeight)) {
      return res.status(400).json({ message: 'Invalid font weight' });
    }

    // Update user's font settings
    const updateData = {};
    if (fontFamily !== undefined) updateData['profile.fontSettings.fontFamily'] = fontFamily;
    if (fontSize !== undefined) updateData['profile.fontSettings.fontSize'] = fontSize;
    if (lineHeight !== undefined) updateData['profile.fontSettings.lineHeight'] = lineHeight;
    if (fontWeight !== undefined) updateData['profile.fontSettings.fontWeight'] = fontWeight;
    if (letterSpacing !== undefined) updateData['profile.fontSettings.letterSpacing'] = letterSpacing;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('profile.fontSettings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Font settings updated successfully',
      fontSettings: user.profile.fontSettings
    });
  } catch (error) {
    console.error('Error updating font settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Reset font settings to defaults
router.post('/settings/reset', authenticateToken, async (req, res) => {
  try {
    const defaultSettings = {
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 'normal',
      letterSpacing: 0
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'profile.fontSettings': defaultSettings } },
      { new: true, runValidators: true }
    ).select('profile.fontSettings');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Font settings reset to defaults',
      fontSettings: user.profile.fontSettings
    });
  } catch (error) {
    console.error('Error resetting font settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get font settings for a specific file
router.get('/file/:fileId/settings', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Get global font settings as fallback
    const user = await User.findById(req.user.id).select('profile.fontSettings');
    const globalSettings = user?.profile?.fontSettings || {
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 'normal',
      letterSpacing: 0
    };

    // Merge file-specific settings with global settings
    const fileSettings = {
      fontFamily: file.fontSettings.fontFamily || globalSettings.fontFamily,
      fontSize: file.fontSettings.fontSize || globalSettings.fontSize,
      lineHeight: file.fontSettings.lineHeight || globalSettings.lineHeight,
      fontWeight: file.fontSettings.fontWeight || globalSettings.fontWeight,
      letterSpacing: file.fontSettings.letterSpacing || globalSettings.letterSpacing
    };

    res.json({
      success: true,
      fontSettings: fileSettings,
      isUsingGlobal: {
        fontFamily: file.fontSettings.fontFamily === null,
        fontSize: file.fontSettings.fontSize === null,
        lineHeight: file.fontSettings.lineHeight === null,
        fontWeight: file.fontSettings.fontWeight === null,
        letterSpacing: file.fontSettings.letterSpacing === null
      }
    });
  } catch (error) {
    console.error('Error fetching file font settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update font settings for a specific file
router.put('/file/:fileId/settings', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { fontFamily, fontSize, lineHeight, fontWeight, letterSpacing, useGlobal } = req.body;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Validate input
    if (fontSize && (fontSize < 8 || fontSize > 24)) {
      return res.status(400).json({ message: 'Font size must be between 8 and 24' });
    }

    if (lineHeight && (lineHeight < 1 || lineHeight > 3)) {
      return res.status(400).json({ message: 'Line height must be between 1 and 3' });
    }

    if (letterSpacing && (letterSpacing < -2 || letterSpacing > 4)) {
      return res.status(400).json({ message: 'Letter spacing must be between -2 and 4' });
    }

    // Valid font families
    const validFontFamilies = [
      'Consolas, "Courier New", monospace',
      '"Courier New", Courier, monospace',
      '"Fira Code", "Courier New", monospace',
      '"JetBrains Mono", "Courier New", monospace',
      '"Source Code Pro", "Courier New", monospace',
      '"Roboto Mono", "Courier New", monospace',
      '"Ubuntu Mono", "Courier New", monospace',
      '"Inconsolata", "Courier New", monospace',
      '"Monaco", "Courier New", monospace',
      '"Menlo", "Courier New", monospace'
    ];

    if (fontFamily && !validFontFamilies.includes(fontFamily)) {
      return res.status(400).json({ message: 'Invalid font family' });
    }

    // Valid font weights
    const validFontWeights = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    if (fontWeight && !validFontWeights.includes(fontWeight)) {
      return res.status(400).json({ message: 'Invalid font weight' });
    }

    // Update file's font settings
    const updateData = {};
    if (useGlobal) {
      // Reset to use global settings
      updateData['fontSettings.fontFamily'] = null;
      updateData['fontSettings.fontSize'] = null;
      updateData['fontSettings.lineHeight'] = null;
      updateData['fontSettings.fontWeight'] = null;
      updateData['fontSettings.letterSpacing'] = null;
    } else {
      // Set specific values
      if (fontFamily !== undefined) updateData['fontSettings.fontFamily'] = fontFamily;
      if (fontSize !== undefined) updateData['fontSettings.fontSize'] = fontSize;
      if (lineHeight !== undefined) updateData['fontSettings.lineHeight'] = lineHeight;
      if (fontWeight !== undefined) updateData['fontSettings.fontWeight'] = fontWeight;
      if (letterSpacing !== undefined) updateData['fontSettings.letterSpacing'] = letterSpacing;
    }

    const updatedFile = await File.findByIdAndUpdate(
      fileId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'File font settings updated successfully',
      file: updatedFile
    });
  } catch (error) {
    console.error('Error updating file font settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Apply global font settings to all files
router.post('/apply-global-to-all', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('profile.fontSettings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all files owned by the user
    const files = await File.find({ ownerId: req.user.id });
    
    // Reset all files to use global settings
    await File.updateMany(
      { ownerId: req.user.id },
      { 
        $set: {
          'fontSettings.fontFamily': null,
          'fontSettings.fontSize': null,
          'fontSettings.lineHeight': null,
          'fontSettings.fontWeight': null,
          'fontSettings.letterSpacing': null
        }
      }
    );

    res.json({
      success: true,
      message: `Global font settings applied to ${files.length} files`,
      filesUpdated: files.length
    });
  } catch (error) {
    console.error('Error applying global settings to all files:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
