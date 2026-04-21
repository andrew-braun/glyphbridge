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
	import { goto } from "$app/navigation"
	import Button from "$lib/components/ui/Button.svelte"
	import { thaiPack } from "$lib/data/thai"
	import { completeLesson } from "$lib/stores/progress"
	import type { PageData } from "./$types"
	// Step components
	import StepBreakdown from "$lib/components/lesson/StepBreakdown.svelte"
	import StepComplete from "$lib/components/lesson/StepComplete.svelte"
	import StepDrills from "$lib/components/lesson/StepDrills.svelte"
	import StepIntro from "$lib/components/lesson/StepIntro.svelte"
	import StepLetters from "$lib/components/lesson/StepLetters.svelte"
	import StepRules from "$lib/components/lesson/StepRules.svelte"

	let { data }: { data: PageData } = $props()
	const lesson = $derived(data.lesson)

	// --- Step state machine ---
	// The lesson progresses linearly through these steps.
	type Step =
		| "intro"
		| "breakdown"
		| "letters"
		| "rules"
		| "drills"
		| "complete"
	const stepOrder: Step[] = [
		"intro",
		"breakdown",
		"letters",
		"rules",
		"drills",
		"complete",
	]

	let currentStepIndex = $state(0)
	let currentStep = $derived(stepOrder[currentStepIndex])

	// Drill results — passed from StepDrills to StepComplete
	let drillCorrectCount = $state(0)

	// Progress bar percentage (0% at intro, 100% at complete)
	const progressPercent = $derived(
		(currentStepIndex / (stepOrder.length - 1)) * 100,
	)

	// Check if there's a lesson after this one
	const hasNextLesson = $derived(
		!!thaiPack.lessons.find((l) => l.id > lesson.id),
	)

	/** Advance to the next step in the lesson flow. */
	function nextStep() {
		if (currentStepIndex < stepOrder.length - 1) {
			currentStepIndex++
		}
	}

	/**
	 * Called when all drills are completed.
	 * Saves progress to localStorage and advances to the complete step.
	 */
	function handleDrillsComplete(correctCount: number) {
		drillCorrectCount = correctCount
		const score = Math.round((correctCount / lesson.drills.length) * 100)
		completeLesson(lesson.id, score)
		nextStep()
	}

	/** Navigate to the next lesson in the curriculum. */
	function goToNextLesson() {
		const next = thaiPack.lessons.find((l) => l.id > lesson.id)
		if (next) {
			goto(`/learn/${next.id}`)
		} else {
			goto("/learn")
		}
	}
</script>

<svelte:head>
	<title>{lesson.title} — GlyphBridge</title>
</svelte:head>

<div class="lesson container">
	<!-- Top bar: back button + progress bar + step indicator -->
	<div class="lesson__progress">
		<Button href="/learn" variant="ghost">&larr; Lessons</Button>
		<div class="progress-bar" style="flex:1">
			<div class="progress-bar__fill" style="width: {progressPercent}%"></div>
		</div>
		<span class="lesson__step-label"
			>{currentStepIndex + 1} / {stepOrder.length}</span
		>
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
			display: flex;
			align-items: center;
			gap: $space-md;
			margin-bottom: $space-xl;
		}

		&__step-label {
			@include step-counter;
			white-space: nowrap;
		}
	}
</style>
