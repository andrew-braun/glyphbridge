<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import { isThai } from "$lib/utils/thai";

	let {
		prompt,
		options,
		correctIndex,
		onAnswer,
		onNext,
		nextLabel = "Next Question ->",
	}: {
		prompt: string;
		options: string[];
		correctIndex: number;
		onAnswer: (isCorrect: boolean) => void;
		onNext: () => void;
		nextLabel?: string;
	} = $props();

	let selectedAnswer = $state<number | null>(null);
	let answered = $state(false);

	const isCorrect = $derived(selectedAnswer === correctIndex);

	function selectAnswer(index: number) {
		if (answered) return;
		selectedAnswer = index;
		answered = true;
		onAnswer(index === correctIndex);
	}

	function handleNext() {
		selectedAnswer = null;
		answered = false;
		onNext();
	}
</script>

<div class="drill">
	<h2 class="drill__prompt">{prompt}</h2>

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
				<span class="drill__option-text" class:thai={isThai(option)}>
					{option}
				</span>
			</button>
		{/each}
	</div>

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

		<Button variant="primary" size="large" fullWidth={true} onclick={handleNext}>
			{nextLabel}
		</Button>
	{/if}
</div>

<style lang="scss">
	.drill {
		display: flex;
		flex-direction: column;
		gap: $space-xl;

		&__prompt {
			text-align: center;
			font-size: $font-size-xl;
		}

		&__options {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: $space-md;
		}

		&__option {
			@include drill-option;
			@include drill-option-states;

			&-text.thai {
				font-size: $font-size-thai;
			}
		}

		&__feedback {
			@include drill-feedback;
		}
	}

	@media (max-width: $bp-sm) {
		.drill__options {
			grid-template-columns: 1fr;
		}
	}
</style>
