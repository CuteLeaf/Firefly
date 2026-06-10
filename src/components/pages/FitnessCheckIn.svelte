<script lang="ts">
  export let posts = [];
  // manage checked state in localStorage keyed by 'fitness-check-<id>'
  function key(id) { return `fitness-check-${id}` }
  let checks = {} as Record<string, boolean>;
  // load
  if (typeof window !== 'undefined') {
    posts.forEach(p => { checks[p.id] = localStorage.getItem(key(p.id)) === '1' });
  }

  function toggle(id){
    checks[id] = !checks[id];
    localStorage.setItem(key(id), checks[id] ? '1' : '0');
  }
</script>

<section class="fitness-check">
  {#if posts.length === 0}
    <div>暂无锻炼计划</div>
  {:else}
    <ul>
      {#each posts as p}
        <li class="fc-item">
          <label>
            <input type="checkbox" bind:checked={checks[p.id]} on:change={()=>toggle(p.id)} />
            <span class="fc-title"><a href={`/posts/${p.id}`}>{p.data.title}</a></span>
          </label>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
.fitness-check{padding:1rem}
.fc-item{margin:0.5rem 0}
.fc-title{margin-left:.5rem}
</style>