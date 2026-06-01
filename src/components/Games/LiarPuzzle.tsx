import React, { useState, useCallback, useMemo } from 'react';
import styles from './GameStyles.module.css';

interface Puzzle {
  id: number;
  description: string;
  statements: { person: string; text: string }[];
  question: string;
  answer: string;
  explanation: string;
}

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    description: '岛上有两种人：诚实者永远说真话，说谎者永远说假话。',
    statements: [
      { person: 'A', text: '"B 是说谎者。"' },
      { person: 'B', text: '"我们两人是不同类型的人。"' },
    ],
    question: 'A 和 B 分别是哪种人？',
    answer: 'A 是说谎者，B 是诚实者',
    explanation: '如果 A 是诚实者，则 B 是说谎者。B 说"我们类型不同"，作为说谎者这句话应为假，即两人类型相同——矛盾。所以 A 是说谎者，B 是诚实者。',
  },
  {
    id: 2,
    description: '三个岛民——每个人要么是诚实者，要么是说谎者。',
    statements: [
      { person: 'A', text: '"我们三个都是说谎者。"' },
      { person: 'B', text: '"我们中恰好有一个是诚实者。"' },
    ],
    question: 'A、B、C 分别是哪种人？',
    answer: 'A 是说谎者，B 是诚实者，C 是诚实者',
    explanation: '如果 A 是诚实者，则"A 是说谎者"为真——矛盾。所以 A 是说谎者，即并非三人都是说谎者。B 如果是说谎者，则并非恰好一个诚实者，且已知 A 是说谎者，则 B 和 C 都是说谎者，三人全说谎——与"A 是说谎者→不全说谎"矛盾。所以 B 是诚实者，恰好一个诚实者为假，且 B 是诚实者，则 C 也是诚实者（否则就只有 B 一个诚实者）。',
  },
  {
    id: 3,
    description: '三个嫌疑人，只有一人偷了宝石。',
    statements: [
      { person: '小红', text: '"是小明偷的。"' },
      { person: '小明', text: '"不是我偷的。"' },
      { person: '小刚', text: '"也不是我偷的。"' },
    ],
    question: '如果只有一个人说真话，谁偷了宝石？',
    answer: '小明偷了宝石',
    explanation: '如果小红说的是真的（小明偷的），则小明说"不是我"为假，小刚说"不是我"为真——两人说真话，不符合。如果小明说的是真的（他没偷），则小红说真话应为假（不是小明偷的，一致），小刚说"不是我"为假（是他偷的）——一人说真话。检查：小红假（不是小明偷的），小明真（他没偷），小刚假（是他偷的）——符合。所以小刚偷的... 等等不对，再想想。实际上：如果只有一人说真话——假设小偷是小明，则小红真，小明假，小刚真 → 两人真，不符合。假设小偷是小刚，则小红假（不是小明），小明真（不是他），小刚假（是他）→ 一人真。所以小刚偷了宝石。',
  },
];

export default function LiarPuzzle(): React.ReactElement {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [solved, setSolved] = useState<number[]>([]);

  const puzzle = PUZZLES[currentPuzzle];

  const options = useMemo(() => {
    // Generate answer options dynamically
    const opts = [
      puzzle.answer,
      ...PUZZLES.filter((p) => p.id !== puzzle.id).map((p) => p.answer),
    ];
    // Shuffle
    return opts.sort(() => Math.random() - 0.5).slice(0, 3);
  }, [currentPuzzle, puzzle]);

  const handleAnswer = useCallback(
    (answer: string) => {
      setSelectedAnswer(answer);
      if (answer === puzzle.answer) {
        setShowExplanation(true);
        if (!solved.includes(currentPuzzle)) {
          setSolved((s) => [...s, currentPuzzle]);
        }
      } else {
        setShowExplanation(false);
      }
    },
    [puzzle.answer, currentPuzzle, solved]
  );

  const handleNext = useCallback(() => {
    setCurrentPuzzle((c) => (c + 1) % PUZZLES.length);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🕵️ 谁在说谎？</div>
      <div className={styles.gameScore}>
        <span>
          谜题 {currentPuzzle + 1} / {PUZZLES.length}
        </span>
        <span>
          已解决：<span className={styles.gameScoreValue}>{solved.length}</span>
        </span>
      </div>

      <div style={{ background: 'var(--ifm-color-emphasis-100)', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>{puzzle.description}</p>
        {puzzle.statements.map((s, i) => (
          <p key={i} style={{ margin: '0.25rem 0' }}>
            <strong>{s.person}</strong> 说：{s.text}
          </p>
        ))}
        <p style={{ marginTop: '0.75rem', fontWeight: 700, color: 'var(--ifm-color-primary)' }}>
          {puzzle.question}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.map((opt, i) => (
          <button
            key={i}
            className={`${styles.gameButton} ${
              selectedAnswer === opt
                ? opt === puzzle.answer
                  ? ''
                  : styles.gameButtonSecondary
                : styles.gameButtonSecondary
            }`}
            onClick={() => handleAnswer(opt)}
            style={{
              textAlign: 'left',
              background:
                selectedAnswer === opt
                  ? opt === puzzle.answer
                    ? '#2e7d32'
                    : '#c62828'
                  : undefined,
              color:
                selectedAnswer === opt
                  ? 'white'
                  : undefined,
            }}
            disabled={showExplanation && selectedAnswer === puzzle.answer}
          >
            {String.fromCharCode(65 + i)}. {opt}
          </button>
        ))}
      </div>

      {showExplanation && (
        <div
          className={`${styles.gameFeedback} ${styles.gameFeedbackSuccess}`}
          style={{ marginTop: '1rem' }}
        >
          <strong>✅ 正确！</strong>
          <p style={{ margin: '0.5rem 0 0 0', lineHeight: 1.6 }}>{puzzle.explanation}</p>
        </div>
      )}

      {selectedAnswer && selectedAnswer !== puzzle.answer && (
        <div
          className={`${styles.gameFeedback} ${styles.gameFeedbackError}`}
          style={{ marginTop: '1rem' }}
        >
          ❌ 再想想！用分类讨论法逐个检验每个可能性。
        </div>
      )}

      <div className={styles.gameRow} style={{ justifyContent: 'center', marginTop: '1rem' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleNext}>
          ➡️ 下一题
        </button>
      </div>
    </div>
  );
}
