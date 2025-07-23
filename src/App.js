import React, { useState } from 'react';

import PixelGrid from './components/PixelGrid';

function App(){
  const [brushColor, setBrushColor] = useState ('#000000');
  const [clearSignal, setClearSignal] = useState (false);


const handleClear= () => {
  setClearSignal(true);
  setTimeout(() => setClearSignal(false),0);
};


return (
  <div style = {{ padding : '20px', fontFamily: 'sans-serif'}}>
    <h1>Pixel Painter</h1>

    <input
    type ='color'
    value ={brushColor}
    onChange = {(e) => setBrushColor(e.target.value)}
    style={{ marginBottom: '10px'}}
    />

    <button onClick={handleClear} style ={{marginLeft: '10px'}}>
      Reset Grid
    </button>

    <PixelGrid brushColor={brushColor} clearSignal={clearSignal}/>


    
  </div>
);
}

export default App;

