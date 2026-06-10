## Plan: 双人共享空间改造

TL;DR: 在现有 Firefly Astro 站点上，按“日常 / 推荐 / 锻炼计划 / 私密表达”四大栏目改造首页、内容模型、栏目页与样式，复用现有加密与相册功能，确保私密内容通过加密与 noindex/robots 控制不被索引。

**Steps**
1. 数据模型与配置：修改 `src/content.config.ts` 增加 `recipient`、`privacy`、`emoji`；更新 `siteConfig` 与 i18n。 (*blocks steps 3*)
2. 首页与导航改造：新增 `DualSpaceHero.astro`、`DualSpaceOverview.astro` 或修改 `src/pages/[...page].astro` 为双人首页；更新 `src/config/navBarConfig.ts`。 (*blocks steps 3*)
3. 栏目组件与页面：新增 `DailyLogCard.astro`、`RecommendationCard.astro`、`DailyTimeline.svelte`、`recommendations.astro`、`fitness-checkin.astro` 等，并修改 `PostCard.astro` 显示 `recipient` 与 `privacy`。 (*depends on 1,2*)
4. SEO 与隐私：更新 `src/pages/robots.txt.ts` 与 `src/layouts/MainGridLayout.astro`，根据 `privacy` 添加 `noindex`。 (*parallel with 3*)
5. 测试与优化：功能测试、加密解密测试、SEO 验证、响应式与多语言校验。 (*after 3,4*)

**Relevant files**
- [src/content.config.ts](src/content.config.ts) — 扩展 frontmatter；新增 `recipient`、`privacy`。
- [src/pages/[...page].astro](src/pages/%5B...page%5D.astro) — 首页改造点。
- [src/config/navBarConfig.ts](src/config/navBarConfig.ts) — 导航栏修改。
- [src/i18n/i18nKey.ts](src/i18n/i18nKey.ts) — 新增 i18n 键。
- [src/layouts/MainGridLayout.astro](src/layouts/MainGridLayout.astro) — 根据 privacy 添加 noindex meta。
- [src/components/features/EncryptedPost.astro](src/components/features/EncryptedPost.astro) — 复用加密文章组件。
- [src/utils/crypto-utils.ts](src/utils/crypto-utils.ts) — 加密/解密逻辑复用点。
- 推荐新增文件：
  - src/components/pages/DualSpaceHero.astro
  - src/components/pages/DualSpaceOverview.astro
  - src/components/pages/DailyLogCard.astro
  - src/components/pages/RecommendationCard.astro
  - src/components/layout/DailyTimeline.svelte
  - src/pages/recommendations.astro
  - src/pages/fitness-checkin.astro
  - src/utils/fitness-utils.ts

**Verification**
1. 首页显示双人空间介绍与四个栏目入口。
2. 文章 frontmatter 支持并显示 `recipient` 与 `privacy`。
3. 私密文章需输入密码查看，加密内容在构建后不可被爬虫索引（robots + noindex 验证）。
4. 日常记录时间线与推荐/锻炼页面能正确筛选并展示内容。
5. 多语言文本均已翻译并在页面上正确显示。

**Decisions / Assumptions**
- 私密内容将在客户端使用现有加密方案保护；静态站点不能提供服务端访问控制。
- 私密文章建议使用难以预测的 slug 以降低被猜测风险。
- 初期数据持久化（锻炼打卡）可使用本地存储或简单 JSON，后续可接入后端。

**Further Considerations**
1. 是否需要在管理/写作流程中强制 `recipient` 与 `privacy` 字段？（建议：在模板中添加必填提示）
2. 是否希望私密栏目在导航中完全隐藏，只通过首页入口访问？
3. 是否要支持按对象筛选（例如只看“写给某人”的记录）？


---
计划已保存到 /memories/session/plan.md。