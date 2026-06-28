<script lang="ts">
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import FeedbackBanner from "$lib/components/ui/FeedbackBanner.svelte";
	import RadioButtons, { type RadioButtonOption } from "$lib/components/ui/RadioButtons.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { LessonVocabularyEntry } from "$lib/data/types";

	type PracticeQuestion = {
		promptThai: string;
		correctLabel: string;
		options: string[];
		correctIndex: number;
	};

	let {
		entries,
		onComplete,
	}: {
		entries: LessonVocabularyEntry[];
		onComplete: (correctCount: number, totalQuestions: number) => void;
	} = $props();

	const uid = $props.id();
	const promptId = `practice-checkpoint-${uid}`;
	const shuffledEntries = $derived.by(() => shuffle([...entries]));
	const questions = $derived(buildQuestions(shuffledEntries));

	let currentIndex = $state(0);
	let correctCount = $state(0);
	let selectedValue = $state("");
	let answered = $state(false);

	const currentQuestion = $derived(questions[currentIndex]);
	const selectedAnswer = $derived(selectedValue === "" ? null : Number(selectedValue));
	const isCorrect = $derived(selectedAnswer === currentQuestion?.correctIndex);
	const radioOptions = $derived(
		(currentQuestion?.options ?? []).map<RadioButtonOption>((option, index) => ({
			value: index.toString(),
			label: option,
			disabled: answered,
			tone: answered
				? index === currentQuestion?.correctIndex
					? "correct"
					: selectedAnswer === index
						? "wrong"
						: "default"
				: "default",
		})),
	);

	function shuffle<T>(items: T[]): T[] {
		const shuffled = [...items];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	function buildQuestions(words: LessonVocabularyEntry[]): PracticeQuestion[] {
		return words.map((entry, index) => {
			const distractors = words.filter(
				(candidate) => candidate.word.thai !== entry.word.thai,
			);
			const optionEntries = [entry, ...distractors.slice(0, Math.min(3, distractors.length))];
			const correctIndex = index % optionEntries.length;
			const [correctEntry, ...otherEntries] = optionEntries;
			const orderedEntries = [...otherEntries];
			orderedEntries.splice(correctIndex, 0, correctEntry);

			return {
				promptThai: entry.word.thai,
				correctLabel: formatOption(entry),
				options: orderedEntries.map(formatOption),
				correctIndex,
			};
		});
	}

	function formatOption(entry: LessonVocabularyEntry): string {
		return `${entry.word.pronunciation} - ${entry.word.meaning}`;
	}

	function setSelectedValue(nextValue: string) {
		if (answered || nextValue === "") return;

		selectedValue = nextValue;
		answered = true;

		if (Number(nextValue) === currentQuestion?.correctIndex) {
			correctCount += 1;
		}
	}

	function getSelectedValue() {
		return selectedValue;
	}

	function handleNext() {
		if (currentIndex < questions.length - 1) {
			currentIndex += 1;
			selectedValue = "";
			answered = false;
			return;
		}

		onComplete(correctCount, questions.length);
	}
</script>

<StepLayout counter={`Checkpoint ${currentIndex + 1} of ${questions.length}`}>
	{#if currentQuestion}
		<section class="practice-checkpoint surface-panel lesson-accent-panel">
			<div class="practice-checkpoint__prompt">
				<p>Read this word.</p>
				<h2 id={promptId} class="thai">{currentQuestion.promptThai}</h2>
			</div>

			<RadioButtons
				class="practice-checkpoint__options"
				labelledBy={promptId}
				options={radioOptions}
				columns={1}
				bind:value={getSelectedValue, setSelectedValue}
			/>

			{#if answered}
				<Reveal as="div" distance={10} duration={320}>
					<FeedbackBanner tone={isCorrect ? "correct" : "wrong"}>
						{#if isCorrect}
							<strong>Correct.</strong> That read matches the Thai word.
						{:else}
							<strong>Not quite.</strong> The right read is {currentQuestion.correctLabel}.
						{/if}
					</FeedbackBanner>
				</Reveal>

				<Reveal as="div" delay={80} distance={8} duration={320}>
					<Button variant="primary" size="large" fullWidth={true} onclick={handleNext}>
						{currentIndex < questions.length - 1 ? "Next question" : "See score"}
					</Button>
				</Reveal>
			{/if}
		</section>
	{/if}
</StepLayout>

<style lang="scss">
	.practice-checkpoint {
		display: grid;
		gap: clamp(#{$space-md}, 2vw, #{$space-lg});
		margin: 0 auto;
		max-width: 48rem;
		padding: clamp(#{$space-lg}, 3vw, #{$space-xl});
		width: 100%;

		.practice-checkpoint__prompt {
			display: grid;
			gap: $space-xs;
			text-align: center;

			p,
			h2 {
				margin: 0;
			}

			p {
				color: var(--color-text-soft);
				font-size: $font-size-xs;
				font-weight: 800;
				letter-spacing: 0.08em;
				text-transform: uppercase;
			}

			h2 {
				font-size: clamp(2.2rem, 7vw, 3.5rem);
				line-height: 1.05;
			}
		}

		:global(.practice-checkpoint__options) {
			gap: $space-md;
		}

		:global(.practice-checkpoint__options .radio-buttons__option) {
			justify-content: flex-start;
			min-height: 4.5rem;
			padding: $space-sm $space-md;
			text-align: left;
		}

		:global(.feedback-banner) {
			font-size: $font-size-base;
			padding: $space-sm $space-md;
		}
	}
</style>
