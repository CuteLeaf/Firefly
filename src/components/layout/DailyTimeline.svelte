<script lang="ts">
  export let posts: any[] = [];

  // group posts by yyyy-mm
  function groupByMonth(list) {
    const map = new Map();
    list.forEach(p => {
      const d = new Date(p.data.published);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return Array.from(map.entries()).sort((a,b)=> b[0].localeCompare(a[0]));
  }

  $: groups = groupByMonth(posts);
</script>

<section class="daily-timeline">
  {#if posts.length === 0}
    <div class="empty">暂无日常记录</div>
  {:else}
    {#each groups as [month, items]}
      <div class="month-block">
        <h3 class="month-title">{month}</h3>
        <ul>
          {#each items as item}
            <li class="tl-item"><time>{new Date(item.data.published).toLocaleDateString()}</time> — <a href={`/posts/${item.id}`}>{item.data.title}</a></li>
          {/each}
        </ul>
      </div>
    {/each}
  {/if}
</section>

<style>
.daily-timeline{padding:1rem}
.month-block{margin-bottom:1rem}
.month-title{font-size:1.05rem;margin-bottom:.5rem}
.tl-item{margin:0.25rem 0}
.empty{color:var(--muted)}
</style>