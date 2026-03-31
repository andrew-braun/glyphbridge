<script lang="ts">
	import { knownWords } from '$lib/stores/progress';
</script>

<svelte:head>
	<title>Known Words — SparkScripts</title>
</svelte:head>

<div class="words container">
	<h1>Known Words</h1>
	<p class="words__subtitle">Your growing collection of Thai words you can read.</p>

	{#if $knownWords.length === 0}
		<div class="empty card">
			<div class="empty__icon">&#128218;</div>
			<h2>No words yet!</h2>
			<p>Complete your first lesson to start building your word collection.</p>
			<a href="/learn" class="btn btn--primary btn--large">Start Learning</a>
		</div>
	{:else}
		<div class="word-grid">
			{#each $knownWords as word}
				<div class="word-card card">
					<div class="word-card__thai thai">{word.thai}</div>
					<div class="word-card__pronunciation">{word.pronunciation}</div>
					<div class="word-card__meaning">{word.meaning}</div>
					<span class="badge badge--primary">{word.category}</span>
					<div class="word-card__syllables">
						{#each word.syllables as syllable}
							<span class="word-card__syllable">
								<span class="thai thai--sm">{syllable.thai}</span>
								<span class="word-card__syllable-sound">{syllable.sound}</span>
							</span>
						{/each}
					</div>
					{#if word.contextNote}
						<p class="word-card__context">{word.contextNote}</p>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.words {
		&__subtitle {
			color: $color-text-light;
			margin-top: $space-sm;
			margin-bottom: $space-xl;
		}
	}

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

	.word-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: $space-lg;
	}

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
