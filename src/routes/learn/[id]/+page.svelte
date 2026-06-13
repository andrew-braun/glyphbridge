<script lang="ts">
	import { onMount } from "svelte";

	import { goto } from "$app/navigation";
	import PageShell from "$lib/components/layout/PageShell.svelte";
	import LessonBackLink from "$lib/components/lesson/LessonBackLink.svelte";
	import LessonGateState from "$lib/components/lesson/LessonGateState.svelte";
	import LessonProgressTracker from "$lib/components/lesson/LessonProgressTracker.svelte";
	import StepBreakdown from "$lib/components/lesson/StepBreakdown.svelte";
	import StepIntro from "$lib/components/lesson/StepIntro.svelte";
	import StepLearningComplete from "$lib/components/lesson/StepLearningComplete.svelte";
	import StepLetters from "$lib/components/lesson/StepLetters.svelte";
	import StepRules from "$lib/components/lesson/StepRules.svelte";
	import StepSameLettersNewWords from "$lib/components/lesson/StepSameLettersNewWords.svelte";
	import { completeLessonLearning, getLessonJourneyState, progress } from "$lib/stores/progress";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const publication = $derived(data.publication);
	const lesson = $derived(data.lesson);
	const corePracticeWords = $derived(lesson.vocabulary.filter((entry) => entry.tier === "core"));
	const guidedPracticeWords = $derived(corePracticeWords.slice(0, 2));
	const hasGuidedPracticeWords = $derived(guidedPracticeWords.length > 0);
	const lessonJourney = $derived.by(() => getLessonJourneyState($progress, lesson.id));

	type Step = "intro" | "breakdown" | "letters" | "rules" | "sameLetters" | "complete";

	const stepOrder = $derived(
		hasGuidedPracticeWords
			? ([
					"intro",
					"breakdown",
					"letters",
					"rules",
					"sameLetters",
					"complete",
				] satisfies Step[])
			: (["intro", "breakdown", "letters", "rules", "complete"] satisfies Step[]),
	);

	let currentStepIndex = $derived(0);
	let hasHydratedProgress = $state(false);

	const currentStep = $derived(stepOrder[currentStepIndex]);
	const progressPercent = $derived((currentStepIndex / (stepOrder.length - 1)) * 100);
	const learnLocked = $derived(hasHydratedProgress && !lessonJourney.learnUnlocked);

	onMount(() => {
		hasHydratedProgress = true;
	});

	function nextStep() {
		if (currentStepIndex < stepOrder.length - 1) {
			currentStepIndex += 1;
		}
	}

	function handleLearningComplete() {
		completeLessonLearning(lesson.id);
		nextStep();
	}

	function goToPractice() {
		goto(`/learn/${lesson.id}/practice`);
	}
</script>

<svelte:head>
	<title>{lesson.title} — Learn — Glyphin</title>
	<meta
		name="description"
		content={`Learn to read ${lesson.anchorWord.thai}, meaning ${lesson.anchorWord.meaning}, through letters, rules, and guided Thai reads before you enter scored practice.`}
	/>
	<meta name="glyphbridge-publication-id" content={publication.publicationId} />
	<meta name="glyphbridge-publication-cache-key" content={publication.publicationCacheKey} />
</svelte:head>

<PageShell class="lesson">
	{#if learnLocked}
		<LessonGateState
			title="This lesson is still locked."
			description="Pass the practice gate from the previous lesson to open this learning phase."
			primaryHref="/learn"
			primaryLabel="Back to lessons"
			secondaryHref={`/learn/${Math.max(1, lesson.id - 1)}/practice`}
			secondaryLabel="Open previous practice"
		/>
	{:else}
		<div class="lesson__chrome">
			<LessonBackLink />
			<LessonProgressTracker
				currentStep={currentStepIndex + 1}
				totalSteps={stepOrder.length}
				value={progressPercent}
			/>
		</div>

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
						onComplete={hasGuidedPracticeWords ? nextStep : handleLearningComplete}
						completeLabel={hasGuidedPracticeWords
							? "Try two guided reads ->"
							: "Finish learning ->"}
					/>
				{:else if currentStep === "sameLetters"}
					<StepSameLettersNewWords
						{lesson}
						coreWords={guidedPracticeWords}
						onComplete={handleLearningComplete}
					/>
				{:else if currentStep === "complete"}
					<StepLearningComplete
						{lesson}
						guidedWordCount={guidedPracticeWords.length}
						practiceWordCount={corePracticeWords.length}
						onStartPractice={goToPractice}
					/>
				{/if}
			</div>
		{/key}
	{/if}
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
