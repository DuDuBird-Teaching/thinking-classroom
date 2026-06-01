---
sidebar_position: 2
title: Nim 取石子游戏
description: 一个简单游戏背后的数学——异或运算与必胜策略
---

import { NimGame } from '@site/src/components/Games';

# Nim 取石子游戏

## 规则

有三堆石子，每堆分别有 3、4、5 颗。两名玩家轮流取石子：

- 每次可以从**任意一堆**中取走**至少 1 颗、至多全部**的石子
- 取走最后一颗石子的玩家**获胜**

## 来一局！

试试看，你能战胜 AI 吗？提示：注意各堆数量的异或和。

<NimGame />

## 必胜策略

Nim 的必胜策略与**异或运算**（XOR）有关：

1. 计算三堆石子数量的异或和：$N = a \oplus b \oplus c$
2. 如果 $N = 0$，当前是**必败局面**（前提是对手不犯错）
3. 如果 $N \neq 0$，存在一步操作使异或和变为 0

## 为什么 XOR 有效？

斯普莱格-格隆迪定理（Sprague-Grundy Theorem）表明，所有无偏博弈都等价于某个 Nim 堆的异或和。Nim 是组合博弈论的基石。
