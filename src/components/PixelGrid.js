import React, { useState, useEffect, useRef } from 'react';
import Pixel from './Pixel';
import { toPng } from 'html-to-image';

const STORAGE_KEY = 'pixelPainterGrid';

function PixelGrid({ 
  brushColor, 
  clearSignal, 
  setBrushColor, 
  recentColors, 
  gridSize, 
  darkMode, 
  setGridSize,
  history,
  setHistory,
  currentStep,
  setCurrentStep
}) {
  const totalPixels = gridSize * gridSize;
  const gridRef = useRef(null);
  
  // Available grid size options
  const gridSizeOptions = [8, 16, 32, 64];

  const [pixels, setPixels] = useState(() => {
    const savedGrid = localStorage.getItem(STORAGE_KEY);
    return savedGrid ? JSON.parse(savedGrid).slice(0, totalPixels) : Array(totalPixels).fill('#ffffff');
  });
  const [isPainting, setIsPainting] = useState(false);

  // Initialize history if empty
  useEffect(() => {
    if (history.length === 0) {
      setHistory([pixels]);
      setCurrentStep(0);
    }
  }, []);

  // Update pixels when currentStep changes (for undo/redo)
  useEffect(() => {
    if (currentStep >= 0 && history[currentStep]) {
      setPixels([...history[currentStep]]);
    }
  }, [currentStep, history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pixels));
  }, [pixels]);

  useEffect(() => {
    if (clearSignal) {
      const clearedGrid = Array(totalPixels).fill('#ffffff');
      setPixels(clearedGrid);
      
      // Add clear operation to history
      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push([...clearedGrid]);
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
    }
  }, [clearSignal, totalPixels, history, currentStep, setHistory, setCurrentStep]);

  useEffect(() => {
    setPixels((prevPixels) => {
      const newPixels = Array(totalPixels).fill('#ffffff');
      for (let i = 0; i < Math.min(prevPixels.length, newPixels.length); i++) {
        newPixels[i] = prevPixels[i];
      }
      
      // Add grid resize operation to history
      const newHistory = history.slice(0, currentStep + 1);
      newHistory.push([...newPixels]);
      setHistory(newHistory);
      setCurrentStep(newHistory.length - 1);
      
      return newPixels;
    });
  }, [gridSize]);

  const handlePaint = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = brushColor;
    setPixels(newPixels);
    
    // Update history when painting
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push([...newPixels]);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    
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

  // Handle grid size change
  const handleGridSizeChange = (newSize) => {
    setGridSize(parseInt(newSize));
  };

  return (
    <div className="page-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
    }}>
      {/* Grid Size Controls - Centered */}
      <div className="grid-size-controls" style={{ 
        marginBottom: '20px',
        textAlign: 'center',
        width: '100%',
      }}>
        <h3 style={{ 
          fontFamily: "'Press Start 2P', cursive",
          color: '#ffffff',
          textShadow: '2px 2px 0 #000, 0 0 10px #740CE3, 0 0 20px #35A5CD',
          marginBottom: '10px',
          fontSize: '0.9rem'
        }}>Grid Size:</h3>
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {gridSizeOptions.map(size => (
            <button 
              key={size}
              onClick={() => handleGridSizeChange(size)}
              style={{
                backgroundColor: gridSize === size ? '#35A5CD' : '#333',
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: gridSize === size ? '0 0 10px #740CE3' : 'none',
                transition: 'all 0.3s ease',
                width: '80px',
              }}
            >
              {size}×{size}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Wrapper - Centered */}
      <div className="grid-wrapper" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: '20px',
        marginBottom: '20px',
      }}>
        <div
          ref={gridRef}
          onMouseDown={() => setIsPainting(true)}
          onMouseUp={() => setIsPainting(false)}
          onMouseLeave={() => setIsPainting(false)}
          className="pixel-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '1px',
            border: '4px solid #35A5CD',
            boxShadow: '0 0 15px #740CE3',
            width: `${gridSize * 15}px`,
            height: `${gridSize * 15}px`,
            maxWidth: '600px',
            maxHeight: '600px'
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
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls Wrapper - Centered */}
      <div className="controls-wrapper" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {/* Recent Colors heading */}
        <h3 style={{ 
          fontFamily: "'Press Start 2P', cursive",
          color: '#ffffff',
          textShadow: '2px 2px 0 #000, 0 0 10px #740CE3, 0 0 20px #35A5CD',
          marginBottom: '15px',
          marginTop: '20px',
          animation: 'pixel-glow 2s ease-in-out infinite alternate',
          textAlign: 'center',
          width: '100%',
        }}>Recent Colors:</h3>
        
        {/* Recent Colors display - centered */}
        <div className="recent-colors" style={{ 
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          width: '100%',
        }}>
          {recentColors && recentColors.length > 0 ? (
            recentColors.map((color, index) => (
              <div
                key={index}
                onClick={() => setBrushColor(color)}
                className="recent-color"
                style={{
                  backgroundColor: color,
                  boxShadow: '0 0 15px #740CE3',
                  width: '30px',
                  height: '30px',
                  display: 'inline-block',
                  borderRadius: '4px'
                }}
              ></div>
            ))
          ) : (
            <div style={{ 
              color: 'white', 
              textShadow: '2px 2px 0 #000, 0 0 10px #740CE3, 0 0 20px #35A5CD'
            }}>No colors yet</div>
          )}
        </div>

        {/* Export button - centered */}
        <img
          src="/assets/buttons/export.png"
          alt="Export as PNG"
          onClick={exportAsImage}
          className="export-button"
          style={{
            cursor: 'pointer',
            width: '150px',
            
            display: 'block',
            margin: '0 auto',
          }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
    </div>
  );
}

export default PixelGrid;