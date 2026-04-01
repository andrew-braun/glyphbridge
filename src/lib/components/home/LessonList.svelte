<!--
  LessonList.svelte — Lesson overview cards
  ===========================================
  Lists all available lessons with visual indicators for:
    - Completed lessons (green left border + checkmark)
    - Current lesson (purple left border + pulsing dot)
    - Locked lessons (dimmed + lock icon)

  Each card shows the anchor word, lesson title, meaning,
  and a preview of the new letters that lesson introduces.
-->
<script lang="ts">
	import { knownWords, currentLessonId } from '$lib/stores/progress';
	import { thaiPack } from '$lib/data/thai';
</script>

<section class="upcoming">
	<h2>Your Lessons</h2>
	<div class="lesson-list">
		{#each thaiPack.lessons as lesson}
			<!-- Determine lesson state based on user progress -->
			{@const isCompleted = $knownWords.some(w => w.thai === lesson.anchorWord.thai)}
			{@const isCurrent = lesson.id === $currentLessonId}
			{@const isLocked = lesson.id > $currentLessonId}
			<a
				href={isLocked ? '#' : `/learn/${lesson.id}`}
				class="lesson-item card"
				class:lesson-item--completed={isCompleted}
				class:lesson-item--current={isCurrent}
				class:lesson-item--locked={isLocked}
			>
				<!-- Status indicator: checkmark / pulsing dot / lock -->
				<div class="lesson-item__status">
					{#if isCompleted}
						<span class="lesson-item__check">&#10003;</span>
					{:else if isCurrent}
						<span class="lesson-item__dot"></span>
					{:else}
						<span class="lesson-item__lock">&#128274;</span>
					{/if}
				</div>

				<!-- Lesson metadata -->
				<div class="lesson-item__content">
					<span class="lesson-item__stage badge badge--primary">Stage {lesson.stage}</span>
					<h3 class="lesson-item__title">{lesson.title}</h3>
					<span class="lesson-item__word thai thai--sm">{lesson.anchorWord.thai}</span>
					<span class="lesson-item__meaning">{lesson.anchorWord.meaning}</span>
				</div>

				<!-- Preview of new letters (hidden on mobile) -->
				<div class="lesson-item__letters">
					{#each lesson.newLetters as letter}
						<span class="lesson-item__letter thai thai--sm">{letter.character}</span>
					{/each}
				</div>
			</a>
		{/each}
	</div>
</section>

<style lang="scss">
	.lesson-list {
		display: flex;
		flex-direction: column;
		gap: $space-md;
	}

	.lesson-item {
		display: flex;
		align-items: center;
		gap: $space-lg;
		padding: $space-lg $space-xl;
		text-decoration: none;
		color: inherit;
		transition: all $transition-base;

		// State borders — left accent color indicates progress
		&--completed {
			border-left: 4px solid $color-success;
		}

		&--current {
			border-left: 4px solid $color-primary;
			box-shadow: $shadow-lg;
		}

		&--locked {
			opacity: 0.5;
			cursor: not-allowed;

			&:hover {
				box-shadow: $shadow-md; // override the card hover shadow lift
			}
		}

		// Left-side status icon
		&__status {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__check {
			color: $color-success;
			font-size: $font-size-xl;
			font-weight: 700;
		}

		// Pulsing dot for current lesson
		&__dot {
			width: 14px;
			height: 14px;
			border-radius: $radius-full;
			background: $color-primary;
			animation: pulse 2s ease-in-out infinite;
		}

		&__lock {
			font-size: $font-size-lg;
		}

		// Text content: stage badge, title, word, meaning
		&__content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: $space-xs;
		}

		&__title {
			font-size: $font-size-lg;
		}

		&__word {
			color: $color-primary;
		}

		&__meaning {
			color: $color-text-light;
			font-size: $font-size-sm;
		}

		// Right-side letter preview chips
		&__letters {
			display: flex;
			gap: $space-sm;
		}

		&__letter {
			width: 44px;
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba($color-primary, 0.08);
			border-radius: $radius-md;
			color: $color-primary;
			font-size: $font-size-xl;
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	// Hide letter preview chips on small screens
	@media (max-width: $bp-md) {
		.lesson-item__letters {
			display: none;
		}
	}
</style>
