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
	<div class="complete">
		<div class="complete__emoji">&#127881;</div>
		<h1>Lesson Complete!</h1>

		<!-- The word the learner just mastered -->
		<p class="complete__word">
			You learned: <span class="thai">{lesson.anchorWord.thai}</span>
			({lesson.anchorWord.meaning})
		</p>

		<!-- Drill score summary -->
		<div class="complete__score">
			<span class="complete__score-num">{correctCount}/{totalDrills}</span>
			<span class="complete__score-label">Drills Correct</span>
		</div>

		<!-- New letters unlocked in this lesson -->
		<div class="complete__letters">
			<h3>New letters learned:</h3>
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
				<h3>More words from this lesson:</h3>
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
					Next Lesson ->
				</Button>
			{:else}
				<Button href="/practice" variant="primary" size="large">
					Practice What You've Learned
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

		&__emoji {
			@include empty-state-icon;
		}

		&__word {
			color: $color-text-light;
			font-size: $font-size-lg;
		}

		// Score display — big green number + label
		&__score {
			@include score-display($color-success);
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
			background: rgba($color-primary, 0.06);
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
			background: rgba($color-accent, 0.06);
			border: 1px solid $color-border;
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
