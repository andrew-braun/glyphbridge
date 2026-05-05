<!--
  Root Layout
  ============
  Wraps all pages with the global stylesheet, navigation bar,
  and progress initialization. The progress store is loaded from
  localStorage on mount so all pages have access to the user's
  learning state.
-->
<script lang="ts">
	// Global SCSS — must be imported here so it applies to all routes
	import "$lib/styles/global.scss";

	import { onMount } from "svelte";

	import MainNav from "$lib/components/navigation/MainNav.svelte";
	import { refreshLearnerProjection } from "$lib/stores/learner";

	let { children } = $props();

	onMount(() => {
		void refreshLearnerProjection();
	});
</script>

<div class="app">
	<MainNav />
	<main class="main">
		{@render children()}
	</main>
</div>

<style lang="scss">
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main {
		flex: 1;
		padding-bottom: $space-3xl;
		padding-top: $space-lg;
	}
</style>
