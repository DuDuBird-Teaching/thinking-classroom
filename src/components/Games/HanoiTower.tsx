import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './GameStyles.module.css';

type PegKey = 'A' | 'B' | 'C';
type DiskState = { pegs: Record<PegKey, number[]>; diskCount: number };

const PEG_COLORS = [
  '#b85c38', '#c46a48', '#d48a6f', '#e8a87c', '#f0c4a6', '#f5e6d3', '#e39660',
];

export default function HanoiTower(): React.ReactElement {
  const [diskCount, setDiskCount] = useState(3);
  const [pegs, setPegs] = useState<Record<PegKey, number[]>>({
    A: [3, 2, 1],
    B: [],
    C: [],
  });
  const [selectedPeg, setSelectedPeg] = useState<PegKey | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [message, setMessage] = useState('点击柱子选择/移动圆盘');
  const [won, setWon] = useState(false);

  const minMoves = 2 ** diskCount - 1;

  const resetGame = useCallback(
    (count?: number) => {
      const n = count ?? diskCount;
      const disks: number[] = [];
      for (let i = n; i >= 1; i--) disks.push(i);
      setPegs({ A: disks, B: [], C: [] });
      setSelectedPeg(null);
      setMoveCount(0);
      setMessage(`最少需要 ${2 ** n - 1} 步，试试看！`);
      setWon(false);
      if (count) setDiskCount(count);
    },
    [diskCount]
  );

  const handlePegClick = useCallback(
    (peg: PegKey) => {
      if (won) return;

      if (selectedPeg === null) {
        // 选择来源柱
        if (pegs[peg].length === 0) {
          setMessage('这根柱子上没有圆盘，请选择有圆盘的柱子。');
          return;
        }
        setSelectedPeg(peg);
        setMessage(`已选中 ${peg} 柱，请点击目标柱子。`);
      } else {
        // 选择目标柱
        if (selectedPeg === peg) {
          setSelectedPeg(null);
          setMessage('已取消选择。点击柱子选择/移动圆盘');
          return;
        }

        const sourceDisk = pegs[selectedPeg][pegs[selectedPeg].length - 1];
        const targetTop = pegs[peg][pegs[peg].length - 1];

        if (targetTop !== undefined && sourceDisk > targetTop) {
          setMessage('❌ 不能将大盘放在小盘上面！');
          setSelectedPeg(null);
          return;
        }

        const newPegs = { ...pegs };
        newPegs[selectedPeg] = newPegs[selectedPeg].slice(0, -1);
        newPegs[peg] = [...newPegs[peg], sourceDisk];
        setPegs(newPegs);
        setMoveCount((m) => m + 1);
        setSelectedPeg(null);
        setMessage(`✅ 将圆盘 ${sourceDisk} 从 ${selectedPeg} 移到 ${peg}`);

        // Check win
        if (peg === 'C' && newPegs.C.length === diskCount) {
          setWon(true);
          if (moveCount + 1 === minMoves) {
            setMessage('🏆 完美！你用了最少步数！');
          } else {
            setMessage(`🎉 恭喜完成！用了 ${moveCount + 1} 步（最少 ${minMoves} 步）。`);
          }
        }
      }
    },
    [selectedPeg, pegs, won, diskCount, moveCount, minMoves]
  );

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🗼 河内塔</div>
      <div className={styles.gameScore}>
        <span>
          圆盘数：<span className={styles.gameScoreValue}>{diskCount}</span>
        </span>
        <span>
          步数：<span className={styles.gameScoreValue}>{moveCount}</span> / 最少 {minMoves}
        </span>
        <span>
          {diskCount <= 3
            ? '简单'
            : diskCount <= 5
              ? '中等'
              : '困难'}
        </span>
      </div>

      <div className={styles.hanoiContainer}>
        {(Object.keys(pegs) as PegKey[]).map((peg) => (
          <div
            key={peg}
            className={styles.hanoiPeg}
            onClick={() => handlePegClick(peg)}
            style={{ cursor: won ? 'default' : 'pointer' }}
          >
            <div
              className={styles.hanoiPegLabel}
              style={{
                color: selectedPeg === peg ? 'var(--ifm-color-primary)' : undefined,
                fontWeight: selectedPeg === peg ? 800 : 600,
              }}
            >
              {peg}
            </div>
            <div
              className={styles.hanoiPegStick}
              style={{
                background:
                  selectedPeg === peg
                    ? 'var(--ifm-color-primary)'
                    : undefined,
              }}
            >
              {pegs[peg].map((disk, i) => (
                <div
                  key={i}
                  className={styles.hanoiDisk}
                  style={{
                    width: `${20 + disk * 18}px`,
                    background: PEG_COLORS[(disk - 1) % PEG_COLORS.length],
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.gameRow} style={{ justifyContent: 'center', marginTop: '1rem' }}>
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            className={`${styles.gameButton} ${diskCount === n ? '' : styles.gameButtonSecondary}`}
            onClick={() => resetGame(n)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            {n} 盘
          </button>
        ))}
      </div>

      <div className={styles.gameRow} style={{ justifyContent: 'center' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={() => resetGame()}>
          🔄 重新开始
        </button>
      </div>

      {message && (
        <div
          className={`${styles.gameFeedback} ${
            won ? styles.gameFeedbackSuccess : styles.gameFeedbackInfo
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
