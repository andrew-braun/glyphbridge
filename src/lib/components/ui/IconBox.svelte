<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		title,
		description,
		number,
		tone = "primary",
		align = "center",
		class: className = "",
		children,
	}: {
		title: string;
		description: string;
		number?: number;
		tone?: "primary" | "accent" | "success" | "warning";
		align?: "start" | "center";
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(
		["icon-box", `icon-box--tone-${tone}`, `icon-box--align-${align}`, className]
			.filter(Boolean)
			.join(" "),
	);
</script>

<article class={classes}>
	<div class="icon-box__icon" aria-hidden="true">
		{#if number !== undefined}
			<span>{number}</span>
		{:else if children}
			{@render children()}
		{/if}
	</div>
	<div class="icon-box__body">
		<h3 class="icon-box__title">{title}</h3>
		<p class="icon-box__description">{description}</p>
	</div>
</article>

<style lang="scss">
	.icon-box {
		align-items: center;
		background: linear-gradient(180deg, rgba(white, 0.98), rgba($color-primary, 0.02));
		border: 1px solid rgba($color-border, 0.8);
		border-radius: $radius-xl;
		box-shadow: $shadow-sm;
		display: flex;
		flex-direction: column;
		gap: $space-md;
		min-height: 100%;
		padding: $space-xl;
		transition:
			transform $transition-base,
			box-shadow $transition-base,
			border-color $transition-base;
		width: 100%;

		&--align-start {
			align-items: flex-start;
			text-align: left;
		}

		&--align-center {
			text-align: center;
		}

		&:hover {
			box-shadow: $shadow-lg;
			transform: translateY(-4px);
		}

		&__body {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
		}

		&__icon {
			align-items: center;
			background: linear-gradient(145deg, $color-primary, $color-primary-dark);
			border-radius: $radius-full;
			box-shadow: 0 14px 28px rgba($color-primary, 0.22);
			color: white;
			display: inline-flex;
			font-size: $font-size-xl;
			font-weight: 700;
			height: 3.75rem;
			justify-content: center;
			width: 3.75rem;
		}

		&__title {
			font-size: $font-size-lg;
		}

		&__description {
			color: $color-text-light;
			font-size: $font-size-sm;
			line-height: 1.65;
		}
	}

	.icon-box--tone-accent {
		background: linear-gradient(180deg, rgba(white, 0.98), rgba($color-accent, 0.06));
		border-color: rgba($color-accent, 0.18);

		.icon-box__icon {
			background: linear-gradient(145deg, $color-accent, #f05d91);
			box-shadow: 0 14px 28px rgba($color-accent, 0.25);
		}
	}

	.icon-box--tone-success {
		background: linear-gradient(180deg, rgba(white, 0.98), rgba($color-success, 0.06));
		border-color: rgba($color-success, 0.2);

		.icon-box__icon {
			background: linear-gradient(145deg, $color-success, #00a282);
			box-shadow: 0 14px 28px rgba($color-success, 0.24);
		}
	}

	.icon-box--tone-warning {
		background: linear-gradient(180deg, rgba(white, 0.98), rgba($color-accent-light, 0.12));
		border-color: rgba($color-accent-light, 0.28);

		.icon-box__icon {
			background: linear-gradient(145deg, $color-accent-light, #f6b535);
			box-shadow: 0 14px 28px rgba($color-accent-light, 0.28);
			color: $color-text;
		}
	}

	@media (max-width: $bp-sm) {
		.icon-box {
			padding: $space-lg;
		}
	}
</style>
