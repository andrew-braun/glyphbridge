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
		background: var(--color-surface-card);
		border: 1px solid var(--color-border);
		border-radius: $radius-xl;
		box-shadow: var(--shadow-soft);
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
			border-color: var(--color-border-strong);
			box-shadow: var(--shadow-card-hover);
			transform: translateY(-2px);
		}

		&__body {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
		}

		&__icon {
			align-items: center;
			background: var(--color-primary);
			border-radius: $radius-full;
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
			color: var(--color-text-muted);
			font-size: $font-size-sm;
			line-height: 1.65;
		}
	}

	.icon-box--tone-accent {
		background: var(--surface-panel-accent);
		border-color: rgb(var(--rgb-accent) / 0.26);

		.icon-box__icon {
			background: var(--color-accent);
		}
	}

	.icon-box--tone-success {
		background: var(--surface-panel-success);
		border-color: rgb(var(--rgb-success) / 0.24);

		.icon-box__icon {
			background: var(--color-success);
		}
	}

	.icon-box--tone-warning {
		background: var(--surface-panel-warning);
		border-color: rgb(var(--rgb-warning) / 0.26);

		.icon-box__icon {
			background: var(--color-warning);
			color: #23192b;
		}
	}

	@media (max-width: $bp-sm) {
		.icon-box {
			padding: $space-lg;
		}
	}
</style>
