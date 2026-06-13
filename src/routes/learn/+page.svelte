<script lang="ts">
	import { onMount } from "svelte";

	import PageShell from "$lib/components/layout/PageShell.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import { getLessonJourneyState, type LessonJourneyState, progress } from "$lib/stores/progress";
	import { cn } from "$lib/utils/cn";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
	const publication = $derived(data.publication);
	const lessons = $derived(data.lessons);

	let hasHydratedProgress = $state(false);

	onMount(() => {
		hasHydratedProgress = true;
	});

	function getLessonCardClasses(state: LessonJourneyState | null) {
		return cn(
			"lesson-card",
			"card",
			state?.isCurrent && "lesson-card--current",
			state !== null && !state.learnUnlocked && "lesson-card--locked",
			state?.practicePassed && "lesson-card--done",
		);
	}

	function getStatusCopy(state: LessonJourneyState | null) {
		if (state === null) {
			return "Learning opens from lesson order. Practice opens after learning.";
		}

		if (!state.learnUnlocked) {
			return "Pass the previous lesson's practice to unlock learning.";
		}

		if (!state.practiceUnlocked) {
			return "Finish learning to unlock this lesson's scored practice.";
		}

		if (state.practicePassed) {
			return state.bestPracticeScore !== undefined
				? `Best practice score: ${state.bestPracticeScore}%`
				: "Practice passed.";
		}

		return state.practiceAttempts > 0
			? `Latest practice score: ${state.latestPracticeScore ?? 0}%`
			: "Practice is ready whenever you are.";
	}
</script>

<svelte:head>
	<title>Learn — Glyphin</title>
	<meta
		name="description"
		content="Work through step-by-step Thai lessons, finish each learning phase, and pass scored practice to unlock what comes next."
	/>
	<meta name="glyphbridge-publication-id" content={publication.publicationId} />
	<meta name="glyphbridge-publication-cache-key" content={publication.publicationCacheKey} />
</svelte:head>

<PageShell class="learn">
	<div class="lessons-grid">
		{#each lessons as lesson}
			{@const hydratedLessonState = hasHydratedProgress
				? getLessonJourneyState($progress, lesson.id)
				: null}
			<Reveal as="div" delay={40 + (lesson.stage - 1) * 55} distance={16}>
				<article class={getLessonCardClasses(hydratedLessonState)}>
					<div class="lesson-card__header">
						<Badge>Stage {lesson.stage}</Badge>
						{#if hydratedLessonState?.practicePassed}
							<Badge tone="success">Passed</Badge>
						{:else if hydratedLessonState?.practiceUnlocked}
							<Badge tone="accent">Practice Ready</Badge>
						{:else if hydratedLessonState?.isCurrent}
							<Badge tone="accent">Current</Badge>
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

					<p class="lesson-card__status">{getStatusCopy(hydratedLessonState)}</p>

					<div class="lesson-card__actions">
						<Button
							href={hydratedLessonState === null || hydratedLessonState.learnUnlocked
								? `/learn/${lesson.id}`
								: undefined}
							variant="primary"
							disabled={hydratedLessonState !== null &&
								!hydratedLessonState.learnUnlocked}
						>
							{hydratedLessonState?.learningCompleted ? "Learn Again" : "Learn"}
						</Button>
						<Button
							href={hydratedLessonState?.practiceUnlocked
								? `/learn/${lesson.id}/practice`
								: undefined}
							variant="secondary"
							disabled={!hydratedLessonState?.practiceUnlocked}
						>
							Practice
						</Button>
					</div>
				</article>
			</Reveal>
		{/each}
	</div>
</PageShell>

<style lang="scss">
	.lessons-grid {
		display: grid;
		gap: $space-md;
		grid-template-columns: repeat(2, 1fr);
	}

	.lesson-card {
		background: var(--surface-panel);
		border: 1px solid var(--color-border);
		display: grid;
		gap: $space-sm;
		padding: $space-lg;
		transition:
			border-color $transition-base,
			box-shadow $transition-base,
			transform $transition-base,
			opacity $transition-fast;

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
			opacity: 0.7;
		}

		&__header,
		&__actions,
		&__new-letters {
			display: flex;
			flex-wrap: wrap;
		}

		&__header,
		&__actions {
			gap: $space-sm;
		}

		&__word {
			color: var(--color-primary-strong);
			line-height: 1.25;
		}

		&__meaning,
		&__status {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
		}

		&__new-letters {
			gap: $space-xs;
			margin-top: $space-xs;
		}

		&__status {
			margin: 0;
			min-height: 2.8rem;
		}

		&__actions {
			margin-top: auto;

			:global(.btn) {
				flex: 1 1 11rem;
			}
		}
	}

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

	@media (max-width: $bp-sm) {
		.lessons-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
