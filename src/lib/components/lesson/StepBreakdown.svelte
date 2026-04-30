<!--
  StepBreakdown.svelte — Lesson Step 2: Syllable Breakdown
  =========================================================
  After the learner has seen the anchor word, this step reveals
  how the word splits into syllables. Each syllable is shown as
  a card with the Thai characters and their romanized sound.

  This is where the learner starts to see the internal structure
  of the word — the bridge between "whole word" and "letter-level".
-->
<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import type { Lesson } from "$lib/data/types";

	let { lesson, onNext }: { lesson: Lesson; onNext: () => void } = $props();
</script>

<div class="step">
	<h2>Breaking down: <span class="thai">{lesson.anchorWord.thai}</span></h2>

	<div class="breakdown">
		<!-- Full word displayed at the top -->
		<div class="breakdown__word thai thai--lg">{lesson.anchorWord.thai}</div>
		<div class="breakdown__arrow">&darr;</div>

		<!-- Individual syllable cards -->
		<div class="breakdown__syllables">
			{#each lesson.anchorWord.syllables as syllable}
				<div class="syllable-card card">
					<span class="syllable-card__thai thai">{syllable.thai}</span>
					<span class="syllable-card__sound">{syllable.sound}</span>
				</div>
			{/each}
		</div>

		<!-- Combined pronunciation and meaning -->
		<div class="breakdown__full">
			<span class="breakdown__pronunciation">{lesson.anchorWord.pronunciation}</span>
			<span class="breakdown__meaning">= "{lesson.anchorWord.meaning}"</span>
		</div>
	</div>

	<Button variant="primary" size="large" fullWidth={true} onclick={onNext}>
		Learn the New Letters ->
	</Button>
</div>

<style lang="scss">
	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		margin: 0 auto;
		max-width: var(--content-max-width);
		@include fade-in-animation;
	}

	// Vertical flow: word → arrow → syllable cards → pronunciation
	.breakdown {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: $space-lg;
		text-align: center;

		&__word {
			color: $color-primary;
		}

		&__arrow {
			color: $color-text-muted;
			font-size: $font-size-2xl;
		}

		&__syllables {
			display: flex;
			flex-wrap: wrap;
			gap: $space-md;
			justify-content: center;
		}

		&__full {
			display: flex;
			flex-direction: column;
			gap: $space-xs;
		}

		&__pronunciation {
			color: $color-primary;
			font-size: $font-size-xl;
			font-weight: 600;
		}

		&__meaning {
			color: $color-text-light;
			font-size: $font-size-lg;
		}
	}

	// Individual syllable display cards
	.syllable-card {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		padding: $space-lg $space-xl;

		&__thai {
			color: $color-primary;
		}

		&__sound {
			color: $color-text-light;
			font-size: $font-size-sm;
			font-weight: 500;
		}
	}
</style>
