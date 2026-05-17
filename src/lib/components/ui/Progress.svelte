<script lang="ts">
	import { Progress as BitsProgress } from "bits-ui";

	import { cn } from "$lib/utils/cn";

	let {
		value,
		max = 100,
		min = 0,
		label = "Progress",
		valueLabel,
		class: className = "",
	}: {
		value: number;
		max?: number;
		min?: number;
		label?: string;
		valueLabel?: string;
		class?: string;
	} = $props();

	const boundedValue = $derived(Math.min(Math.max(value, min), max));
	const percent = $derived(max === min ? 0 : ((boundedValue - min) / (max - min)) * 100);
	const resolvedValueLabel = $derived(valueLabel ?? `${Math.round(percent)}%`);
	const classes = $derived(cn("progress", className));
</script>

<div class={classes}>
	<div class="progress__track">
		<BitsProgress.Root
			class="progress__root"
			value={boundedValue}
			{min}
			{max}
			aria-label={label}
			aria-valuetext={resolvedValueLabel}
		>
			<div class="progress__fill" style:width={`${percent}%`}></div>
		</BitsProgress.Root>
	</div>
	<span class="progress__label">{resolvedValueLabel}</span>
</div>

<style lang="scss">
	.progress {
		width: 100%;

		&__track {
			background: var(--color-border);
			border-radius: $radius-full;
			height: 8px;
			overflow: hidden;
			width: 100%;
		}

		&__fill {
			background: var(--color-primary);
			border-radius: $radius-full;
			height: 100%;
			transition: width $transition-slow;
		}

		&__track :global(.progress__root) {
			height: 100%;
		}

		&__label {
			color: var(--color-text-muted);
			display: block;
			font-size: $font-size-xs;
			font-weight: 600;
			letter-spacing: 0.04em;
			margin-top: $space-xs;
			text-align: right;
			text-transform: uppercase;
		}
	}
</style>
