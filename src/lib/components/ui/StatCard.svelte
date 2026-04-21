<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		value,
		label,
		class: className = "",
		children,
	}: {
		value: string;
		label: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div class={`stat-card card ${className}`}>
	<span class="stat-card__number">{value}</span>
	<span class="stat-card__label">{label}</span>
	{#if children}
		<div class="stat-card__preview">
			{@render children()}
		</div>
	{/if}
</div>

<style lang="scss">
	.stat-card {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		flex: 1;
		min-width: 220px;

		&__number {
			font-size: $font-size-3xl;
			font-weight: 800;
			color: $color-primary;
		}

		&__label {
			@include step-counter;
		}

		&__preview {
			color: $color-text-muted;
			margin-top: $space-xs;
		}
	}
</style>
