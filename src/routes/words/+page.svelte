<script lang="ts">
	// Reactive store of words the user has learned by completing lessons
	import Button from "$lib/components/ui/Button.svelte"
	import { knownWords } from "$lib/stores/progress"
</script>

<svelte:head>
	<title>Known Words — SparkScripts</title>
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
	<p class="words__subtitle">
		Your growing collection of Thai words you can read.
	</p>

	<!-- Empty state: shown when the user has not completed any lessons yet -->
	{#if $knownWords.length === 0}
		<div class="empty card">
			<div class="empty__icon">&#128218;</div>
			<h2>No words yet!</h2>
			<p>Complete your first lesson to start building your word collection.</p>
			<Button href="/learn" variant="primary" size="large"
				>Start Learning</Button
			>
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
			margin-top: $space-sm;
			margin-bottom: $space-xl;
		}
	}

	// Empty state card: centered layout with icon, message, and CTA
	.empty {
		text-align: center;
		padding: $space-3xl;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-md;

		&__icon {
			font-size: 4rem;
		}

		p {
			color: $color-text-light;
			max-width: 400px;
		}
	}

	// Responsive grid: cards fill at a minimum width of 320px
	.word-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: $space-lg;
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
			font-size: $font-size-lg;
			font-weight: 600;
			color: $color-text;
		}

		&__meaning {
			font-size: $font-size-base;
			color: $color-text-light;
		}

		&__syllables {
			display: flex;
			gap: $space-sm;
			flex-wrap: wrap;
			margin-top: $space-sm;
		}

		&__syllable {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 2px;
			padding: $space-xs $space-sm;
			background: rgba($color-primary, 0.06);
			border-radius: $radius-sm;
		}

		&__syllable-sound {
			font-size: $font-size-xs;
			color: $color-text-light;
		}

		&__context {
			margin-top: $space-sm;
			font-size: $font-size-sm;
			color: $color-text-light;
			line-height: 1.6;
			border-top: 1px solid $color-border;
			padding-top: $space-sm;
		}
	}
</style>
