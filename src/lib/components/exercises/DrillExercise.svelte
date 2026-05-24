<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import FeedbackBanner from "$lib/components/ui/FeedbackBanner.svelte";
	import RadioButtons, { type RadioButtonOption } from "$lib/components/ui/RadioButtons.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
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

<div class="drill surface-panel lesson-accent-panel">
	<h2 class="drill__prompt" id={promptId}>{prompt}</h2>

	<RadioButtons
		class="drill__options"
		labelledBy={promptId}
		options={radioOptions}
		bind:value={getSelectedValue, setSelectedValue}
	/>

	{#if answered}
		<Reveal as="div" distance={10} duration={320}>
			<FeedbackBanner tone={isCorrect ? "correct" : "wrong"}>
				{#if isCorrect}
					<strong>Correct.</strong> You matched the sound to the right Thai form.
				{:else}
					<strong>Not quite.</strong> The answer is:
					<span class="thai thai--sm">{options[correctIndex]}</span>
				{/if}
			</FeedbackBanner>
		</Reveal>

		<Reveal as="div" delay={80} distance={8} duration={320}>
			<Button variant="primary" size="large" fullWidth={true} onclick={handleNext}>
				{nextLabel}
			</Button>
		</Reveal>
	{/if}
</div>

<style lang="scss">
	.drill {
		display: grid;
		gap: clamp(#{$space-md}, 2vw, #{$space-lg});
		margin: 0 auto;
		max-width: 48rem;
		padding: clamp(#{$space-lg}, 3vw, #{$space-xl});
		width: 100%;

		&__prompt {
			font-size: $font-size-xl;
			margin: 0;
			text-align: center;
		}

		:global(.drill__options) {
			gap: $space-md;
		}

		:global(.drill__options .radio-buttons__option) {
			min-height: 4.75rem;
			padding: $space-sm $space-md;
		}

		:global(.drill__options .radio-buttons__label.thai) {
			font-size: $font-size-xl;
			line-height: 1.2;
		}

		:global(.feedback-banner) {
			font-size: $font-size-base;
			padding: $space-sm $space-md;
		}
	}

	@media (min-width: $bp-md) {
		.drill {
			:global(.drill__options) {
				gap: $space-md;
			}

			:global(.drill__options .radio-buttons__option) {
				min-height: 3.75rem;
			}
		}
	}
</style>
