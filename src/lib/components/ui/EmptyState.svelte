<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	let {
		title,
		description,
		class: className = "",
		art,
		actions,
		children,
	}: {
		title: string;
		description?: string;
		class?: string;
		art?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("empty-state", className));
</script>

<div class={classes}>
	{#if art}
		<div class="empty-state__art">
			{@render art()}
		</div>
	{/if}
	<h2>{title}</h2>
	{#if description}
		<p>{description}</p>
	{/if}
	{@render children?.()}
	{#if actions}
		<div class="empty-state__actions">
			{@render actions()}
		</div>
	{/if}
</div>
