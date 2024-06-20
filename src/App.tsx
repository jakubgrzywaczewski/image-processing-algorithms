import { useState } from 'react';

import './App.css';
import Canvas from './components/Canvas';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';

import { applyFloydSteinbergDithering } from './algorithms/floyd-steinberg-dithering';
import { applyGrayscaleAlgorithm } from './algorithms/gray-scale';
import { applyReverseAlgorithm } from './algorithms/reverse-pixels-algorithm';

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
    <div className="wrapper">
      <header>
        <h1>Image Processing Algorithms</h1>
      </header>
      <main>
        <Canvas setCanvasContext={setCanvasContext} imageData={imageData} />
        <ImageUploader setImageData={handleImageUpload} />
      </main>
      <nav>
        {canvasContext && imageData && (
          <>
            <Button onClick={() => applyFloydSteinbergDithering(canvasContext)}>
              Floyd-Steinberg Dithering
            </Button>
            <Button onClick={() => applyGrayscaleAlgorithm(canvasContext)}>
              Grayscale Algorithm
            </Button>
            <Button onClick={() => applyReverseAlgorithm(canvasContext)}>Reverse Algorithm</Button>
            <Button onClick={restoreOriginal}>Restore Original</Button>
          </>
        )}
      </nav>
    </div>
  );
}

export default App;
