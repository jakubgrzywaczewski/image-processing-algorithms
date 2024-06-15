import React, { useRef, useEffect } from 'react';

type CanvasProps = {
  imageData: ImageData | null;
  processImage: (ctx: CanvasRenderingContext2D) => void;
};

const Canvas = ({ imageData, processImage }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && imageData) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.putImageData(imageData, 0, 0);
        processImage(ctx);
      }
    }
  }, [imageData, processImage]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
