<!--
  Home Page — /
  ==============
  Landing page and dashboard. New users see the hero + method explainer.
  Returning users also see their progress stats and lesson list.

  Composed of four sub-components, each handling its own section.
-->
<script lang="ts">
	import HomeHero from "$lib/components/content/home/HomeHero.svelte";
	import HomeStatsOverview from "$lib/components/content/home/HomeStatsOverview.svelte";
	import HowItWorksSection from "$lib/components/content/home/HowItWorksSection.svelte";
	import LessonList from "$lib/components/content/lesson/LessonList.svelte";
	import { currentLessonId, knownLetters, knownWords, totalLessons } from "$lib/stores/progress";
</script>

<svelte:head>
	<title>GlyphBridge — Learn Thai Through Real Words</title>
	<meta
		name="description"
		content="Learn to read Thai through real words, guided lesson steps, and short drills built around signs, menus, roads, and everyday language."
	/>
</svelte:head>

<div class="home container">
	<HomeHero
		hasStartedLearning={$currentLessonId > 1 || $knownLetters.length > 0}
		showPractice={$knownLetters.length > 0}
	/>
	<HomeStatsOverview
		knownLetters={$knownLetters}
		knownWords={$knownWords}
		currentLessonId={$currentLessonId}
		{totalLessons}
	/>
	<HowItWorksSection />
	<LessonList currentLessonId={$currentLessonId} knownWords={$knownWords} />
</div>

<style lang="scss">
	// Vertical stack of homepage sections with generous spacing
	.home {
		display: flex;
		flex-direction: column;
		gap: $space-3xl;
	}
</style>
