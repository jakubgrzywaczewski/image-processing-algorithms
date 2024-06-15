import React, { useState } from 'react';

import Canvas from './components/Canvas.js';
import { applyGrayscaleAlgorithm, applyMainAlgorithm, applyReverseAlgorithm } from './helpers.js';
import { ImageUploader } from './components/ImageUploader.js';
import { Button } from './components/Button.js';

function App() {
  const [imageData, setImageData] = useState<ImageData | null>(null);

  return (
    <div>
      <ImageUploader setImageData={setImageData} />
      <Button onClick={() => applyMainAlgorithm}>Use Main Algorithm</Button>
      <Button onClick={() => applyGrayscaleAlgorithm}>Use Grayscale Algorithm</Button>
      <Button onClick={() => applyReverseAlgorithm}>Use Reverse Algorithm</Button>
      <Canvas imageData={imageData} processImage={applyMainAlgorithm} />
    </div>
  );
}

export default App;
