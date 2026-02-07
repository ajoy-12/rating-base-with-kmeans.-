/**
 * Rating-based K-Means Clustering - Full code
 * Use in browser or Node. Data: items with [quality, value, design] ratings (1-5).
 */

// --- 1. RATING DATA ---
const RATING_DATA = [
  { name: 'Product A', ratings: [4.8, 4.2, 4.5] },
  { name: 'Product B', ratings: [3.2, 4.8, 3.0] },
  { name: 'Product C', ratings: [4.5, 3.5, 4.8] },
  { name: 'Product D', ratings: [2.5, 2.8, 2.2] },
  { name: 'Product E', ratings: [4.9, 4.0, 4.7] },
  { name: 'Product F', ratings: [3.0, 4.5, 3.2] },
  { name: 'Product G', ratings: [2.2, 2.0, 2.5] },
  { name: 'Product H', ratings: [4.6, 4.4, 4.3] },
  { name: 'Product I', ratings: [3.5, 3.8, 3.6] },
  { name: 'Product J', ratings: [1.8, 2.2, 2.0] },
  { name: 'Product K', ratings: [4.2, 3.9, 4.1] },
  { name: 'Product L', ratings: [2.8, 3.2, 2.9] },
  { name: 'Product M', ratings: [4.7, 4.6, 4.4] },
  { name: 'Product N', ratings: [3.8, 4.1, 3.9] },
  { name: 'Product O', ratings: [2.0, 2.5, 2.3] },
];

// --- 2. EUCLIDEAN DISTANCE ---
function euclidean(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += (a[i] - b[i]) ** 2;
  return Math.sqrt(sum);
}

// --- 3. K-MEANS ---
function kmeans(points, k, maxIters = 100) {
  const n = points.length;
  const dim = points[0].length;
  let centroids = [];
  const used = new Set();
  while (centroids.length < k) {
    const i = Math.floor(Math.random() * n);
    if (!used.has(i)) {
      used.add(i);
      centroids.push([...points[i]]);
    }
  }
  let assignments = new Array(n).fill(0);

  for (let iter = 0; iter < maxIters; iter++) {
    const newAssignments = points.map(p => {
      let best = 0;
      let bestDist = Infinity;
      centroids.forEach((c, i) => {
        const d = euclidean(p, c);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      return best;
    });

    let changed = false;
    for (let i = 0; i < n; i++) {
      if (newAssignments[i] !== assignments[i]) changed = true;
      assignments[i] = newAssignments[i];
    }
    if (!changed) break;

    const sums = Array.from({ length: k }, () => new Array(dim).fill(0));
    const counts = new Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      counts[c]++;
      for (let d = 0; d < dim; d++) sums[c][d] += points[i][d];
    }
    for (let c = 0; c < k; c++) {
      for (let d = 0; d < dim; d++) {
        centroids[c][d] = counts[c] > 0 ? sums[c][d] / counts[c] : centroids[c][d];
      }
    }
  }
  return { assignments, centroids };
}

// --- 4. RUN (example) ---
const k = 3;
const points = RATING_DATA.map(item => item.ratings);
const { assignments, centroids } = kmeans(points, k);

console.log('Centroids:', centroids);
console.log('Assignments:', assignments);
RATING_DATA.forEach((item, i) => {
  console.log(`${item.name} -> Cluster ${assignments[i] + 1}`);
});

// Export for use in HTML / modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RATING_DATA, euclidean, kmeans };
}
