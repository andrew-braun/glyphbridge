<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	let {
		label,
		value,
		class: className = "",
		children,
	}: {
		label: string;
		value?: string | number;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(cn("detail-row", className));
</script>

<div class={classes}>
	<span class="detail-row__label">{label}</span>
	<span class="detail-row__value">
		{#if children}
			{@render children()}
		{:else}
			{value}
		{/if}
	</span>
</div>

<style lang="scss">
	.detail-row {
		@include detail-row;

		&__label {
			@include detail-label;
		}

		&__value {
			font-weight: 500;
		}
	}

	@media (max-width: $bp-sm) {
		.detail-row {
			align-items: flex-start;
			flex-direction: column;
			gap: $space-xs;
		}
	}
</style>
