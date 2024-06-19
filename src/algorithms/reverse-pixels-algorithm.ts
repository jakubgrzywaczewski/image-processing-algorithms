export const applyReverseAlgorithm = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]!; // R
    data[i + 1] = 255 - data[i + 1]!; // G
    data[i + 2] = 255 - data[i + 2]!; // B
  }

  ctx.putImageData(imageData, 0, 0);
};
