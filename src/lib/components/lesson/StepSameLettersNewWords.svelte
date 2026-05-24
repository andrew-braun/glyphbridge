<!--
  StepSameLettersNewWords.svelte — Lesson Step 5: Transfer Words
  ===============================================================
	Self-checks support vocabulary that reuses the lesson's new letters and patterns.
	Learners see each word before its pronunciation and meaning are revealed.
-->
<script lang="ts">
	import SameLettersWordList from "$lib/components/lesson/SameLettersWordList.svelte";
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Eyebrow from "$lib/components/ui/Eyebrow.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { Lesson, LessonVocabularyEntry } from "$lib/data/types";

	let {
		lesson,
		words,
		onComplete,
	}: {
		lesson: Lesson;
		words: LessonVocabularyEntry[];
		onComplete: () => void;
	} = $props();

	let currentIndex = $state(0);
	let isAnswerRevealed = $state(false);

	const currentWord = $derived(words[currentIndex]);
	const currentEntries = $derived(currentWord ? [currentWord] : []);
	const hasNextWord = $derived(currentIndex < words.length - 1);
	const actionLabel = $derived(
		isAnswerRevealed
			? hasNextWord
				? "Try the next word ->"
				: "Bring on the drills ->"
			: "Check my read",
	);

	function next() {
		if (!isAnswerRevealed) {
			isAnswerRevealed = true;
			return;
		}

		if (hasNextWord) {
			currentIndex++;
			isAnswerRevealed = false;
			return;
		}

		onComplete();
	}
</script>

<StepLayout class="step--same-letters" counter={`New word ${currentIndex + 1} of ${words.length}`}>
	<section class="same-letters surface-panel lesson-accent-panel lesson-accent-panel--mango">
		<Reveal as="div" distance={14}>
			<div class="same-letters__intro">
				<div class="same-letters__copy">
					<Eyebrow>Read before reveal</Eyebrow>
					<h2>Same letters, new words</h2>
					<p>
						The word you opened was <span class="thai">{lesson.anchorWord.thai}</span>.
						Use those tools on this new word before checking the answer.
					</p>
				</div>

				<div class="same-letters__anchor" aria-label="Anchor word from this lesson">
					<span class="same-letters__anchor-label">Anchor</span>
					<span class="same-letters__anchor-word thai">{lesson.anchorWord.thai}</span>
					<span class="same-letters__anchor-meaning">{lesson.anchorWord.meaning}</span>
				</div>
			</div>
		</Reveal>

		{#key `${currentIndex}-${isAnswerRevealed}`}
			<SameLettersWordList
				entries={currentEntries}
				newLetters={lesson.newLetters}
				ariaLabel={isAnswerRevealed
					? "Answer for the current transfer word"
					: "Current transfer word to read before revealing the answer"}
				revealStart={120}
				showAnswers={isAnswerRevealed}
				hiddenLabel="Read it first. Say the sound in your head, then check yourself."
			/>
		{/key}
	</section>

	<Button variant="primary" size="large" fullWidth={true} onclick={next}>
		{actionLabel}
	</Button>
</StepLayout>

<style lang="scss">
	.same-letters {
		--same-letters-accent: var(--color-mango);
		--same-letters-panel-padding: #{$space-lg};

		display: grid;
		gap: clamp(#{$space-md}, 2vw, #{$space-lg});
		padding: var(--same-letters-panel-padding);

		.same-letters__intro {
			display: grid;
			gap: $space-md;
		}

		.same-letters__copy {
			display: grid;
			gap: $space-sm;
			max-width: 38rem;

			h2,
			p {
				margin: 0;
			}

			p {
				color: var(--color-text-muted);
				font-size: $font-size-base;
				line-height: 1.5;
			}

			.thai {
				color: var(--color-mango);
				font-weight: 800;
			}
		}

		.same-letters__anchor {
			align-content: center;
			background: var(--color-mango);
			border: 1px solid var(--color-mango);
			border-radius: $radius-lg;
			box-shadow: var(--shadow-card);
			color: var(--color-on-mango);
			display: grid;
			gap: $space-xs;
			justify-items: center;
			padding: $space-md;
			text-align: center;
		}

		.same-letters__anchor-label {
			color: var(--color-on-mango);
			font-size: $font-size-xs;
			font-weight: 800;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.same-letters__anchor-word {
			font-size: clamp(2rem, 5vw, 3rem);
			font-weight: 750;
			line-height: 1;
		}

		.same-letters__anchor-meaning {
			color: var(--color-on-mango);
		}
	}

	@media (min-width: $bp-md) {
		.same-letters {
			.same-letters__intro {
				align-items: center;
				grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.34fr);
			}
		}
	}

	@media (max-width: $bp-sm) {
		.same-letters {
			padding: $space-lg;
		}
	}
</style>
