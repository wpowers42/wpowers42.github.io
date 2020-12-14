const colorscaleValue = [
  [0.00, { r: 238, g: 238, b: 238 }],
  [0.01, { r: 210, g: 34, b: 45 }],
  [0.40, { r: 210, g: 34, b: 45 }],
  [0.65, { r: 255, g: 191, b: 0 }],
  [1.00, { r: 35, g: 136, b: 35 }],
];

const numInRange = (pct, numStart, numEnd) => numStart - (numStart - numEnd) * pct;

const ratingColorScale = (colorArr, ratingPct) => {
  const low = [...[...colorArr].reverse().find((color) => color[0] <= ratingPct)];
  const high = [...colorArr.find((color) => color[0] >= ratingPct)];
  return ([low, high]);
};
const getColor = (rating, colorArr = colorscaleValue) => {
  const ratingPct = rating / 10;
  const [low, high] = ratingColorScale(colorArr, ratingPct);
  const rangePct = (ratingPct - low[0]) / (high[0] - low[0]);
  const color = {};
  ['r', 'g', 'b'].forEach((c) => {
    const c1 = low[1][c];
    const c2 = high[1][c];
    const c3 = c1 === c2 ? c1 : numInRange(rangePct, c1, c2);
    color[c] = c3;
  });
  return color;
};

export { getColor };
