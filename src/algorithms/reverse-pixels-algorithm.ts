export const applyReverseAlgorithm = (ctx: CanvasRenderingContext2D) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const originalR = data[i];
    const originalG = data[i + 1];
    const originalB = data[i + 2];

    data[i] = 255 - originalR!;
    data[i + 1] = 255 - originalG!;
    data[i + 2] = 255 - originalB!;
  }

  ctx.putImageData(imageData, 0, 0);
};
