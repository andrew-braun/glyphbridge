<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	let {
		summary,
		open = false,
		class: className = "",
		children,
	}: {
		summary: string;
		open?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("disclosure", className));
</script>

<details class={classes} {open}>
	<summary class="disclosure__summary">
		<span class="disclosure__label">{summary}</span>
		<span class="disclosure__chevron" aria-hidden="true">↓</span>
	</summary>
	<div class="disclosure__body">
		{@render children?.()}
	</div>
</details>

<style lang="scss">
	.disclosure {
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);
		padding-top: $space-sm;

		.disclosure__summary {
			align-items: center;
			color: var(--color-link);
			cursor: pointer;
			display: inline-flex;
			font-family: $font-display;
			font-size: $font-size-sm;
			font-weight: 600;
			gap: $space-xs;
			list-style: none;
			padding: $space-xs 0;

			&::-webkit-details-marker {
				display: none;
			}

			&:hover {
				color: var(--color-link-hover);
			}
		}

		.disclosure__chevron {
			font-size: $font-size-xs;
			transition: transform $transition-fast;
		}

		&[open] {
			.disclosure__chevron {
				transform: rotate(180deg);
			}
		}

		.disclosure__body {
			font-size: $font-size-sm;
			line-height: 1.6;

			:global(p) {
				margin: $space-sm 0;
			}
		}
	}
</style>
