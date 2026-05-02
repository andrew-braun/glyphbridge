<script lang="ts">
	import CardLink from "$lib/components/ui/CardLink.svelte";
	import { currentLessonId } from "$lib/stores/progress";
	import { cn } from "$lib/utils/cn";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const lessons = $derived(data.lessons);

	function getLessonCardClasses(isCurrent: boolean, isUnlocked: boolean, isDone: boolean) {
		return cn(
			"lesson-card",
			"card",
			isCurrent && "lesson-card--current",
			!isUnlocked && "lesson-card--locked",
			isDone && "lesson-card--done",
		);
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
	Displays a grid of all available lessons from the active published lesson bundle.
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
		{#each lessons as lesson}
			<!-- Derive state flags: isCurrent marks the next lesson to do, isUnlocked allows navigation -->
			{@const isCurrent = lesson.id === $currentLessonId}
			{@const isUnlocked = lesson.id <= $currentLessonId}
			{@const isDone = lesson.id < $currentLessonId}
			<CardLink
				href={`/learn/${lesson.id}`}
				disabled={!isUnlocked}
				class={getLessonCardClasses(isCurrent, isUnlocked, isDone)}
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
			</CardLink>
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
			margin-bottom: $space-xl;
			margin-top: $space-sm;
		}
	}

	// Two-column grid; collapses to single column on mobile
	.lessons-grid {
		display: grid;
		gap: $space-lg;
		grid-template-columns: repeat(2, 1fr);
	}

	// Lesson card: three visual states via BEM modifiers (--current, --done, --locked)
	:global(.lesson-card) {
		color: inherit;
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		overflow: hidden;
		position: relative;
		text-decoration: none;
	}

	:global(.lesson-card--current) {
		border: 2px solid $color-primary;
	}

	:global(.lesson-card--done) {
		border-left: 4px solid $color-success;
	}

	:global(.lesson-card--locked) {
		cursor: not-allowed;
		opacity: 0.5;
	}

	:global(.lesson-card) .lesson-card__header {
		display: flex;
		gap: $space-sm;
	}

	:global(.lesson-card) .lesson-card__word {
		color: $color-primary;
	}

	:global(.lesson-card) .lesson-card__meaning {
		color: $color-text-light;
		font-size: $font-size-sm;
	}

	:global(.lesson-card) .lesson-card__new-letters {
		display: flex;
		gap: $space-sm;
		margin-top: $space-sm;
	}

	:global(.lesson-card) .lesson-card__overlay {
		align-items: center;
		background: rgba(255, 255, 255, 0.7);
		color: $color-text-light;
		display: flex;
		font-weight: 600;
		inset: 0;
		justify-content: center;
		position: absolute;
	}

	// Small square chip showing a single Thai character
	.letter-chip {
		align-items: center;
		background: rgba($color-primary, 0.08);
		border-radius: $radius-md;
		color: $color-primary;
		display: flex;
		height: 40px;
		justify-content: center;
		width: 40px;
	}

	// Mobile: single-column layout for lesson cards
	@media (max-width: $bp-sm) {
		.lessons-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
