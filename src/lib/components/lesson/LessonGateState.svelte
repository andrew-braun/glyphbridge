<script lang="ts">
	import GlyphRibbon from "$lib/components/illustrations/GlyphRibbon.svelte";
	import ActionGroup from "$lib/components/layout/ActionGroup.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import EmptyState from "$lib/components/ui/EmptyState.svelte";

	let {
		title,
		description,
		primaryHref,
		primaryLabel,
		secondaryHref,
		secondaryLabel,
	}: {
		title: string;
		description: string;
		primaryHref: string;
		primaryLabel: string;
		secondaryHref?: string;
		secondaryLabel?: string;
	} = $props();
</script>

<section class="lesson-gate surface-panel">
	<EmptyState {title} {description}>
		{#snippet art()}
			<GlyphRibbon tokens={["ไ", "ท", "ย"]} tone="mixed" />
		{/snippet}
		{#snippet actions()}
			<ActionGroup justify="center" stackAt="sm">
				<Button href={primaryHref} variant="primary" size="large">{primaryLabel}</Button>
				{#if secondaryHref && secondaryLabel}
					<Button href={secondaryHref} variant="secondary" size="large">
						{secondaryLabel}
					</Button>
				{/if}
			</ActionGroup>
		{/snippet}
	</EmptyState>
</section>

<style lang="scss">
	.lesson-gate {
		padding: clamp(#{$space-xl}, 5vw, #{$space-3xl});
	}
</style>
