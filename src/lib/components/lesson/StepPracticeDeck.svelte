<script lang="ts">
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Eyebrow from "$lib/components/ui/Eyebrow.svelte";
	import type { Lesson, LessonVocabularyEntry } from "$lib/data/types";

	let {
		lesson,
		entries,
		onComplete,
	}: {
		lesson: Lesson;
		entries: LessonVocabularyEntry[];
		onComplete: () => void;
	} = $props();

	let currentIndex = $state(0);
	let revealed = $state(false);

	const currentEntry = $derived(entries[currentIndex]);
	const hasNextEntry = $derived(currentIndex < entries.length - 1);
	const focusLetters = $derived(
		currentEntry
			? lesson.newLetters.filter((letter) =>
					currentEntry.word.thai.includes(letter.character),
				)
			: [],
	);
	const actionLabel = $derived(
		revealed ? (hasNextEntry ? "Next card" : "Quick recap") : "Reveal the read",
	);

	function handleAction() {
		if (!revealed) {
			revealed = true;
			return;
		}

		if (hasNextEntry) {
			currentIndex += 1;
			revealed = false;
			return;
		}

		onComplete();
	}
</script>

<StepLayout counter={`Practice stack ${currentIndex + 1} of ${entries.length}`}>
	{#if currentEntry}
		<section class="practice-deck surface-panel lesson-accent-panel lesson-accent-panel--mango">
			<div class="practice-deck__intro">
				<div class="practice-deck__copy">
					<Eyebrow>Read before reveal</Eyebrow>
					<h2>Take your best read first.</h2>
					<p>
						Use the pattern from <span class="thai">{lesson.anchorWord.thai}</span>,
						then flip the card to check pronunciation and meaning.
					</p>
				</div>
				<div class="practice-deck__anchor">
					<span class="practice-deck__anchor-label">Anchor</span>
					<span class="practice-deck__anchor-word thai">{lesson.anchorWord.thai}</span>
				</div>
			</div>

			<div class="practice-deck__stack" aria-live="polite">
				<div class="practice-deck__shadow practice-deck__shadow--back"></div>
				<div class="practice-deck__shadow practice-deck__shadow--mid"></div>
				<div class={["practice-deck__card", { "practice-deck__card--revealed": revealed }]}>
					<div class="practice-deck__face practice-deck__face--front">
						<span class="practice-deck__face-label">Try to read</span>
						<span class="practice-deck__thai thai">{currentEntry.word.thai}</span>
						{#if focusLetters.length > 0}
							<ul
								class="practice-deck__focus-list"
								aria-label="New letters in this card"
							>
								{#each focusLetters as letter}
									<li class="practice-deck__focus-chip thai">
										{letter.character}
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class="practice-deck__face practice-deck__face--back">
						<span class="practice-deck__face-label">Check yourself</span>
						<span class="practice-deck__thai thai">{currentEntry.word.thai}</span>
						<div class="practice-deck__answer">
							<strong>{currentEntry.word.pronunciation}</strong>
							<span>{currentEntry.word.meaning}</span>
						</div>
						{#if currentEntry.word.syllables.length > 0}
							<ul
								class="practice-deck__syllables"
								aria-label={`Readable parts of ${currentEntry.word.thai}`}
							>
								{#each currentEntry.word.syllables as syllable}
									<li>
										<span class="thai">{syllable.thai}</span>
										<span>{syllable.sound}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>
		</section>

		<Button variant="primary" size="large" fullWidth={true} onclick={handleAction}>
			{actionLabel}
		</Button>
	{/if}
</StepLayout>

<style lang="scss">
	.practice-deck {
		display: grid;
		gap: clamp(#{$space-lg}, 3vw, #{$space-2xl});
		padding: clamp(#{$space-lg}, 4vw, #{$space-2xl});

		.practice-deck__intro,
		.practice-deck__copy {
			display: grid;
			gap: $space-sm;
		}

		.practice-deck__copy {
			h2,
			p {
				margin: 0;
			}

			p {
				color: var(--color-text-muted);
				line-height: 1.5;
				max-width: 38rem;
			}
		}

		.practice-deck__anchor {
			align-content: center;
			background: rgb(var(--rgb-mango) / 0.18);
			border: 1px solid rgb(var(--rgb-mango) / 0.42);
			border-radius: $radius-lg;
			display: grid;
			gap: $space-xs;
			justify-items: center;
			padding: $space-md;
		}

		.practice-deck__anchor-label,
		.practice-deck__face-label {
			color: var(--color-text-soft);
			font-size: $font-size-xs;
			font-weight: 800;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.practice-deck__anchor-word,
		.practice-deck__thai {
			font-size: clamp(2.25rem, 7vw, 4rem);
			font-weight: 800;
			line-height: 1;
		}

		.practice-deck__anchor-word {
			color: var(--color-mango);
		}

		.practice-deck__stack {
			margin: 0 auto;
			max-width: 38rem;
			padding: $space-md 0 $space-xs;
			perspective: 1400px;
			position: relative;
			width: min(100%, 38rem);
		}

		.practice-deck__shadow,
		.practice-deck__card {
			border-radius: $radius-lg;
		}

		.practice-deck__shadow {
			background: rgb(var(--rgb-mango) / 0.12);
			border: 1px solid rgb(var(--rgb-mango) / 0.18);
			inset: auto 0 0;
			position: absolute;
		}

		.practice-deck__shadow--back {
			height: calc(100% - 0.35rem);
			transform: translateY(1rem) scale(0.96);
		}

		.practice-deck__shadow--mid {
			height: calc(100% - 0.2rem);
			transform: translateY(0.55rem) scale(0.98);
		}

		.practice-deck__card {
			background: transparent;
			min-height: 26rem;
			position: relative;
			transform-style: preserve-3d;
			transition: transform $motion-duration-slow $motion-ease-standard;

			&.practice-deck__card--revealed {
				transform: rotateY(180deg);
			}
		}

		.practice-deck__face {
			backface-visibility: hidden;
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			box-shadow: var(--shadow-card);
			display: grid;
			gap: $space-md;
			inset: 0;
			padding: clamp(#{$space-lg}, 4vw, #{$space-2xl});
			position: absolute;
			text-align: center;
		}

		.practice-deck__face--front {
			align-content: center;
			justify-items: center;
		}

		.practice-deck__face--back {
			align-content: start;
			transform: rotateY(180deg);
		}

		.practice-deck__focus-list,
		.practice-deck__syllables {
			display: flex;
			flex-wrap: wrap;
			gap: $space-sm;
			justify-content: center;
			list-style: none;
			margin: 0;
			padding: 0;
		}

		.practice-deck__focus-chip,
		.practice-deck__syllables li {
			align-items: center;
			background: var(--surface-interactive);
			border: 1px solid var(--color-border);
			border-radius: 999px;
			display: inline-flex;
			gap: $space-xs;
			justify-content: center;
			padding: $space-xs $space-sm;
		}

		.practice-deck__focus-chip {
			color: var(--color-mango);
			font-size: $font-size-lg;
			font-weight: 800;
		}

		.practice-deck__answer {
			display: grid;
			gap: $space-xs;

			strong {
				font-size: $font-size-xl;
			}

			span {
				color: var(--color-text-muted);
				font-size: $font-size-lg;
			}
		}

		.practice-deck__syllables li {
			color: var(--color-text-muted);
		}
	}

	@media (min-width: $bp-md) {
		.practice-deck {
			.practice-deck__intro {
				grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.55fr);
			}
		}
	}

	@media (max-width: $bp-sm) {
		.practice-deck {
			.practice-deck__card {
				min-height: 23rem;
			}
		}
	}
</style>
