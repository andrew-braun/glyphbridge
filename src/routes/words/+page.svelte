<script lang="ts">
	// Reactive store of words the user has learned by completing lessons
	import Button from "$lib/components/ui/Button.svelte";
	import { knownWords } from "$lib/stores/progress";
</script>

<svelte:head>
	<title>Known Words — GlyphBridge</title>
	<meta
		name="description"
		content="Browse the Thai words you have unlocked so far, including pronunciation, meanings, syllable breakdowns, and real-world context notes."
	/>
</svelte:head>

<!--
  Known Words Page
  Shows every Thai word the user has unlocked through lessons.
  - When the collection is empty, an "empty state" card encourages the user
    to start their first lesson via a CTA link.
  - Otherwise, a responsive grid of word cards displays each word's Thai script,
    pronunciation, English meaning, category badge, syllable breakdown, and
    optional context note.
-->
<div class="words container">
	<h1>Known Words</h1>
	<p class="words__subtitle">Your growing collection of anchor and supporting Thai words.</p>

	<!-- Empty state: shown when the user has not completed any lessons yet -->
	{#if $knownWords.length === 0}
		<div class="empty card">
			<div class="empty__icon">&#128218;</div>
			<h2>No words yet!</h2>
			<p>Complete your first lesson to start building your word collection.</p>
			<Button href="/learn" variant="primary" size="large">Start Learning</Button>
		</div>
		<!-- Word cards grid: each card shows full word details and syllable breakdown -->
	{:else}
		<div class="word-grid">
			{#each $knownWords as word}
				<div class="word-card card">
					<div class="word-card__thai thai">{word.thai}</div>
					<div class="word-card__pronunciation">{word.pronunciation}</div>
					<div class="word-card__meaning">{word.meaning}</div>
					<span class="badge badge--primary">{word.category}</span>
					<!-- Syllable chips: break the word into its component sounds -->
					<div class="word-card__syllables">
						{#each word.syllables as syllable}
							<span class="word-card__syllable">
								<span class="thai thai--sm">{syllable.thai}</span>
								<span class="word-card__syllable-sound">{syllable.sound}</span>
							</span>
						{/each}
					</div>
					<!-- Optional usage/context note (e.g. formality, common pairings) -->
					{#if word.contextNote}
						<p class="word-card__context">{word.contextNote}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	/* ========================================
	   Known Words page styles
	   ======================================== */

	// Page wrapper and subtitle
	.words {
		&__subtitle {
			color: $color-text-light;
			margin-bottom: $space-xl;
			margin-top: $space-sm;
		}
	}

	// Empty state card: centered layout with icon, message, and CTA
	.empty {
		align-items: center;
		display: flex;
		flex-direction: column;
		gap: $space-md;
		padding: $space-3xl;
		text-align: center;

		&__icon {
			font-size: 4rem;
		}

		p {
			color: $color-text-light;
			max-width: var(--text-max-width);
		}
	}

	// Responsive grid: cards fill at a minimum width of 320px
	.word-grid {
		display: grid;
		gap: $space-lg;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
	}

	// Individual word card: stacks Thai text, pronunciation, meaning, syllables
	.word-card {
		display: flex;
		flex-direction: column;
		gap: $space-sm;

		&__thai {
			color: $color-primary;
		}

		&__pronunciation {
			color: $color-text;
			font-size: $font-size-lg;
			font-weight: 600;
		}

		&__meaning {
			color: $color-text-light;
			font-size: $font-size-base;
		}

		&__syllables {
			display: flex;
			flex-wrap: wrap;
			gap: $space-sm;
			margin-top: $space-sm;
		}

		&__syllable {
			align-items: center;
			background: rgba($color-primary, 0.06);
			border-radius: $radius-sm;
			display: flex;
			flex-direction: column;
			gap: 2px;
			padding: $space-xs $space-sm;
		}

		&__syllable-sound {
			color: $color-text-light;
			font-size: $font-size-xs;
		}

		&__context {
			border-top: 1px solid $color-border;
			color: $color-text-light;
			font-size: $font-size-sm;
			line-height: 1.6;
			margin-top: $space-sm;
			padding-top: $space-sm;
		}
	}
</style>
