export function cubePositions(heights: number[][]): Array<[number, number, number]> {
  const rows = heights.length;
  if (rows === 0) return [];

  let maxCols = 0;
  for (const row of heights) {
    if (row && row.length > maxCols) {
      maxCols = row.length;
    }
  }
  if (maxCols === 0) return [];

  const positions: Array<[number, number, number]> = [];

  for (let r = 0; r < rows; r++) {
    const row = heights[r] || [];
    for (let c = 0; c < row.length; c++) {
      const rawH = row[c];
      const h = Math.max(0, Math.floor(rawH || 0));
      for (let k = 0; k < h; k++) {
        const x = c - (maxCols - 1) / 2;
        const y = k + 0.5;
        const z = r - (rows - 1) / 2;
        positions.push([x, y, z]);
      }
    }
  }

  return positions;
}

export interface IsoFace {
  points: string;
  face: 'top' | 'left' | 'right';
}

export function isoFaces(heights: number[][]): IsoFace[] {
  const rows = heights.length;
  if (rows === 0) return [];

  interface CubeCoord {
    r: number;
    c: number;
    k: number;
  }

  const cubes: CubeCoord[] = [];

  for (let r = 0; r < rows; r++) {
    const row = heights[r] || [];
    for (let c = 0; c < row.length; c++) {
      const rawH = row[c];
      const h = Math.max(0, Math.floor(rawH || 0));
      for (let k = 0; k < h; k++) {
        cubes.push({ r, c, k });
      }
    }
  }

  // Sort from far to near:
  // (r + c) ascending ensures farther cubes are drawn first.
  // Then r ascending, then k ascending (bottom layers drawn before top layers).
  cubes.sort((a, b) => {
    const depthA = a.r + a.c;
    const depthB = b.r + b.c;
    if (depthA !== depthB) return depthA - depthB;
    if (a.r !== b.r) return a.r - b.r;
    return a.k - b.k;
  });

  const dx = 30;
  const dy = 17;
  const H = 34;

  const faces: IsoFace[] = [];

  for (const cube of cubes) {
    const cx = (cube.c - cube.r) * dx;
    const cy = (cube.c + cube.r) * dy - cube.k * H;

    // Left face
    const leftPoints = `${cx - dx},${cy} ${cx},${cy + dy} ${cx},${cy + dy + H} ${cx - dx},${cy + H}`;
    faces.push({ points: leftPoints, face: 'left' });

    // Right face
    const rightPoints = `${cx},${cy + dy} ${cx + dx},${cy} ${cx + dx},${cy + H} ${cx},${cy + dy + H}`;
    faces.push({ points: rightPoints, face: 'right' });

    // Top face
    const topPoints = `${cx},${cy - dy} ${cx + dx},${cy} ${cx},${cy + dy} ${cx - dx},${cy}`;
    faces.push({ points: topPoints, face: 'top' });
  }

  return faces;
}

