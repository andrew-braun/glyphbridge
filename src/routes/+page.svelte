<!--
  Home Page — /
  ==============
  Landing page and dashboard. New users see the hero + method explainer.
  Returning users also see their progress stats and lesson list.

  Composed of four sub-components, each handling its own section.
-->
<script lang="ts">
	import GuestHomeShell from "$lib/components/content/home/GuestHomeShell.svelte";
	import HomeStatsOverview from "$lib/components/content/home/HomeStatsOverview.svelte";
	import HowItWorksSection from "$lib/components/content/home/HowItWorksSection.svelte";
	import LearnerHomeHub from "$lib/components/content/home/LearnerHomeHub.svelte";
	import LessonList from "$lib/components/content/lesson/LessonList.svelte";
	import { authSession } from "$lib/stores/learner";
	import { currentLessonId, knownLetters, knownWords, totalLessons } from "$lib/stores/progress";

	const hasStartedLearning = $derived(
		$currentLessonId > 1 || $knownLetters.length > 0 || $knownWords.length > 0,
	);
	const showLearnerHub = $derived($authSession.authenticated || hasStartedLearning);
</script>

<svelte:head>
	<title>GlyphBridge — Learn Thai Through Real Words</title>
	<meta
		name="description"
		content="Learn to read Thai through real words, guided lesson steps, and short drills built around signs, menus, roads, and everyday language."
	/>
</svelte:head>

<div class="home container">
	{#if showLearnerHub}
		<LearnerHomeHub
			authenticated={$authSession.authenticated}
			currentLessonId={$currentLessonId}
			hasPractice={$knownLetters.length > 0}
			knownLetterCount={$knownLetters.length}
			knownWordCount={$knownWords.length}
			{totalLessons}
		/>
		<HomeStatsOverview
			knownLetters={$knownLetters}
			knownWords={$knownWords}
			currentLessonId={$currentLessonId}
			{totalLessons}
		/>
		<LessonList currentLessonId={$currentLessonId} knownWords={$knownWords} />
	{:else}
		<GuestHomeShell />
		<HowItWorksSection />
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
