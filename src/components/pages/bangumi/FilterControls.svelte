<script lang="ts">
interface Filter {
	value: string;
	label: string;
	count?: number;
}

interface Props {
	filters: Filter[];
	activeFilter: string;
	onFilterChange: (filter: string) => void;
}

const { filters, activeFilter, onFilterChange }: Props = $props();
</script>

<div class="flex flex-wrap gap-1.5 mb-4">
  {#each filters as filter}
    <button
      class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 {filter.value === activeFilter
        ? 'bg-(--primary) text-white shadow-md'
        : 'bg-(--btn-regular-bg) text-(--btn-content) hover:bg-(--btn-regular-bg-hover)'}"
      onclick={() => onFilterChange(filter.value)}
      type="button"
    >
      {filter.label}
      {#if filter.count !== undefined}
        <span class="ml-1">({filter.count})</span>
      {/if}
    </button>
  {/each}
</div>
