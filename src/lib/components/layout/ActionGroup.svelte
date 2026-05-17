<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	type ActionGroupJustify = "start" | "center" | "end" | "between";
	type ActionGroupStackAt = "none" | "sm" | "md";

	let {
		gap = "1rem",
		justify = "start",
		stackAt = "none",
		class: className = "",
		children,
	}: {
		gap?: string;
		justify?: ActionGroupJustify;
		stackAt?: ActionGroupStackAt;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(
		cn(
			"action-group",
			`action-group--justify-${justify}`,
			`action-group--stack-${stackAt}`,
			className,
		),
	);
</script>

<div class={classes} style={`--action-group-gap:${gap};`}>
	{@render children?.()}
</div>

<style lang="scss">
	.action-group {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: var(--action-group-gap);

		&--justify-start {
			justify-content: flex-start;
		}

		&--justify-center {
			justify-content: center;
		}

		&--justify-end {
			justify-content: flex-end;
		}

		&--justify-between {
			justify-content: space-between;
		}
	}

	@media (max-width: $bp-sm) {
		.action-group--stack-sm {
			align-items: stretch;
			flex-direction: column;
		}
	}

	@media (max-width: $bp-md) {
		.action-group--stack-md {
			align-items: stretch;
			flex-direction: column;
		}
	}
</style>
