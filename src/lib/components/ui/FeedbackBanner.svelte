<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	export type FeedbackTone = "correct" | "wrong";

	let {
		tone,
		mark,
		class: className = "",
		children,
	}: {
		tone: FeedbackTone;
		mark?: string;
		class?: string;
		children?: Snippet;
	} = $props();

	const resolvedMark = $derived(mark ?? (tone === "correct" ? "✓" : "×"));
	const classes = $derived(cn("feedback-banner", `feedback-banner--${tone}`, className));
</script>

<div class={classes} role="status">
	<span class="feedback-banner__mark" aria-hidden="true">{resolvedMark}</span>
	<div class="feedback-banner__body">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.feedback-banner {
		align-items: center;
		display: flex;
		gap: $space-sm;
		justify-content: center;
		@include drill-feedback;

		&__mark {
			align-items: center;
			background: rgb(var(--rgb-primary) / 0.14);
			border-radius: $radius-full;
			display: inline-flex;
			font-size: $font-size-base;
			font-weight: 800;
			height: 1.8rem;
			justify-content: center;
			width: 1.8rem;
		}

		&__body {
			display: inline;
		}
	}
</style>
