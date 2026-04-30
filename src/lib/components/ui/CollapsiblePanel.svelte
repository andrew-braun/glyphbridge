<script lang="ts">
	import { Collapsible } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		open = $bindable(false),
		label,
		labelledBy,
		class: className = "",
		children,
	}: {
		open?: boolean;
		label?: string;
		labelledBy?: string;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(["collapsible-panel", className].filter(Boolean).join(" "));
	const resolvedAriaLabel = $derived(labelledBy ? undefined : label);
</script>

<Collapsible.Root bind:open>
	<Collapsible.Content
		class={classes}
		aria-label={resolvedAriaLabel}
		aria-labelledby={labelledBy}
	>
		{@render children?.()}
	</Collapsible.Content>
</Collapsible.Root>
