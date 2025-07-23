import React, {useState, useEffect } from 'react';
import Pixel from './Pixel';


function PixelGrid({brushColor,clearSignal}){
  const gridSize =16;
  const totalPixels = gridSize * gridSize;


  const[pixels,setPixels]=useState(Array(totalPixels).fill('#ffffff'));

  const handlePaint = (index) => {
    const newPixels = [...pixels];
    newPixels[index] = brushColor;
    setPixels(newPixels);
  };

  useEffect(() => {
    if (clearSignal) {
      setPixels(Array(totalPixels).fill('#ffffff'));
    }
  }, [clearSignal]);

  return (
    <div
    style = {{
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, 20px)`,
      gap :'1px',
      marginTop: '10px'
    }}
    >
      {pixels.map((color, index) => (
        <Pixel 
        key={index}
        color={color}
        onClick={() => handlePaint(index)}
        />
      ))}
    </div>
  );
}

export default PixelGrid;

