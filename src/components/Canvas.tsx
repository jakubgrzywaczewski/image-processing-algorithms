import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

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

  return { newWidth, newHeight, scale, naturalWidth, naturalHeight };
}

const Canvas = ({ setCanvasContext, imageData }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100); // 100% is the default zoom level
  const [originalImageBitmap, setOriginalImageBitmap] = useState<ImageBitmap | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [baseScale, setBaseScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartY, setDragStartY] = useState<number>(0);

  // This effect loads the image and sets up the canvas
  useEffect(() => {
    const setupCanvas = async () => {
      if (imageData) {
        const bitmap = await createImageBitmap(imageData);
        setOriginalImageBitmap(bitmap);

        // Calculate the base dimensions (100% zoom) - this will be the fixed canvas size
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.8;
        const { newWidth, newHeight, scale } = await calculateScaledDimensions(
          bitmap,
          maxWidth,
          maxHeight,
        );

        // Save the base scale (default fit)
        setBaseScale(scale);

        // Set the fixed canvas dimensions
        setCanvasWidth(newWidth);
        setCanvasHeight(newHeight);

        if (canvasRef.current) {
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
        }

        // Reset offset when loading a new image
        setOffsetX(0);
        setOffsetY(0);
      }
    };

    setupCanvas();
  }, [imageData]);

  // This effect handles drawing with the current zoom level and position
  useEffect(() => {
    const updateCanvas = async () => {
      if (canvasRef.current && originalImageBitmap && canvasWidth && canvasHeight && baseScale) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          // Clear the canvas
          context.clearRect(0, 0, canvasWidth, canvasHeight);

          // Calculate the zoom factor
          // 0% -> 0, 100% -> baseScale, 200% -> baseScale * 2
          const zoomFactor = (zoomLevel / 100) * baseScale;

          // Calculate dimensions of the zoomed image
          const zoomedWidth = originalImageBitmap.width * zoomFactor;
          const zoomedHeight = originalImageBitmap.height * zoomFactor;

          // Calculate positioning to center the zoomed image, plus the current offset
          const centerX = (canvasWidth - zoomedWidth) / 2 + offsetX;
          const centerY = (canvasHeight - zoomedHeight) / 2 + offsetY;

          // Draw the image with zoom applied, at the offset position
          context.drawImage(originalImageBitmap, centerX, centerY, zoomedWidth, zoomedHeight);

          setCanvasContext(context);
        }
      }
    };

    window.addEventListener('resize', updateCanvas);
    updateCanvas();
    return () => window.removeEventListener('resize', updateCanvas);
  }, [
    setCanvasContext,
    originalImageBitmap,
    canvasWidth,
    canvasHeight,
    zoomLevel,
    baseScale,
    offsetX,
    offsetY,
  ]);

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLevel(parseInt(e.target.value, 10));
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setIsDragging(true);
      setDragStartX(mouseX - offsetX);
      setDragStartY(mouseY - offsetY);

      // Set the cursor to grabbing
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grabbing';
      }
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setOffsetX(mouseX - dragStartX);
      setOffsetY(mouseY - dragStartY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Reset cursor
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);

      // Reset cursor
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grab';
      }
    }
  };

  // Set initial grab cursor when component mounts
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, []);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <div className="zoom-control">
        <input
          type="range"
          min="0"
          max="200"
          value={zoomLevel}
          onChange={handleZoomChange}
          className="zoom-slider"
        />
        <span className="zoom-label">{zoomLevel}%</span>
      </div>
    </div>
  );
};

export default Canvas;
