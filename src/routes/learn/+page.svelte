<script lang="ts">
	import { thaiPack } from "$lib/data/thai";
	import { currentLessonId } from "$lib/stores/progress";

	function handleLessonCardClick(event: MouseEvent, isUnlocked: boolean) {
		if (!isUnlocked) {
			event.preventDefault();
		}
	}
</script>

<svelte:head>
	<title>Learn — GlyphBridge</title>
	<meta
		name="description"
		content="Work through step-by-step Thai reading lessons built around real words, new letters, pronunciation rules, and quick drills."
	/>
</svelte:head>

<!--
  Learn Page (Lesson Index)
  Displays a grid of all available lessons from the Thai language pack.
  Each lesson card shows:
  - A stage badge and completion/current status indicator
  - The anchor word (the real Thai word taught in the lesson)
  - The new letters introduced by that lesson
  Lessons are locked until the previous lesson is completed; locked cards
  show a semi-transparent overlay preventing navigation.
-->
<div class="learn container">
	<h1>Lessons</h1>
	<p class="learn__subtitle">
		Each lesson teaches you a real Thai word and the letters inside it.
	</p>

	<div class="lessons-grid">
		{#each thaiPack.lessons as lesson}
			<!-- Derive state flags: isCurrent marks the next lesson to do, isUnlocked allows navigation -->
			{@const isCurrent = lesson.id === $currentLessonId}
			{@const isUnlocked = lesson.id <= $currentLessonId}
			<a
				href={isUnlocked ? `/learn/${lesson.id}` : "#"}
				class="lesson-card card"
				class:lesson-card--current={isCurrent}
				class:lesson-card--locked={!isUnlocked}
				class:lesson-card--done={lesson.id < $currentLessonId}
				aria-disabled={!isUnlocked}
				tabindex={!isUnlocked ? -1 : undefined}
				onclick={(event) => handleLessonCardClick(event, isUnlocked)}
			>
				<!-- Header badges: stage number + completion state (Complete / Current / none) -->
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
				<!-- Chips previewing the new Thai letters this lesson introduces -->
				<div class="lesson-card__new-letters">
					{#each lesson.newLetters as letter}
						<span class="letter-chip thai thai--sm">{letter.character}</span>
					{/each}
				</div>
				<!-- Overlay blocks interaction on locked lessons -->
				{#if !isUnlocked}
					<div class="lesson-card__overlay">&#128274; Complete previous lesson</div>
				{/if}
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	/* ========================================
	   Learn page (lesson index) styles
	   ======================================== */

	// Page wrapper and subtitle
	.learn {
		&__subtitle {
			color: $color-text-light;
			margin-top: $space-sm;
			margin-bottom: $space-xl;
		}
	}

	// Two-column grid; collapses to single column on mobile
	.lessons-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: $space-lg;
	}

	// Lesson card: three visual states via BEM modifiers (--current, --done, --locked)
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

	// Small square chip showing a single Thai character
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

	// Mobile: single-column layout for lesson cards
	@media (max-width: $bp-sm) {
		.lessons-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
