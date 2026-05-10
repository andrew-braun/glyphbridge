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
		background:
			linear-gradient(180deg, rgb(var(--rgb-primary) / 0.06), transparent 42%),
			var(--color-surface-card);
		border: 1px solid var(--color-border);
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: $space-sm;
		min-width: 220px;
		text-align: center;

		&__number {
			color: var(--color-primary-strong);
			font-size: $font-size-3xl;
			font-weight: 800;
		}

		&__label {
			@include step-counter;
		}

		&__preview {
			color: var(--color-text-soft);
			margin-top: $space-xs;
		}
	}
</style>
