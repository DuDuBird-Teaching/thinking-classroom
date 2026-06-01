import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/math/intro"
          >
            📐 开始探索数学
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/physics/intro"
            style={{ marginLeft: '1rem' }}
          >
            ⚛️ 进入物理世界
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} — 点燃思维之火`}
      description="嘟嘟鸟思维课堂：一个专注于数学、物理、计算机科学与思维训练的在线学习平台。"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section className={styles.quoteSection}>
          <div className="container">
            <blockquote className={styles.quote}>
              <p>
                "教育不是注满一桶水，而是点燃一把火。"
              </p>
              <footer>— 威廉·巴特勒·叶芝</footer>
            </blockquote>
          </div>
        </section>
      </main>
    </Layout>
  );
}
