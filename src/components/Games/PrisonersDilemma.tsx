import React, { useState, useCallback } from 'react';
import styles from './GameStyles.module.css';

type Choice = 'cooperate' | 'betray';

interface Payoff {
  bothCooperate: [number, number];
  bothBetray: [number, number];
  youBetrayTheyCooperate: [number, number];
  youCooperateTheyBetray: [number, number];
}

const DEFAULT_PAYOFF: Payoff = {
  bothCooperate: [-1, -1],
  bothBetray: [-5, -5],
  youBetrayTheyCooperate: [0, -10],
  youCooperateTheyBetray: [-10, 0],
};

type OpponentStrategy = 'random' | 'titForTat' | 'alwaysCooperate' | 'alwaysBetray';

function opponentMove(
  strategy: OpponentStrategy,
  history: { you: Choice; them: Choice }[]
): Choice {
  switch (strategy) {
    case 'alwaysCooperate':
      return 'cooperate';
    case 'alwaysBetray':
      return 'betray';
    case 'titForTat':
      if (history.length === 0) return 'cooperate';
      return history[history.length - 1].you; // copy your last move
    case 'random':
      return Math.random() < 0.5 ? 'cooperate' : 'betray';
  }
}

export default function PrisonersDilemma(): React.ReactElement {
  const [payoff] = useState<Payoff>(DEFAULT_PAYOFF);
  const [strategy, setStrategy] = useState<OpponentStrategy>('titForTat');
  const [history, setHistory] = useState<{ you: Choice; them: Choice; round: number }[]>([]);
  const [yourScore, setYourScore] = useState(0);
  const [theirScore, setTheirScore] = useState(0);
  const [lastResult, setLastResult] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const getPayoffResult = useCallback(
    (you: Choice, them: Choice): [number, number] => {
      if (you === 'cooperate' && them === 'cooperate') return payoff.bothCooperate;
      if (you === 'betray' && them === 'betray') return payoff.bothBetray;
      if (you === 'betray' && them === 'cooperate') return payoff.youBetrayTheyCooperate;
      return payoff.youCooperateTheyBetray;
    },
    [payoff]
  );

  const handleChoice = useCallback(
    (yourChoice: Choice) => {
      const them = opponentMove(strategy, history);
      const [yScore, tScore] = getPayoffResult(yourChoice, them);

      setYourScore((s) => s + yScore);
      setTheirScore((s) => s + tScore);
      setHistory((h) => [...h, { you: yourChoice, them, round: h.length + 1 }]);

      const labels: Record<Choice, string> = { cooperate: '合作（沉默）', betray: '背叛（坦白）' };
      setLastResult(
        `你选择了「${labels[yourChoice]}」，对手选择了「${labels[them]}」。` +
        ` 你 ${yScore > 0 ? '+' : ''}${yScore} 分，对手 ${tScore > 0 ? '+' : ''}${tScore} 分。`
      );
    },
    [strategy, history, getPayoffResult]
  );

  const handleReset = useCallback(() => {
    setHistory([]);
    setYourScore(0);
    setTheirScore(0);
    setLastResult('');
  }, []);

  const totalRounds = history.length;

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameTitle}>🤝 囚徒困境模拟器</div>

      <div className={styles.gameScore}>
        <span>
          你的总分：<span className={styles.gameScoreValue}>{yourScore}</span> 分
        </span>
        <span>
          对手总分：<span className={styles.gameScoreValue}>{theirScore}</span> 分
        </span>
        <span>
          回合：<span className={styles.gameScoreValue}>{totalRounds}</span>
        </span>
      </div>

      <div className={styles.gameRow} style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
        <span style={{ marginRight: '0.5rem' }}>对手策略：</span>
        {([
          ['titForTat', '以牙还牙'],
          ['random', '随机'],
          ['alwaysCooperate', '永远合作'],
          ['alwaysBetray', '永远背叛'],
        ] as [OpponentStrategy, string][]).map(([val, label]) => (
          <button
            key={val}
            className={`${styles.gameButton} ${strategy === val ? '' : styles.gameButtonSecondary}`}
            onClick={() => { handleReset(); setStrategy(val); }}
            style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem' }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Payoff matrix */}
      <div className={styles.pdMatrix}>
        <div />
        <div className={`${styles.pdCell} ${styles.pdCellHeader}`}>对手合作</div>
        <div className={`${styles.pdCell} ${styles.pdCellHeader}`}>对手背叛</div>
        <div className={`${styles.pdCell} ${styles.pdCellHeader}`}>你合作</div>
        <div className={`${styles.pdCell} ${styles.pdCellValue}`}>
          ({payoff.bothCooperate[0]}, {payoff.bothCooperate[1]})
        </div>
        <div className={`${styles.pdCell} ${styles.pdCellValue}`}>
          ({payoff.youCooperateTheyBetray[0]}, {payoff.youCooperateTheyBetray[1]})
        </div>
        <div className={`${styles.pdCell} ${styles.pdCellHeader}`}>你背叛</div>
        <div className={`${styles.pdCell} ${styles.pdCellValue}`}>
          ({payoff.youBetrayTheyCooperate[0]}, {payoff.youBetrayTheyCooperate[1]})
        </div>
        <div className={`${styles.pdCell} ${styles.pdCellValue}`}>
          ({payoff.bothBetray[0]}, {payoff.bothBetray[1]})
        </div>
      </div>

      <div className={styles.pdChoice}>
        <button className={styles.gameButton} onClick={() => handleChoice('cooperate')}>
          🤝 合作（沉默）
        </button>
        <button
          className={styles.gameButton}
          style={{ background: '#c62828' }}
          onClick={() => handleChoice('betray')}
        >
          🗡️ 背叛（坦白）
        </button>
      </div>

      {lastResult && (
        <div className={`${styles.gameFeedback} ${styles.gameFeedbackInfo}`}>{lastResult}</div>
      )}

      <div className={styles.gameRow} style={{ justifyContent: 'center' }}>
        <button className={`${styles.gameButton} ${styles.gameButtonSecondary}`} onClick={handleReset}>
          🔄 重新开始
        </button>
        <button
          className={`${styles.gameButton} ${styles.gameButtonSecondary}`}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          📖 {showExplanation ? '隐藏' : '显示'}分析
        </button>
      </div>

      {showExplanation && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
          <p>
            <strong>个体理性分析：</strong>无论对手选什么，背叛对你都是更优的选择。
            如果对手合作，你背叛得 0 分（好于合作的 -1 分）；
            如果对手背叛，你背叛得 -5 分（好于合作的 -10 分）。
          </p>
          <p>
            <strong>集体理性分析：</strong>双方都背叛的结果 (-5, -5) 比双方都合作 (-1, -1) 更差。
            这就是困境的核心——个体最优导致集体最差。
          </p>
          <p>
            <strong>以牙还牙策略：</strong>在重复博弈中，这种策略（第一轮合作，之后模仿对方上一轮选择）
            被证明是最成功的策略之一。它善良（不先背叛）、报复（回应背叛）、宽容（对方恢复合作后也恢复合作）。
          </p>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ marginTop: '0.75rem', maxHeight: 150, overflowY: 'auto' }}>
          <table style={{ width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                <th>回合</th>
                <th>你的选择</th>
                <th>对手选择</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.round}>
                  <td>{h.round}</td>
                  <td>{h.you === 'cooperate' ? '🤝 合作' : '🗡️ 背叛'}</td>
                  <td>{h.them === 'cooperate' ? '🤝 合作' : '🗡️ 背叛'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
