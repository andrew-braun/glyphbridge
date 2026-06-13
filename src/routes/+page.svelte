<script lang="ts">
	import HomeHero from "$lib/components/content/home/HomeHero.svelte";
	import HomeStatsOverview from "$lib/components/content/home/HomeStatsOverview.svelte";
	import LessonList from "$lib/components/content/lesson/LessonList.svelte";
	import { authSession } from "$lib/stores/learner";
	import {
		completedLessonCount,
		knownLetters,
		knownWords,
		resumeHref,
		resumeTarget,
		totalLessons,
	} from "$lib/stores/progress";

	const hasStartedLearning = $derived(
		$completedLessonCount > 0 || $knownLetters.length > 0 || $knownWords.length > 0,
	);
	const showLearnerDetails = $derived($authSession.authenticated || hasStartedLearning);
</script>

<div class="home container">
	<HomeHero
		authenticated={$authSession.authenticated}
		resumeHref={$resumeHref}
		resumePhase={$resumeTarget.phase}
	/>
	{#if showLearnerDetails}
		<HomeStatsOverview
			knownLetters={$knownLetters}
			knownWords={$knownWords}
			completedLessonCount={$completedLessonCount}
			{totalLessons}
		/>
		<LessonList />
	{/if}
</div>

<style lang="scss">
	// Vertical stack of homepage sections with generous spacing
	.home {
		display: flex;
		flex-direction: column;
		gap: $space-3xl;
	}
</style>
