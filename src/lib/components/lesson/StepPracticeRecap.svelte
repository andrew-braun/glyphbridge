<script lang="ts">
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Eyebrow from "$lib/components/ui/Eyebrow.svelte";
	import type { LessonVocabularyEntry } from "$lib/data/types";

	let {
		entries,
		onComplete,
	}: {
		entries: LessonVocabularyEntry[];
		onComplete: () => void;
	} = $props();

	let revealedIndexes = $state<number[]>([]);

	function isRevealed(index: number) {
		return revealedIndexes.includes(index);
	}

	function toggle(index: number) {
		if (isRevealed(index)) {
			revealedIndexes = revealedIndexes.filter((item) => item !== index);
			return;
		}

		revealedIndexes = [...revealedIndexes, index];
	}
</script>

<StepLayout counter="Quick recap">
	<section class="practice-recap surface-panel surface-panel--sky">
		<div class="practice-recap__intro">
			<Eyebrow tone="accent">Mini-batch recap</Eyebrow>
			<h2>Scan the whole set once more.</h2>
			<p>Tap any word to reveal its pronunciation and meaning before the scored check.</p>
		</div>

		<div class="practice-recap__grid">
			{#each entries as entry, index}
				<button
					type="button"
					class={[
						"practice-recap__card",
						{ "practice-recap__card--revealed": isRevealed(index) },
					]}
					aria-pressed={isRevealed(index)}
					onclick={() => toggle(index)}
				>
					<span class="practice-recap__thai thai">{entry.word.thai}</span>
					{#if isRevealed(index)}
						<span class="practice-recap__meta">{entry.word.pronunciation}</span>
						<span class="practice-recap__meta">{entry.word.meaning}</span>
					{:else}
						<span class="practice-recap__hint">Reveal</span>
					{/if}
				</button>
			{/each}
		</div>
	</section>

	<Button variant="primary" size="large" fullWidth={true} onclick={onComplete}>
		Start the scored check
	</Button>
</StepLayout>

<style lang="scss">
	.practice-recap {
		display: grid;
		gap: clamp(#{$space-lg}, 3vw, #{$space-2xl});
		padding: clamp(#{$space-lg}, 4vw, #{$space-2xl});

		.practice-recap__intro {
			display: grid;
			gap: $space-sm;

			h2,
			p {
				margin: 0;
			}

			p {
				color: var(--color-text-muted);
				line-height: 1.5;
				max-width: 36rem;
			}
		}

		.practice-recap__grid {
			display: grid;
			gap: $space-md;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.practice-recap__card {
			align-content: center;
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			display: grid;
			gap: $space-xs;
			min-height: 9.5rem;
			padding: $space-lg $space-md;
			text-align: center;
			transition:
				border-color $transition-base,
				box-shadow $transition-base,
				transform $transition-base;

			&:hover {
				border-color: var(--color-primary);
				box-shadow: var(--shadow-card-hover);
				transform: translateY(-2px);
			}

			&.practice-recap__card--revealed {
				background: rgb(var(--rgb-primary) / 0.05);
				border-color: rgb(var(--rgb-primary) / 0.38);
			}
		}

		.practice-recap__thai {
			color: var(--color-primary-strong);
			font-size: clamp(1.75rem, 4vw, 2.3rem);
			font-weight: 800;
			line-height: 1.08;
		}

		.practice-recap__meta {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
			font-weight: 700;
		}

		.practice-recap__hint {
			color: var(--color-text-soft);
			font-size: $font-size-xs;
			font-weight: 800;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}
	}

	@media (max-width: $bp-sm) {
		.practice-recap {
			.practice-recap__grid {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
