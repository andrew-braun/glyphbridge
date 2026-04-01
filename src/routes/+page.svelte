<!--
  Home Page — /
  ==============
  Landing page and dashboard. New users see the hero + method explainer.
  Returning users also see their progress stats and lesson list.

  Composed of four sub-components, each handling its own section.
-->
<script lang="ts">
	import HeroSection from '$lib/components/home/HeroSection.svelte';
	import StatsOverview from '$lib/components/home/StatsOverview.svelte';
	import MethodExplainer from '$lib/components/home/MethodExplainer.svelte';
	import LessonList from '$lib/components/home/LessonList.svelte';
</script>

<svelte:head>
	<title>SparkScripts — Learn Thai Through Real Words</title>
</svelte:head>

<div class="home container">
	<HeroSection />
	<StatsOverview />
	<MethodExplainer />
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
