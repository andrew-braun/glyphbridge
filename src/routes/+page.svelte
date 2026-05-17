<script lang="ts">
	import HomeHero from "$lib/components/content/home/HomeHero.svelte";
	import HomeStatsOverview from "$lib/components/content/home/HomeStatsOverview.svelte";
	import LessonList from "$lib/components/content/lesson/LessonList.svelte";
	import { authSession } from "$lib/stores/learner";
	import { currentLessonId, knownLetters, knownWords, totalLessons } from "$lib/stores/progress";

	const hasStartedLearning = $derived(
		$currentLessonId > 1 || $knownLetters.length > 0 || $knownWords.length > 0,
	);
	const showLearnerDetails = $derived($authSession.authenticated || hasStartedLearning);
</script>

<div class="home container">
	<HomeHero authenticated={$authSession.authenticated} currentLessonId={$currentLessonId} />
	{#if showLearnerDetails}
		<HomeStatsOverview
			knownLetters={$knownLetters}
			knownWords={$knownWords}
			currentLessonId={$currentLessonId}
			{totalLessons}
		/>
		<LessonList currentLessonId={$currentLessonId} knownWords={$knownWords} />
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
