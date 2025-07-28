import React, { useState, useEffect, useRef } from 'react';
import Pixel from './Pixel';
import { toPng } from 'html-to-image';

const STORAGE_KEY = 'pixelPainterGrid';

function PixelGrid({ brushColor, clearSignal, setBrushColor, recentColors, gridSize, darkMode }) {
  const totalPixels = gridSize * gridSize;
  const gridRef = useRef(null);

  const [pixels, setPixels] = useState(() => {
    const savedGrid = localStorage.getItem(STORAGE_KEY);
    return savedGrid ? JSON.parse(savedGrid).slice(0, totalPixels) : Array(totalPixels).fill('#ffffff');
  });
  const [isPainting, setIsPainting] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pixels));
  }, [pixels]);

  useEffect(() => {
    if (clearSignal) {
      setPixels(Array(totalPixels).fill('#ffffff'));
    }
  }, [clearSignal]);

  useEffect(() => {
    setPixels((prevPixels) => {
      const newPixels = Array(totalPixels).fill('#ffffff');
      for (let i = 0; i < Math.min(prevPixels.length, newPixels.length); i++) {
        newPixels[i] = prevPixels[i];
      }
      return newPixels;
    });
  }, [gridSize]);

  const handlePaint = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = brushColor;
    setHistory([...history, pixels]);
    setPixels(newPixels);
  };

  const exportAsImage = () => {
    if (gridRef.current) {
      toPng(gridRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'pixel-grid.png';
          link.click();
        })
        .catch((error) => {
          console.error('Failed to export grid as image:', error);
        });
    }
  };

  return (
    <div>
      <div
        ref={gridRef}
        onMouseDown={() => setIsPainting(true)}
        onMouseUp={() => setIsPainting(false)}
        onMouseLeave={() => setIsPainting(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gap: '1px',
          marginTop: '10px',
        }}
      >
        {pixels.map((color, index) => (
          <Pixel
            key={index}
            color={color}
            onClick={() => handlePaint(index)}
            onMouseEnter={() => {
              if (isPainting) handlePaint(index);
            }}
          />
        ))}
      </div>

      <button onClick={exportAsImage} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>
        Export as PNG
      </button>

      <div style={{ marginTop: '20px' }}>
        <h3>Recent Colors:</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {recentColors.map((color, index) => (
            <div
              key={index}
              onClick={() => setBrushColor(color)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: color,
                border: '1px solid #000',
                cursor: 'pointer',
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PixelGrid;
