<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	type MetricDisplayTone = "primary" | "success" | "default";

	let {
		value,
		label,
		tone = "primary",
		class: className = "",
		children,
	}: {
		value: string | number;
		label: string;
		tone?: MetricDisplayTone;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("metric-display", `metric-display--${tone}`, className));
</script>

<div class={classes}>
	<span class="metric-display__value">{value}</span>
	<span class="metric-display__label">{label}</span>
	{@render children?.()}
</div>

<style lang="scss">
	.metric-display {
		display: flex;
		flex-direction: column;
		gap: $space-xs;
		text-align: center;

		&__value {
			color: var(--metric-display-color, var(--color-primary-strong));
			font-size: $font-size-3xl;
			font-weight: 800;
		}

		&__label {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
			font-weight: 600;
			letter-spacing: 0.05em;
			text-transform: uppercase;
		}

		&--success {
			--metric-display-color: var(--color-success);
		}

		&--default {
			--metric-display-color: var(--color-text);
		}
	}
</style>
