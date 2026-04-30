<script lang="ts">
	import { ToggleGroup } from "bits-ui";

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

	const classes = $derived(["toggle-tiles", className].filter(Boolean).join(" "));

	function getTileClasses(option: ToggleTileOption, pressed: boolean) {
		return [
			"toggle-tiles__item",
			option.variant === "known" ? "toggle-tiles__item--known" : "",
			pressed ? "toggle-tiles__item--selected" : "",
		]
			.filter(Boolean)
			.join(" ");
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
			background: $color-bg-card;
			border: 2px solid $color-border;
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
				background: rgba($color-primary, 0.04);
				border-color: rgba($color-primary, 0.3);

				&:hover {
					border-color: $color-primary;
					box-shadow: $shadow-md;
					transform: translateY(-2px);
				}
			}

			&--selected {
				background: rgba($color-primary, 0.08);
				border-color: $color-primary !important;
				box-shadow: $shadow-lg;
			}
		}

		&__primary {
			color: $color-primary;
			font-size: $font-size-2xl;
		}

		&__secondary {
			color: $color-text-light;
			font-size: $font-size-xs;
			font-weight: 600;

			&--muted {
				color: $color-text-muted;
			}
		}
	}

	@media (max-width: $bp-sm) {
		.toggle-tiles {
			grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
		}
	}
</style>
