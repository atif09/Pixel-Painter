import React from 'react';

const Pixel = ({ color, onClick, onMouseEnter, style }) => {
  return (
    <div
      className="pixel"
      style={{
        backgroundColor: color,
        ...style
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    />
  );
};

export default Pixel;