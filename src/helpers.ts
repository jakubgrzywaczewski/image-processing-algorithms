export const applyMainAlgorithm = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const width = imageData.width;

  for (let i = 0; i < data.length; i += 4) {
    if (data && data.length && data[i] !== undefined && data[i + 1] !== undefined && data[i + 2] !== undefined) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const newColor = gray < 128 ? 0 : 255;
      const error = gray - newColor;

      data[i] = data[i + 1] = data[i + 2] = newColor;

      if (i + 4 < data.length) {
        data[i + 4] += (error * 7) / 16;
        data[i + 5] += (error * 7) / 16;
        data[i + 6] += (error * 7) / 16;
      }
      if (i + 4 * width - 4 < data.length) {
        data[i + 4 * width - 4] += (error * 3) / 16;
        data[i + 4 * width - 3] += (error * 3) / 16;
        data[i + 4 * width - 2] += (error * 3) / 16;
      }
      if (i + 4 * width < data.length) {
        data[i + 4 * width] += (error * 5) / 16;
        data[i + 4 * width + 1] += (error * 5) / 16;
        data[i + 4 * width + 2] += (error * 5) / 16;
      }
      if (i + 4 * width + 4 < data.length) {
        data[i + 4 * width + 4] += error / 16;
        data[i + 4 * width + 5] += error / 16;
        data[i + 4 * width + 6] += error / 16;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const applyGrayscaleAlgorithm = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data && data[i] !== undefined && data[i + 1] !== undefined && data[i + 2] !== undefined) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const applyReverseAlgorithm = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    if (data && data.length && data[i] !== undefined && data[i + 1] !== undefined && data[i + 2] !== undefined) {
      data[i] = 255 - data[i]; // R
      data[i + 1] = 255 - data[i + 1]; // G
      data[i + 2] = 255 - data[i + 2]; // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
};
