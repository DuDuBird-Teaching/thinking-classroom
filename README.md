# 嘟嘟鸟思维课堂 🐦

[![Built with Docusaurus](https://img.shields.io/badge/built%20with-Docusaurus-3ecc5f?logo=docusaurus)](https://docusaurus.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

一个专注于**数学、物理、计算机科学与思维训练**的在线学习平台。

> "教育不是注满一桶水，而是点燃一把火。" — 叶芝

## ✨ 功能特色

- 📐 **数学模块**：逻辑与证明、线性代数、微积分、概率统计、数学趣题
- ⚛️ **物理模块**：经典力学、电磁学、光学、现代物理、物理思维方法
- 💻 **计算机模块**：计算思维、算法可视化、AI/ML 入门、编程思维
- 🧩 **思维游戏**：7 个交互式游戏组件（24点、数列推理、Nim、囚徒困境、河内塔、逻辑谜题、数独）
- 🎨 **KaTeX 数学公式**渲染
- 🌓 **明暗主题**自适应

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm start

# 构建生产版本
npm run build

# 本地预览构建结果
npm run serve

# TypeScript 类型检查
npm run typecheck
```

## 📁 项目结构

```
├── blog/              # 博客/更新日志
├── docs/              # 文档内容
│   ├── math/          #   数学模块
│   ├── physics/       #   物理模块
│   ├── cs/            #   计算机模块
│   ├── games/         #   思维游戏模块
│   └── about.md       #   关于本站
├── src/
│   ├── components/    # React 组件（含 Games/ 游戏组件）
│   ├── css/           # 全局样式
│   └── pages/         # 页面
├── static/img/        # 静态资源
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

## 🛠️ 技术栈

- **框架**：[Docusaurus v3](https://docusaurus.io/) + React 19
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **数学渲染**：[KaTeX](https://katex.org/) + remark-math + rehype-katex
- **代码高亮**：Prism React Renderer

## 📄 许可证

MIT
