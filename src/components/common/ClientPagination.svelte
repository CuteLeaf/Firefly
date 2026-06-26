<script lang="ts">
interface Props {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}

const { totalItems, itemsPerPage, currentPage, onPageChange }: Props = $props();

const totalPages = $derived(Math.ceil(totalItems / itemsPerPage));

function generatePageNumbers(
	current: number,
	total: number,
): (number | string)[] {
	if (total <= 7) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	const delta = 2;
	const left = Math.max(2, current - delta);
	const right = Math.min(total - 1, current + delta);
	const pages: (number | string)[] = [1];

	if (left > 2) pages.push("...");
	for (let i = left; i <= right; i++) pages.push(i);
	if (right < total - 1) pages.push("...");
	if (total > 1) pages.push(total);

	return pages;
}

const pageNumbers = $derived(generatePageNumbers(currentPage, totalPages));

function goToPage(page: number) {
	if (page >= 1 && page <= totalPages && page !== currentPage) {
		onPageChange(page);
	}
}
</script>

{#if totalPages > 1}
  <div class="responsive-pagination flex justify-center items-center mt-8">
    <!-- 移动端简化版分页 -->
    <div class="mobile-pagination items-center gap-3">
      <button
        type="button"
        class="btn-card overflow-hidden rounded-lg text-(--primary) w-11 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <div class="btn-card flex items-center rounded-lg px-4 h-11 gap-1.5">
        <span class="text-base font-bold text-(--primary)">{currentPage}</span>
        <span class="text-sm text-neutral-500 dark:text-neutral-500">/</span>
        <span class="text-base font-bold text-neutral-700 dark:text-neutral-300">{totalPages}</span>
      </div>

      <button
        type="button"
        class="btn-card overflow-hidden rounded-lg text-(--primary) w-11 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>

    <!-- 桌面端完整版分页 -->
    <div class="desktop-pagination items-center gap-3">
      <button
        type="button"
        class="btn-card overflow-hidden rounded-lg text-(--primary) w-11 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="上一页"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      {#each pageNumbers as pageItem}
        {#if pageItem === "..."}
          <svg class="w-11 h-11 flex items-center justify-center text-neutral-700 dark:text-neutral-300" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        {:else}
          <button
            type="button"
            class="rounded-lg overflow-hidden w-11 h-11 flex items-center justify-center font-bold {pageItem === currentPage
              ? 'bg-(--primary) text-white dark:text-black/70'
              : 'btn-card active:scale-[0.85] text-neutral-700 dark:text-neutral-300'}"
            onclick={() => goToPage(pageItem as number)}
            aria-label="{String(pageItem)}"
            aria-current={pageItem === currentPage ? 'page' : undefined}
          >
            {pageItem}
          </button>
        {/if}
      {/each}

      <button
        type="button"
        class="btn-card overflow-hidden rounded-lg text-(--primary) w-11 h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        onclick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="下一页"
      >
        <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  </div>
{/if}

<style>
  .responsive-pagination {
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .mobile-pagination {
    display: flex;
    padding: 0 1rem;
  }

  .desktop-pagination {
    display: none;
  }

  @media (min-width: 1024px) {
    .mobile-pagination {
      display: none;
    }
    .desktop-pagination {
      display: flex;
    }
  }

  @media (max-width: 640px) {
    .mobile-pagination {
      padding: 0 0.5rem;
    }
  }

  @media (max-width: 480px) {
    .mobile-pagination {
      padding: 0 0.25rem;
    }
  }

  .responsive-pagination button {
    transition: all 0.2s ease-in-out;
  }

  @media (prefers-contrast: high) {
    .responsive-pagination button {
      border: 1px solid currentColor;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .responsive-pagination button {
      transition: none;
    }
  }

  @media (hover: none) and (pointer: coarse) {
    .responsive-pagination button {
      min-height: 44px;
      min-width: 44px;
    }
    .mobile-pagination button {
      min-height: 40px;
      min-width: 40px;
    }
  }

  @media (max-width: 1024px) and (orientation: landscape) {
    .mobile-pagination {
      padding: 0 0.5rem;
    }
  }
</style>
