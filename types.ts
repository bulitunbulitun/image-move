
export type GridState = boolean[];

export enum ActionType {
  ROTATE_CW = 'Rotate 90° CW',
  ROTATE_CCW = 'Rotate 90° CCW',
  FLIP_H = 'Flip Horizontal',
  FLIP_V = 'Flip Vertical',
  FLIP_D1 = 'Diagonal Flip (Main)',
  FLIP_D2 = 'Diagonal Flip (Anti)',
  INVERT = 'Invert Colors',
  CENTER_SYMMETRY = 'Center Symmetry',
  MOVE_UP = 'Move Up',
  MOVE_DOWN = 'Move Down',
  MOVE_LEFT = 'Move Left',
  MOVE_RIGHT = 'Move Right',
  CLEAR = 'Clear',
  RESIZE = 'Resize Grid'
}

export interface HistoryItem {
  id: string;
  action: ActionType;
  timestamp: Date;
  previousGrid: GridState;
}
