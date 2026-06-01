import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // 数学侧边栏
  mathSidebar: [
    'math/intro',
    {
      type: 'category',
      label: '逻辑与证明',
      items: ['math/logic/propositional-logic'],
    },
    {
      type: 'category',
      label: '线性代数直观理解',
      items: ['math/linear-algebra/vectors-and-spaces'],
    },
    {
      type: 'category',
      label: '微积分核心思想',
      items: ['math/calculus/limits-and-continuity'],
    },
    {
      type: 'category',
      label: '概率与统计',
      items: [
        'math/probability/frequency-to-bayes',
        'math/probability/statistical-fallacies',
      ],
    },
    {
      type: 'category',
      label: '数学趣题',
      items: ['math/puzzles/monty-hall'],
    },
  ],

  // 物理侧边栏
  physicsSidebar: [
    'physics/intro',
    {
      type: 'category',
      label: '经典力学',
      items: [
        'physics/mechanics/newton-laws',
        'physics/mechanics/conservation-laws',
      ],
    },
    {
      type: 'category',
      label: '电磁学',
      items: ['physics/electromagnetism/what-is-field'],
    },
    {
      type: 'category',
      label: '光学',
      items: ['physics/optics/nature-of-light'],
    },
    {
      type: 'category',
      label: '现代物理',
      items: [
        'physics/modern/special-relativity',
        'physics/modern/quantum-mechanics',
      ],
    },
    {
      type: 'category',
      label: '物理思维方法',
      items: [
        'physics/methods/modeling-and-approximation',
        'physics/methods/symmetry-and-conservation',
      ],
    },
  ],

  // 计算机侧边栏
  csSidebar: [
    'cs/intro',
    {
      type: 'category',
      label: '计算思维',
      items: ['cs/computational-thinking/introduction'],
    },
    {
      type: 'category',
      label: '算法思维',
      items: [
        'cs/algorithms/big-o-complexity',
        'cs/algorithms/recursion',
      ],
    },
    {
      type: 'category',
      label: '算法可视化',
      items: ['cs/algorithms/sorting-visualization'],
    },
    {
      type: 'category',
      label: 'AI 与机器学习',
      items: [
        'cs/ai/neural-network-intuition',
        'cs/ai/llm-explained',
      ],
    },
    {
      type: 'category',
      label: '编程思维',
      items: [
        'cs/programming/git-model',
        'cs/programming/functional-programming',
      ],
    },
  ],

  // 思维游戏侧边栏
  gamesSidebar: [
    'games/intro',
    {
      type: 'category',
      label: '逻辑推理游戏',
      items: ['games/logic/liar-puzzle'],
    },
    {
      type: 'category',
      label: '数学游戏',
      items: [
        'games/math/24-game',
        'games/math/sequence-reasoning',
      ],
    },
    {
      type: 'category',
      label: '策略与博弈',
      items: [
        'games/strategy/prisoners-dilemma',
        'games/strategy/nim-game',
      ],
    },
    {
      type: 'category',
      label: '空间思维',
      items: ['games/spatial/symmetry-recognition'],
    },
  ],
};

export default sidebars;
