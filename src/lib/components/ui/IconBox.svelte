<script lang="ts">
	import type { Snippet } from "svelte"

	let {
		title,
		description,
		number,
		class: className = "",
		children,
	}: {
		title: string
		description: string
		number?: number
		class?: string
		children?: Snippet
	} = $props()
</script>

<article class={`icon-box ${className}`}>
	<div class="icon-box__icon" aria-hidden="true">
		{#if number !== undefined}
			<span>{number}</span>
		{:else if children}
			{@render children()}
		{/if}
	</div>
	<h3 class="icon-box__title">{title}</h3>
	<p class="icon-box__description">{description}</p>
</article>

<style lang="scss">
	.icon-box {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;

		&__icon {
			width: 40px;
			height: 40px;
			border-radius: $radius-full;
			background: $color-primary;
			color: white;
			font-weight: 700;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-lg;
		}

		&__title {
			margin-top: $space-sm;
			font-size: $font-size-base;
		}

		&__description {
			margin-top: $space-xs;
			font-size: $font-size-sm;
			color: $color-text-light;
		}
	}
</style>
