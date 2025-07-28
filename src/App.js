import React, { useState } from 'react';
import PixelGrid from './components/PixelGrid';

function App() {
  const [brushColor, setBrushColor] = useState('#000000');
  const [clearSignal, setClearSignal] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [gridSize, setGridSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);

  const handleClear = () => {
    setClearSignal(true);
    setTimeout(() => setClearSignal(false), 0);
  };

  const updateRecentColors = (color) => {
    if (!recentColors.includes(color)) {
      const updatedColors = [color, ...recentColors].slice(0, 5);
      setRecentColors(updatedColors);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Pixel Painter</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => {
            setBrushColor(e.target.value);
            updateRecentColors(e.target.value);
          }}
          style={{
            padding: '10px',
            border: '4px solid #000',
            cursor: 'pointer',
          }}
        />

        <button
          onClick={handleClear}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            border: '4px solid #000',
            cursor: 'pointer',
          }}
        >
          Reset Grid
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '10px 20px',
            backgroundColor: darkMode ? '#4caf50' : '#000000',
            color: darkMode ? '#000000' : '#ffffff',
            border: '4px solid #000',
            cursor: 'pointer',
          }}
        >
          Toggle Dark Mode
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="gridSize" style={{ fontSize: '14px' }}>Grid Size:</label>
        <select
          id="gridSize"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          style={{
            marginLeft: '10px',
            padding: '10px',
            border: '4px solid #000',
            cursor: 'pointer',
          }}
        >
          <option value={8}>8x8</option>
          <option value={16}>16x16</option>
          <option value={32}>32x32</option>
        </select>
      </div>

      <PixelGrid
        brushColor={brushColor}
        clearSignal={clearSignal}
        setBrushColor={setBrushColor}
        recentColors={recentColors}
        gridSize={gridSize}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;
