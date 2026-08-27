// Firefly 专属 MDX 文章 UI 组件集合
//
// MDX 文章里一次 import 即可使用多个组件：
//   import { TabGroup, Timeline, TimelineItem } from "@/components/firefly-mdx";
//
// 说明：
// - 这里收录 .svelte（交互类）和 .astro（展示类）两种组件。Astro 组件能从这里
//   re-export，靠的是 src/astro-modules.d.ts 里的 `*.astro` 模块声明（纯 tsc 兜底，
//   编辑器里 @astrojs/ts-plugin 提供真实类型）。
// - 以后新增的 MDX UI 组件在这里追加一行导出即可。

export { default as Badge } from "@/components/common/Badge.astro";
export { default as StepItem } from "@/components/common/StepItem.astro";
export { default as Steps } from "@/components/common/Steps.astro";
export { default as TabGroup } from "@/components/common/TabGroup.svelte";
export { default as Timeline } from "@/components/common/Timeline.astro";
export { default as TimelineItem } from "@/components/common/TimelineItem.astro";
