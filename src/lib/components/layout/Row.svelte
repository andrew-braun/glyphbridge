<script lang="ts">
	import type { Snippet } from "svelte"

	type RowAlign = "stretch" | "start" | "center" | "end"
	type RowJustify = "start" | "center" | "end" | "between"

	let {
		gap = "1rem",
		align = "stretch",
		justify = "start",
		wrap = true,
		stackAt = "md",
		class: className = "",
		children,
	}: {
		gap?: string
		align?: RowAlign
		justify?: RowJustify
		wrap?: boolean
		stackAt?: "none" | "sm" | "md"
		class?: string
		children?: Snippet
	} = $props()

	const classes = $derived(
		[
			"row",
			`row--align-${align}`,
			`row--justify-${justify}`,
			`row--stack-${stackAt}`,
			wrap ? "row--wrap" : "row--no-wrap",
			className,
		]
			.filter(Boolean)
			.join(" "),
	)
</script>

<div class={classes} style={`--row-gap: ${gap};`}>
	{@render children?.()}
</div>

<style lang="scss">
	.row {
		display: flex;
		gap: var(--row-gap);

		&--wrap {
			flex-wrap: wrap;
		}

		&--no-wrap {
			flex-wrap: nowrap;
		}

		&--align-stretch {
			align-items: stretch;
		}

		&--align-start {
			align-items: flex-start;
		}

		&--align-center {
			align-items: center;
		}

		&--align-end {
			align-items: flex-end;
		}

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
		.row--stack-sm {
			flex-direction: column;
		}
	}

	@media (max-width: $bp-md) {
		.row--stack-md {
			flex-direction: column;
		}

		.row {
			&--stack-none {
				flex-direction: row;
			}
		}
	}
</style>
