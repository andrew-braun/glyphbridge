<script lang="ts">
	type GlyphRibbonTone = "mixed" | "primary" | "accent" | "success" | "warning";
	type GlyphRibbonSize = "sm" | "md";

	let {
		tokens,
		tone = "mixed",
		size = "md",
		animated = true,
		class: className = "",
	}: {
		tokens: string[];
		tone?: GlyphRibbonTone;
		size?: GlyphRibbonSize;
		animated?: boolean;
		class?: string;
	} = $props();

	const mixedTones: Array<Exclude<GlyphRibbonTone, "mixed">> = [
		"primary",
		"accent",
		"success",
		"warning",
	];

	function resolveTone(index: number): Exclude<GlyphRibbonTone, "mixed"> {
		return tone === "mixed" ? mixedTones[index % mixedTones.length] : tone;
	}
</script>

<div
	class={`glyph-ribbon glyph-ribbon--${size} ${!animated ? "glyph-ribbon--static" : ""} ${className}`}
	aria-hidden="true"
>
	{#each tokens as token, index}
		<span
			class={`glyph-ribbon__token glyph-ribbon__token--${resolveTone(index)} thai thai--sm`}
			style={`--glyph-delay:${index * 110}ms`}
		>
			{token}
		</span>
	{/each}
</div>

<style lang="scss">
	.glyph-ribbon {
		align-items: center;
		display: inline-flex;
		flex-wrap: wrap;
		gap: $space-sm;
		justify-content: center;

		&__token {
			align-items: center;
			animation: glyphRibbonFloat 4.8s ease-in-out infinite;
			animation-delay: var(--glyph-delay);
			backdrop-filter: blur(6px);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-full;
			box-shadow: var(--shadow-soft);
			display: inline-flex;
			justify-content: center;
			min-width: 3rem;
			padding: 0.2rem 0.95rem;
		}

		&__token--primary {
			background: rgb(var(--rgb-primary) / 0.12);
			color: var(--color-primary-strong);
		}

		&__token--accent {
			background: rgb(var(--rgb-accent) / 0.12);
			color: var(--color-accent);
		}

		&__token--success {
			background: rgb(var(--rgb-success) / 0.12);
			color: var(--color-success);
		}

		&__token--warning {
			background: rgb(var(--rgb-warning) / 0.16);
			color: var(--color-warning);
		}

		&--sm .glyph-ribbon__token {
			font-size: $font-size-lg;
			min-width: 2.6rem;
			padding: 0.15rem 0.75rem;
		}

		&--static .glyph-ribbon__token {
			animation: none;
		}
	}

	@keyframes glyphRibbonFloat {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.glyph-ribbon__token {
			animation: none;
		}
	}
</style>
