<script lang="ts">
	import { Button as BitsButton } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		href,
		disabled = false,
		class: className = "",
		onclick,
		children,
	}: {
		href: string;
		disabled?: boolean;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children?: Snippet;
	} = $props();
</script>

<BitsButton.Root {href} {disabled} class={className} {onclick}>
	{@render children?.()}
</BitsButton.Root>
