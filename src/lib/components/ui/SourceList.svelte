<script lang="ts">
	import { cn } from "$lib/utils/cn";

	export interface Source {
		href: string;
		label: string;
	}

	let {
		sources,
		class: className = "",
	}: {
		sources: Source[];
		class?: string;
	} = $props();

	const classes = $derived(cn("source-list", className));
</script>

<ul class={classes}>
	{#each sources as source}
		<li class="source-list__item">
			<a
				class="source-list__link"
				href={source.href}
				target="_blank"
				rel="noopener noreferrer"
			>
				{source.label}
			</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	.source-list {
		display: flex;
		flex-direction: column;
		font-size: $font-size-sm;
		gap: $space-xs;
		list-style: none;
		margin: $space-sm 0 0;
		padding: 0;

		.source-list__item {
			padding-left: $space-md;
			position: relative;

			&::before {
				color: var(--color-primary);
				content: "•";
				left: 0;
				position: absolute;
			}

			.source-list__link {
				color: var(--color-link);
				text-decoration: underline;
				text-decoration-color: rgb(var(--rgb-primary) / 0.3);
				text-underline-offset: 2px;

				&:hover {
					color: var(--color-link-hover);
					text-decoration-color: var(--color-link-hover);
				}
			}
		}
	}
</style>
