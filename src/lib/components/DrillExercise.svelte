<!--
  DrillExercise.svelte
  ====================
  Reusable multiple-choice drill component used by both lesson drills
  and the standalone practice page. Displays a prompt with 4 answer
  options, highlights correct/wrong answers after selection, and calls
  back to the parent with the result.

  Props:
    - prompt:        The question text shown to the learner
    - options:       Array of 4 answer strings (may contain Thai script)
    - correctIndex:  Index (0–3) of the correct answer
    - onAnswer:      Callback fired after the user selects an answer
    - onNext:        Callback fired when the user clicks "Next"
    - nextLabel:     Text for the next button (e.g. "Next Question →")
-->
<script lang="ts">
	import { isThai } from '$lib/utils/thai';

	// --- Props from parent ---
	let {
		prompt,
		options,
		correctIndex,
		onAnswer,
		onNext,
		nextLabel = 'Next Question →'
	}: {
		prompt: string;
		options: string[];
		correctIndex: number;
		onAnswer: (isCorrect: boolean) => void;
		onNext: () => void;
		nextLabel?: string;
	} = $props();

	// --- Local drill state ---
	// Tracks which option the user tapped and whether they've answered yet.
	let selectedAnswer = $state<number | null>(null);
	let answered = $state(false);

	// Derived: did the user pick the right answer?
	const isCorrect = $derived(selectedAnswer === correctIndex);

	/**
	 * Called when the user taps an answer option.
	 * Locks in the answer, marks the drill as answered, and notifies parent.
	 */
	function selectAnswer(index: number) {
		if (answered) return; // prevent double-tap
		selectedAnswer = index;
		answered = true;
		onAnswer(index === correctIndex);
	}

	/**
	 * Called when the user clicks "Next" after seeing feedback.
	 * Resets local state and notifies parent to advance.
	 */
	function handleNext() {
		selectedAnswer = null;
		answered = false;
		onNext();
	}
</script>

<div class="drill">
	<!-- Question prompt -->
	<h2 class="drill__prompt">{prompt}</h2>

	<!-- Answer grid — 2×2 on desktop, stacked on mobile -->
	<div class="drill__options">
		{#each options as option, i}
			<button
				class="drill__option"
				class:drill__option--selected={selectedAnswer === i}
				class:drill__option--correct={answered && i === correctIndex}
				class:drill__option--wrong={answered && selectedAnswer === i && i !== correctIndex}
				onclick={() => selectAnswer(i)}
				disabled={answered}
			>
				<!-- Apply .thai class for larger font when option contains Thai characters -->
				<span class="drill__option-text" class:thai={isThai(option)}>
					{option}
				</span>
			</button>
		{/each}
	</div>

	<!-- Feedback banner — shown only after the user answers -->
	{#if answered}
		<div
			class="drill__feedback"
			class:drill__feedback--correct={isCorrect}
			class:drill__feedback--wrong={!isCorrect}
		>
			{#if isCorrect}
				<strong>Correct!</strong>
			{:else}
				<strong>Not quite.</strong> The answer is:
				<span class="thai thai--sm">{options[correctIndex]}</span>
			{/if}
		</div>

		<button class="btn btn--primary btn--large btn--full" onclick={handleNext}>
			{nextLabel}
		</button>
	{/if}
</div>

<style lang="scss">
	// Drill layout — vertical stack of prompt → options → feedback → next button
	.drill {
		display: flex;
		flex-direction: column;
		gap: $space-xl;

		&__prompt {
			text-align: center;
			font-size: $font-size-xl;
		}

		// 2×2 answer grid
		&__options {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: $space-md;
		}

		// Individual answer button — uses shared drill-option mixin
		&__option {
			@include drill-option;
			@include drill-option-states;

			// Thai script in answer options gets a larger font size
			&-text.thai {
				font-size: $font-size-thai;
			}
		}

		// Correct/wrong feedback banner — uses shared drill-feedback mixin
		&__feedback {
			@include drill-feedback;
		}
	}

	// Stack options vertically on small screens
	@media (max-width: $bp-sm) {
		.drill__options {
			grid-template-columns: 1fr;
		}
	}
</style>
