<!--
  StepSameLettersNewWords.svelte — Lesson Step 5: Transfer Practice
  =================================================================
	Self-checks lesson practice vocabulary that reuses the lesson's new letters and
	patterns. Learners see each target before its pronunciation and meaning are revealed.
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
		coreWords,
		extensionWords,
		onComplete,
	}: {
		lesson: Lesson;
		coreWords: LessonVocabularyEntry[];
		extensionWords?: LessonVocabularyEntry[];
		onComplete: () => void;
	} = $props();

	type PracticePhase = "core" | "extensionPrompt" | "extension";

	let phase = $state<PracticePhase>("core");
	let currentIndex = $state(0);
	let isAnswerRevealed = $state(false);

	const extensionSet = $derived(extensionWords ?? []);
	const isExtensionPrompt = $derived(phase === "extensionPrompt");
	const isExtensionPhase = $derived(phase === "extension");
	const activeWords = $derived(isExtensionPhase ? extensionSet : coreWords);
	const currentWord = $derived(activeWords[currentIndex]);
	const currentEntries = $derived(currentWord ? [currentWord] : []);
	const hasNextWord = $derived(currentIndex < activeWords.length - 1);
	const hasExtensionWords = $derived(extensionSet.length > 0);
	const counterLabel = $derived(
		isExtensionPrompt
			? "Optional extension"
			: `${isExtensionPhase ? "Extension" : "Core"} practice ${currentIndex + 1} of ${activeWords.length}`,
	);
	const actionLabel = $derived(
		isAnswerRevealed
			? hasNextWord
				? "Try the next read ->"
				: phase === "core" && hasExtensionWords
					? "See optional extension ->"
					: "Bring on the drills ->"
			: "Check my read",
	);

	function next() {
		if (isExtensionPrompt) {
			return;
		}

		if (!isAnswerRevealed) {
			isAnswerRevealed = true;
			return;
		}

		if (hasNextWord) {
			currentIndex++;
			isAnswerRevealed = false;
			return;
		}

		if (phase === "core" && hasExtensionWords) {
			phase = "extensionPrompt";
			currentIndex = 0;
			isAnswerRevealed = false;
			return;
		}

		onComplete();
	}

	function startExtension() {
		phase = "extension";
		currentIndex = 0;
		isAnswerRevealed = false;
	}
</script>

<StepLayout class="step--same-letters" counter={counterLabel}>
	<section class="same-letters surface-panel lesson-accent-panel lesson-accent-panel--mango">
		<Reveal as="div" distance={14}>
			<div class="same-letters__intro">
				<div class="same-letters__copy">
					<Eyebrow>Read before reveal</Eyebrow>
					<h2>
						{isExtensionPhase ? "Same letters, extra reads" : "Same letters, new reads"}
					</h2>
					<p>
						The word you opened was <span class="thai">{lesson.anchorWord.thai}</span>.
						Use those tools on this fresh read before checking the answer.
					</p>
				</div>

				<div class="same-letters__anchor" aria-label="Anchor word from this lesson">
					<span class="same-letters__anchor-label">Anchor</span>
					<span class="same-letters__anchor-word thai">{lesson.anchorWord.thai}</span>
					<span class="same-letters__anchor-meaning">{lesson.anchorWord.meaning}</span>
				</div>
			</div>
		</Reveal>

		{#if isExtensionPrompt}
			<Reveal as="div" delay={120} distance={10}>
				<div class="same-letters__extension-prompt">
					<div class="same-letters__extension-copy">
						<Eyebrow>Core practice complete</Eyebrow>
						<h3>Keep going with the extension set?</h3>
						<p>
							You cleared the required practice. There are {extensionSet.length} more optional
							reads here if you want extra pattern reps before the drills.
						</p>
					</div>

					<div class="same-letters__actions">
						<Button
							variant="primary"
							size="large"
							fullWidth={true}
							onclick={startExtension}
						>
							Start the extension set
						</Button>
						<Button
							variant="secondary"
							size="large"
							fullWidth={true}
							onclick={onComplete}
						>
							Skip to drills
						</Button>
					</div>
				</div>
			</Reveal>
		{:else}
			{#key `${phase}-${currentIndex}-${isAnswerRevealed}`}
				<SameLettersWordList
					entries={currentEntries}
					newLetters={lesson.newLetters}
					ariaLabel={isAnswerRevealed
						? "Answer for the current practice target"
						: "Current practice target to read before revealing the answer"}
					revealStart={120}
					showAnswers={isAnswerRevealed}
					hiddenLabel="Read it first. Say the sound in your head, then check yourself."
				/>
			{/key}
		{/if}
	</section>

	{#if !isExtensionPrompt}
		<Button variant="primary" size="large" fullWidth={true} onclick={next}>
			{actionLabel}
		</Button>
	{/if}
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

		.same-letters__extension-prompt {
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			display: grid;
			gap: $space-lg;
			padding: clamp(#{$space-md}, 2vw, #{$space-lg});
		}

		.same-letters__extension-copy {
			display: grid;
			gap: $space-sm;

			h3,
			p {
				margin: 0;
			}

			p {
				color: var(--color-text-muted);
				font-size: $font-size-base;
				line-height: 1.5;
			}
		}

		.same-letters__actions {
			display: grid;
			gap: $space-sm;
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
