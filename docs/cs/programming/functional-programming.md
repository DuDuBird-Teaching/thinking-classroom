---
sidebar_position: 2
title: 函数式编程思想
description: 纯函数、不可变性与声明式编程
---

# 函数式编程思想

## 纯函数

**纯函数**的两个条件：
1. 相同输入总是产生相同输出（无随机、无外部状态依赖）
2. 没有副作用（不修改外部状态）

```typescript
// 不纯：依赖外部状态
let count = 0;
function increment() {
  count++; // 副作用
  return count;
}

// 纯：输入决定输出
function add(a: number, b: number): number {
  return a + b;
}
```

## 不可变数据

不直接修改数据，而是创建新的副本：

```typescript
// 可变
const arr = [1, 2, 3];
arr.push(4); // 修改了原数组

// 不可变
const arr = [1, 2, 3];
const newArr = [...arr, 4]; // 创建新数组
```

## 声明式 vs 命令式

| | 命令式 | 声明式 |
|------|-----------|------------|
| 风格 | "怎么做"（步骤） | "要什么"（描述结果） |
| 例子 | for 循环 | `.filter().map()` |
| 关注点 | 控制流 | 数据流 |

> 本节内容仍在完善中，敬请期待更多精彩…
