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
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-md;
		width: 100%;
		min-height: 100%;
		padding: $space-xl;
		border: 1px solid rgba($color-border, 0.8);
		border-radius: $radius-xl;
		background: linear-gradient(180deg, rgba(white, 0.98), rgba($color-primary, 0.02));
		box-shadow: $shadow-sm;
		transition:
			transform $transition-base,
			box-shadow $transition-base,
			border-color $transition-base;

		&--align-start {
			align-items: flex-start;
			text-align: left;
		}

		&--align-center {
			text-align: center;
		}

		&:hover {
			transform: translateY(-4px);
			box-shadow: $shadow-lg;
		}

		&__body {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
		}

		&__icon {
			width: 3.75rem;
			height: 3.75rem;
			border-radius: $radius-full;
			background: linear-gradient(145deg, $color-primary, $color-primary-dark);
			color: white;
			font-weight: 700;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-xl;
			box-shadow: 0 14px 28px rgba($color-primary, 0.22);
		}

		&__title {
			font-size: $font-size-lg;
		}

		&__description {
			font-size: $font-size-sm;
			color: $color-text-light;
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
			color: $color-text;
			box-shadow: 0 14px 28px rgba($color-accent-light, 0.28);
		}
	}

	@media (max-width: $bp-sm) {
		.icon-box {
			padding: $space-lg;
		}
	}
</style>
