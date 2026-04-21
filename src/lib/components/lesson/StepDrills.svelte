<!--
  StepDrills.svelte — Lesson Step 5: Practice Drills
  ====================================================
  Wraps the shared DrillExercise component with lesson-specific
  progress tracking. Shows a counter ("Drill 2 of 6") and accumulates
  correct/wrong counts to report to the parent when all drills are done.
-->
<script lang="ts">
	import DrillExercise from "$lib/components/exercises/DrillExercise.svelte";
	import type { DrillQuestion } from "$lib/data/types";

	let {
		drills,
		onComplete,
	}: {
		drills: DrillQuestion[];
		onComplete: (correctCount: number) => void;
	} = $props();

	// --- Drill progress state ---
	let currentIndex = $state(0);
	let correctCount = $state(0);

	const currentDrill = $derived(drills[currentIndex]);

	/** Called by DrillExercise after the user selects an answer. */
	function handleAnswer(isCorrect: boolean) {
		if (isCorrect) correctCount++;
	}

	/** Called by DrillExercise when user clicks "Next". */
	function handleNext() {
		if (currentIndex < drills.length - 1) {
			currentIndex++;
		} else {
			// All drills done — report score to parent
			onComplete(correctCount);
		}
	}
</script>

<div class="step">
	<div class="step__counter">
		Drill {currentIndex + 1} of {drills.length}
	</div>

	{#if currentDrill}
		<DrillExercise
			prompt={currentDrill.prompt}
			options={currentDrill.options}
			correctIndex={currentDrill.correctIndex}
			onAnswer={handleAnswer}
			onNext={handleNext}
			nextLabel={currentIndex < drills.length - 1 ? "Next Question →" : "See Results →"}
		/>
	{/if}
</div>

<style lang="scss">
	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		max-width: var(--content-max-width);
		margin: 0 auto;
		@include fade-in-animation;

		&__counter {
			@include step-counter;
		}
	}
</style>
