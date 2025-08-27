import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const FontContext = createContext();

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};

export const FontProvider = ({ children }) => {
  const [globalFontSettings, setGlobalFontSettings] = useState(() => {
    // Load from localStorage on initialization
    try {
      const saved = localStorage.getItem('codesyncGlobalFontSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading global font settings:', error);
    }
    
    // Default font settings
    return {
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 'normal',
      letterSpacing: 0
    };
  });

  const [currentFileId, setCurrentFileId] = useState(null);
  const [fileFontSettings, setFileFontSettings] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  // Save global font settings to server
  const saveGlobalFontSettingsToServer = async (settings) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/font/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save global font settings to server');
      }
    } catch (error) {
      console.error('Error saving global font settings to server:', error);
      throw error;
    }
  };

  // Save file font settings to server
  const saveFileFontSettingsToServer = async (fileId, settings, useGlobal = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !fileId) return;

      const response = await fetch(`${API_BASE_URL}/api/font/file/${fileId}/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...settings, useGlobal })
      });

      if (!response.ok) {
        throw new Error('Failed to save file font settings to server');
      }
    } catch (error) {
      console.error('Error saving file font settings to server:', error);
      throw error;
    }
  };

  // Load global font settings from server
  const loadGlobalFontSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/font/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGlobalFontSettings(data.fontSettings);
      }
    } catch (error) {
      console.error('Error loading global font settings from server:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  // Load font settings for a specific file
  const loadFileFontSettings = useCallback(async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !fileId) return;

      const response = await fetch(`${API_BASE_URL}/api/font/file/${fileId}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFileFontSettings(prev => ({
          ...prev,
          [fileId]: data
        }));
        setCurrentFileId(fileId);
      }
    } catch (error) {
      console.error('Error loading file font settings:', error);
    }
  }, [API_BASE_URL]);

  // Set current file for font settings
  const setCurrentFile = useCallback((fileId) => {
    setCurrentFileId(fileId);
    if (fileId && !fileFontSettings[fileId]) {
      loadFileFontSettings(fileId);
    }
  }, [fileFontSettings, loadFileFontSettings]);

  // Update global font settings
  const updateGlobalFontSettings = async (newSettings) => {
    const updatedSettings = {
      ...globalFontSettings,
      ...newSettings
    };
    
    setGlobalFontSettings(updatedSettings);
    
    // Save to server
    try {
      await saveGlobalFontSettingsToServer(updatedSettings);
    } catch (error) {
      console.error('Failed to save global font settings to server:', error);
    }
  };

  // Update file font settings
  const updateFileFontSettings = async (fileId, newSettings, useGlobal = false) => {
    if (!fileId) return;

    if (useGlobal) {
      // Remove file-specific settings
      setFileFontSettings(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
    } else {
      // Update file-specific settings
      const currentFileSettings = fileFontSettings[fileId]?.fontSettings || globalFontSettings;
      const updatedSettings = {
        ...currentFileSettings,
        ...newSettings
      };
      
      setFileFontSettings(prev => ({
        ...prev,
        [fileId]: {
          fontSettings: updatedSettings,
          isUsingGlobal: {
            fontFamily: false,
            fontSize: false,
            lineHeight: false,
            fontWeight: false,
            letterSpacing: false
          }
        }
      }));
    }
    
    // Save to server
    try {
      await saveFileFontSettingsToServer(fileId, newSettings, useGlobal);
    } catch (error) {
      console.error('Failed to save file font settings to server:', error);
    }
  };

  // Reset global font settings to defaults
  const resetGlobalFontSettings = async () => {
    const defaultSettings = {
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 'normal',
      letterSpacing: 0
    };
    
    setGlobalFontSettings(defaultSettings);
    
    // Reset on server
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/api/font/settings/reset`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Failed to reset global font settings on server:', error);
    }
  };

  // Apply global settings to all files
  const applyGlobalToAllFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/font/apply-global-to-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear all file-specific settings
        setFileFontSettings({});
        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error('Failed to apply global settings to all files:', error);
    }
  };

  // Get effective font settings for current file
  const getEffectiveFontSettings = () => {
    if (!currentFileId || !fileFontSettings[currentFileId]) {
      return globalFontSettings;
    }

    const fileSettings = fileFontSettings[currentFileId];
    const isUsingGlobal = fileSettings.isUsingGlobal;

    return {
      fontFamily: isUsingGlobal.fontFamily ? globalFontSettings.fontFamily : fileSettings.fontSettings.fontFamily,
      fontSize: isUsingGlobal.fontSize ? globalFontSettings.fontSize : fileSettings.fontSettings.fontSize,
      lineHeight: isUsingGlobal.lineHeight ? globalFontSettings.lineHeight : fileSettings.fontSettings.lineHeight,
      fontWeight: isUsingGlobal.fontWeight ? globalFontSettings.fontWeight : fileSettings.fontSettings.fontWeight,
      letterSpacing: isUsingGlobal.letterSpacing ? globalFontSettings.letterSpacing : fileSettings.fontSettings.letterSpacing
    };
  };

  // Get Monaco editor options with font settings
  const getMonacoOptions = (baseOptions = {}) => {
    const effectiveSettings = getEffectiveFontSettings();
    return {
      ...baseOptions,
      fontSize: effectiveSettings.fontSize,
      fontFamily: effectiveSettings.fontFamily,
      lineHeight: Math.round(effectiveSettings.fontSize * effectiveSettings.lineHeight),
      fontWeight: effectiveSettings.fontWeight,
      letterSpacing: effectiveSettings.letterSpacing
    };
  };

  // Get CSS styles for font settings
  const getFontStyles = () => {
    const effectiveSettings = getEffectiveFontSettings();
    return {
      fontFamily: effectiveSettings.fontFamily,
      fontSize: `${effectiveSettings.fontSize}px`,
      lineHeight: effectiveSettings.lineHeight,
      fontWeight: effectiveSettings.fontWeight,
      letterSpacing: `${effectiveSettings.letterSpacing}px`
    };
  };

  // Save to localStorage whenever global settings change
  useEffect(() => {
    try {
      localStorage.setItem('codesyncGlobalFontSettings', JSON.stringify(globalFontSettings));
    } catch (error) {
      console.error('Error saving global font settings:', error);
    }
  }, [globalFontSettings]);

  // Load global font settings from server when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadGlobalFontSettings();
    }
  }, [loadGlobalFontSettings]);

  const value = {
    // Global settings
    globalFontSettings,
    updateGlobalFontSettings,
    resetGlobalFontSettings,
    loadGlobalFontSettings,
    
    // File-specific settings
    currentFileId,
    setCurrentFile,
    fileFontSettings,
    updateFileFontSettings,
    loadFileFontSettings,
    
    // Utility functions
    getEffectiveFontSettings,
    getMonacoOptions,
    getFontStyles,
    applyGlobalToAllFiles,
    isLoading
  };

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
};
