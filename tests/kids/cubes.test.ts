import { describe, expect, it } from 'vitest';
import { cubePositions, isoFaces } from '@/lib/kids/cubes';

describe('cubes geometry', () => {
  describe('cubePositions', () => {
    it('generates centered positions for [[2,1,0],[1,1,3]]', () => {
      const heights = [
        [2, 1, 0],
        [1, 1, 3],
      ];
      const positions = cubePositions(heights);

      // Total cubes: 2 + 1 + 0 + 1 + 1 + 3 = 8
      expect(positions).toHaveLength(8);

      // Check column 0, row 0, layer 1:
      // maxCols = 3, rows = 2
      // x = 0 - (3 - 1) / 2 = -1
      // y = 1 + 0.5 = 1.5
      // z = 0 - (2 - 1) / 2 = -0.5
      const target = positions.find(
        ([x, y, z]) => Math.abs(x - -1) < 1e-4 && Math.abs(y - 1.5) < 1e-4 && Math.abs(z - -0.5) < 1e-4,
      );
      expect(target).toBeDefined();
    });

    it('returns empty array for [[0,0]]', () => {
      expect(cubePositions([[0, 0]])).toEqual([]);
    });

    it('handles negative and non-integer heights [[-1, 2.7]]', () => {
      // -1 -> 0, 2.7 -> 2 => 2 positions
      const positions = cubePositions([[-1, 2.7]]);
      expect(positions).toHaveLength(2);
    });

    it('does not throw on ragged rows [[1],[1,1]]', () => {
      expect(() => cubePositions([[1], [1, 1]])).not.toThrow();
      expect(cubePositions([[1], [1, 1]])).toHaveLength(3);
    });
  });

  describe('isoFaces', () => {
    it('returns 6 faces for [[1, 1]]', () => {
      const faces = isoFaces([[1, 1]]);
      expect(faces).toHaveLength(6);
      for (const face of faces) {
        expect(['top', 'left', 'right']).toContain(face.face);
        expect(typeof face.points).toBe('string');
        expect(face.points.length).toBeGreaterThan(0);
      }
    });

    it('orders faces so nearer row (larger r) comes after farther row at same col', () => {
      // 2 rows, 1 col: row 0 (farther) and row 1 (nearer)
      const heights = [[1], [1]];
      const faces = isoFaces(heights);
      expect(faces).toHaveLength(6);

      // Faces of row 0 vs row 1:
      // All faces of the nearer cube (row 1) must appear after all faces of the farther cube (row 0)
      const row0Faces = faces.slice(0, 3);
      const row1Faces = faces.slice(3, 6);

      expect(row0Faces).toHaveLength(3);
      expect(row1Faces).toHaveLength(3);
      // Ensure row1 faces are rendered after row0 faces
      expect(faces.indexOf(row1Faces[0])).toBeGreaterThan(faces.indexOf(row0Faces[2]));
    });
  });
});
