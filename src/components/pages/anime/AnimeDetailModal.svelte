<script lang="ts">
import type { StandardizedAnime } from "@/types/anime";

interface Props {
	item: StandardizedAnime | null;
	onclose: () => void;
}

const { item, onclose }: Props = $props();

function handleBackdropClick(e: MouseEvent) {
	if (e.target === e.currentTarget) {
		onclose();
	}
}

function handleKeydown(e: KeyboardEvent) {
	if (e.key === "Escape") {
		onclose();
	}
}

// Lock body scroll when modal is open
$effect(() => {
	if (item) {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}
});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if item}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="modal-backdrop"
    onclick={handleBackdropClick}
    role="dialog"
    aria-modal="true"
    aria-label={item.title}
  >
    <div class="modal-container">
      <!-- Close button -->
      <button
        type="button"
        class="modal-close-btn"
        onclick={onclose}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4l-5.6 5.6l5.6 5.6l-1.4 1.4l-5.6-5.6z"/></svg>
      </button>

      <div class="modal-body">
        <!-- Poster -->
        <div class="modal-poster">
          {#if item.poster}
            <img
              src={item.poster}
              alt={item.title}
              class="modal-poster-img"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          {:else}
            <div class="modal-poster-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 5v6.5h-2V7H5v10h6.5v2H3V5zm4 4v10q0 .825-.587 1.413T20 21H8q-.825 0-1.412-.587T6 20V8q0-.825.588-1.412T8 5h10q.825 0 1.413.588T20 7zm-4 8V9H8v12h12zm-6-1"/></svg>
            </div>
          {/if}
        </div>

        <!-- Content -->
        <div class="modal-content">
          <div>
            <!-- Badges -->
            <div class="modal-badges">
              <span class="modal-badge {item.type === 'movie' ? 'badge-movie' : 'badge-tv'}">
                {item.type === 'movie' ? '剧场版' : 'TV 动画'}
              </span>
              {#if item.rating > 0}
                <span class="modal-badge badge-rating">
                  评分 {item.rating.toFixed(1)}
                </span>
              {/if}
              {#if item.epStatus}
                <span class="modal-badge badge-ep">
                  {item.epStatus}
                </span>
              {/if}
            </div>

            <!-- Title -->
            <h3 class="modal-title">{item.title}</h3>
            {#if item.originalTitle && item.originalTitle !== item.title}
              <p class="modal-original-title">{item.originalTitle}</p>
            {/if}

            <!-- Overview -->
            {#if item.overview}
              <div class="modal-overview-section">
                <h4 class="modal-overview-label">剧情简介</h4>
                <p class="modal-overview-text">{item.overview}</p>
              </div>
            {/if}
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <span class="modal-source">
              {#if item.source === 'bilibili'}
                <svg xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 14.5v-9l6 4.5z"/></svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/></svg>
              {/if}
              <span>{item.source === 'bilibili' ? 'Bilibili' : 'TMDB'}</span>
            </span>

            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              class="modal-play-btn"
            >
              <span>跳转播放</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="0.875em" height="0.875em" viewBox="0 0 24 24"><path fill="currentColor" d="M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleUp {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .modal-container {
    background: var(--card-bg, #fff);
    border: 1px solid var(--line-divider, #e5e7eb);
    border-radius: 1.25rem;
    width: 100%;
    max-width: 40rem;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    position: relative;
    animation: scaleUp 0.2s ease-out;
  }

  .modal-close-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    padding: 0.375rem;
    background: var(--btn-regular-bg, #f3f4f6);
    border: 1px solid var(--line-divider, #e5e7eb);
    border-radius: 9999px;
    color: var(--btn-content, #6b7280);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-close-btn:hover {
    background: var(--btn-regular-bg-hover, #e5e7eb);
    color: var(--btn-content, #374151);
  }

  .modal-body {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .modal-body {
      flex-direction: row;
    }
  }

  .modal-poster {
    width: 100%;
    aspect-ratio: 2/3;
    background: var(--btn-regular-bg, #f3f4f6);
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .modal-poster {
      width: 40%;
      aspect-ratio: auto;
      min-height: 100%;
    }
  }

  .modal-poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .modal-poster-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--btn-content, #9ca3af);
  }

  .modal-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  .modal-badges {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }

  .modal-badge {
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
  }

  .badge-tv {
    background: color-mix(in srgb, var(--primary, #3b82f6) 10%, transparent);
    color: var(--primary, #3b82f6);
    border: 1px solid color-mix(in srgb, var(--primary, #3b82f6) 20%, transparent);
  }

  .badge-movie {
    background: rgba(245, 158, 11, 0.1);
    color: #d97706;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }

  .badge-rating {
    background: rgba(234, 179, 8, 0.1);
    color: #ca8a04;
    border: 1px solid rgba(234, 179, 8, 0.2);
  }

  .badge-ep {
    background: rgba(236, 72, 153, 0.1);
    color: #db2777;
    border: 1px solid rgba(236, 72, 153, 0.2);
  }

  .modal-title {
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--btn-content, #111827);
    margin-top: 0.25rem;
  }

  :global(.dark) .modal-title {
    color: #f3f4f6;
  }

  .modal-original-title {
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.25rem;
    font-family: ui-monospace, monospace;
  }

  .modal-overview-section {
    margin-top: 1rem;
  }

  .modal-overview-label {
    font-size: 0.6875rem;
    font-weight: 700;
    color: #6b7280;
  }

  .modal-overview-text {
    font-size: 0.8125rem;
    color: var(--btn-content, #374151);
    line-height: 1.6;
    margin-top: 0.375rem;
    text-align: justify;
    max-height: 9rem;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  :global(.dark) .modal-overview-text {
    color: #d1d5db;
  }

  .modal-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--line-divider, #e5e7eb);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-source {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.6875rem;
    color: #9ca3af;
  }

  .modal-play-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 1rem;
    background: var(--primary, #3b82f6);
    color: white;
    border-radius: 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.15s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .modal-play-btn:hover {
    filter: brightness(0.9);
  }

  @media (prefers-reduced-motion: reduce) {
    .modal-backdrop,
    .modal-container {
      animation: none;
    }
  }
</style>
