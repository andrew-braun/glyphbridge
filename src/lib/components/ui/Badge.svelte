<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	export type BadgeTone = "primary" | "accent" | "success" | "warning" | "muted";

	let {
		tone = "primary",
		class: className = "",
		children,
	}: {
		tone?: BadgeTone;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("badge", `badge--${tone}`, className));
</script>

<span class={classes}>
	{@render children?.()}
</span>
