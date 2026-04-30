<script lang="ts">
	import { RadioGroup, useId } from "bits-ui";

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

	const promptId = useId();

	let selectedValue = $state("");
	let answered = $state(false);

	const selectedAnswer = $derived(selectedValue === "" ? null : Number(selectedValue));
	const isCorrect = $derived(selectedAnswer === correctIndex);

	function getSelectedValue() {
		return selectedValue;
	}

	function setSelectedValue(nextValue: string) {
		if (answered || nextValue === "") return;
		selectedValue = nextValue;
		answered = true;
		onAnswer(Number(nextValue) === correctIndex);
	}

	function getOptionClasses(index: number, checked: boolean) {
		return [
			"drill__option",
			checked ? "drill__option--selected" : "",
			answered && index === correctIndex ? "drill__option--correct" : "",
			answered && selectedAnswer === index && index !== correctIndex
				? "drill__option--wrong"
				: "",
		]
			.filter(Boolean)
			.join(" ");
	}

	function handleNext() {
		selectedValue = "";
		answered = false;
		onNext();
	}
</script>

<div class="drill">
	<h2 class="drill__prompt" id={promptId}>{prompt}</h2>

	<RadioGroup.Root
		class="drill__options"
		aria-labelledby={promptId}
		bind:value={getSelectedValue, setSelectedValue}
	>
		{#each options as option, i}
			<RadioGroup.Item value={i.toString()} disabled={answered}>
				{#snippet child({ props, checked })}
					<button {...props} class={getOptionClasses(i, checked)}>
						<span class="drill__option-text" class:thai={isThai(option)}>
							{option}
						</span>
					</button>
				{/snippet}
			</RadioGroup.Item>
		{/each}
	</RadioGroup.Root>

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
			font-size: $font-size-xl;
			text-align: center;
		}

		&__options {
			display: grid;
			gap: $space-md;
			grid-template-columns: 1fr 1fr;
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
