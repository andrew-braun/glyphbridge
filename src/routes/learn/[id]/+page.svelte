<!--
  Lesson Page — /learn/[id]
  ==========================
	The core learning experience. Orchestrates a 7-step lesson flow when practice
	vocabulary exists:
		1. Intro      — Show the anchor word, spark curiosity
		2. Breakdown  — Reveal syllable structure
		3. Letters    — Teach new letters one at a time
		4. Rules      — Explain spelling/pronunciation rules
		5. New Words  — Transfer the same letters into fresh word contexts
		6. Drills     — Multiple-choice practice questions
		7. Complete   — Score summary and navigation

  Each step is its own component (in $lib/components/lesson/).
  This page manages the step state machine and progress persistence.
-->
<script lang="ts">
	import { goto } from "$app/navigation";
	import PageShell from "$lib/components/layout/PageShell.svelte";
	import LessonBackLink from "$lib/components/lesson/LessonBackLink.svelte";
	import LessonProgressTracker from "$lib/components/lesson/LessonProgressTracker.svelte";
	import StepBreakdown from "$lib/components/lesson/StepBreakdown.svelte";
	import StepComplete from "$lib/components/lesson/StepComplete.svelte";
	import StepDrills from "$lib/components/lesson/StepDrills.svelte";
	import StepIntro from "$lib/components/lesson/StepIntro.svelte";
	import StepLetters from "$lib/components/lesson/StepLetters.svelte";
	import StepRules from "$lib/components/lesson/StepRules.svelte";
	import StepSameLettersNewWords from "$lib/components/lesson/StepSameLettersNewWords.svelte";
	import { completeLesson } from "$lib/stores/progress";
	import {
		createLessonCompletionSyncInput,
		queueAndFlushLessonCompletionAttempt,
	} from "$lib/stores/progress-sync";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const publication = $derived(data.publication);
	const lesson = $derived(data.lesson);
	const nextLessonId = $derived(data.nextLessonId);
	const corePracticeWords = $derived(lesson.vocabulary.filter((entry) => entry.tier === "core"));
	const extensionPracticeWords = $derived(
		lesson.vocabulary.filter((entry) => entry.tier === "extension"),
	);
	const hasPracticeWords = $derived(corePracticeWords.length + extensionPracticeWords.length > 0);

	// --- Step state machine ---
	// The lesson progresses linearly through these steps.
	type Step = "intro" | "breakdown" | "letters" | "rules" | "sameLetters" | "drills" | "complete";
	const stepOrder = $derived(
		hasPracticeWords
			? ([
					"intro",
					"breakdown",
					"letters",
					"rules",
					"sameLetters",
					"drills",
					"complete",
				] satisfies Step[])
			: (["intro", "breakdown", "letters", "rules", "drills", "complete"] satisfies Step[]),
	);

	let currentStepIndex = $state(0);
	let currentStep = $derived(stepOrder[currentStepIndex]);

	// Drill results — passed from StepDrills to StepComplete
	let drillCorrectCount = $state(0);

	// Progress bar percentage (0% at intro, 100% at complete)
	const progressPercent = $derived((currentStepIndex / (stepOrder.length - 1)) * 100);

	// Check if there's a lesson after this one
	const hasNextLesson = $derived(nextLessonId !== null);

	function resetLessonFlow(lessonId: number) {
		if (lessonId < 1) return;

		currentStepIndex = 0;
		drillCorrectCount = 0;
	}

	$effect(() => {
		resetLessonFlow(lesson.id);
	});

	/** Advance to the next step in the lesson flow. */
	function nextStep() {
		if (currentStepIndex < stepOrder.length - 1) {
			currentStepIndex++;
		}
	}

	/**
	 * Called when all drills are completed.
	 * Saves progress to localStorage and advances to the complete step.
	 */
	function handleDrillsComplete(correctCount: number) {
		drillCorrectCount = correctCount;
		const score = Math.round((correctCount / lesson.drills.length) * 100);
		const completion = completeLesson(lesson.id, score);

		if (completion?.completedAt) {
			void queueAndFlushLessonCompletionAttempt(
				createLessonCompletionSyncInput({
					completedAt: completion.completedAt,
					lessonId: lesson.id,
					publicationId: publication.publicationId,
					score,
				}),
			);
		}

		nextStep();
	}

	/** Navigate to the next lesson in the curriculum. */
	function goToNextLesson() {
		if (nextLessonId !== null) {
			goto(`/learn/${nextLessonId}`);
		} else {
			goto("/learn");
		}
	}
</script>

<svelte:head>
	<title>{lesson.title} — Glyphin</title>
	<meta
		name="description"
		content={`Learn to read ${lesson.anchorWord.thai}, meaning ${lesson.anchorWord.meaning}, through letters, reading rules, and short Thai practice drills.`}
	/>
	<meta name="glyphbridge-publication-id" content={publication.publicationId} />
	<meta name="glyphbridge-publication-cache-key" content={publication.publicationCacheKey} />
</svelte:head>

<PageShell class="lesson">
	<div class="lesson__chrome">
		<LessonBackLink />
		<LessonProgressTracker
			currentStep={currentStepIndex + 1}
			totalSteps={stepOrder.length}
			value={progressPercent}
		/>
	</div>

	<!-- Render the current step component -->
	{#key `${lesson.id}-${currentStep}`}
		<div class="lesson__stage">
			{#if currentStep === "intro"}
				<StepIntro {lesson} onNext={nextStep} />
			{:else if currentStep === "breakdown"}
				<StepBreakdown {lesson} onNext={nextStep} />
			{:else if currentStep === "letters"}
				<StepLetters letters={lesson.newLetters} onComplete={nextStep} />
			{:else if currentStep === "rules"}
				<StepRules
					rules={lesson.rulesIntroduced}
					onComplete={nextStep}
					completeLabel={hasPracticeWords
						? "Try them in new words ->"
						: "Bring on the drills ->"}
				/>
			{:else if currentStep === "sameLetters"}
				<StepSameLettersNewWords
					{lesson}
					coreWords={corePracticeWords}
					extensionWords={extensionPracticeWords}
					onComplete={nextStep}
				/>
			{:else if currentStep === "drills"}
				<StepDrills drills={lesson.drills} onComplete={handleDrillsComplete} />
			{:else if currentStep === "complete"}
				<StepComplete
					{lesson}
					correctCount={drillCorrectCount}
					totalDrills={lesson.drills.length}
					onNextLesson={goToNextLesson}
					{hasNextLesson}
				/>
			{/if}
		</div>
	{/key}
</PageShell>

<style lang="scss">
	:global(.lesson.page-shell) {
		gap: $space-md;
	}

	.lesson__stage {
		@include motion-safe-animation(
			lessonStageFade $motion-duration-slow $motion-ease-standard both
		);
	}

	@keyframes lessonStageFade {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.lesson__chrome {
		align-items: center;
		display: grid;
		gap: $space-xs $space-sm;
		grid-template-columns: auto minmax(12rem, 1fr);
		margin: 0 auto;
		max-width: 64rem;
		width: 100%;
	}

	@media (max-width: $bp-sm) {
		.lesson__chrome {
			align-items: stretch;
			grid-template-columns: 1fr;
		}
	}
</style>
