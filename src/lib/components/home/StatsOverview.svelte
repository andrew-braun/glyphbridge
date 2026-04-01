<!--
  StatsOverview.svelte — Progress stats cards
  =============================================
  Shows three cards summarizing the user's progress:
    1. Letters learned (with a preview of the characters)
    2. Words known (with Thai word preview)
    3. Lessons completed (with a progress bar)

  Only rendered when the user has made some progress.
-->
<script lang="ts">
	import { knownLetters, knownWords, currentLessonId, totalLessons } from '$lib/stores/progress';
</script>

{#if $knownLetters.length > 0}
	<section class="stats">
		<div class="stat-card card">
			<span class="stat-card__number">{$knownLetters.length}</span>
			<span class="stat-card__label">Letters Learned</span>
			<div class="stat-card__preview thai thai--sm">
				{$knownLetters.join(' ')}
			</div>
		</div>
		<div class="stat-card card">
			<span class="stat-card__number">{$knownWords.length}</span>
			<span class="stat-card__label">Words Known</span>
			<div class="stat-card__preview thai thai--sm">
				{$knownWords.map(w => w.thai).join(' ')}
			</div>
		</div>
		<div class="stat-card card">
			<span class="stat-card__number">{$currentLessonId - 1}/{totalLessons}</span>
			<span class="stat-card__label">Lessons Complete</span>
			<div class="progress-bar">
				<div
					class="progress-bar__fill"
					style="width: {(($currentLessonId - 1) / totalLessons) * 100}%"
				></div>
			</div>
		</div>
	</section>
{/if}

<style lang="scss">
	// Three-column stat cards grid
	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: $space-lg;
	}

	.stat-card {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: $space-sm;

		// Big number at the top of each card
		&__number {
			font-size: $font-size-3xl;
			font-weight: 800;
			color: $color-primary;
		}

		// Uppercase label below the number
		&__label {
			@include step-counter; // reuses the small uppercase label style
		}

		// Thai character/word preview
		&__preview {
			color: $color-text-muted;
			margin-top: $space-xs;
		}
	}

	@media (max-width: $bp-md) {
		.stats {
			grid-template-columns: 1fr;
		}
	}
</style>
