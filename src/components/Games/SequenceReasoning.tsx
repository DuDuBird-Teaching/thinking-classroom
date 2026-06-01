import React, { useState, useCallback, useMemo } from 'react';
import styles from './GameStyles.module.css';

interface Sequence {
  id: number;
  sequence: number[];
  description: string;
  answer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const SEQUENCES: Sequence[] = [
  {
    id: 1,
    sequence: [1, 1, 2, 3, 5, 8],
    description: '一个非常著名的数列',
    answer: 13,
    explanation: '斐波那契数列：每一项是前两项之和。8 + 5 = 13。',
    difficulty: 'easy',
  },
  {
    id: 2,
    sequence: [1, 4, 9, 16, 25],
    description: '数学中非常熟悉的模式',
    answer: 36,
    explanation: '平方数：1², 2², 3², 4², 5², 所以下一项是 6² = 36。',
    difficulty: 'easy',
  },
  {
    id: 3,
    sequence: [2, 3, 5, 7, 11],
    description: '这些数有一个特殊的共同性质',
    answer: 13,
    explanation: '质数序列！2, 3, 5, 7, 11 都是质数，下一个质数是 13。',
    difficulty: 'easy',
  },
  {
    id: 4,
    sequence: [1, 2, 4, 8, 16],
    description: '翻倍的力量',
    answer: 32,
    explanation: '等比数列：公比为 2。每一项乘以 2：16 × 2 = 32。也可以理解为 2^{n-1}。',
    difficulty: 'easy',
  },
  {
    id: 5,
    sequence: [1, 3, 6, 10, 15],
    description: '这些数可以排列成三角形',
    answer: 21,
    explanation: '三角形数：1, 1+2=3, 3+3=6, 6+4=10, 10+5=15, 15+6=21。第 n 项 = n(n+1)/2。',
    difficulty: 'medium',
  },
  {
    id: 6,
    sequence: [2, 6, 12, 20, 30],
    description: '矩形的一族',
    answer: 42,
    explanation: 'n × (n+1)：1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42。',
    difficulty: 'medium',
  },
  {
    id: 7,
    sequence: [3, 7, 15, 31, 63],
    description: '接近 2 的幂次',
    answer: 127,
    explanation: '2^{n+1} - 1：2²-1=3, 2³-1=7, 2⁴-1=15, 2⁵-1=31, 2⁶-1=63, 2⁷-1=127。',
    difficulty: 'medium',
  },
  {
    id: 8,
    sequence: [1, 4, 3, 6, 5, 8],
    description: '奇偶交替的规律',
    answer: 7,
    explanation: '交错序列：奇数位 1, 3, 5, 7（递增 2）；偶数位 4, 6, 8（递增 2）。下一项在奇数位。',
    difficulty: 'hard',
  },
  {
    id: 9,
    sequence: [1, 11, 21, 1211, 111221],
    description: '读出来就知道答案了',
    answer: 312211,
    explanation: '"外观数列"（Look-and-say）：1 → "一个1"=11 → "两个1"=21 → "一个2一个1"=1211 → "一个1一个2两个1"=111221 → "三个1两个2一个1"=312211。',
    difficulty: 'hard',
  },
];

export default function SequenceReasoning(): React.ReactElement {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info' | '';
    message: string;
  }>({ type: '', message: '' });
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredSequences = useMemo(
    () =>
      difficulty === 'all'
        ? SEQUENCES
        : SEQUENCES.filter((s) => s.difficulty === difficulty),
    [difficulty]
  );

  const current = filteredSequences[currentIdx % filteredSequences.length];

  const handleSubmit = useCallback(() => {
    const num = Number(guess);
    if (isNaN(num)) {
      setFeedback({ type: 'error', message: '请输入有效的数字。' });
      return;
    }
    if (num === current.answer) {
      setFeedback({ type: 'success', message: `✅ 正确！${current.explanation}` });
      setScore((s) => s + Math.max(3 - hintsUsed, 1));
    } else {
      setFeedback({
        type: 'error',
        message: `❌ ${num} 不是正确的下一项。再想想规律！`,
      });
    }
  }, [guess, current, hintsUsed]);

  const handleHint = useCallback(() => {
    setHintsUsed((h) => h + 1);
    setFeedback({
      type: 'info',
      message: `💡 ${current.description}`,
    });
  }, [current]);

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => (i + 1) % filteredSequences.length);
    setGuess('');
    setFeedback({ type: '', message: '' });
    setHintsUsed(0);
  }, [filteredSequences.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const diffLabel = { easy: '⭐', medium: '⭐⭐', hard: '⭐⭐⭐' };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🔢 数列推理</div>
      <div className={styles.gameScore}>
        <span>
          <span className={styles.gameScoreValue}>{currentIdx + 1}</span> / {filteredSequences.length}
        </span>
        <span>
          难度：{diffLabel[current.difficulty]}
        </span>
        <span>
          得分：<span className={styles.gameScoreValue}>{score}</span>
        </span>
      </div>

      <div className={styles.gameRow} style={{ justifyContent: 'center' }}>
        {([
          ['all', '全部'],
          ['easy', '简单'],
          ['medium', '中等'],
          ['hard', '困难'],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            className={`${styles.gameButton} ${difficulty === val ? '' : styles.gameButtonSecondary}`}
            onClick={() => {
              setDifficulty(val);
              setCurrentIdx(0);
              setGuess('');
              setFeedback({ type: '', message: '' });
              setHintsUsed(0);
            }}
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.gameBoard} style={{ margin: '1.5rem 0' }}>
        {current.sequence.map((n, i) => (
          <span key={i} className={styles.gameNumber}>
            {n}
          </span>
        ))}
        <span
          className={styles.gameNumber}
          style={{
            background: 'var(--ifm-color-emphasis-300)',
            color: 'var(--ifm-font-color-base)',
            border: '2px dashed var(--ifm-color-primary)',
          }}
        >
          ?
        </span>
      </div>

      <div className={styles.gameRow}>
        <input
          className={styles.gameInput}
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入下一项..."
          style={{ maxWidth: 200 }}
        />
        <button className={styles.gameButton} onClick={handleSubmit}>
          提交
        </button>
      </div>

      <div className={styles.gameRow} style={{ justifyContent: 'center' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleHint}>
          💡 提示（-1分）
        </button>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleNext}>
          ➡️ 跳过
        </button>
      </div>

      {feedback.message && (
        <div
          className={`${styles.gameFeedback} ${
            feedback.type === 'success'
              ? styles.gameFeedbackSuccess
              : feedback.type === 'error'
                ? styles.gameFeedbackError
                : styles.gameFeedbackInfo
          }`}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}
