<!--
  Lesson Page — /learn/[id]
  ==========================
  The core learning experience. Orchestrates a 6-step lesson flow:
    1. Intro     — Show the anchor word, spark curiosity
    2. Breakdown — Reveal syllable structure
    3. Letters   — Teach new letters one at a time
    4. Rules     — Explain spelling/pronunciation rules
    5. Drills    — Multiple-choice practice questions
    6. Complete  — Score summary and navigation

  Each step is its own component (in $lib/components/lesson/).
  This page manages the step state machine and progress persistence.
-->
<script lang="ts">
	import { goto } from "$app/navigation";
	// Step components
	import StepBreakdown from "$lib/components/lesson/StepBreakdown.svelte";
	import StepComplete from "$lib/components/lesson/StepComplete.svelte";
	import StepDrills from "$lib/components/lesson/StepDrills.svelte";
	import StepIntro from "$lib/components/lesson/StepIntro.svelte";
	import StepLetters from "$lib/components/lesson/StepLetters.svelte";
	import StepRules from "$lib/components/lesson/StepRules.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Progress from "$lib/components/ui/Progress.svelte";
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

	// --- Step state machine ---
	// The lesson progresses linearly through these steps.
	type Step = "intro" | "breakdown" | "letters" | "rules" | "drills" | "complete";
	const stepOrder: Step[] = ["intro", "breakdown", "letters", "rules", "drills", "complete"];

	let currentStepIndex = $state(0);
	let currentStep = $derived(stepOrder[currentStepIndex]);

	// Drill results — passed from StepDrills to StepComplete
	let drillCorrectCount = $state(0);

	// Progress bar percentage (0% at intro, 100% at complete)
	const progressPercent = $derived((currentStepIndex / (stepOrder.length - 1)) * 100);

	// Check if there's a lesson after this one
	const hasNextLesson = $derived(nextLessonId !== null);

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
	<title>{lesson.title} — GlyphBridge</title>
	<meta
		name="description"
		content={`Learn to read ${lesson.anchorWord.thai}, meaning ${lesson.anchorWord.meaning}, through letters, reading rules, and short Thai practice drills.`}
	/>
	<meta name="glyphbridge-publication-id" content={publication.publicationId} />
	<meta name="glyphbridge-publication-cache-key" content={publication.publicationCacheKey} />
</svelte:head>

<div class="lesson container page-shell page-shell--narrow">
	<!-- Top bar: back button + progress bar + step indicator -->
	<div class="lesson__progress surface-panel card card--flat">
		<Button href="/learn" variant="ghost">&larr; Lessons</Button>
		<div class="lesson__progress-bar">
			<Progress
				label="Lesson progress"
				value={progressPercent}
				valueLabel={`${currentStepIndex + 1} of ${stepOrder.length} steps complete`}
			/>
		</div>
		<span class="lesson__step-label">{currentStepIndex + 1} / {stepOrder.length}</span>
	</div>

	<!-- Render the current step component -->
	{#if currentStep === "intro"}
		<StepIntro {lesson} onNext={nextStep} />
	{:else if currentStep === "breakdown"}
		<StepBreakdown {lesson} onNext={nextStep} />
	{:else if currentStep === "letters"}
		<StepLetters letters={lesson.newLetters} onComplete={nextStep} />
	{:else if currentStep === "rules"}
		<StepRules rules={lesson.rulesIntroduced} onComplete={nextStep} />
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

<style lang="scss">
	.lesson {
		&__progress {
			align-items: center;
			background: var(--surface-panel);
			display: flex;
			gap: $space-md;
			margin-bottom: $space-sm;
		}

		&__progress-bar {
			flex: 1;
		}

		&__step-label {
			@include step-counter;
			white-space: nowrap;
		}
	}

	@media (max-width: $bp-sm) {
		.lesson__progress {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
