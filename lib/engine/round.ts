export function roundHalfUp(x: number, d: number): number {
  const m = 10 ** d;
  return Math.floor(x * m + 0.5 + 1e-9) / m;
}

export function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}
