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
		max-width: var(--content-max-width);
		margin: 0 auto;
		@include fade-in-animation;
	}

	// Celebration card — centered layout with stacked elements
	.complete {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-xl;

		&__emoji {
			@include empty-state-icon;
		}

		&__word {
			font-size: $font-size-lg;
			color: $color-text-light;
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

		&__letter-grid {
			display: flex;
			gap: $space-lg;
			justify-content: center;
			flex-wrap: wrap;
		}

		// Individual letter chip
		&__letter {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $space-xs;
			padding: $space-md;
			background: rgba($color-primary, 0.06);
			border-radius: $radius-lg;
			min-width: 80px;
		}

		&__actions {
			display: flex;
			gap: $space-md;
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
