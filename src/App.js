import React, { useState, useEffect } from 'react';
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
  
  // Add this function to update brush color and recent colors
  const updateBrushColor = (color) => {
    setBrushColor(color);
    
    // Update recent colors - only add if it's not already there
    if (!recentColors.includes(color)) {
      // Add to front of array and keep only 5 most recent colors
      setRecentColors(prevColors => [color, ...prevColors.filter(c => c !== color)].slice(0, 5));
    }
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
    <div>
      <canvas id="pixel-background" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}></canvas>

      <div style={{ position: 'relative', zIndex: 1, padding: '20px', textAlign: 'center' }}>
        <h1 className="app-title" style={{
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "3rem",
          textShadow: "4px 4px 0 #000, 0 0 15px #740CE3, 0 0 30px #35A5CD",
          color: "#ffffff",
          letterSpacing: "2px",
          padding: "15px",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          border: "4px solid #35A5CD",
          boxShadow: "0 0 15px #740CE3",
          borderRadius: "8px"
        }}>Pixel Painter</h1>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          {/* Color Bucket Icon with Hidden Color Picker */}
          <div style={{ position: 'relative' }}>
            <img
              src="/assets/buttons/color.bucket.png"
              alt="Color Picker"
              className="color-bucket-icon"
              style={{
                width: '140px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onClick={(e) => {
                // When clicked, programmatically click the hidden color input
                document.getElementById('color-picker-input').click();
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            
            {/* Hidden color input that will be activated when the image is clicked */}
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

          <img
            src="/assets/buttons/reset-grid.png"
            alt="Reset Grid"
            onClick={handleClear}
            className="reset-button"
            style={{
              cursor: 'pointer',
              width: '150px',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} 
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}   
          />
          
          <PixelGrid
            brushColor={brushColor}
            clearSignal={clearSignal}
            setBrushColor={updateBrushColor}
            recentColors={recentColors}
            gridSize={gridSize}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;