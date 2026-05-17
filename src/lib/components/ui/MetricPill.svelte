<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	let {
		value,
		label,
		class: className = "",
		children,
	}: {
		value: string | number;
		label: string;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("metric-pill", className));
</script>

<div class={classes}>
	<span class="metric-pill__value">{value}</span>
	<span class="metric-pill__label">{label}</span>
	{@render children?.()}
</div>
