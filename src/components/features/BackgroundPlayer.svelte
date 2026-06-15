<script lang="ts">
  import { onMount } from "svelte";

  export let playerUrl: string | string[] = "";
  export let playerMode: "order" | "random" = "order";

  let isPlaying = false;
  let videoElement: HTMLVideoElement | null = null;

  // 标准化为数组
  let urls: string[] = [];
  let currentIndex = 0;

  // 初始化或 playerUrl 变化时重建列表
  function rebuildUrls() {
    urls = Array.isArray(playerUrl) ? playerUrl : (playerUrl ? [playerUrl] : []);
    currentIndex = 0;
  }
  rebuildUrls();

  function getCurrentSrc(): string {
    return urls[currentIndex] || "";
  }

  function getNextIndex(): number {
    if (urls.length <= 1) return 0;
    if (playerMode === "random") {
      let next: number;
      do {
        next = Math.floor(Math.random() * urls.length);
      } while (next === currentIndex);
      return next;
    }
    return (currentIndex + 1) % urls.length;
  }

  function getPrevIndex(): number {
    if (urls.length <= 1) return 0;
    if (playerMode === "random") {
      let next: number;
      do {
        next = Math.floor(Math.random() * urls.length);
      } while (next === currentIndex);
      return next;
    }
    return (currentIndex - 1 + urls.length) % urls.length;
  }

  function playVideo() {
    if (!videoElement || !urls.length) return;
    videoElement.src = getCurrentSrc();
    videoElement.muted = true;
    videoElement
      .play()
      .then(() => {
        // 用户主动点击后取消静音
        setTimeout(() => {
          if (videoElement) videoElement.muted = false;
        }, 100);
      })
      .catch(() => {
        // 播放失败（如用户未交互时 autoplay 被拦截）
        isPlaying = false;
        applyState();
      });
  }

  function switchTrack(index: number) {
    if (index < 0 || index >= urls.length) return;
    currentIndex = index;
    if (isPlaying) {
      playVideo();
    } else {
      // 暂停状态切换曲目 → 同步 src 方便用户点击播放时立即播这一首
      if (videoElement) {
        videoElement.src = getCurrentSrc();
        videoElement.load();
      }
    }
  }

  function nextVideo() {
    switchTrack(getNextIndex());
  }

  function prevVideo() {
    switchTrack(getPrevIndex());
  }

  function togglePlayPause() {
    if (!urls.length) return;
    isPlaying = !isPlaying;
    if (isPlaying) {
      if (currentIndex >= urls.length) currentIndex = 0;
      applyState();
      // 等待 DOM 更新后播放
      requestAnimationFrame(() => playVideo());
    } else {
      if (videoElement) videoElement.pause();
      applyState();
    }
  }

  function onVideoEnded() {
    if (urls.length > 1) {
      currentIndex = getNextIndex();
      playVideo();
    } else {
      isPlaying = false;
      applyState();
    }
  }

  function applyState() {
    const body = document.body;
    const html = document.documentElement;
    if (isPlaying) {
      body.setAttribute("data-bg-video-playing", "true");
      html.setAttribute("data-bg-video-playing", "true");
    } else {
      body.removeAttribute("data-bg-video-playing");
      html.removeAttribute("data-bg-video-playing");
    }
  }

  onMount(() => {
    return () => {
      document.body.removeAttribute("data-bg-video-playing");
      document.documentElement.removeAttribute("data-bg-video-playing");
    };
  });
</script>

{#if urls.length > 0}
  <div class="bg-video-overlay" class:active={isPlaying}>
    <video
      bind:this={videoElement}
      preload="auto"
      playsinline
      on:ended={onVideoEnded}
      class="bg-video-el"
    >
    </video>
  </div>

  <div class="bg-player-controls" class:has-multiple={urls.length > 1}>
    {#if urls.length > 1}
      <button
        class="bg-nav-btn bg-prev-btn"
        on:click={prevVideo}
        title="上一个视频"
        aria-label="上一个视频"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fill-rule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" />
        </svg>
      </button>
    {/if}

    <button
      class="bg-play-btn"
      class:playing={isPlaying}
      on:click={togglePlayPause}
      title={isPlaying ? "暂停背景视频" : "播放背景视频"}
      aria-label={isPlaying ? "暂停背景视频" : "播放背景视频"}
    >
      {#if isPlaying}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
          <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
        </svg>
      {/if}
    </button>

    {#if urls.length > 1}
      <button
        class="bg-nav-btn bg-next-btn"
        on:click={nextVideo}
        title="下一个视频"
        aria-label="下一个视频"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  .bg-video-overlay {
    position: absolute;
    inset: 0;
    z-index: 15;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
  .bg-video-overlay.active {
    opacity: 1;
  }
  .bg-video-el {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ===== Button group ===== */
  .bg-player-controls {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    pointer-events: auto;
  }

  .bg-play-btn,
  .bg-nav-btn {
    width: 2.75rem;
    height: 2.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.35);
    color: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(6px);
    cursor: pointer;
    transition: opacity 0.2s ease, background 0.2s ease, color 0.2s ease;
    opacity: 0.5;
  }

  .bg-play-btn:hover,
  .bg-nav-btn:hover {
    background: rgba(0, 0, 0, 0.55);
    color: rgba(255, 255, 255, 0.8);
    opacity: 0.8;
  }

  .bg-play-btn.playing {
    opacity: 0.8;
  }

  /* Prev/Next — hidden by default, revealed on container hover */
  .bg-prev-btn,
  .bg-next-btn {
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 0.2s ease, transform 0.2s ease, background 0.2s ease, color 0.2s ease;
  }

  .bg-prev-btn:hover,
  .bg-next-btn:hover {
    opacity: 0.8 !important;
    transform: scale(1);
  }

  .bg-player-controls.has-multiple:hover .bg-prev-btn,
  .bg-player-controls.has-multiple:hover .bg-next-btn {
    opacity: 0.5;
    transform: scale(1);
  }

  /* ===== wallpaper layer visibility during video playback ===== */
  :global([data-bg-video-playing] #banner-images-container),
  :global([data-bg-video-playing] #banner-dim-container),
  :global([data-bg-video-playing] #banner-overlay-container),
  :global([data-bg-video-playing] #header-waves),
  :global([data-bg-video-playing] #wallpaper-gradient) {
    opacity: 0 !important;
    transition: opacity 0.5s ease;
  }
</style>
