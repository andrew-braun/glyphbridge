<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		as = "h2",
		align = "start",
		class: className = "",
		children,
	}: {
		as?: "h1" | "h2" | "h3" | "h4";
		align?: "start" | "center";
		class?: string;
		children?: Snippet;
	} = $props();

	const classes = $derived(["heading", `heading--${align}`, className].filter(Boolean).join(" "));
</script>

<svelte:element this={as} class={classes}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.heading {
		margin-bottom: var(--section-heading-gap);

		&--center {
			text-align: center;
		}
	}
</style>
