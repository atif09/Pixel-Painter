import React from 'react';

// Update the Pixel component to accept and use the style prop:

const Pixel = ({ color, onClick, onMouseEnter, style }) => {
  return (
    <div
      className="pixel"
      style={{
        backgroundColor: color,
        ...style // Apply any additional styles passed in
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
};

export default Pixel;