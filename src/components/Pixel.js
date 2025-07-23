import React from 'react';

function Pixel ({color,onClick,onMouseEnter}) {
  return (
    <div
    
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    style={{
      width: '20px',
      height: '20px',
      backgroundColor: color,
      border: '1px solid #ccc',
      cursor: 'pointer'
    }}
    />
  );
}

export default Pixel;