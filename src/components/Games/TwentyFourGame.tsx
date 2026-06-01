import React, { useState, useCallback, useEffect } from 'react';
import styles from './GameStyles.module.css';

function generateNumbers(): number[] {
  const nums: number[] = [];
  for (let i = 0; i < 4; i++) {
    nums.push(Math.floor(Math.random() * 9) + 1); // 1-9
  }
  return nums;
}

// 检查是否能组成24（用于验证非 brute-force）
function canMake24(nums: number[]): boolean {
  const ops = ['+', '-', '*', '/'];
  const permutations = getPermutations(nums);

  for (const perm of permutations) {
    for (const op1 of ops) {
      for (const op2 of ops) {
        for (const op3 of ops) {
          // 五种括号结构
          const patterns = [
            `(${perm[0]}${op1}${perm[1]})${op2}(${perm[2]}${op3}${perm[3]})`,
            `((${perm[0]}${op1}${perm[1]})${op2}${perm[2]})${op3}${perm[3]}`,
            `(${perm[0]}${op1}(${perm[1]}${op2}${perm[2]}))${op3}${perm[3]}`,
            `${perm[0]}${op1}((${perm[1]}${op2}${perm[2]})${op3}${perm[3]})`,
            `${perm[0]}${op1}(${perm[1]}${op2}(${perm[2]}${op3}${perm[3]}))`,
          ];
          for (const pattern of patterns) {
            try {
              const result = eval(pattern);
              if (Math.abs(result - 24) < 1e-9) return true;
            } catch {
              // ignore division by zero
            }
          }
        }
      }
    }
  }
  return false;
}

function getPermutations(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr];
  const result: number[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of getPermutations(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

export default function TwentyFourGame(): React.ReactElement {
  const [numbers, setNumbers] = useState<number[]>(() => {
    let nums = generateNumbers();
    while (!canMake24(nums)) {
      nums = generateNumbers();
    }
    return nums;
  });
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info' | '';
    message: string;
  }>({ type: '', message: '' });
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const handleSubmit = useCallback(() => {
    try {
      const expr = input.replace(/\s/g, '');
      const usedNumbers = expr.match(/\d+/g)?.map(Number).sort() || [];
      const required = [...numbers].sort();

      if (JSON.stringify(usedNumbers) !== JSON.stringify(required)) {
        setFeedback({
          type: 'error',
          message: `请恰好使用这四个数字各一次：${numbers.join(', ')}`,
        });
        return;
      }

      const result = eval(expr);
      if (Math.abs(result - 24) < 1e-9) {
        setFeedback({ type: 'success', message: '✅ 太棒了！结果等于24！' });
        setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
      } else {
        setFeedback({
          type: 'error',
          message: `❌ 表达式的结果是 ${result}，不是 24，再试试！`,
        });
        setScore((s) => ({ ...s, total: s.total + 1 }));
      }
    } catch {
      setFeedback({ type: 'error', message: '表达式格式有误，请检查后重试。' });
    }
  }, [input, numbers]);

  const handleNewGame = useCallback(() => {
    let nums = generateNumbers();
    while (!canMake24(nums)) {
      nums = generateNumbers();
    }
    setNumbers(nums);
    setInput('');
    setFeedback({ type: '', message: '' });
  }, []);

  const handleHint = useCallback(() => {
    setFeedback({
      type: 'info',
      message: '提示：尝试用两个数字的运算结果与另外两个数字组合。常见因子：4×6=24, 3×8=24, 2×12=24',
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🎯 24点游戏</div>
      <div className={styles.gameScore}>
        <span>
          正确率：{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
        </span>
        <span>
          <span className={styles.gameScoreValue}>{score.correct}</span> / {score.total}
        </span>
      </div>
      <div className={styles.gameBoard}>
        {numbers.map((n, i) => (
          <span key={i} className={styles.gameNumber}>
            {n}
          </span>
        ))}
      </div>
      <div className={styles.gameRow}>
        <input
          className={styles.gameInput}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入表达式，如 (4+8)*(7-5)"
        />
        <button className={styles.gameButton} onClick={handleSubmit}>
          验证
        </button>
      </div>
      <div className={styles.gameRow} style={{ justifyContent: 'center' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleHint}>
          💡 提示
        </button>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleNewGame}>
          🔄 换一题
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
      <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-500)' }}>
        规则：使用 +、-、×、/ 四种运算，恰好使用四个数字各一次，使结果等于 24。可以用括号改变运算顺序。
      </p>
    </div>
  );
}
