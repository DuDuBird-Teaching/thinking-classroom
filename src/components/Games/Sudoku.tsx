import React, { useState, useCallback, useMemo } from 'react';
import styles from './GameStyles.module.css';

type Cell = { value: number; given: boolean };
type Grid = Cell[][];

// 生成简易数独谜题（挖洞法）
function generatePuzzle(): { grid: Grid; solution: number[][] } {
  // 一个标准解作为种子
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  // 随机去掉一些格子
  const grid: Grid = solution.map((row) =>
    row.map((val) => ({
      value: Math.random() < 0.65 ? 0 : val,
      given: Math.random() < 0.65 ? false : true,
    }))
  );

  // 确保每行至少显示 3 个数字
  for (let r = 0; r < 9; r++) {
    const givenCount = grid[r].filter((c) => c.given).length;
    if (givenCount < 3) {
      const toAdd = 3 - givenCount;
      const empties = grid[r]
        .map((c, i) => (c.given ? -1 : i))
        .filter((i) => i >= 0);
      for (let k = 0; k < toAdd && k < empties.length; k++) {
        const idx = empties[Math.floor(Math.random() * empties.length)];
        grid[r][idx] = { value: solution[r][idx], given: true };
      }
    }
  }

  return { grid, solution };
}

export default function Sudoku(): React.ReactElement {
  const [puzzle, setPuzzle] = useState(() => generatePuzzle());
  const [userGrid, setUserGrid] = useState<(number | null)[][]>(
    puzzle.grid.map((row) => row.map((c) => (c.given ? c.value : null)))
  );
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (puzzle.grid[r][c].given) return;
      setSelectedCell([r, c]);
    },
    [puzzle]
  );

  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell) return;
      const [r, c] = selectedCell;

      setUserGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = num === prev[r][c] ? null : num;
        return next;
      });

      // Check error
      const newErrors = new Set(errors);
      const key = `${r},${c}`;
      if (num !== 0 && num !== puzzle.solution[r][c]) {
        newErrors.add(key);
      } else {
        newErrors.delete(key);
      }
      setErrors(newErrors);
    },
    [selectedCell, errors, puzzle.solution]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleNumberInput(0);
      } else if (e.key === 'ArrowUp' && r > 0) {
        setSelectedCell([r - 1, c]);
      } else if (e.key === 'ArrowDown' && r < 8) {
        setSelectedCell([r + 1, c]);
      } else if (e.key === 'ArrowLeft' && c > 0) {
        setSelectedCell([r, c - 1]);
      } else if (e.key === 'ArrowRight' && c < 8) {
        setSelectedCell([r, c + 1]);
      }
    },
    [selectedCell, handleNumberInput]
  );

  const handleCheck = useCallback(() => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!puzzle.grid[r][c].given) {
          if (userGrid[r][c] !== puzzle.solution[r][c]) {
            setMessage('还有错误，请再检查一下。');
            return;
          }
        }
      }
    }
    setMessage('🎉 恭喜！你完成了数独！');
  }, [userGrid, puzzle]);

  const handleReset = useCallback(() => {
    const p = generatePuzzle();
    setPuzzle(p);
    setUserGrid(p.grid.map((row) => row.map((c) => (c.given ? c.value : null))));
    setSelectedCell(null);
    setErrors(new Set());
    setMessage('');
  }, []);

  // Keyboard listener
  React.useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleNumberInput(0);
      } else if (e.key === 'ArrowUp' && r > 0) {
        e.preventDefault();
        setSelectedCell([r - 1, c]);
      } else if (e.key === 'ArrowDown' && r < 8) {
        e.preventDefault();
        setSelectedCell([r + 1, c]);
      } else if (e.key === 'ArrowLeft' && c > 0) {
        e.preventDefault();
        setSelectedCell([r, c - 1]);
      } else if (e.key === 'ArrowRight' && c < 8) {
        e.preventDefault();
        setSelectedCell([r, c + 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedCell, handleNumberInput]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🧩 数独</div>

      <div
        className={styles.sudokuGrid}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {userGrid.map((row, r) =>
          row.map((cell, c) => {
            const isGiven = puzzle.grid[r][c].given;
            const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
            const isError = errors.has(`${r},${c}`);
            const isSameNumber =
              cell &&
              selectedCell &&
              userGrid[selectedCell[0]][selectedCell[1]] === cell &&
              !(selectedCell[0] === r && selectedCell[1] === c);

            let className = styles.sudokuCell;
            if (isGiven) className += ` ${styles.sudokuCellGiven}`;
            if (!isGiven && cell) className += ` ${styles.sudokuCellUser}`;
            if (isSelected) className += ` ${styles.sudokuCellSelected}`;
            if (isError) className += ` ${styles.sudokuCellError}`;

            return (
              <button
                key={`${r}-${c}`}
                className={className}
                onClick={() => handleCellClick(r, c)}
                style={{
                  background: isSameNumber
                    ? 'var(--ifm-color-primary-lightest)'
                    : isSelected
                      ? undefined
                      : undefined,
                }}
              >
                {cell || ''}
              </button>
            );
          })
        )}
      </div>

      <div className={styles.gameRow} style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleCheck}>
          ✅ 检查答案
        </button>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleReset}>
          🔄 新题目
        </button>
      </div>

      <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)', textAlign: 'center' }}>
        点击格子后用键盘输入数字 1-9，方向键移动光标，Backspace 清除。
      </p>

      {message && (
        <div
          className={`${styles.gameFeedback} ${
            message.includes('恭喜') ? styles.gameFeedbackSuccess : styles.gameFeedbackInfo
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
