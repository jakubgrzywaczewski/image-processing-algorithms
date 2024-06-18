import { useRef, useEffect } from 'react';
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
  const widthRatio = maxWidth / naturalWidth;
  const heightRatio = maxHeight / naturalHeight;
  const scale = Math.min(widthRatio, heightRatio, 1);
  const newWidth = naturalWidth * scale;
  const newHeight = naturalHeight * scale;

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
          const maxWidth = window.innerWidth;
          const maxHeight = window.innerHeight * 0.8;
          const { newWidth, newHeight } = await calculateScaledDimensions(
            imageBitmap,
            maxWidth,
            maxHeight,
          );

          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;

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
