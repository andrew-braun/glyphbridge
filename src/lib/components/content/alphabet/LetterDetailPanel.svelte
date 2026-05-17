<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import CollapsiblePanel from "$lib/components/ui/CollapsiblePanel.svelte";
	import DetailRow from "$lib/components/ui/DetailRow.svelte";
	import type { Letter } from "$lib/data/types";

	const panelHeadingId = "letter-detail-panel-heading";

	let {
		letter,
		onClose,
	}: {
		letter: Letter | null;
		onClose: () => void;
	} = $props();
</script>

<CollapsiblePanel open={letter !== null} labelledBy={panelHeadingId}>
	{#if letter}
		<div class="detail-panel card">
			<h2 id={panelHeadingId} class="visually-hidden">Details for {letter.character}</h2>
			<Button variant="ghost" class="detail-panel__close" onclick={onClose}>
				<span aria-hidden="true">&times;</span>
				<span class="visually-hidden">Close details for {letter.character}</span>
			</Button>
			<div class="detail-panel__char thai">{letter.character}</div>
			<div class="detail-panel__info">
				<DetailRow label="Sound" value={letter.romanization} />
				<DetailRow label="Pronunciation" value={letter.pronunciation} />
				<DetailRow
					label="Type"
					value={`${letter.type}${letter.class ? ` (${letter.class} class)` : ""}`}
				/>
				{#if letter.position && letter.position !== "standalone"}
					<DetailRow label="Position" value={`Written ${letter.position}`} />
				{/if}
				<div class="detail-panel__mnemonic">
					<strong>Memory trick:</strong>
					{letter.mnemonic}
				</div>
			</div>
		</div>
	{/if}
</CollapsiblePanel>

<style lang="scss">
	.detail-panel {
		align-items: flex-start;
		display: flex;
		gap: $space-xl;
		margin-top: $space-xl;
		position: relative;

		&__char {
			color: var(--color-primary-strong);
			font-size: 4rem;
		}

		&__info {
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: $space-sm;
		}

		&__mnemonic {
			background: var(--surface-interactive);
			border-radius: $radius-md;
			font-size: $font-size-sm;
			line-height: 1.6;
			margin-top: $space-sm;
			padding: $space-md;
		}
	}

	:global(.detail-panel__close) {
		font-size: $font-size-xl;
		position: absolute;
		right: $space-md;
		top: $space-md;
	}

	@media (max-width: $bp-sm) {
		.detail-panel {
			align-items: center;
			flex-direction: column;
			text-align: center;
		}
	}
</style>
