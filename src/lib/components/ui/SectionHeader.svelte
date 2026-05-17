<script lang="ts">
	import { cn } from "$lib/utils/cn";

	import Eyebrow from "./Eyebrow.svelte";

	type SectionHeaderAlign = "center" | "start";
	type SectionHeaderTone = "primary" | "accent" | "success" | "warning" | "muted";

	let {
		eyebrow,
		eyebrowTone = "primary",
		title,
		description,
		align = "center",
		class: className = "",
	}: {
		eyebrow?: string;
		eyebrowTone?: SectionHeaderTone;
		title: string;
		description?: string;
		align?: SectionHeaderAlign;
		class?: string;
	} = $props();

	const classes = $derived(cn("section-header", `section-header--${align}`, className));
</script>

<header class={classes}>
	{#if eyebrow}
		<Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
	{/if}
	<h2 class="section-header__title">{title}</h2>
	{#if description}
		<p class="section-header__description">{description}</p>
	{/if}
</header>

<style lang="scss">
	.section-header {
		display: flex;
		flex-direction: column;
		gap: $space-md;

		&.section-header--center {
			align-items: center;
			margin: 0 auto;
			max-width: 44rem;
			text-align: center;
		}

		&.section-header--start {
			align-items: flex-start;
		}

		.section-header__title {
			font-size: clamp($font-size-2xl, 3.5vw, $font-size-3xl);
			margin: 0;
		}

		.section-header__description {
			color: var(--color-text-muted);
			font-size: $font-size-lg;
			line-height: 1.65;
			margin: 0;
		}
	}
</style>
