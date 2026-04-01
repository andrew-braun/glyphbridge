<script lang="ts">
	import type { Snippet } from "svelte"

	let {
		badge,
		title,
		highlight,
		subtitle,
		align = "center",
		children,
	}: {
		badge?: string
		title: string
		highlight?: string
		subtitle: string
		align?: "left" | "center"
		children?: Snippet
	} = $props()
</script>

<section class="page-hero" class:page-hero--left={align === "left"}>
	{#if badge}
		<span class="page-hero__badge badge badge--primary">{badge}</span>
	{/if}

	<h1 class="page-hero__title">
		{title}
		{#if highlight}
			<br />
			<span class="page-hero__highlight">{highlight}</span>
		{/if}
	</h1>

	<p class="page-hero__subtitle">{subtitle}</p>

	{#if children}
		<div class="page-hero__actions">
			{@render children()}
		</div>
	{/if}
</section>

<style lang="scss">
	.page-hero {
		text-align: center;
		padding: $space-3xl 0 $space-xl;

		&--left {
			text-align: left;
		}

		&__title {
			font-size: $font-size-4xl;
			margin-top: $space-md;
			line-height: 1.1;
		}

		&__highlight {
			background: linear-gradient(135deg, $color-primary, $color-accent);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		&__subtitle {
			margin-top: $space-lg;
			font-size: $font-size-lg;
			color: $color-text-light;
			max-width: 560px;
			margin-left: auto;
			margin-right: auto;
		}

		&--left &__subtitle {
			margin-left: 0;
		}

		&__actions {
			margin-top: $space-xl;
			display: flex;
			gap: $space-md;
			justify-content: center;
			flex-wrap: wrap;
		}

		&--left &__actions {
			justify-content: flex-start;
		}
	}

	@media (max-width: $bp-md) {
		.page-hero__title {
			font-size: $font-size-2xl;
		}
	}
</style>
