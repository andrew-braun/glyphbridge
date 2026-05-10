<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import CollapsiblePanel from "$lib/components/ui/CollapsiblePanel.svelte";
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
				<div class="detail-panel__row">
					<span class="detail-panel__label">Sound</span>
					<span>{letter.romanization}</span>
				</div>
				<div class="detail-panel__row">
					<span class="detail-panel__label">Pronunciation</span>
					<span>{letter.pronunciation}</span>
				</div>
				<div class="detail-panel__row">
					<span class="detail-panel__label">Type</span>
					<span>{letter.type}{letter.class ? ` (${letter.class} class)` : ""}</span>
				</div>
				{#if letter.position && letter.position !== "standalone"}
					<div class="detail-panel__row">
						<span class="detail-panel__label">Position</span>
						<span>Written {letter.position}</span>
					</div>
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

		&__row {
			border-bottom: 1px solid var(--color-border);
			display: flex;
			justify-content: space-between;
			padding: $space-xs 0;
		}

		&__label {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
			font-weight: 600;
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

			&__row {
				flex-direction: column;
				gap: $space-xs;
			}
		}
	}
</style>
