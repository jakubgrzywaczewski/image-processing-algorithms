import type { ChangeEvent } from 'react';
import { useState } from 'react';

import './App.css';
import { applyFloydSteinbergDithering } from './algorithms/floyd-steinberg-dithering';
import { applyGrayscaleAlgorithm } from './algorithms/gray-scale';
import { applyReverseAlgorithm } from './algorithms/reverse-pixels-algorithm';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import {
  applyImageTransform,
  cloneImageData,
  downloadImageData,
  type ImageTransform,
} from './image-data';
import { Algorithm } from './types/algorithms';

function App() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const handleImageUpload = (data: ImageData) => {
    setImageData(cloneImageData(data));
    setOriginalImageData(cloneImageData(data));
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

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
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAlgorithmSelect = (algorithm: Algorithm) => {
    if (!imageData) return;

    const applyTransform = (transform: ImageTransform) => {
      setImageData((currentImageData) =>
        currentImageData ? applyImageTransform(currentImageData, transform) : currentImageData,
      );
    };

    switch (algorithm) {
      case Algorithm.FLOYD_STEINBERG:
        applyTransform(applyFloydSteinbergDithering);
        break;
      case Algorithm.GRAYSCALE:
        applyTransform(applyGrayscaleAlgorithm);
        break;
      case Algorithm.REVERSE:
        applyTransform(applyReverseAlgorithm);
        break;
      case Algorithm.RESTORE:
        if (originalImageData) {
          setImageData(cloneImageData(originalImageData));
        }
        break;
      case Algorithm.DOWNLOAD:
        downloadImageData(imageData);
        break;
    }
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Image Processing Algorithms</h1>
      </header>
      <main>
        <Canvas imageData={imageData} />
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
