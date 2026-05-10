<script lang="ts">
	import { ToggleGroup } from "bits-ui";

	import { cn } from "$lib/utils/cn";

	export type ToggleTileVariant = "default" | "known";
	export type ToggleTileSecondaryTone = "default" | "muted";

	export type ToggleTileOption = {
		value: string;
		primaryLabel: string;
		secondaryLabel?: string;
		disabled?: boolean;
		primaryIsThai?: boolean;
		variant?: ToggleTileVariant;
		secondaryTone?: ToggleTileSecondaryTone;
	};

	let {
		options,
		value = $bindable(""),
		labelledBy,
		minColumnWidth = "80px",
		class: className = "",
	}: {
		options: ToggleTileOption[];
		value?: string;
		labelledBy?: string;
		minColumnWidth?: string;
		class?: string;
	} = $props();

	const classes = $derived(cn("toggle-tiles", className));

	function getTileClasses(option: ToggleTileOption, pressed: boolean) {
		return cn(
			"toggle-tiles__item",
			option.variant === "known" && "toggle-tiles__item--known",
			pressed && "toggle-tiles__item--selected",
		);
	}
</script>

<ToggleGroup.Root type="single" bind:value>
	{#snippet child({ props })}
		<div
			{...props}
			class={classes}
			aria-labelledby={labelledBy}
			style={`--toggle-tiles-min-width: ${minColumnWidth}`}
		>
			{#each options as option}
				<ToggleGroup.Item value={option.value} disabled={option.disabled}>
					{#snippet child({ props, pressed })}
						<button {...props} class={getTileClasses(option, pressed)}>
							<span class={["toggle-tiles__primary", { thai: option.primaryIsThai }]}
								>{option.primaryLabel}</span
							>
							{#if option.secondaryLabel}
								<span
									class={[
										"toggle-tiles__secondary",
										{
											"toggle-tiles__secondary--muted":
												option.secondaryTone === "muted",
										},
									]}
								>
									{option.secondaryLabel}
								</span>
							{/if}
						</button>
					{/snippet}
				</ToggleGroup.Item>
			{/each}
		</div>
	{/snippet}
</ToggleGroup.Root>

<style lang="scss">
	.toggle-tiles {
		display: grid;
		gap: $space-md;
		grid-template-columns: repeat(auto-fill, minmax(var(--toggle-tiles-min-width), 1fr));

		&__item {
			align-items: center;
			background: var(--color-surface-card);
			border: 2px solid var(--color-border);
			border-radius: $radius-lg;
			cursor: pointer;
			display: flex;
			flex-direction: column;
			font-family: inherit;
			gap: $space-xs;
			padding: $space-md;
			transition: all $transition-fast;

			&:disabled {
				cursor: default;
				opacity: 0.4;
			}

			&--known {
				background: var(--surface-interactive);
				border-color: var(--color-border-strong);

				&:hover {
					border-color: var(--color-primary);
					box-shadow: var(--shadow-card);
					transform: translateY(-2px);
				}
			}

			&--selected {
				background: var(--surface-interactive-strong);
				border-color: var(--color-primary) !important;
				box-shadow: var(--shadow-card-hover);
			}
		}

		&__primary {
			color: var(--color-primary-strong);
			font-size: $font-size-2xl;
		}

		&__secondary {
			color: var(--color-text-muted);
			font-size: $font-size-xs;
			font-weight: 600;

			&--muted {
				color: var(--color-text-soft);
			}
		}
	}

	@media (max-width: $bp-sm) {
		.toggle-tiles {
			grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
		}
	}
</style>
