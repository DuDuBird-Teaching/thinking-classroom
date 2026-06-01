import React, { useState, useCallback, useMemo } from 'react';
import styles from './GameStyles.module.css';

type HeapSizes = [number, number, number];

// minimax with alpha-beta pruning for Nim
function bestMove(heaps: HeapSizes): { heapIdx: number; take: number } | null {
  const nimSum = heaps[0] ^ heaps[1] ^ heaps[2];
  if (nimSum === 0) {
    // losing position, make a random small move
    for (let i = 0; i < 3; i++) {
      if (heaps[i] > 0) return { heapIdx: i, take: 1 };
    }
    return null;
  }

  // winning position: make XOR = 0
  for (let i = 0; i < 3; i++) {
    const target = heaps[i] ^ nimSum;
    if (target < heaps[i]) {
      return { heapIdx: i, take: heaps[i] - target };
    }
  }
  // fallback
  for (let i = 0; i < 3; i++) {
    if (heaps[i] > 0) return { heapIdx: i, take: 1 };
  }
  return null;
}

function isGameOver(heaps: HeapSizes): boolean {
  return heaps.every((h) => h === 0);
}

const INITIAL_HEAPS: HeapSizes = [3, 4, 5];

export default function NimGame(): React.ReactElement {
  const [heaps, setHeaps] = useState<HeapSizes>(INITIAL_HEAPS);
  const [selectedHeap, setSelectedHeap] = useState<number | null>(null);
  const [takeCount, setTakeCount] = useState(1);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [message, setMessage] = useState('你的回合，选择一堆石子来取。');
  const [gameOver, setGameOver] = useState(false);
  const [wins, setWins] = useState({ player: 0, ai: 0 });

  const totalStones = useMemo(() => heaps[0] + heaps[1] + heaps[2], [heaps]);

  const aiMove = useCallback(
    (currentHeaps: HeapSizes) => {
      const move = bestMove(currentHeaps);
      if (!move || isGameOver(currentHeaps)) return;

      setTimeout(() => {
        setHeaps((prev) => {
          const next = [...prev] as HeapSizes;
          next[move.heapIdx] -= move.take;
          return next;
        });
        setMessage(
          `AI 从第 ${move.heapIdx + 1} 堆取走 ${move.take} 颗石子。`
        );
        setPlayerTurn(true);
      }, 600);
    },
    []
  );

  const handleHeapClick = useCallback(
    (idx: number) => {
      if (!playerTurn || gameOver) return;
      if (selectedHeap === idx) {
        setSelectedHeap(null);
        setTakeCount(1);
      } else {
        setSelectedHeap(idx);
        setTakeCount(1);
      }
    },
    [playerTurn, gameOver, selectedHeap]
  );

  const handleTake = useCallback(() => {
    if (selectedHeap === null || !playerTurn || gameOver) return;
    if (takeCount > heaps[selectedHeap]) return;

    const nextHeaps = [...heaps] as HeapSizes;
    nextHeaps[selectedHeap] -= takeCount;
    setHeaps(nextHeaps);
    setSelectedHeap(null);
    setTakeCount(1);

    if (isGameOver(nextHeaps)) {
      setGameOver(true);
      setMessage('🎉 你赢了！你取走了最后一颗石子！');
      setWins((w) => ({ ...w, player: w.player + 1 }));
      return;
    }

    setMessage('AI 思考中…');
    setPlayerTurn(false);
    aiMove(nextHeaps);
  }, [selectedHeap, takeCount, playerTurn, gameOver, heaps, aiMove]);

  const handleReset = useCallback(() => {
    setHeaps(INITIAL_HEAPS);
    setSelectedHeap(null);
    setTakeCount(1);
    setPlayerTurn(true);
    setMessage('你的回合，选择一堆石子来取。');
    setGameOver(false);
  }, []);

  // Check if AI should start first
  const handleAiFirst = useCallback(() => {
    handleReset();
    setTimeout(() => {
      setPlayerTurn(false);
      setMessage('AI 先手，思考中…');
      setTimeout(() => aiMove(INITIAL_HEAPS), 300);
    }, 100);
    // Need to override the immediate reset
  }, [handleReset, aiMove]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🪨 Nim 取石子游戏</div>
      <div className={styles.gameScore}>
        <span>
          你 <span className={styles.gameScoreValue}>{wins.player}</span> 胜
        </span>
        <span>
          AI <span className={styles.gameScoreValue}>{wins.ai}</span> 胜
        </span>
        <span>
          剩余石子：<span className={styles.gameScoreValue}>{totalStones}</span>
        </span>
      </div>
      <div className={styles.gameBoard}>
        {heaps.map((count, idx) => (
          <div
            key={idx}
            className={`${styles.nimHeap} ${selectedHeap === idx ? styles.nimHeapSelected : ''}`}
            onClick={() => handleHeapClick(idx)}
          >
            <strong>第 {idx + 1} 堆</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 120 }}>
              {Array.from({ length: count }, (_, i) => (
                <span key={i} className={styles.nimStone} />
              ))}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-500)' }}>
              {count} 颗
            </span>
          </div>
        ))}
      </div>

      {selectedHeap !== null && playerTurn && !gameOver && (
        <div className={styles.gameRow} style={{ justifyContent: 'center' }}>
          <span>取走</span>
          <input
            type="range"
            min={1}
            max={heaps[selectedHeap]}
            value={takeCount}
            onChange={(e) => setTakeCount(Number(e.target.value))}
            style={{ width: 120 }}
          />
          <span className={styles.gameScoreValue}>{takeCount}</span>
          <span>颗</span>
          <button className={styles.gameButton} onClick={handleTake}>
            确认取子
          </button>
        </div>
      )}

      <div className={styles.gameRow} style={{ justifyContent: 'center', marginTop: '0.75rem' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleReset}>
          🔄 新游戏（你先手）
        </button>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleAiFirst}>
          🤖 AI 先手
        </button>
      </div>

      {message && (
        <div
          className={`${styles.gameFeedback} ${
            gameOver ? styles.gameFeedbackSuccess : styles.gameFeedbackInfo
          }`}
        >
          {message}
        </div>
      )}

      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-500)' }}>
        规则：每次从任意一堆中取走至少 1 颗石子，取走最后一颗者获胜。
        {playerTurn && !gameOver && ' 提示：堆大小异或和为 0 时是必败局面。'}
      </p>
    </div>
  );
}
