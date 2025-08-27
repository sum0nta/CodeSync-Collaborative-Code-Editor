import React, { useState, useEffect } from 'react';
import { useFont } from '../context/FontContext';
import { toast } from 'react-hot-toast';

const FontSettings = ({ isOpen, onClose, currentFileId, currentFileName }) => {
  const { 
    globalFontSettings, 
    updateGlobalFontSettings, 
    resetGlobalFontSettings,
    fileFontSettings,
    updateFileFontSettings,
    applyGlobalToAllFiles,
    getEffectiveFontSettings
  } = useFont();

  const [tempSettings, setTempSettings] = useState(globalFontSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [useGlobalSettings, setUseGlobalSettings] = useState(true);
  const [isFileSpecific, setIsFileSpecific] = useState(false);

  // Font family options
  const fontFamilies = [
    { value: 'Consolas, "Courier New", monospace', label: 'Consolas', preview: 'Consolas' },
    { value: '"Courier New", Courier, monospace', label: 'Courier New', preview: 'Courier New' },
    { value: '"Fira Code", "Courier New", monospace', label: 'Fira Code', preview: 'Fira Code' },
    { value: '"JetBrains Mono", "Courier New", monospace', label: 'JetBrains Mono', preview: 'JetBrains Mono' },
    { value: '"Source Code Pro", "Courier New", monospace', label: 'Source Code Pro', preview: 'Source Code Pro' },
    { value: '"Roboto Mono", "Courier New", monospace', label: 'Roboto Mono', preview: 'Roboto Mono' },
    { value: '"Ubuntu Mono", "Courier New", monospace', label: 'Ubuntu Mono', preview: 'Ubuntu Mono' },
    { value: '"Inconsolata", "Courier New", monospace', label: 'Inconsolata', preview: 'Inconsolata' },
    { value: '"Monaco", "Courier New", monospace', label: 'Monaco', preview: 'Monaco' },
    { value: '"Menlo", "Courier New", monospace', label: 'Menlo', preview: 'Menlo' }
  ];

  // Font weight options
  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '100', label: 'Thin (100)' },
    { value: '200', label: 'Extra Light (200)' },
    { value: '300', label: 'Light (300)' },
    { value: '400', label: 'Regular (400)' },
    { value: '500', label: 'Medium (500)' },
    { value: '600', label: 'Semi Bold (600)' },
    { value: '700', label: 'Bold (700)' },
    { value: '800', label: 'Extra Bold (800)' },
    { value: '900', label: 'Black (900)' }
  ];

  // Initialize settings when component opens or file changes
  useEffect(() => {
    if (isOpen) {
      if (currentFileId && fileFontSettings[currentFileId]) {
        // File has specific settings
        setTempSettings(fileFontSettings[currentFileId].fontSettings);
        setUseGlobalSettings(false);
        setIsFileSpecific(true);
      } else {
        // Use global settings
        setTempSettings(globalFontSettings);
        setUseGlobalSettings(true);
        setIsFileSpecific(false);
      }
    }
  }, [isOpen, currentFileId, fileFontSettings, globalFontSettings]);

  const handleSave = async () => {
    try {
      if (currentFileId && !useGlobalSettings) {
        // Save file-specific settings
        await updateFileFontSettings(currentFileId, tempSettings, false);
        toast.success(`Font settings saved for ${currentFileName || 'this file'}`);
      } else if (currentFileId && useGlobalSettings) {
        // Reset file to use global settings
        await updateFileFontSettings(currentFileId, {}, true);
        toast.success(`${currentFileName || 'This file'} now uses global font settings`);
      } else {
        // Save global settings
        await updateGlobalFontSettings(tempSettings);
        toast.success('Global font settings saved');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save font settings');
    }
  };

  const handleReset = async () => {
    try {
      if (currentFileId) {
        // Reset file to use global settings
        await updateFileFontSettings(currentFileId, {}, true);
        setUseGlobalSettings(true);
        setTempSettings(globalFontSettings);
        toast.success(`${currentFileName || 'This file'} reset to global settings`);
      } else {
        // Reset global settings
        await resetGlobalFontSettings();
        setTempSettings(globalFontSettings);
        toast.success('Global font settings reset to defaults');
      }
    } catch (error) {
      toast.error('Failed to reset font settings');
    }
  };

  const handleApplyToAll = async () => {
    try {
      await applyGlobalToAllFiles();
      toast.success('Global font settings applied to all files');
    } catch (error) {
      toast.error('Failed to apply settings to all files');
    }
  };

  const handleUseGlobalToggle = () => {
    setUseGlobalSettings(!useGlobalSettings);
    if (!useGlobalSettings) {
      // Switching to global settings
      setTempSettings(globalFontSettings);
    } else {
      // Switching to file-specific settings
      const effectiveSettings = getEffectiveFontSettings();
      setTempSettings(effectiveSettings);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#2d2d30',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        color: 'white',
        border: '1px solid #3e3e42'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #3e3e42',
          paddingBottom: '12px'
        }}>
          <h2 style={{ margin: 0, color: '#cccccc' }}>
            {currentFileId ? `Font Settings - ${currentFileName || 'Current File'}` : 'Global Font Settings'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#cccccc',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* File-specific toggle */}
        {currentFileId && (
          <div style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#1e1e1e',
            borderRadius: '6px',
            border: '1px solid #3e3e42'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!useGlobalSettings}
                onChange={handleUseGlobalToggle}
                style={{ cursor: 'pointer' }}
              />
              <span>Use file-specific font settings</span>
            </label>
            {isFileSpecific && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                This file has custom font settings. Uncheck to use global settings.
              </div>
            )}
          </div>
        )}

        {/* Settings are disabled when using global settings */}
        <div style={{ opacity: useGlobalSettings ? 0.5 : 1, pointerEvents: useGlobalSettings ? 'none' : 'auto' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            marginBottom: '20px',
            borderBottom: '1px solid #3e3e42'
          }}>
            <button
              onClick={() => setActiveTab('general')}
              style={{
                background: activeTab === 'general' ? '#007acc' : 'transparent',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              style={{
                background: activeTab === 'advanced' ? '#007acc' : 'transparent',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '4px 4px 0 0'
              }}
            >
              Advanced
            </button>
          </div>

          {/* General Tab */}
          {activeTab === 'general' && (
            <div>
              {/* Font Family */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cccccc' }}>
                  Font Family
                </label>
                <select
                  value={tempSettings.fontFamily}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    border: '1px solid #3e3e42',
                    borderRadius: '4px'
                  }}
                >
                  {fontFamilies.map(font => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#888' }}>
                  Preview: <span style={{ fontFamily: tempSettings.fontFamily }}>{fontFamilies.find(f => f.value === tempSettings.fontFamily)?.preview}</span>
                </div>
              </div>

              {/* Font Size */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cccccc' }}>
                  Font Size: {tempSettings.fontSize}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={tempSettings.fontSize}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                  <span>8px</span>
                  <span>24px</span>
                </div>
              </div>

              {/* Font Weight */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cccccc' }}>
                  Font Weight
                </label>
                <select
                  value={tempSettings.fontWeight}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, fontWeight: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#1e1e1e',
                    color: 'white',
                    border: '1px solid #3e3e42',
                    borderRadius: '4px'
                  }}
                >
                  {fontWeights.map(weight => (
                    <option key={weight.value} value={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div>
              {/* Line Height */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cccccc' }}>
                  Line Height: {tempSettings.lineHeight}
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={tempSettings.lineHeight}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, lineHeight: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                  <span>1.0</span>
                  <span>3.0</span>
                </div>
              </div>

              {/* Letter Spacing */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#cccccc' }}>
                  Letter Spacing: {tempSettings.letterSpacing}px
                </label>
                <input
                  type="range"
                  min="-2"
                  max="4"
                  step="0.1"
                  value={tempSettings.letterSpacing}
                  onChange={(e) => setTempSettings(prev => ({ ...prev, letterSpacing: parseFloat(e.target.value) }))}
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                  <span>-2px</span>
                  <span>4px</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#1e1e1e',
            borderRadius: '6px',
            border: '1px solid #3e3e42'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#cccccc' }}>Preview</h4>
            <div style={{
              fontFamily: tempSettings.fontFamily,
              fontSize: `${tempSettings.fontSize}px`,
              lineHeight: tempSettings.lineHeight,
              fontWeight: tempSettings.fontWeight,
              letterSpacing: `${tempSettings.letterSpacing}px`,
              color: '#cccccc',
              backgroundColor: '#2d2d30',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #3e3e42'
            }}>
              <div>function example() {'{'}</div>
              <div style={{ marginLeft: '20px' }}>const message = "Hello, World!";</div>
              <div style={{ marginLeft: '20px' }}>console.log(message);</div>
              <div>{'}'}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '24px',
          justifyContent: 'flex-end'
        }}>
          {currentFileId && (
            <button
              onClick={handleApplyToAll}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4a4a4a',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Apply Global to All Files
            </button>
          )}
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d73a49',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;
