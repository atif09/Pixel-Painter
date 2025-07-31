import React, { useState, useEffect } from 'react';
import PixelGrid from './components/PixelGrid';

function App() {
  const [brushColor, setBrushColor] = useState('#000000');
  const [clearSignal, setClearSignal] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [gridSize, setGridSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  
  // Add history state for undo/redo functionality
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isErasing, setIsErasing] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [hexInput, setHexInput] = useState('#000000');

  const handleClear = () => {
    setClearSignal(true);
    setTimeout(() => setClearSignal(false), 0);
    setActiveButton('reset');
    setTimeout(() => setActiveButton(null), 500);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    setActiveButton(isErasing ? null : 'eraser');
  };
  
  const handleHexChange = (e) => {
    const value = e.target.value;
    // Validate hex format
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setHexInput(value);
      
      // Only update brush color when we have a complete hex code
      if (value.length === 7) {
        updateBrushColor(value);
      }
    }
  };
  
  // Update brush color and recent colors
  const updateBrushColor = (color) => {
    setBrushColor(color);
    setHexInput(color);
    
    // If eraser was active, turn it off when selecting a color
    if (isErasing) {
      setIsErasing(false);
      setActiveButton(null);
    }
    
    // Update recent colors - only add if it's not already there
    if (!recentColors.includes(color)) {
      // Add to front of array and keep only 5 most recent colors
      setRecentColors(prevColors => [color, ...prevColors.filter(c => c !== color)].slice(0, 5));
    }
  };
  
  // Add undo and redo handlers
  const handleUndo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setActiveButton('undo');
      setTimeout(() => setActiveButton(null), 500);
    }
  };

  const handleRedo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      setActiveButton('redo');
      setTimeout(() => setActiveButton(null), 500);
    }
  };

  const handleColorPickerClick = () => {
    document.getElementById('color-picker-input').click();
    setActiveButton('color');
    setTimeout(() => setActiveButton(null), 500);
  };

  useEffect(() => {
    // Canvas setup for animated background
    const canvas = document.getElementById('pixel-background');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to fill the entire screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create many more pixels for better distribution
    const pixels = [];
    const pixelCount = 200; // Increased from 100
    
    for (let i = 0; i < pixelCount; i++) {
      pixels.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 5,
        dx: (Math.random() - 0.5) * 2, // Better velocity distribution
        dy: (Math.random() - 0.5) * 2,
        color: Math.random() > 0.5 ? '#740CE3' : '#35A5CD',
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      pixels.forEach((pixel) => {
        // Update position
        pixel.x += pixel.dx;
        pixel.y += pixel.dy;

        // Bounce off edges
        if (pixel.x <= 0 || pixel.x >= canvas.width - pixel.size) {
          pixel.dx *= -1;
          pixel.x = Math.max(0, Math.min(pixel.x, canvas.width - pixel.size));
        }
        
        if (pixel.y <= 0 || pixel.y >= canvas.height - pixel.size) {
          pixel.dy *= -1;
          pixel.y = Math.max(0, Math.min(pixel.y, canvas.height - pixel.size));
        }

        // Draw pixel
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
      });
      
      requestAnimationFrame(animate);
    }

    animate();
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className="app-container">
      <canvas id="pixel-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}></canvas>

      <div className="app-content" style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <h1 className="app-title" style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "3rem",
          textShadow: "4px 4px 0 #000, 0 0 15px #740CE3, 0 0 30px #35A5CD",
          color: "#ffffff",
          letterSpacing: "2px",
          padding: "15px",
          animation: "pixel-glow 2s ease-in-out infinite alternate",
          margin: "20px 0 40px 0"
        }}>Pixel Painter</h1>

        <div className="app-controls" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '20px', 
          width: '100%',
          maxWidth: '800px'
        }}>
          <div className="tool-controls" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            marginBottom: '20px',
            position: 'relative;'
          }}>
            {/* Color Bucket with better centering */}
            <div style={{ position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '70px'

             }}>
              <img
                src="/assets/buttons/color.bucket.png"
                alt="Color Picker"
                className={`color-bucket-icon ${activeButton === 'color' ? 'tool-button-active' : ''}`}
                style={{
                  width: '150px',
                  cursor: 'pointer',
                  
                  transition: 'transform 0.3s ease, filter 0.3s ease', // Match the reset button's transition
                }}
                onClick={handleColorPickerClick}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              
              <input
                id="color-picker-input"
                type="color"
                value={brushColor}
                onChange={(e) => updateBrushColor(e.target.value)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '0.1px',
                  height: '0.1px',
                  overflow: 'hidden',
                }}
              />
            </div>

             <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px', // Fixed height for alignment
                marginLeft: '0',
                marginRight: '0'
              }}>
            
            {/* Eraser Button */}
            <img
              src="/assets/buttons/eraser.png"
              alt="Eraser"
              onClick={toggleEraser}
              className={`eraser-button ${isErasing ? 'active' : ''} ${activeButton === 'eraser' ? 'tool-button-active' : ''}`}
              style={{
                cursor: 'pointer',
                width: '70px',
                opacity: isErasing ? 1 : 0.8,
                filter: isErasing ? 'drop-shadow(0 0 10px #35A5CD)' : 'drop-shadow(0 0 5px #740CE3)',
                transition: 'transform 0.3s ease, filter 0.3s ease',
                transform: isErasing ? 'scale(1.2)' : 'scale(1)'
              }}
              onMouseOver={(e) => !isErasing && (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseOut={(e) => !isErasing && (e.currentTarget.style.transform = 'scale(1)')}
            />
            </div>

            <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px' // Fixed height for alignment
              }}>

            {/* Undo button */}
            <img
              src="/assets/buttons/undo.png"
              alt="Undo"
              onClick={handleUndo}
              className={`undo-button ${activeButton === 'undo' ? 'tool-button-active' : ''}`}
              style={{
                cursor: currentStep > 0 ? 'pointer' : 'not-allowed',
                width: '70px',
                opacity: currentStep > 0 ? 1 : 0.5,
                filter: 'drop-shadow(0 0 5px #740CE3)',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseOver={(e) => currentStep > 0 ? e.currentTarget.style.transform = 'scale(1.2)' : null}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            /></div>

            <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px' // Fixed height for alignment
              }}>     

            {/* Redo button */}
            <img
              src="/assets/buttons/redo.png"
              alt="Redo"
              onClick={handleRedo}
              className={`redo-button ${activeButton === 'redo' ? 'tool-button-active' : ''}`}
              style={{
                cursor: currentStep < history.length - 1 ? 'pointer' : 'not-allowed',
                width: '70px',
                opacity: currentStep < history.length - 1 ? 1 : 0.5,
                filter: 'drop-shadow(0 0 5px #740CE3)',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseOver={(e) => currentStep < history.length - 1 ? e.currentTarget.style.transform = 'scale(1.2)' : null}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            /></div>

            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '70px' // Fixed height for alignment
              }}> 

            {/* Reset button */}
            <img
              src="/assets/buttons/reset-grid.png"
              alt="Reset Grid"
              onClick={handleClear}
              className={`reset-button ${activeButton === 'reset' ? 'tool-button-active' : ''}`}
              style={{
                cursor: 'pointer',
                width: '150px',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            /></div>
          </div>
          
          <PixelGrid
            brushColor={brushColor}
            clearSignal={clearSignal}
            setBrushColor={updateBrushColor}
            recentColors={recentColors}
            gridSize={gridSize}
            setGridSize={setGridSize}
            darkMode={darkMode}
            history={history}
            setHistory={setHistory}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            isErasing={isErasing}
            hexInput={hexInput}
            handleHexChange={handleHexChange}
          />
        </div>
      </div>
    </div>
  );
}

export default App;