<script lang="ts">
	import { Progress as BitsProgress } from "bits-ui";

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
	const classes = $derived(["progress", className].filter(Boolean).join(" "));
</script>

<div class={classes}>
	<BitsProgress.Root
		value={boundedValue}
		{min}
		{max}
		aria-label={label}
		aria-valuetext={resolvedValueLabel}
		style=" border-radius: inherit;display: block; height: 100%; overflow: hidden; width: 100%;"
	>
		<div class="progress__fill" style:width={`${percent}%`}></div>
	</BitsProgress.Root>
</div>

<style lang="scss">
	.progress {
		background: $color-border;
		border-radius: $radius-full;
		height: 8px;
		overflow: hidden;
		width: 100%;

		&__fill {
			background: linear-gradient(90deg, $color-primary, $color-primary-light);
			border-radius: $radius-full;
			height: 100%;
			transition: width $transition-slow;
		}
	}
</style>
