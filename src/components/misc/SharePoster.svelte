<script lang="ts">
import QRCode from "qrcode";
import { onMount } from "svelte";
import Icon from "@/components/common/Icon.svelte";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";

export let title: string;
export let author: string;
export let description = "";
export let pubDate: string;
export let coverImage: string | null = null;
export let url: string;
export let siteTitle: string;
export let avatar: string | null = null;

let showModal = false;
let posterImage: string | null = null;
let generating = false;
let themeColor = "#558e88"; // Default blue

onMount(() => {
	// Get theme color from CSS variable
	const temp = document.createElement("div");
	temp.style.color = "var(--primary)";
	temp.style.display = "none";
	document.body.appendChild(temp);
	const computedColor = getComputedStyle(temp).color;
	document.body.removeChild(temp);

	if (computedColor) {
		themeColor = computedColor;
	}
});

function loadImage(src: string): Promise<HTMLImageElement | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => {
			if (!src.includes("images.weserv.nl")) {
				const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&output=png`;
				const proxyImg = new Image();
				proxyImg.crossOrigin = "anonymous";
				proxyImg.onload = () => resolve(proxyImg);
				proxyImg.onerror = () => {
					resolve(null);
				};
				proxyImg.src = proxyUrl;
			} else {
				resolve(null);
			}
		};
		img.src = src;
	});
}

function getLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string[] {
	const chars = text.split("");
	const lines: string[] = [];
	let currentLine = "";

	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		const width = ctx.measureText(currentLine + char).width;
		if (width < maxWidth) {
			currentLine += char;
		} else {
			lines.push(currentLine);
			currentLine = char;
		}
	}
	if (currentLine) {
		lines.push(currentLine);
	}
	return lines;
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

async function generatePoster() {
	showModal = true;
	if (posterImage) return;

	generating = true;
	try {
		const scale = 2;
		const width = 425 * scale;
		const padding = 24 * scale;

		// 1. Prepare resources
		const qrCodeUrl = await QRCode.toDataURL(url, {
			margin: 1,
			width: 100 * scale,
			color: { dark: "#000000", light: "#ffffff" },
		});
		const [qrImg, coverImg, avatarImg] = await Promise.all([
			loadImage(qrCodeUrl),
			coverImage ? loadImage(coverImage) : Promise.resolve(null),
			avatar ? loadImage(avatar) : Promise.resolve(null),
		]);

		// 2. Setup Canvas for measuring
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas context not available");

		canvas.width = width;
		// Initial height estimation, will be adjusted
		canvas.height = 1000 * scale;

		// 3. Layout Calculation
		const contentWidth = width - padding * 2;
		let currentY = 0;

		// Cover
		const coverHeight = (coverImage ? 200 : 120) * scale;
		currentY += coverHeight;
		currentY += padding; // Gap after cover

		// Meta (Date on Cover) - No extra height needed

		// Title
		ctx.font = `700 ${24 * scale}px 'Roboto', sans-serif`;
		const titleLines = getLines(ctx, title, contentWidth);
		const titleLineHeight = 30 * scale;
		const titleHeight = titleLines.length * titleLineHeight;
		currentY += titleHeight;
		currentY += 16 * scale; // Gap

		// Description
		let descHeight = 0;
		if (description) {
			ctx.font = `${14 * scale}px 'Roboto', sans-serif`;
			const descLines = getLines(ctx, description, contentWidth - 16 * scale); // minus border width and gap
			// Limit to 6 lines
			const maxDescLines = 6;
			const displayDescLines = descLines.slice(0, maxDescLines);
			const descLineHeight = 25 * scale; // 1.8 line-height approx
			descHeight = displayDescLines.length * descLineHeight;
			currentY += descHeight;
			// currentY += 24 * scale; // Gap to footer (Removed to reduce whitespace)
		} else {
			currentY += 8 * scale; // Smaller gap if no desc
		}

		// Footer (Author + QR)
		// Footer top border + padding
		currentY += 24 * scale;
		const footerHeight = 64 * scale; // Avatar/QR height
		currentY += footerHeight;
		currentY += padding; // Bottom padding

		// 4. Resize Canvas to fit content
		canvas.height = currentY;

		// 5. Draw Content
		// Fill Background
		ctx.fillStyle = "#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw Decorative Circles
		ctx.save();
		ctx.globalAlpha = 0.1;
		ctx.fillStyle = themeColor;

		// Top Right Circle
		// CSS: top: -50px, right: -50px, width: 150px, height: 150px
		// Radius = 75px
		// Center X = width + 50 - 75 = width - 25
		// Center Y = -50 + 75 = 25
		ctx.beginPath();
		ctx.arc(width - 25 * scale, 25 * scale, 75 * scale, 0, Math.PI * 2);
		ctx.fill();

		// Bottom Left Circle
		// Adjusted to cover the avatar
		ctx.beginPath();
		ctx.arc(10 * scale, canvas.height - 10 * scale, 50 * scale, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();

		// Parse Date
		let dateObj: { day: string; month: string; year: string } | null = null;
		try {
			const d = new Date(pubDate);
			if (!Number.isNaN(d.getTime())) {
				dateObj = {
					day: d.getDate().toString().padStart(2, "0"),
					month: (d.getMonth() + 1).toString().padStart(2, "0"),
					year: d.getFullYear().toString(),
				};
			}
		} catch (e) {}

		// Draw Cover
		if (coverImg) {
			// Object-fit: cover implementation
			const imgRatio = coverImg.width / coverImg.height;
			const targetRatio = width / coverHeight;
			let sx: number;
			let sy: number;
			let sWidth: number;
			let sHeight: number;

			if (imgRatio > targetRatio) {
				sHeight = coverImg.height;
				sWidth = sHeight * targetRatio;
				sx = (coverImg.width - sWidth) / 2;
				sy = 0;
			} else {
				sWidth = coverImg.width;
				sHeight = sWidth / targetRatio;
				sx = 0;
				sy = (coverImg.height - sHeight) / 2;
			}
			ctx.drawImage(
				coverImg,
				sx,
				sy,
				sWidth,
				sHeight,
				0,
				0,
				width,
				coverHeight,
			);
		} else {
			ctx.save();
			ctx.fillStyle = themeColor;
			ctx.globalAlpha = 0.2;
			ctx.fillRect(0, 0, width, coverHeight);
			ctx.restore();
		}

		// Draw Date Overlay
		if (dateObj) {
			const dateBoxW = 60 * scale;
			const dateBoxH = 60 * scale;
			const dateBoxX = padding;
			const dateBoxY = coverHeight - dateBoxH;

			// Background (Semi-transparent black)
			ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
			drawRoundedRect(ctx, dateBoxX, dateBoxY, dateBoxW, dateBoxH, 4 * scale);
			ctx.fill();

			// Day
			ctx.fillStyle = "#ffffff";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = `700 ${30 * scale}px 'Roboto', sans-serif`;
			ctx.fillText(dateObj.day, dateBoxX + dateBoxW / 2, dateBoxY + 24 * scale);

			// Line
			ctx.beginPath();
			ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
			ctx.lineWidth = 1 * scale;
			ctx.moveTo(dateBoxX + 10 * scale, dateBoxY + 42 * scale);
			ctx.lineTo(dateBoxX + dateBoxW - 10 * scale, dateBoxY + 42 * scale);
			ctx.stroke();

			// Year Month
			ctx.font = `${10 * scale}px 'Roboto', sans-serif`;
			ctx.fillText(
				`${dateObj.year} ${dateObj.month}`,
				dateBoxX + dateBoxW / 2,
				dateBoxY + 51 * scale,
			);
		}

		// Reset Y for drawing
		let drawY = coverHeight + padding;

		// Draw Title
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.font = `700 ${24 * scale}px 'Roboto', sans-serif`;
		ctx.fillStyle = "#111827";
		titleLines.forEach((line) => {
			ctx.fillText(line, padding, drawY);
			drawY += titleLineHeight;
		});
		drawY += 16 * scale - (titleLineHeight - 24 * scale); // Adjust for line-height diff

		// Draw Description
		if (description) {
			// Draw vertical line
			ctx.fillStyle = "#e5e7eb";
			const descLineH = descHeight; // Approximate
			// Extend the line slightly above and below the text
			drawRoundedRect(
				ctx,
				padding,
				drawY - 8 * scale,
				4 * scale,
				descLineH + 8 * scale,
				2 * scale,
			);
			ctx.fill();

			ctx.font = `${14 * scale}px 'Roboto', sans-serif`;
			ctx.fillStyle = "#4b5563";
			const descLines = getLines(ctx, description, contentWidth - 16 * scale);
			const maxDescLines = 6;

			descLines.slice(0, maxDescLines).forEach((line) => {
				ctx.fillText(line, padding + 16 * scale, drawY);
				drawY += 25 * scale; // line height
			});
			// drawY += 24 * scale; // Removed to reduce whitespace
		} else {
			drawY += 8 * scale;
		}

		// Draw Footer Divider
		drawY += 24 * scale; // Spacing before line
		ctx.beginPath();
		ctx.strokeStyle = "#f3f4f6";
		ctx.lineWidth = 1 * scale;
		ctx.moveTo(padding, drawY);
		ctx.lineTo(width - padding, drawY);
		ctx.stroke();
		drawY += 24 * scale; // Spacing after line

		// Draw Footer Content
		const footerY = drawY;

		// Left: Author
		if (avatarImg) {
			ctx.save();
			const avatarSize = 64 * scale;
			const avatarX = padding;

			// Circle clip
			ctx.beginPath();
			ctx.arc(
				avatarX + avatarSize / 2,
				footerY + avatarSize / 2,
				avatarSize / 2,
				0,
				Math.PI * 2,
			);
			ctx.closePath();
			ctx.clip();

			ctx.drawImage(avatarImg, avatarX, footerY, avatarSize, avatarSize);
			ctx.restore();

			// Border for avatar
			ctx.beginPath();
			ctx.arc(
				avatarX + (64 * scale) / 2,
				footerY + (64 * scale) / 2,
				(64 * scale) / 2,
				0,
				Math.PI * 2,
			);
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 2 * scale;
			ctx.stroke();
		}

		const authorTextX = padding + (avatar ? 64 * scale + 16 * scale : 0);
		const textCenterY = footerY + 32 * scale;

		ctx.fillStyle = "#9ca3af";
		ctx.font = `${12 * scale}px 'Roboto', sans-serif`;
		ctx.fillText(i18n(I18nKey.author), authorTextX, textCenterY - 20 * scale);

		ctx.fillStyle = "#1f2937";
		ctx.font = `700 ${20 * scale}px 'Roboto', sans-serif`;
		ctx.fillText(author, authorTextX, textCenterY + 4 * scale);

		// Right: QR Code
		const qrSize = 64 * scale;
		const qrX = width - padding - qrSize;

		// QR Background/Shadow effect (simplified as border)
		ctx.fillStyle = "#ffffff";
		// Shadow simulation
		ctx.shadowColor = "rgba(0, 0, 0, 0.05)";
		ctx.shadowBlur = 4 * scale;
		ctx.shadowOffsetY = 2 * scale;
		drawRoundedRect(ctx, qrX, footerY, qrSize, qrSize, 4 * scale);
		ctx.fill();
		ctx.shadowColor = "transparent"; // Reset shadow

		// Draw QR
		const qrInnerSize = 56 * scale;
		const qrPadding = (qrSize - qrInnerSize) / 2;
		if (qrImg) {
			ctx.drawImage(
				qrImg,
				qrX + qrPadding,
				footerY + qrPadding,
				qrInnerSize,
				qrInnerSize,
			);
		}

		// Site Info (Left of QR)
		const siteInfoX = qrX - 16 * scale;
		ctx.textAlign = "right";

		ctx.fillStyle = "#9ca3af";
		ctx.font = `${12 * scale}px 'Roboto', sans-serif`;
		ctx.fillText(i18n(I18nKey.scanToRead), siteInfoX, textCenterY - 20 * scale);

		ctx.fillStyle = "#1f2937";
		ctx.font = `700 ${20 * scale}px 'Roboto', sans-serif`;
		ctx.fillText(siteTitle, siteInfoX, textCenterY + 4 * scale);

		// Finalize
		posterImage = canvas.toDataURL("image/png");
		generating = false;
	} catch (error) {
		console.error("Failed to generate poster:", error);
		generating = false;
	}
}

function downloadPoster() {
	if (posterImage) {
		const a = document.createElement("a");
		a.href = posterImage;
		a.download = `poster-${title.replace(/\s+/g, "-")}.png`;
		a.click();
	}
}

function closeModal() {
	showModal = false;
}

let copied = false;
function copyLink() {
	navigator.clipboard.writeText(url);
	copied = true;
	setTimeout(() => {
		copied = false;
	}, 2000);
}

function portal(node: HTMLElement) {
	document.body.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		},
	};
}
</script>

<!-- Trigger Button -->
<button 
  class="btn-regular rounded-lg h-12 px-6 gap-2 hover:scale-105 active:scale-95 whitespace-nowrap"
  on:click={generatePoster}
  aria-label="Generate Share Poster"
>
  <Icon icon="material-symbols:share" size="md" />
  <span>{i18n(I18nKey.shareArticle)}</span>
</button>



<!-- Modal -->
{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div use:portal class="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-opacity" on:click={closeModal}>
    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-[440px] w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl transform transition-all" on:click={(e) => e.stopPropagation()}>
      
      <div class="p-6 flex justify-center bg-gray-50 dark:bg-gray-900 min-h-[200px] items-center">
        {#if posterImage}
          <img src={posterImage} alt="Poster" class="max-w-full h-auto shadow-lg rounded-lg" />
        {:else}
           <div class="flex flex-col items-center gap-3">
             <div class="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style="border-top-color: {themeColor}"></div>
             <span class="text-sm text-gray-500">{i18n(I18nKey.generatingPoster)}</span>
           </div>
        {/if}
      </div>
      
      <div class="p-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
        <button 
          class="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          on:click={copyLink}
        >
          {#if copied}
            <Icon icon="material-symbols:check" size="md" />
            <span>{i18n(I18nKey.copied)}</span>
          {:else}
            <Icon icon="material-symbols:link" size="md" />
            <span>{i18n(I18nKey.copyLink)}</span>
          {/if}
        </button>
        <button 
          class="py-3 text-white rounded-xl font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-90"
          style="background-color: {themeColor};"
          on:click={downloadPoster}
          disabled={!posterImage}
        >
          <Icon icon="material-symbols:download" size="md" />
          {i18n(I18nKey.savePoster)}
        </button>
      </div>
    </div>
  </div>
{/if}
