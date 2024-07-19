import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import '../css/settings.css';

function Settings() {
  const userId = JSON.parse(localStorage.getItem('userId'));
  const [email, setEmail] = useState('dept.head@bulsu.ph');
  const [theme, setTheme] = useState('');

  useEffect(() => {
    if (userId) {
      const savedTheme = localStorage.getItem(`theme-${userId}`);
      if (savedTheme) {
        setTheme(savedTheme);
        document.body.className = savedTheme;
      }
    }
  }, [userId]);

  const handleBgColorChange = (colorClass) => {
    setTheme(colorClass);
    document.body.className = colorClass;
  };

  const handleChangeTheme = () => {
    if (userId) {
      localStorage.setItem(`theme-${userId}`, theme);
    }
  };

  const handleDiscardChanges = () => {
    if (userId) {
      const savedTheme = localStorage.getItem(`theme-${userId}`);
      if (savedTheme) {
        setTheme(savedTheme);
        document.body.className = savedTheme;
      }
    }
  };

  return (
    <div>
      <Sidebar />
      <div className='settings-container'>
        <div className="settings-card">
          <h3>Settings</h3>
          <label>Email:</label>
          <input type="email" value={email} readOnly />
          <button className="btn btn-danger">Reset Password</button>
          <button className="btn btn-danger">Reset All Schedule</button>
        </div>
        <div className="user-preference-card">
          <h3>User Preference</h3>
          <h4>Color theme</h4>
          <div>
            <label>Background color:</label>
            <div className="color-options">
              <span className="color-circle black" onClick={() => handleBgColorChange('theme-dark')}></span>
              <span className="color-circle white" onClick={() => handleBgColorChange('theme-light')}></span>
            </div>
          </div>
          <button className="btn btn-success" onClick={handleChangeTheme}>Change Theme</button>
          <button className="btn btn-secondary" onClick={handleDiscardChanges}>Discard Changes</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
