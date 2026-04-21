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
	import MainNav from "$lib/components/navigation/MainNav.svelte";
	import { initProgress } from "$lib/stores/progress";
	import "$lib/styles/global.scss";
	import { onMount } from "svelte";

	let { children } = $props();

	// Initialize client-side progress once when the root layout mounts.
	onMount(() => {
		initProgress();
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
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main {
		flex: 1;
		padding-top: $space-lg;
		padding-bottom: $space-3xl;
	}
</style>
