<script lang="ts">
	let { class: className = "" }: { class?: string } = $props();

	const glyphs = [
		{ label: "ก", x: 78, y: 74, tone: "accent" },
		{ label: "ไ", x: 250, y: 96, tone: "primary" },
		{ label: "ม", x: 96, y: 238, tone: "success" },
		{ label: "ย", x: 234, y: 230, tone: "warning" },
	];
</script>

<div class={`glyph-orbit ${className}`} aria-hidden="true">
	<svg viewBox="0 0 320 320" role="presentation">
		<defs>
			<linearGradient id="glyph-orbit-core" x1="0%" x2="100%" y1="0%" y2="100%">
				<stop offset="0%" stop-color="var(--color-primary)" />
				<stop offset="100%" stop-color="var(--color-accent)" />
			</linearGradient>
		</defs>

		<circle class="glyph-orbit__halo" cx="160" cy="160" r="124"></circle>
		<circle class="glyph-orbit__ring glyph-orbit__ring--outer" cx="160" cy="160" r="118"
		></circle>
		<circle class="glyph-orbit__ring glyph-orbit__ring--inner" cx="160" cy="160" r="84"
		></circle>

		<g class="glyph-orbit__core">
			<circle cx="160" cy="160" r="62" fill="url(#glyph-orbit-core)"></circle>
			<circle cx="160" cy="160" r="42" fill="rgb(255 255 255 / 0.12)"></circle>
			<text class="glyph-orbit__word" x="160" y="177">ไทย</text>
		</g>

		{#each glyphs as glyph, index}
			<g
				class={`glyph-orbit__token glyph-orbit__token--${glyph.tone}`}
				style={`--token-delay:${index * 160}ms`}
				transform={`translate(${glyph.x} ${glyph.y})`}
			>
				<circle r="26"></circle>
				<text x="0" y="11">{glyph.label}</text>
			</g>
		{/each}
	</svg>
</div>

<style lang="scss">
	.glyph-orbit {
		aspect-ratio: 1;
		max-width: 25rem;
		position: relative;
		width: min(100%, 25rem);

		svg {
			display: block;
			height: auto;
			overflow: visible;
			width: 100%;
		}

		&__halo {
			fill: rgb(var(--rgb-primary) / 0.16);
			filter: blur(12px);
		}

		&__ring {
			fill: none;
			stroke-width: 1.5;

			&--outer {
				animation: orbitSpin 24s linear infinite;
				stroke: rgb(var(--rgb-primary) / 0.34);
				stroke-dasharray: 10 14;
			}

			&--inner {
				animation: orbitSpinReverse 18s linear infinite;
				stroke: rgb(var(--rgb-accent) / 0.26);
				stroke-dasharray: 6 10;
			}
		}

		&__core {
			filter: drop-shadow(0 20px 40px rgb(var(--rgb-primary) / 0.32));
		}

		&__word {
			fill: white;
			font-family: $font-thai;
			font-size: 2.35rem;
			font-weight: 700;
			letter-spacing: 0.04em;
			text-anchor: middle;
		}

		&__token {
			animation: orbitBob 5s ease-in-out infinite;
			animation-delay: var(--token-delay);
			transform-origin: center;

			circle {
				fill: var(--token-fill, rgb(var(--rgb-primary) / 0.16));
				stroke: var(--token-stroke, rgb(var(--rgb-primary) / 0.36));
				stroke-width: 1.5;
			}

			text {
				fill: var(--token-text, var(--color-text));
				font-family: $font-thai;
				font-size: 1.6rem;
				font-weight: 700;
				text-anchor: middle;
			}
		}

		&__token--primary {
			--token-fill: rgb(var(--rgb-primary) / 0.18);
			--token-stroke: rgb(var(--rgb-primary) / 0.42);
			--token-text: var(--color-primary-strong);
		}

		&__token--accent {
			--token-fill: rgb(var(--rgb-accent) / 0.16);
			--token-stroke: rgb(var(--rgb-accent) / 0.32);
			--token-text: var(--color-accent);
		}

		&__token--success {
			--token-fill: rgb(var(--rgb-success) / 0.16);
			--token-stroke: rgb(var(--rgb-success) / 0.32);
			--token-text: var(--color-success);
		}

		&__token--warning {
			--token-fill: rgb(var(--rgb-warning) / 0.18);
			--token-stroke: rgb(var(--rgb-warning) / 0.34);
			--token-text: var(--color-warning);
		}
	}

	@keyframes orbitSpin {
		from {
			transform: rotate(0deg);
			transform-origin: center;
		}

		to {
			transform: rotate(360deg);
			transform-origin: center;
		}
	}

	@keyframes orbitSpinReverse {
		from {
			transform: rotate(360deg);
			transform-origin: center;
		}

		to {
			transform: rotate(0deg);
			transform-origin: center;
		}
	}

	@keyframes orbitBob {
		0%,
		100% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-8px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.glyph-orbit__ring,
		.glyph-orbit__token {
			animation: none;
		}
	}
</style>
