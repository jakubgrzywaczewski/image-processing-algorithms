import type { MouseEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import './Canvas.css';
import { imageDataToCanvas } from '../image-data';

type CanvasProps = {
  imageData: ImageData | null;
};

export function calculateScaledDimensions(
  image: Pick<ImageData, 'width' | 'height'>,
  maxWidth: number,
  maxHeight: number,
) {
  const naturalWidth = image.width;
  const naturalHeight = image.height;
  const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
  const newWidth = Math.max(1, Math.round(naturalWidth * scale));
  const newHeight = Math.max(1, Math.round(naturalHeight * scale));

  return { newWidth, newHeight, scale, naturalWidth, naturalHeight };
}

const Canvas = ({ imageData }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  const sourceCanvas = useMemo(
    () => (imageData ? imageDataToCanvas(imageData) : null),
    [imageData],
  );
  const dimensions = useMemo(
    () =>
      imageData
        ? calculateScaledDimensions(imageData, viewport.width * 0.9, viewport.height * 0.8)
        : null,
    [imageData, viewport],
  );

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !sourceCanvas || !dimensions) return;

    const { newWidth, newHeight, scale } = dimensions;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = newWidth;
    canvasRef.current.height = newHeight;
    context.clearRect(0, 0, newWidth, newHeight);

    const zoomFactor = (zoomLevel / 100) * scale;
    const zoomedWidth = sourceCanvas.width * zoomFactor;
    const zoomedHeight = sourceCanvas.height * zoomFactor;
    const centerX = (newWidth - zoomedWidth) / 2 + offsetX;
    const centerY = (newHeight - zoomedHeight) / 2 + offsetY;

    context.drawImage(sourceCanvas, centerX, centerY, zoomedWidth, zoomedHeight);
  }, [sourceCanvas, dimensions, zoomLevel, offsetX, offsetY]);

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

      canvasRef.current.style.cursor = 'grabbing';
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

    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);

      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grab';
      }
    }
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'grab' }}
      />
      <div className="zoom-control">
        <input
          type="range"
          min="10"
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
