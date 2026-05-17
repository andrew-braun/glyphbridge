<script lang="ts">
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	type NoticeTone = "default" | "accent" | "success" | "warning";

	let {
		tone = "default",
		class: className = "",
		children,
	}: {
		tone?: NoticeTone;
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(
		cn("notice-box", "card", "card--flat", `notice-box--${tone}`, className),
	);
</script>

<div class={classes}>
	{@render children?.()}
</div>

<style lang="scss">
	.notice-box {
		color: var(--color-text-muted);
		font-size: $font-size-sm;
		line-height: 1.6;

		&--accent {
			background: var(--surface-panel-accent);
		}

		&--success {
			background: var(--surface-panel-success);
		}

		&--warning {
			background: var(--surface-panel-warning);
		}
	}
</style>
