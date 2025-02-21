import { useState } from 'react';

import './App.css';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            handleImageUpload(imageData);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlgorithmSelect = (algorithm: string) => {
    if (!canvasContext) return;

    switch (algorithm) {
      case 'floyd-steinberg':
        applyFloydSteinbergDithering(canvasContext);
        break;
      case 'grayscale':
        applyGrayscaleAlgorithm(canvasContext);
        break;
      case 'reverse':
        applyReverseAlgorithm(canvasContext);
        break;
      default:
        break;
    }
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Image Processing Algorithms</h1>
      </header>
      <main>
        <Canvas setCanvasContext={setCanvasContext} imageData={imageData} />
      </main>
      <Toolbar
        hasImage={!!imageData}
        onFileSelect={handleFileSelect}
        onAlgorithmSelect={handleAlgorithmSelect}
      />
    </div>
  );
}

export default App;
