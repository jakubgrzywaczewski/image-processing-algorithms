import { useState } from 'react';

import './App.css';
import Canvas from './components/Canvas';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { applyGrayscaleAlgorithm, applyMainAlgorithm, applyReverseAlgorithm } from './helpers';

function App() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  const handleImageUpload = (data: ImageData) => {
    setImageData(data);
    setOriginalImageData(data);
  };

  const restoreOriginal = () => {
    if (originalImageData && canvasContext) {
      canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
      canvasContext.putImageData(originalImageData, 0, 0);
    }
  };

  return (
    <main>
      <Canvas setCanvasContext={setCanvasContext} imageData={imageData} />
      <nav>
        <ImageUploader setImageData={handleImageUpload} />
        {canvasContext && imageData && (
          <>
            <Button onClick={() => applyMainAlgorithm(canvasContext)}>Use Main Algorithm</Button>
            <Button onClick={() => applyGrayscaleAlgorithm(canvasContext)}>Use Grayscale Algorithm</Button>
            <Button onClick={() => applyReverseAlgorithm(canvasContext)}>Use Reverse Algorithm</Button>
            <Button onClick={restoreOriginal}>Restore Original</Button>
          </>
        )}
      </nav>
    </main>
  );
}

export default App;
