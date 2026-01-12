
import React, { useState, useCallback } from 'react';
import { 
  RotateCw, RotateCcw, 
  FlipHorizontal, FlipVertical, 
  MoveUp, MoveDown, MoveLeft, MoveRight, 
  Trash2, Eye, EyeOff, History as HistoryIcon,
  CircleDot, Undo2, ListX,
  SquareDashed, MousePointer2, Shuffle
} from 'lucide-react';
import { GridState, ActionType, HistoryItem } from './types';
import { 
  rotateCW, rotateCCW, flipHorizontal, flipVertical, centerSymmetry, translate,
  flipDiagonalMain, flipDiagonalAnti, invertGrid
} from './utils/transformations';

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState<number>(4);
  const [grid, setGrid] = useState<GridState>(new Array(16).fill(false));
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const updateGrid = useCallback((newGrid: GridState, action: ActionType) => {
    const currentGrid = [...grid];
    setGrid(newGrid);
    setHistory(prev => [
      { 
        id: Math.random().toString(36).substr(2, 9), 
        action, 
        timestamp: new Date(),
        previousGrid: currentGrid
      },
      ...prev.slice(0, 49)
    ]);
  }, [grid]);

  const handleResize = (newSize: number) => {
    setGridSize(newSize);
    setGrid(new Array(newSize * newSize).fill(false));
    setHistory([]);
    setIsHidden(false);
  };

  const toggleCell = (index: number) => {
    if (isHidden) return;
    const newGrid = [...grid];
    newGrid[index] = !newGrid[index];
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    const currentGrid = [...grid];
    setGrid(new Array(gridSize * gridSize).fill(false));
    setHistory(prev => [
      { 
        id: Math.random().toString(36).substr(2, 9), 
        action: ActionType.CLEAR, 
        timestamp: new Date(),
        previousGrid: currentGrid
      },
      ...prev
    ]);
    setIsHidden(false);
  };

  const undoLastAction = () => {
    if (history.length === 0) return;
    const [lastAction, ...remainingHistory] = history;
    setGrid(lastAction.previousGrid);
    setHistory(remainingHistory);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app-container p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-3 shrink-0">
        <div className="text-left">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">空间想象力训练</h1>
          <p className="text-slate-500 text-[10px] mt-0.5 font-medium">Spatial Reasoning v1.3</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsHidden(!isHidden)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-bold transition-all shadow-sm active:scale-95 text-xs ${
              isHidden ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            {isHidden ? <><Eye size={14} /> 显示</> : <><EyeOff size={14} /> 预测</>}
          </button>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-md font-bold hover:bg-red-100 transition-all shadow-sm active:scale-95 text-xs"
          >
            <Trash2 size={14} /> 清空
          </button>
        </div>
      </header>

      <main className="flex gap-4 flex-1 min-h-0">
        {/* Left Side: Controls (200px) */}
        <aside className="w-[200px] flex flex-col gap-3 shrink-0">
          <section className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <CircleDot size={10} /> 基础设置
            </h2>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-medium text-slate-700 outline-none cursor-pointer hover:border-indigo-200 transition-all"
              value={gridSize}
              onChange={(e) => handleResize(parseInt(e.target.value))}
            >
              <option value={3}>3 x 3</option>
              <option value={4}>4 x 4</option>
              <option value={5}>5 x 5</option>
              <option value={6}>6 x 6</option>
            </select>
          </section>

          <section className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex-1 overflow-y-auto custom-scrollbar">
            <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
              <RotateCw size={10} /> 变换
            </h2>
            <div className="flex flex-col gap-1.5 pb-2">
              <ControlButton icon={<RotateCw size={14} />} label="顺时针 90°" onClick={() => updateGrid(rotateCW(grid, gridSize), ActionType.ROTATE_CW)} />
              <ControlButton icon={<RotateCcw size={14} />} label="逆时针 90°" onClick={() => updateGrid(rotateCCW(grid, gridSize), ActionType.ROTATE_CCW)} />
              <ControlButton icon={<FlipHorizontal size={14} />} label="水平翻转" onClick={() => updateGrid(flipHorizontal(grid, gridSize), ActionType.FLIP_H)} />
              <ControlButton icon={<FlipVertical size={14} />} label="垂直翻转" onClick={() => updateGrid(flipVertical(grid, gridSize), ActionType.FLIP_V)} />
              <ControlButton icon={<SquareDashed size={14} className="rotate-45" />} label="主对角线翻转" onClick={() => updateGrid(flipDiagonalMain(grid, gridSize), ActionType.FLIP_D1)} />
              <ControlButton icon={<SquareDashed size={14} className="-rotate-45" />} label="副对角线翻转" onClick={() => updateGrid(flipDiagonalAnti(grid, gridSize), ActionType.FLIP_D2)} />
              <ControlButton icon={<div className="font-black text-[10px]">Ω</div>} label="中心对称" onClick={() => updateGrid(centerSymmetry(grid, gridSize), ActionType.CENTER_SYMMETRY)} />
              <ControlButton icon={<Shuffle size={14} />} label="颜色反转" onClick={() => updateGrid(invertGrid(grid), ActionType.INVERT)} />
            </div>
          </section>
        </aside>

        {/* Center: Canvas */}
        <div className="flex-1 flex flex-col gap-3 bg-white rounded-xl shadow-sm border border-slate-200 p-4 items-center justify-center min-w-0">
          <div 
            className="grid gap-1 w-full max-w-[300px] aspect-square bg-slate-100 p-2 rounded-lg border border-slate-200 shadow-inner"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {grid.map((isActive, i) => (
              <button
                key={i}
                onClick={() => toggleCell(i)}
                className={`
                  w-full h-full rounded transition-all duration-300
                  ${isActive && !isHidden ? 'bg-indigo-900 shadow-md scale-95' : 'bg-white hover:bg-slate-50'}
                  ${isHidden ? 'cursor-not-allowed opacity-30 bg-slate-200' : 'cursor-pointer active:scale-90'}
                `}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div />
            <NavButton icon={<MoveUp size={18} />} onClick={() => updateGrid(translate(grid, gridSize, -1, 0), ActionType.MOVE_UP)} />
            <div />
            <NavButton icon={<MoveLeft size={18} />} onClick={() => updateGrid(translate(grid, gridSize, 0, -1), ActionType.MOVE_LEFT)} />
            <div className="flex items-center justify-center font-black text-slate-300 text-[8px] uppercase tracking-tighter">平移</div>
            <NavButton icon={<MoveRight size={18} />} onClick={() => updateGrid(translate(grid, gridSize, 0, 1), ActionType.MOVE_RIGHT)} />
            <div />
            <NavButton icon={<MoveDown size={18} />} onClick={() => updateGrid(translate(grid, gridSize, 1, 0), ActionType.MOVE_DOWN)} />
            <div />
          </div>
        </div>

        {/* Right: History (200px) */}
        <aside className="w-[200px] flex flex-col shrink-0">
          <section className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h2 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <HistoryIcon size={10} /> 历史
              </h2>
              <div className="flex gap-0.5">
                <HistoryActionBtn icon={<Undo2 size={12} />} onClick={undoLastAction} disabled={history.length === 0} title="撤回" />
                <HistoryActionBtn icon={<ListX size={12} />} onClick={clearHistory} disabled={history.length === 0} title="清空" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30 text-slate-400 italic">
                   <span className="text-[10px]">暂无记录</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div key={item.id} className="flex flex-col border-l-2 border-indigo-100 pl-2 py-1 bg-slate-50/50 rounded-r">
                      <span className="text-[10px] font-bold text-slate-700 leading-tight truncate">{item.action}</span>
                      <span className="text-[8px] text-slate-400 font-mono">{item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <button 
                onClick={undoLastAction}
                className="mt-2 w-full py-1.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-1 shrink-0 active:scale-95 shadow-sm"
              >
                <Undo2 size={12} /> 撤回
              </button>
            )}
          </section>
        </aside>
      </main>

      <footer className="mt-2 text-center text-slate-400 text-[8px] font-medium tracking-wide shrink-0">
        COMPACT WORKSPACE • v1.3 • 975x506
      </footer>
    </div>
  );
};

/* Helper Components */

const ControlButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-2 py-1.5 text-slate-700 hover:bg-indigo-600 hover:text-white rounded border border-slate-50 hover:border-indigo-600 w-full group shadow-sm active:scale-95 bg-slate-50/50 transition-colors"
  >
    <span className="bg-white p-1 rounded group-hover:bg-indigo-500 transition-colors shadow-sm text-indigo-600 group-hover:text-white shrink-0">{icon}</span>
    <span className="font-bold text-[10px] tracking-tight truncate">{label}</span>
  </button>
);

const NavButton: React.FC<{ icon: React.ReactNode, onClick: () => void, disabled?: boolean }> = ({ icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center w-10 h-10 rounded border transition-all
      ${disabled ? 'bg-slate-50 border-slate-100 opacity-40' : 'bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-sm active:scale-90'}
    `}
  >
    {icon}
  </button>
);

const HistoryActionBtn: React.FC<{ icon: React.ReactNode, onClick: () => void, disabled: boolean, title: string }> = ({ icon, onClick, disabled, title }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    title={title}
    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-20 border border-transparent active:scale-90"
  >
    {icon}
  </button>
);

export default App;
