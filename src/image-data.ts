export type ImageTransform = (context: CanvasRenderingContext2D) => void;

export const cloneImageData = (imageData: ImageData): ImageData =>
  new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height);

export const imageDataToCanvas = (imageData: ImageData): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create a 2D canvas context.');
  }

  context.putImageData(imageData, 0, 0);
  return canvas;
};

export const applyImageTransform = (imageData: ImageData, transform: ImageTransform): ImageData => {
  const canvas = imageDataToCanvas(cloneImageData(imageData));
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to create a 2D canvas context.');
  }

  transform(context);
  return context.getImageData(0, 0, canvas.width, canvas.height);
};

export const downloadImageData = (imageData: ImageData): void => {
  const canvas = imageDataToCanvas(imageData);
  const link = document.createElement('a');
  link.download = 'processed-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};
