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
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import DetailRow from "$lib/components/ui/DetailRow.svelte";
	import NoticeBox from "$lib/components/ui/NoticeBox.svelte";
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

<StepLayout counter={`Letter ${currentIndex + 1} of ${letters.length}`}>
	<div class="letter-intro">
		<!-- Large character display -->
		<div class="letter-intro__char thai">
			{currentLetter.character}
		</div>

		<!-- Letter details table -->
		<div class="letter-intro__details">
			<DetailRow label="Sound" value={currentLetter.romanization} />
			<DetailRow label="Pronunciation" value={currentLetter.pronunciation} />
			<DetailRow label="Type">
				<Badge>
					{currentLetter.type}{currentLetter.class
						? ` (${currentLetter.class} class)`
						: ""}
				</Badge>
			</DetailRow>
			<!-- Position only shown for non-standalone characters (vowels that sit above/below/around) -->
			{#if currentLetter.position && currentLetter.position !== "standalone"}
				<DetailRow
					label="Position"
					value={`Written ${currentLetter.position} the consonant`}
				/>
			{/if}
		</div>

		<!-- Mnemonic memory trick -->
		<NoticeBox class="letter-intro__mnemonic">
			<strong>Remember:</strong>
			{currentLetter.mnemonic}
		</NoticeBox>
	</div>

	<Button variant="primary" size="large" fullWidth={true} onclick={next}>
		{currentIndex < letters.length - 1
			? "Take the next letter ->"
			: "Learn the rule behind it ->"}
	</Button>
</StepLayout>

<style lang="scss">
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
			font-size: 5rem;
			height: 140px;
			justify-content: center;
			line-height: 1;
			width: 140px;
		}

		// Stacked rows of letter properties
		&__details {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			width: 100%;
		}

		// Mnemonic box at the bottom
		:global(.letter-intro__mnemonic) {
			text-align: left;
			width: 100%;
		}
	}
</style>
