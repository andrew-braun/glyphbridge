<!--
  StepLetters.svelte — Lesson Step 3: New Letter Introduction
  ============================================================
  Teaches each new letter one at a time. For each letter, shows:
    - The character in a large display
    - Sound / romanization / pronunciation
    - Letter type and consonant class (for future tone rules)
    - Position info (above, below, etc.) for vowels
    - A mnemonic memory trick

  The learner advances through letters one by one, then proceeds
  to the rules step.
-->
<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import type { Letter } from "$lib/data/types";

	let {
		letters,
		onComplete,
	}: {
		letters: Letter[];
		onComplete: () => void;
	} = $props();

	// Track which letter the learner is currently viewing
	let currentIndex = $state(0);
	const currentLetter = $derived(letters[currentIndex]);

	/** Advance to next letter, or move to rules step if all letters shown. */
	function next() {
		if (currentIndex < letters.length - 1) {
			currentIndex++;
		} else {
			onComplete();
		}
	}
</script>

<div class="step">
	<div class="step__counter">
		Letter {currentIndex + 1} of {letters.length}
	</div>

	<div class="letter-intro">
		<!-- Large character display -->
		<div class="letter-intro__char thai" style="font-size: 5rem; line-height: 1;">
			{currentLetter.character}
		</div>

		<!-- Letter details table -->
		<div class="letter-intro__details">
			<div class="letter-intro__row">
				<span class="letter-intro__label">Sound</span>
				<span class="letter-intro__value">{currentLetter.romanization}</span>
			</div>
			<div class="letter-intro__row">
				<span class="letter-intro__label">Pronunciation</span>
				<span class="letter-intro__value">{currentLetter.pronunciation}</span>
			</div>
			<div class="letter-intro__row">
				<span class="letter-intro__label">Type</span>
				<span class="letter-intro__value badge badge--primary">
					{currentLetter.type}{currentLetter.class
						? ` (${currentLetter.class} class)`
						: ""}
				</span>
			</div>
			<!-- Position only shown for non-standalone characters (vowels that sit above/below/around) -->
			{#if currentLetter.position && currentLetter.position !== "standalone"}
				<div class="letter-intro__row">
					<span class="letter-intro__label">Position</span>
					<span class="letter-intro__value"
						>Written {currentLetter.position} the consonant</span
					>
				</div>
			{/if}
		</div>

		<!-- Mnemonic memory trick -->
		<div class="letter-intro__mnemonic card card--flat">
			<strong>Remember:</strong>
			{currentLetter.mnemonic}
		</div>
	</div>

	<Button variant="primary" size="large" fullWidth={true} onclick={next}>
		{currentIndex < letters.length - 1
			? "Take the next letter ->"
			: "Learn the rule behind it ->"}
	</Button>
</div>

<style lang="scss">
	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		margin: 0 auto;
		max-width: var(--content-max-width);
		@include fade-in-animation;

		&__counter {
			@include step-counter;
		}
	}

	// Centered letter showcase with details below
	.letter-intro {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		text-align: center;

		// Large character in a subtle colored box
		&__char {
			align-items: center;
			background: var(--surface-hero);
			border: 1px solid var(--color-border);
			border-radius: $radius-xl;
			box-shadow: var(--shadow-card);
			color: var(--color-primary-strong);
			display: flex;
			height: 140px;
			justify-content: center;
			width: 140px;
		}

		// Stacked rows of letter properties
		&__details {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			width: 100%;
		}

		&__row {
			@include detail-row;
		}

		&__label {
			@include detail-label;
		}

		&__value {
			font-weight: 500;
		}

		// Mnemonic box at the bottom
		&__mnemonic {
			font-size: $font-size-sm;
			line-height: 1.6;
			text-align: left;
			width: 100%;
		}
	}
</style>
