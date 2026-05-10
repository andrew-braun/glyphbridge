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
	<BitsProgress.Root
		class="progress__track"
		value={boundedValue}
		{min}
		{max}
		aria-label={label}
		aria-valuetext={resolvedValueLabel}
	>
		<div class="progress__fill" style:width={`${percent}%`}></div>
	</BitsProgress.Root>
</div>

<style lang="scss">
	.progress {
		background: var(--color-border);
		border-radius: $radius-full;
		height: 8px;
		overflow: hidden;
		width: 100%;

		&__track {
			border-radius: inherit;
			display: block;
			height: 100%;
			overflow: hidden;
			width: 100%;
		}

		&__fill {
			background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
			border-radius: $radius-full;
			height: 100%;
			transition: width $transition-slow;
		}
	}
</style>
