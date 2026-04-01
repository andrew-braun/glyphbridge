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
	import '$lib/styles/global.scss';
	import { onMount } from 'svelte';
	import { initProgress } from '$lib/stores/progress';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();

	// Load saved progress from localStorage when the app first mounts.
	// This hydrates the progress store so all pages and components
	// can read the user's known letters, words, and lesson state.
	onMount(() => {
		initProgress();
	});
</script>

<div class="app">
	<Nav />
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
