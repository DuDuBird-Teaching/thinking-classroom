import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: '嘟嘟鸟思维课堂',
  tagline: '点燃思维之火，探索数学、物理与计算机的奥秘',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://dudubird-teaching.github.io',
  baseUrl: '/thinking-classroom/',

  organizationName: 'DuDuBird-Teaching',
  projectName: 'thinking-classroom',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateTime: false,
          editUrl: undefined,
        },
        blog: {
          showReadingTime: true,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
          editUrl: undefined,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZUJBU6TQ1aF5s5lDSZ',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '嘟嘟鸟思维课堂',
      logo: {
        alt: '嘟嘟鸟思维课堂 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mathSidebar',
          position: 'left',
          label: '数学',
        },
        {
          type: 'docSidebar',
          sidebarId: 'physicsSidebar',
          position: 'left',
          label: '物理',
        },
        {
          type: 'docSidebar',
          sidebarId: 'csSidebar',
          position: 'left',
          label: '计算机',
        },
        {
          type: 'docSidebar',
          sidebarId: 'gamesSidebar',
          position: 'left',
          label: '思维游戏',
        },
        { to: '/blog', label: '更新日志', position: 'left' },
        {
          href: 'https://github.com/duudubird/thinking-classroom',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '内容',
          items: [
            { label: '数学', to: '/docs/math/intro' },
            { label: '物理', to: '/docs/physics/intro' },
            { label: '计算机', to: '/docs/cs/intro' },
            { label: '思维游戏', to: '/docs/games/intro' },
          ],
        },
        {
          title: '关于',
          items: [
            { label: '关于本站', to: '/docs/about' },
            { label: '更新日志', to: '/blog' },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/duudubird/thinking-classroom',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 嘟嘟鸟思维课堂. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'java', 'rust', 'latex'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
