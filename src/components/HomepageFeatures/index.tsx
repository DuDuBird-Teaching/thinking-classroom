import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '数学',
    emoji: '📐',
    description: (
      <>
        从逻辑与证明到线性代数、微积分与概率统计，
        用直观的方式理解数学的核心思想。
      </>
    ),
  },
  {
    title: '物理',
    emoji: '⚛️',
    description: (
      <>
        从经典力学到相对论与量子力学，
        探索宇宙运行的基本规律与思维方法。
      </>
    ),
  },
  {
    title: '计算机',
    emoji: '💻',
    description: (
      <>
        计算思维、算法设计、人工智能——
        理解信息时代的底层逻辑。
      </>
    ),
  },
  {
    title: '思维游戏',
    emoji: '🧩',
    description: (
      <>
        逻辑谜题、数学游戏、策略博弈——
        在游戏中锻炼思维的肌肉。
      </>
    ),
  },
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center">
        <span className={styles.featureEmoji} role="img" aria-label={title}>
          {emoji}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
