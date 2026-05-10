<!--
  StepComplete.svelte — Lesson Step 6: Completion Summary
  ========================================================
  Shows the learner a celebration screen with:
    - Their drill score (e.g. "5/6 Drills Correct")
    - The anchor word they just learned
    - A grid of the new letters they unlocked
    - Navigation to the next lesson or back to the lesson list
-->
<script lang="ts">
	import GlyphRibbon from "$lib/components/illustrations/GlyphRibbon.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import type { Lesson } from "$lib/data/types";

	let {
		lesson,
		correctCount,
		totalDrills,
		onNextLesson,
		hasNextLesson,
	}: {
		lesson: Lesson;
		correctCount: number;
		totalDrills: number;
		onNextLesson: () => void;
		hasNextLesson: boolean;
	} = $props();

	const supportingWords = $derived(lesson.vocabulary);
</script>

<div class="step">
	<div class="complete surface-panel surface-panel--success card">
		<GlyphRibbon tokens={["ไ", "ท", "ย"]} tone="success" class="complete__flare" />
		<p class="complete__eyebrow">Lesson checkpoint saved</p>
		<h1>Lesson complete.</h1>

		<!-- The word the learner just mastered -->
		<p class="complete__word">
			You can now read: <span class="thai">{lesson.anchorWord.thai}</span>
			({lesson.anchorWord.meaning})
		</p>

		<!-- Drill score summary -->
		<div class="complete__score surface-panel card card--flat">
			<span class="complete__score-num">{correctCount}/{totalDrills}</span>
			<span class="complete__score-label">Drills Correct</span>
		</div>

		<!-- New letters unlocked in this lesson -->
		<div class="complete__letters">
			<h3>What this lesson added</h3>
			<div class="complete__letter-grid">
				{#each lesson.newLetters as letter}
					<div class="complete__letter">
						<span class="thai" style="font-size:2.5rem">{letter.character}</span>
						<span>{letter.romanization}</span>
					</div>
				{/each}
			</div>
		</div>

		{#if supportingWords.length > 0}
			<div class="complete__vocabulary">
				<h3>More words built from the same pattern</h3>
				<div class="complete__vocabulary-grid">
					{#each supportingWords as entry}
						<div class="complete__vocabulary-card">
							<span class="thai thai--sm">{entry.word.thai}</span>
							<span>{entry.word.pronunciation}</span>
							<span>{entry.word.meaning}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Navigation actions -->
		<div class="complete__actions">
			{#if hasNextLesson}
				<Button variant="primary" size="large" onclick={onNextLesson}>
					Go to the next word ->
				</Button>
			{:else}
				<Button href="/practice" variant="primary" size="large">
					Practice what you know
				</Button>
			{/if}
			<Button href="/learn" variant="secondary" size="large">All Lessons</Button>
		</div>
	</div>
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

	// Celebration card — centered layout with stacked elements
	.complete {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		text-align: center;

		&__eyebrow {
			color: var(--color-success);
			font-size: $font-size-xs;
			font-weight: 700;
			letter-spacing: 0.12em;
			text-transform: uppercase;
		}

		&__word {
			color: var(--color-text-muted);
			font-size: $font-size-lg;
		}

		&__score {
			@include score-display(var(--color-success));
			min-width: 13rem;
		}

		// Letter grid section
		&__letters {
			width: 100%;

			h3 {
				margin-bottom: $space-md;
			}
		}

		&__vocabulary {
			width: 100%;

			h3 {
				margin-bottom: $space-md;
			}
		}

		&__letter-grid {
			display: flex;
			flex-wrap: wrap;
			gap: $space-lg;
			justify-content: center;
		}

		// Individual letter chip
		&__letter {
			align-items: center;
			background: var(--surface-interactive);
			border: 1px solid var(--color-border);
			border-radius: $radius-lg;
			display: flex;
			flex-direction: column;
			gap: $space-xs;
			min-width: 80px;
			padding: $space-md;
		}

		&__vocabulary-grid {
			display: grid;
			gap: $space-md;
			grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		}

		&__vocabulary-card {
			background: var(--surface-panel-accent);
			border: 1px solid var(--color-border);
			border-radius: $radius-lg;
			display: flex;
			flex-direction: column;
			gap: $space-xs;
			padding: $space-md;
		}

		&__actions {
			display: flex;
			flex-wrap: wrap;
			gap: $space-md;
			justify-content: center;
		}
	}
</style>
