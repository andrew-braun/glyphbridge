<!--
  StepIntro.svelte — Lesson Step 1: Word Introduction
  ====================================================
  Shows the anchor word in large Thai script with a "Can you guess?"
  prompt. Includes an optional real-world context note explaining
  where the learner would encounter this word in Thailand.

  This is the first thing the learner sees — it creates curiosity
  before any breakdown or instruction happens.
-->
<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte"
	import type { Lesson } from "$lib/data/types"

	let { lesson, onNext }: { lesson: Lesson; onNext: () => void } = $props()
</script>

<div class="step step--intro">
	<span class="badge badge--primary">Stage {lesson.stage}</span>
	<h1 class="step__title">{lesson.title}</h1>

	<!-- Large word reveal — the learner's first look at the anchor word -->
	<div class="word-reveal">
		<div class="word-reveal__thai thai thai--lg">{lesson.anchorWord.thai}</div>
		<p class="word-reveal__hint">Can you guess what this says?</p>
	</div>

	<!-- Context note explaining where this word appears in the real world -->
	{#if lesson.anchorWord.contextNote}
		<div class="context-note card card--flat">
			<p>{lesson.anchorWord.contextNote}</p>
		</div>
	{/if}

	<Button variant="primary" size="large" fullWidth={true} onclick={onNext}>
		Show Me the Breakdown ->
	</Button>
</div>

<style lang="scss">
	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		max-width: 640px;
		margin: 0 auto;
		@include fade-in-animation;

		&__title {
			font-size: $font-size-2xl;
		}
	}

	// Large reveal area with subtle gradient background
	.word-reveal {
		text-align: center;
		padding: $space-2xl;
		background: linear-gradient(
			135deg,
			rgba($color-primary, 0.04),
			rgba($color-accent, 0.04)
		);
		border-radius: $radius-xl;

		&__thai {
			color: $color-primary;
		}

		&__hint {
			margin-top: $space-md;
			color: $color-text-light;
			font-style: italic;
		}
	}

	.context-note {
		font-size: $font-size-sm;
		color: $color-text-light;
		line-height: 1.6;
	}
</style>
