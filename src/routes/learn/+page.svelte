<script lang="ts">
	import { onMount } from "svelte";

	import CardLink from "$lib/components/ui/CardLink.svelte";
	import { currentLessonId } from "$lib/stores/progress";
	import { cn } from "$lib/utils/cn";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const publication = $derived(data.publication);
	const lessons = $derived(data.lessons);

	type HydratedLessonState = {
		isCurrent: boolean;
		isUnlocked: boolean;
		isDone: boolean;
	};

	let hasHydratedProgress = $state(false);

	onMount(() => {
		hasHydratedProgress = true;
	});

	function getHydratedLessonState(
		lessonId: number,
		currentProgressLessonId: number,
	): HydratedLessonState {
		return {
			isCurrent: lessonId === currentProgressLessonId,
			isUnlocked: lessonId <= currentProgressLessonId,
			isDone: lessonId < currentProgressLessonId,
		};
	}

	function getLessonCardClasses(state: HydratedLessonState | null) {
		return cn(
			"lesson-card",
			"card",
			state?.isCurrent && "lesson-card--current",
			state !== null && !state.isUnlocked && "lesson-card--locked",
			state?.isDone && "lesson-card--done",
		);
	}
</script>

<svelte:head>
	<title>Learn — GlyphBridge</title>
	<meta
		name="description"
		content="Work through step-by-step Thai reading lessons built around real words, new letters, pronunciation rules, and quick drills."
	/>
	<meta name="glyphbridge-publication-id" content={publication.publicationId} />
	<meta name="glyphbridge-publication-cache-key" content={publication.publicationCacheKey} />
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
<div class="learn container page-shell">
	<section class="page-intro learn__intro">
		<span class="page-intro__eyebrow">Thai reading path</span>
		<h1 class="page-intro__title">Start with a whole word, then peel it open.</h1>
		<p class="page-intro__body">
			Each lesson starts with a real Thai word you could meet on a sign, menu, or appliance,
			then walks you inward through syllables, letters, rules, and a quick drill loop.
		</p>
		<div class="page-intro__meta">
			<span class="badge badge--primary">{lessons.length} short lessons</span>
			<span class="badge badge--accent">real words first</span>
			<span class="badge badge--success">local progress</span>
		</div>
	</section>

	<div class="lessons-grid">
		{#each lessons as lesson}
			<!-- Personal progress state is applied after hydration so the prerendered HTML stays publication-only. -->
			{@const hydratedLessonState = hasHydratedProgress
				? getHydratedLessonState(lesson.id, $currentLessonId)
				: null}
			<CardLink
				href={`/learn/${lesson.id}`}
				disabled={hydratedLessonState !== null && !hydratedLessonState.isUnlocked}
				class={getLessonCardClasses(hydratedLessonState)}
			>
				<!-- Header badges: stage number is static, progress badges appear after hydration. -->
				<div class="lesson-card__header">
					<span class="badge badge--primary">Stage {lesson.stage}</span>
					{#if hydratedLessonState?.isDone}
						<span class="badge badge--success">Complete</span>
					{:else if hydratedLessonState?.isCurrent}
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
				<!-- Locked-state overlay is learner-specific and appears after hydration. -->
				{#if hydratedLessonState !== null && !hydratedLessonState.isUnlocked}
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
		&__intro {
			margin-bottom: $space-sm;
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
		background: var(--surface-panel);
		border: 1px solid var(--color-border);
		color: inherit;
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		overflow: hidden;
		position: relative;
		text-decoration: none;
	}

	:global(.lesson-card--current) {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-card-hover);
	}

	:global(.lesson-card--done) {
		border-left: 4px solid var(--color-success);
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
		color: var(--color-primary-strong);
	}

	:global(.lesson-card) .lesson-card__meaning {
		color: var(--color-text-muted);
		font-size: $font-size-sm;
	}

	:global(.lesson-card) .lesson-card__new-letters {
		display: flex;
		gap: $space-sm;
		margin-top: $space-sm;
	}

	:global(.lesson-card) .lesson-card__overlay {
		align-items: center;
		backdrop-filter: blur(8px);
		background: var(--surface-overlay);
		color: var(--color-text);
		display: flex;
		font-weight: 600;
		inset: 0;
		justify-content: center;
		position: absolute;
	}

	// Small square chip showing a single Thai character
	.letter-chip {
		align-items: center;
		background: var(--surface-interactive-strong);
		border-radius: $radius-md;
		color: var(--color-primary-strong);
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
