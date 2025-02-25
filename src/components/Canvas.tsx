import { useEffect, useRef } from 'react';

import './Canvas.css';

type CanvasProps = {
  setCanvasContext: (context: CanvasRenderingContext2D | null) => void;
  imageData: ImageData | null;
};

async function calculateScaledDimensions(
  imageBitmap: ImageBitmap,
  maxWidth: number,
  maxHeight: number,
) {
  const naturalWidth = imageBitmap.width;
  const naturalHeight = imageBitmap.height;

  // Determine if image is horizontal or vertical
  const isHorizontal = naturalWidth >= naturalHeight;

  let scale: number;
  if (isHorizontal) {
    // For horizontal images, adapt to width
    scale = Math.min(maxWidth / naturalWidth, 1);
  } else {
    // For vertical images, adapt to height
    scale = Math.min(maxHeight / naturalHeight, 1);
  }

  // Additional check to ensure we never exceed viewport constraints
  // Calculate dimensions after applying the initial scale
  let newWidth = naturalWidth * scale;
  let newHeight = naturalHeight * scale;

  // If after scaling, the height still exceeds maxHeight, scale down further
  if (newHeight > maxHeight) {
    const heightScale = maxHeight / newHeight;
    newWidth *= heightScale;
    newHeight = maxHeight;
    scale *= heightScale;
  }

  // Similarly for width
  if (newWidth > maxWidth) {
    const widthScale = maxWidth / newWidth;
    newHeight *= widthScale;
    newWidth = maxWidth;
    scale *= widthScale;
  }

  return { newWidth, newHeight, scale };
}

const Canvas = ({ setCanvasContext, imageData }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateCanvas = async () => {
      if (canvasRef.current && imageData) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          const imageBitmap = await createImageBitmap(imageData);
          // Leave some margin on the sides
          const maxWidth = window.innerWidth * 0.9;
          const maxHeight = window.innerHeight * 0.8;
          const { newWidth, newHeight } = await calculateScaledDimensions(
            imageBitmap,
            maxWidth,
            maxHeight,
          );

          // Set the actual canvas size to the calculated dimensions
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;

          // Clear and draw at the full canvas size
          context.clearRect(0, 0, newWidth, newHeight);
          context.drawImage(imageBitmap, 0, 0, newWidth, newHeight);

          setCanvasContext(context);
        }
      }
    };

    window.addEventListener('resize', updateCanvas);
    updateCanvas();
    return () => window.removeEventListener('resize', updateCanvas);
  }, [setCanvasContext, imageData]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
