<!--
  Home Page — /
  ==============
  Landing page and dashboard. New users see the hero + method explainer.
  Returning users also see their progress stats and lesson list.

  Composed of four sub-components, each handling its own section.
-->
<script lang="ts">
	import HomeHero from "$lib/components/content/home/HomeHero.svelte"
	import HomeStatsOverview from "$lib/components/content/home/HomeStatsOverview.svelte"
	import HowItWorksSection from "$lib/components/content/home/HowItWorksSection.svelte"
	import LessonList from "$lib/components/content/lesson/LessonList.svelte"
</script>

<svelte:head>
	<title>SparkScripts — Learn Thai Through Real Words</title>
</svelte:head>

<div class="home container">
	<HomeHero />
	<HomeStatsOverview />
	<HowItWorksSection />
	<LessonList />
</div>

<style lang="scss">
	// Vertical stack of homepage sections with generous spacing
	.home {
		display: flex;
		flex-direction: column;
		gap: $space-3xl;
	}
</style>
