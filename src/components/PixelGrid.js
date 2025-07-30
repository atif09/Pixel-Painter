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

  // Update the handlePaint function to also update recent colors:
  const handlePaint = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = brushColor;
    setPixels(newPixels);
    
    // Update recent colors via the parent component's function
    setBrushColor(brushColor);
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
    <div className="page-container">
      <div className="grid-wrapper">
        <div
          ref={gridRef}
          onMouseDown={() => setIsPainting(true)}
          onMouseUp={() => setIsPainting(false)}
          onMouseLeave={() => setIsPainting(false)}
          className="pixel-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 20px)`,
            gap: '1px',
            border: '4px solid #35A5CD',
            boxShadow: '0 0 15px #740CE3'
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
      </div>

      <div className="controls-wrapper">
        {/* Replaced button with image */}
        <img
          src="/assets/buttons/export.png"
          alt="Export as PNG"
          onClick={exportAsImage}
          className="export-button"
          style={{
            cursor: 'pointer',
            width: '150px',
            marginTop: '20px',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        <div style={{ marginTop: '20px' }}>
          <h3 style={{ 
            fontFamily: "'Press Start 2P', cursive",
            color: '#ffffff',
            textShadow: '2px 2px 0 #000',
            marginBottom: '10px'
          }}>Recent Colors:</h3>
          <div className="recent-colors">
            {recentColors && recentColors.length > 0 ? (recentColors.map((color, index) => (
              <div
                key={index}
                onClick={() => setBrushColor(color)}
                className="recent-color"
                style={{
                  backgroundColor: color,
                  border: '2px solid #fff',
                  boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)',
                  width: '30px',
                  height: '30px',
                  display: 'inline-block',
                  marginRight: '5px'
                }}
              ></div>
            )) 
          ) : (
              <div style={{ color: '#fff',
                textShadow: '2px 2px 0 #000, 0 0 10px #740CE3, 0 0 20px #35A5CD'
               }}>No recent colors</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PixelGrid;