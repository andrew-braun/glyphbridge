<script lang="ts">
	import { currentLesson, currentLessonId } from '$lib/stores/progress';
	import { goto } from '$app/navigation';
	import { thaiPack } from '$lib/data/thai';
</script>

<svelte:head>
	<title>Learn — SparkScripts</title>
</svelte:head>

<div class="learn container">
	<h1>Lessons</h1>
	<p class="learn__subtitle">Each lesson teaches you a real Thai word and the letters inside it.</p>

	<div class="lessons-grid">
		{#each thaiPack.lessons as lesson}
			{@const isCurrent = lesson.id === $currentLessonId}
			{@const isUnlocked = lesson.id <= $currentLessonId}
			<a
				href={isUnlocked ? `/learn/${lesson.id}` : '#'}
				class="lesson-card card"
				class:lesson-card--current={isCurrent}
				class:lesson-card--locked={!isUnlocked}
				class:lesson-card--done={lesson.id < $currentLessonId}
			>
				<div class="lesson-card__header">
					<span class="badge badge--primary">Stage {lesson.stage}</span>
					{#if lesson.id < $currentLessonId}
						<span class="badge badge--success">Complete</span>
					{:else if isCurrent}
						<span class="badge badge--accent">Current</span>
					{/if}
				</div>
				<div class="lesson-card__word thai">{lesson.anchorWord.thai}</div>
				<h3>{lesson.title}</h3>
				<p class="lesson-card__meaning">{lesson.anchorWord.meaning}</p>
				<div class="lesson-card__new-letters">
					{#each lesson.newLetters as letter}
						<span class="letter-chip thai thai--sm">{letter.character}</span>
					{/each}
				</div>
				{#if !isUnlocked}
					<div class="lesson-card__overlay">&#128274; Complete previous lesson</div>
				{/if}
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	.learn {
		&__subtitle {
			color: $color-text-light;
			margin-top: $space-sm;
			margin-bottom: $space-xl;
		}
	}

	.lessons-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $space-lg;
	}

	.lesson-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		text-decoration: none;
		color: inherit;
		overflow: hidden;

		&--current {
			border: 2px solid $color-primary;
		}

		&--done {
			border-left: 4px solid $color-success;
		}

		&--locked {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&__header {
			display: flex;
			gap: $space-sm;
		}

		&__word {
			color: $color-primary;
		}

		&__meaning {
			color: $color-text-light;
			font-size: $font-size-sm;
		}

		&__new-letters {
			display: flex;
			gap: $space-sm;
			margin-top: $space-sm;
		}

		&__overlay {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(255, 255, 255, 0.7);
			font-weight: 600;
			color: $color-text-light;
		}
	}

	.letter-chip {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba($color-primary, 0.08);
		border-radius: $radius-md;
		color: $color-primary;
	}

	@media (max-width: $bp-sm) {
		.lessons-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
