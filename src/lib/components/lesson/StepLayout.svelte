<script lang="ts">
	import type { Snippet } from "svelte";

	import StepCounter from "$lib/components/lesson/StepCounter.svelte";
	import { cn } from "$lib/utils/cn";

	let {
		counter,
		class: className = "",
		children,
	}: {
		counter?: string;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("step", className));
</script>

<div class={classes}>
	{#if counter}
		<StepCounter>{counter}</StepCounter>
	{/if}
	{@render children?.()}
</div>

<style lang="scss">
	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		margin: 0 auto;
		max-width: var(--content-max-width);
		@include fade-in-animation;
	}
</style>
