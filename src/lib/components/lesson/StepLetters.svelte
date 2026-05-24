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
	import Reveal from "$lib/components/ui/Reveal.svelte";
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
	{#key currentLetter.character}
		<section class="letter-intro surface-panel lesson-accent-panel lesson-accent-panel--sky">
			<!-- Large character display -->
			<div class="letter-intro__char thai">
				<Reveal as="span" distance={14}>{currentLetter.character}</Reveal>
			</div>

			<!-- Letter details table -->
			<div class="letter-intro__details">
				<div class="letter-intro__details-content">
					<Reveal as="div" delay={80} distance={14}>
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
					</Reveal>
				</div>
			</div>

			<!-- Mnemonic memory trick -->
			<div class="letter-intro__mnemonic">
				<Reveal as="div" delay={160} distance={12}>
					<NoticeBox>
						<strong>Remember:</strong>
						{currentLetter.mnemonic}
					</NoticeBox>
				</Reveal>
			</div>
		</section>
	{/key}

	<Button variant="primary" size="large" fullWidth={true} onclick={next}>
		{currentIndex < letters.length - 1
			? "Take the next letter ->"
			: "Learn the rule behind it ->"}
	</Button>
</StepLayout>

<style lang="scss">
	.letter-intro {
		align-items: center;
		display: grid;
		gap: clamp(#{$space-md}, 2vw, #{$space-xl});
		justify-items: center;
		padding: clamp(#{$space-lg}, 3vw, #{$space-xl});
		text-align: center;

		&__char {
			align-items: center;
			background: var(--color-sky);
			border: 1px solid var(--color-sky);
			border-radius: $radius-xl;
			box-shadow: var(--shadow-card);
			color: var(--color-on-sky);
			display: flex;
			font-size: 4.5rem;
			height: 120px;
			justify-content: center;
			line-height: 1;
			width: 120px;
		}

		// Stacked rows of letter properties
		&__details {
			width: 100%;
		}

		&__details-content {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			width: 100%;
		}

		&__mnemonic {
			text-align: left;
			width: 100%;
		}
	}

	@media (min-width: $bp-md) {
		.letter-intro {
			align-items: stretch;
			display: grid;
			gap: $space-md $space-lg;
			grid-template-columns: 12rem minmax(0, 1fr);
			justify-items: stretch;
			text-align: left;

			&__char {
				font-size: 5rem;
				height: 100%;
				min-height: 10rem;
				width: 100%;
			}

			&__details {
				align-self: center;
			}

			&__mnemonic {
				grid-column: 1 / -1;
			}
		}
	}
</style>
