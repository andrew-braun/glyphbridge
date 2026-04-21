<script lang="ts">
	import type { Snippet } from "svelte";

	type ButtonVariant = "primary" | "secondary" | "ghost" | "success";
	type ButtonSize = "md" | "large";
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

	const variantClass = $derived(`btn--${variant}`);
	const sizeClass = $derived(size === "large" ? "btn--large" : "");
	const fullWidthClass = $derived(fullWidth ? "btn--full" : "");
	const classes = $derived(
		["btn", variantClass, sizeClass, fullWidthClass, className].filter(Boolean).join(" "),
	);

	function handleAnchorClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}

	function handleButtonClick(event: MouseEvent) {
		onclick?.(event);
	}
</script>

{#if href}
	<a
		href={disabled ? "#" : href}
		class={classes}
		aria-disabled={disabled}
		tabindex={disabled ? -1 : undefined}
		onclick={handleAnchorClick}
	>
		{@render children?.()}
	</a>
{:else}
	<button class={classes} {type} {disabled} onclick={handleButtonClick}>
		{@render children?.()}
	</button>
{/if}
