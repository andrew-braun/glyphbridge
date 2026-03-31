<script lang="ts">
	import { knownLetters, progress } from '$lib/stores/progress';
	import { thaiPack } from '$lib/data/thai';
	import type { Letter } from '$lib/data/types';

	// Build a map of all letters from all lessons
	const allLetters: Letter[] = thaiPack.lessons.flatMap((l) => l.newLetters);

	// Group by type
	const consonants = $derived(allLetters.filter((l) => l.type === 'consonant'));
	const vowels = $derived(allLetters.filter((l) => l.type === 'vowel'));

	function isKnown(char: string): boolean {
		return $knownLetters.includes(char);
	}

	let selectedLetter = $state<Letter | null>(null);
</script>

<svelte:head>
	<title>Alphabet — SparkScripts</title>
</svelte:head>

<div class="alphabet container">
	<h1>Your Thai Alphabet</h1>
	<p class="alphabet__subtitle">
		Letters unlock as you complete lessons. You know <strong>{$knownLetters.length}</strong> of {allLetters.length} letters taught so far.
	</p>

	<div class="progress-bar" style="margin-bottom: 2rem">
		<div class="progress-bar__fill" style="width: {($knownLetters.length / allLetters.length) * 100}%"></div>
	</div>

	<section class="letter-section">
		<h2>Consonants</h2>
		<div class="letter-grid">
			{#each consonants as letter}
				<button
					class="letter-tile"
					class:letter-tile--known={isKnown(letter.character)}
					class:letter-tile--selected={selectedLetter?.character === letter.character}
					onclick={() => selectedLetter = selectedLetter?.character === letter.character ? null : letter}
					disabled={!isKnown(letter.character)}
				>
					<span class="letter-tile__char thai">{letter.character}</span>
					{#if isKnown(letter.character)}
						<span class="letter-tile__sound">{letter.romanization}</span>
					{:else}
						<span class="letter-tile__lock">?</span>
					{/if}
				</button>
			{/each}
		</div>
	</section>

	<section class="letter-section">
		<h2>Vowels</h2>
		<div class="letter-grid">
			{#each vowels as letter}
				<button
					class="letter-tile"
					class:letter-tile--known={isKnown(letter.character)}
					class:letter-tile--selected={selectedLetter?.character === letter.character}
					onclick={() => selectedLetter = selectedLetter?.character === letter.character ? null : letter}
					disabled={!isKnown(letter.character)}
				>
					<span class="letter-tile__char thai">{letter.character}</span>
					{#if isKnown(letter.character)}
						<span class="letter-tile__sound">{letter.romanization}</span>
					{:else}
						<span class="letter-tile__lock">?</span>
					{/if}
				</button>
			{/each}
		</div>
	</section>

	{#if selectedLetter}
		<div class="detail-panel card">
			<button class="detail-panel__close btn btn--ghost" onclick={() => selectedLetter = null}>&times;</button>
			<div class="detail-panel__char thai" style="font-size: 4rem; color: var(--primary);">
				{selectedLetter.character}
			</div>
			<div class="detail-panel__info">
				<div class="detail-panel__row">
					<span class="detail-panel__label">Sound</span>
					<span>{selectedLetter.romanization}</span>
				</div>
				<div class="detail-panel__row">
					<span class="detail-panel__label">Pronunciation</span>
					<span>{selectedLetter.pronunciation}</span>
				</div>
				<div class="detail-panel__row">
					<span class="detail-panel__label">Type</span>
					<span>{selectedLetter.type}{selectedLetter.class ? ` (${selectedLetter.class} class)` : ''}</span>
				</div>
				{#if selectedLetter.position && selectedLetter.position !== 'standalone'}
					<div class="detail-panel__row">
						<span class="detail-panel__label">Position</span>
						<span>Written {selectedLetter.position}</span>
					</div>
				{/if}
				<div class="detail-panel__mnemonic">
					<strong>Memory trick:</strong> {selectedLetter.mnemonic}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.alphabet {
		&__subtitle {
			color: $color-text-light;
			margin-top: $space-sm;
			margin-bottom: $space-lg;
		}
	}

	.letter-section {
		margin-top: $space-xl;

		h2 {
			margin-bottom: $space-md;
		}
	}

	.letter-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		gap: $space-md;
	}

	.letter-tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-xs;
		padding: $space-md;
		border: 2px solid $color-border;
		border-radius: $radius-lg;
		background: $color-bg-card;
		cursor: pointer;
		transition: all $transition-fast;
		font-family: inherit;

		&:disabled {
			cursor: default;
			opacity: 0.4;
		}

		&--known {
			border-color: rgba($color-primary, 0.3);
			background: rgba($color-primary, 0.04);

			&:hover {
				border-color: $color-primary;
				box-shadow: $shadow-md;
				transform: translateY(-2px);
			}
		}

		&--selected {
			border-color: $color-primary !important;
			box-shadow: $shadow-lg;
			background: rgba($color-primary, 0.08);
		}

		&__char {
			font-size: $font-size-2xl;
			color: $color-primary;
		}

		&__sound {
			font-size: $font-size-xs;
			color: $color-text-light;
			font-weight: 600;
		}

		&__lock {
			font-size: $font-size-xs;
			color: $color-text-muted;
		}
	}

	.detail-panel {
		position: relative;
		margin-top: $space-xl;
		display: flex;
		gap: $space-xl;
		align-items: flex-start;

		--primary: #{$color-primary};

		&__close {
			position: absolute;
			top: $space-md;
			right: $space-md;
			font-size: $font-size-xl;
		}

		&__info {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: $space-sm;
		}

		&__row {
			display: flex;
			justify-content: space-between;
			padding: $space-xs 0;
			border-bottom: 1px solid $color-border;
		}

		&__label {
			font-weight: 600;
			color: $color-text-light;
			font-size: $font-size-sm;
		}

		&__mnemonic {
			margin-top: $space-sm;
			padding: $space-md;
			background: rgba($color-primary, 0.04);
			border-radius: $radius-md;
			font-size: $font-size-sm;
			line-height: 1.6;
		}
	}

	@media (max-width: $bp-sm) {
		.letter-grid {
			grid-template-columns: repeat(auto-fill, minmax(65px, 1fr));
		}

		.detail-panel {
			flex-direction: column;
			align-items: center;
			text-align: center;

			&__row {
				flex-direction: column;
				gap: $space-xs;
			}
		}
	}
</style>
