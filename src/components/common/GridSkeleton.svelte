<!-- 加载骨架：标签行 + 筛选胶囊 + 卡片网格 + 分页 -->
<div class="border-b border-(--line-divider) mb-3">
  <div class="flex min-w-max space-x-8">
    {#each [1, 2, 3, 4] as _}
      <div class="h-10 w-20 bg-(--btn-regular-bg) rounded animate-pulse"></div>
    {/each}
  </div>
</div>
<!-- 筛选骨架 -->
<div class="flex flex-wrap gap-1.5 mb-4">
  {#each [1, 2, 3, 4] as _}
    <div class="h-7 w-16 bg-(--btn-regular-bg) rounded-full animate-pulse"></div>
  {/each}
</div>
<!-- 卡片网格骨架 -->
<div class="media-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
  {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as _}
    <div class="rounded-xl overflow-hidden">
      <div class="aspect-2/3 bg-(--btn-regular-bg) animate-pulse"></div>
    </div>
  {/each}
</div>
<!-- 分页骨架 -->
<div class="mt-6 flex items-center justify-center gap-3">
  <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
  <div class="w-16 h-8 bg-(--btn-regular-bg) rounded animate-pulse"></div>
  <div class="w-11 h-11 bg-(--btn-regular-bg) rounded-lg animate-pulse"></div>
</div>
