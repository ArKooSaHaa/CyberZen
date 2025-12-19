import React, { useState, useEffect } from 'react';

export const STORAGE_KEY = 'REACT_APP_API_BASE_URL_OVERRIDE';

const ApiConfigPrompt = () => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [overrideExists, setOverrideExists] = useState(false);

  useEffect(() => {
    const env = process.env.REACT_APP_API_BASE_URL;
    const override = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    // Show the prompt when env is not set (typical on Vercel) OR when an override already exists
    if (!env || override) {
      setVisible(true);
      setOverrideExists(Boolean(override));
      if (override) setValue(override);
    }
  }, []);

  if (!visible) return null;

  const save = () => {
    const trimmed = (value || '').trim();
    if (!trimmed) return alert('Please enter a backend base URL (e.g. https://api.example.com)');
    try {
      // Basic validation
      const url = new URL(trimmed);
      localStorage.setItem(STORAGE_KEY, url.origin);
      // Reload to let app pick up the new base
      window.location.reload();
    } catch (err) {
      alert('Invalid URL. Make sure it starts with https://');
    }
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setValue('');
    setOverrideExists(false);
    window.location.reload();
  };

  const dismiss = () => setVisible(false);

  return (
    <div style={{ width: '100%', maxWidth: 720, margin: '12px auto', padding: 12, border: '1px solid #ffc107', background: '#fff8e1', borderRadius: 8 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <strong>API Base URL</strong>
          <div style={{ fontSize: 13, color: '#333' }}>
            {overrideExists
              ? 'Using a local override for API base URL. Update or clear it below.'
              : 'Backend URL is not configured for this build. Enter your backend base URL so the frontend can call the API (example: https://api.example.com)'}
          </div>
        </div>
        <input
          aria-label="API base URL"
          placeholder="https://api.example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{ padding: '8px', borderRadius: 6, border: '1px solid #ccc', minWidth: 260 }}
        />
        <button onClick={save} style={{ padding: '8px 12px', borderRadius: 6, background: '#0070f3', color: '#fff', border: 'none' }}>Save</button>
        {overrideExists ? (
          <button onClick={clear} style={{ padding: '8px 12px', borderRadius: 6, background: '#dc3545', color: '#fff', border: 'none' }}>Clear</button>
        ) : (
          <button onClick={dismiss} style={{ padding: '8px 12px', borderRadius: 6, background: '#6c757d', color: '#fff', border: 'none' }}>Dismiss</button>
        )}
      </div>
    </div>
  );
};

export default ApiConfigPrompt;
