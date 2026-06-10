<script lang="ts">
  export let items: any[] = [];
  export let pageSize = 6;
  export let startPage = 1;
  let page = startPage;
  $: total = Math.max(1, Math.ceil(items.length / pageSize));
  $: pageItems = items.slice((page - 1) * pageSize, page * pageSize);
  function goto(n){ page = Math.max(1, Math.min(total, n)); }
  function prev(){ goto(page-1); }
  function next(){ goto(page+1); }
</script>

<div class="pager-root">
  <div class="pager-list">
    <slot {pageItems}></slot>
  </div>
  {#if total > 1}
    <div class="pager-controls">
      <button on:click={prev} disabled={page===1} class="btn">Prev</button>
      <div class="pager-info">{page} / {total}</div>
      <button on:click={next} disabled={page===total} class="btn">Next</button>
    </div>
  {/if}
</div>

<style>
.pager-root{display:flex;flex-direction:column;gap:.75rem}
.pager-controls{display:flex;gap:.5rem;align-items:center}
.btn{padding:.4rem .7rem;border-radius:6px;background:var(--btn-regular-bg)}
.pager-info{font-size:.9rem;color:var(--muted)}
</style>