<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	let {
		narrow = false,
		class: className = "",
		children,
	}: {
		narrow?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(
		cn("container", "page-shell", narrow && "page-shell--narrow", className),
	);
</script>

<div class={classes}>
	{@render children?.()}
</div>
