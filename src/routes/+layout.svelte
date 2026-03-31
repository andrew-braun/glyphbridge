<script lang="ts">
	import '$lib/styles/global.scss';
	import { onMount } from 'svelte';
	import { initProgress } from '$lib/stores/progress';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();

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
