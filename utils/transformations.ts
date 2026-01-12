
import { GridState } from '../types';

export const rotateCW = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newRow = c;
      const newCol = size - 1 - r;
      const newIndex = newRow * size + newCol;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const rotateCCW = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newRow = size - 1 - c;
      const newCol = r;
      const newIndex = newRow * size + newCol;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const flipHorizontal = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newCol = size - 1 - c;
      const newIndex = r * size + newCol;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const flipVertical = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    const newRow = size - 1 - r;
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newIndex = newRow * size + c;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const flipDiagonalMain = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newIndex = c * size + r;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const flipDiagonalAnti = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newRow = size - 1 - c;
      const newCol = size - 1 - r;
      const newIndex = newRow * size + newCol;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const invertGrid = (grid: GridState): GridState => {
  return grid.map(val => !val);
};

export const centerSymmetry = (grid: GridState, size: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    const newRow = size - 1 - r;
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      const newCol = size - 1 - c;
      const newIndex = newRow * size + newCol;
      newGrid[newIndex] = grid[oldIndex];
    }
  }
  return newGrid;
};

export const translate = (grid: GridState, size: number, dr: number, dc: number): GridState => {
  const newGrid = new Array(size * size).fill(false);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const oldIndex = r * size + c;
      if (grid[oldIndex]) {
        const newRow = (r + dr + size) % size;
        const newCol = (c + dc + size) % size;
        const newIndex = newRow * size + newCol;
        newGrid[newIndex] = true;
      }
    }
  }
  return newGrid;
};
