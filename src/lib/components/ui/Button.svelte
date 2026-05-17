<script lang="ts">
	import { Button as BitsButton } from "bits-ui";
	import type { Snippet } from "svelte";

	import { cn } from "$lib/utils/cn";

	type ButtonVariant = "primary" | "secondary" | "ghost" | "success";
	type ButtonSize = "sm" | "md" | "large";
	type NativeButtonType = "button" | "submit" | "reset";

	let {
		href,
		variant = "primary",
		size = "md",
		fullWidth = false,
		disabled = false,
		type = "button",
		class: className = "",
		onclick,
		children,
	}: {
		href?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
		fullWidth?: boolean;
		disabled?: boolean;
		type?: NativeButtonType;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	} = $props();

	const classes = $derived(
		cn("btn", `btn--${variant}`, `btn--${size}`, fullWidth && "btn--full", className),
	);
</script>

{#if href}
	<BitsButton.Root {href} class={classes} {disabled} {onclick}>
		{@render children?.()}
	</BitsButton.Root>
{:else}
	<BitsButton.Root class={classes} {type} {disabled} {onclick}>
		{@render children?.()}
	</BitsButton.Root>
{/if}
