export const applyGrayscaleAlgorithm = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r !== undefined && g !== undefined && b !== undefined) {
      const avg = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};
