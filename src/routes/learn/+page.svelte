<script lang="ts">
	import { onMount } from "svelte";

	import PageShell from "$lib/components/layout/PageShell.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
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
	<title>Learn — Glyphin</title>
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
<PageShell class="learn">
	<div class="lessons-grid">
		{#each lessons as lesson}
			<!-- Personal progress state is applied after hydration so the prerendered HTML stays publication-only. -->
			{@const hydratedLessonState = hasHydratedProgress
				? getHydratedLessonState(lesson.id, $currentLessonId)
				: null}
			<Reveal as="div" delay={40 + (lesson.stage - 1) * 55} distance={16}>
				<svelte:element
					this={hydratedLessonState !== null && !hydratedLessonState.isUnlocked
						? "div"
						: "a"}
					href={hydratedLessonState !== null && !hydratedLessonState.isUnlocked
						? undefined
						: `/learn/${lesson.id}`}
					class={getLessonCardClasses(hydratedLessonState)}
					aria-disabled={hydratedLessonState !== null && !hydratedLessonState.isUnlocked
						? "true"
						: undefined}
				>
					<!-- Header badges: stage number is static, progress badges appear after hydration. -->
					<div class="lesson-card__header">
						<Badge>Stage {lesson.stage}</Badge>
						{#if hydratedLessonState?.isDone}
							<Badge tone="success">Complete</Badge>
						{:else if hydratedLessonState?.isCurrent}
							<Badge tone="accent">Current</Badge>
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
				</svelte:element>
			</Reveal>
		{/each}
	</div>
</PageShell>

<style lang="scss">
	/* ========================================
	   Learn page (lesson index) styles
	   ======================================== */

	// Two-column grid; collapses to single column on mobile
	.lessons-grid {
		display: grid;
		gap: $space-md;
		grid-template-columns: repeat(2, 1fr);
	}

	// Lesson card: three visual states via BEM modifiers (--current, --done, --locked)
	.lesson-card {
		background: var(--surface-panel);
		border: 1px solid var(--color-border);
		color: inherit;
		display: flex;
		flex-direction: column;
		gap: $space-xs;
		overflow: hidden;
		padding: $space-lg;
		position: relative;
		text-decoration: none;
		@include motion-safe-transition(
			border-color $transition-base,
			box-shadow $transition-base,
			transform $transition-base,
			opacity $transition-fast
		);

		&:hover {
			transform: translateY(-2px);
		}

		&--current {
			border-color: var(--color-primary);
			box-shadow: var(--shadow-card-hover);
		}

		&--done {
			border-left: 4px solid var(--color-success);
		}

		&--locked {
			cursor: not-allowed;
			opacity: 0.5;

			&:hover {
				transform: none;
			}
		}

		&__header {
			display: flex;
			gap: $space-sm;
		}

		&__word {
			color: var(--color-primary-strong);
			line-height: 1.25;
		}

		&__meaning {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
		}

		&__new-letters {
			display: flex;
			gap: $space-xs;
			margin-top: $space-xs;
		}

		&__overlay {
			align-items: center;
			backdrop-filter: blur(8px);
			background: var(--surface-overlay);
			color: var(--color-text);
			display: flex;
			font-weight: 600;
			inset: 0;
			justify-content: center;
			position: absolute;
			@include motion-safe-transition(opacity $transition-fast);
		}
	}

	// Small square chip showing a single Thai character
	.letter-chip {
		align-items: center;
		background: var(--surface-interactive-strong);
		border-radius: $radius-md;
		color: var(--color-primary-strong);
		display: flex;
		height: 36px;
		justify-content: center;
		width: 36px;
	}

	@media (min-width: $bp-lg) {
		.lessons-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	// Mobile: single-column layout for lesson cards
	@media (max-width: $bp-sm) {
		.lessons-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
