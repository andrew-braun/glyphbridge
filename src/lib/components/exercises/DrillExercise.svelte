<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import RadioButtons, { type RadioButtonOption } from "$lib/components/ui/RadioButtons.svelte";
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

	const uid = $props.id();
	const promptId = `drill-prompt-${uid}`;

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

	const radioOptions = $derived(
		options.map<RadioButtonOption>((option, index) => ({
			value: index.toString(),
			label: option,
			disabled: answered,
			isThai: isThai(option),
			tone: answered
				? index === correctIndex
					? "correct"
					: selectedAnswer === index
						? "wrong"
						: "default"
				: "default",
		})),
	);

	function handleNext() {
		selectedValue = "";
		answered = false;
		onNext();
	}
</script>

<div class="drill">
	<h2 class="drill__prompt" id={promptId}>{prompt}</h2>

	<RadioButtons
		labelledBy={promptId}
		options={radioOptions}
		bind:value={getSelectedValue, setSelectedValue}
	/>

	{#if answered}
		<div
			class={[
				"drill__feedback",
				{
					"drill__feedback--correct": isCorrect,
					"drill__feedback--wrong": !isCorrect,
				},
			]}
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

		&__feedback {
			@include drill-feedback;
		}
	}
</style>
