<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	let {
		class: className = "",
		children,
	}: {
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("step-counter", className));
</script>

<span class={classes}>
	{@render children?.()}
</span>

<style lang="scss">
	.step-counter {
		@include step-counter;
		display: inline-flex;
	}
</style>
