<script lang="ts">
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import { thaiPack } from "$lib/data/thai";
	import { getLessonJourneyState, type LessonJourneyState, progress } from "$lib/stores/progress";
	import { cn } from "$lib/utils/cn";

	function getLessonItemClasses(state: LessonJourneyState) {
		return cn(
			"lesson-item",
			"card",
			state.practicePassed && "lesson-item--completed",
			state.isCurrent && "lesson-item--current",
			!state.learnUnlocked && "lesson-item--locked",
		);
	}

	function getStatusLabel(state: LessonJourneyState) {
		if (!state.learnUnlocked) return "Locked";
		if (state.practicePassed) return "Passed";
		if (state.practiceUnlocked) return "Practice Ready";
		return "Learning";
	}
</script>

<section class="upcoming">
	<Heading>Your Lessons</Heading>
	<div class="lesson-list">
		{#each thaiPack.lessons as lesson}
			{@const state = getLessonJourneyState($progress, lesson.id)}
			<Reveal as="div" delay={30 + (lesson.stage - 1) * 45} distance={14}>
				<article class={getLessonItemClasses(state)}>
					<div class="lesson-item__content">
						<div class="lesson-item__header">
							<Badge class="lesson-item__stage">Stage {lesson.stage}</Badge>
							<Badge tone={state.practicePassed ? "success" : "accent"}>
								{getStatusLabel(state)}
							</Badge>
						</div>
						<h3 class="lesson-item__title">{lesson.title}</h3>
						<span class="lesson-item__word thai thai--sm">{lesson.anchorWord.thai}</span
						>
						<span class="lesson-item__meaning">{lesson.anchorWord.meaning}</span>
						<div class="lesson-item__actions">
							<Button
								href={state.learnUnlocked ? `/learn/${lesson.id}` : undefined}
								variant="primary"
								disabled={!state.learnUnlocked}
							>
								{state.learningCompleted ? "Learn Again" : "Learn"}
							</Button>
							<Button
								href={state.practiceUnlocked
									? `/learn/${lesson.id}/practice`
									: undefined}
								variant="secondary"
								disabled={!state.practiceUnlocked}
							>
								Practice
							</Button>
						</div>
					</div>

					<div class="lesson-item__aside">
						<div class="lesson-item__letters">
							{#each lesson.newLetters as letter}
								<span class="lesson-item__letter thai thai--sm"
									>{letter.character}</span
								>
							{/each}
						</div>
						<p class="lesson-item__score">
							{#if state.practicePassed}
								Best {state.bestPracticeScore ?? 0}%
							{:else if state.practiceAttempts > 0}
								Latest {state.latestPracticeScore ?? 0}%
							{:else if !state.learnUnlocked}
								Previous practice gate
							{:else if !state.practiceUnlocked}
								Finish Learning first
							{:else}
								Ready for the score gate
							{/if}
						</p>
					</div>
				</article>
			</Reveal>
		{/each}
	</div>
</section>

<style lang="scss">
	.upcoming {
		display: flex;
		flex-direction: column;
	}

	.lesson-list {
		display: flex;
		flex-direction: column;
		gap: $space-md;
	}

	.lesson-item {
		display: grid;
		gap: $space-lg;
		padding: $space-lg $space-xl;
		transition:
			border-color $transition-base,
			box-shadow $transition-base,
			transform $transition-base,
			opacity $transition-fast;

		&:hover {
			transform: translateY(-2px);
		}

		&--completed {
			border-left: 4px solid var(--color-success);
		}

		&--current {
			border-left: 4px solid var(--color-primary);
			box-shadow: var(--shadow-card-hover);
		}

		&--locked {
			opacity: 0.72;
		}

		&__content,
		&__aside {
			display: grid;
			gap: $space-sm;
		}

		&__header,
		&__actions,
		&__letters {
			display: flex;
			flex-wrap: wrap;
			gap: $space-sm;
		}

		&__title {
			font-size: $font-size-lg;
		}

		&__word {
			color: var(--color-primary-strong);
		}

		&__meaning,
		&__score {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
		}

		&__actions {
			margin-top: $space-xs;

			:global(.btn) {
				flex: 1 1 11rem;
			}
		}

		&__letters {
			justify-content: flex-end;
		}

		&__letter {
			align-items: center;
			background: rgb(var(--rgb-primary) / 0.12);
			border-radius: $radius-md;
			color: var(--color-primary-strong);
			display: flex;
			font-size: $font-size-xl;
			height: 44px;
			justify-content: center;
			width: 44px;
		}

		&__score {
			margin: 0;
			text-align: right;
		}
	}

	@media (min-width: $bp-md) {
		.lesson-item {
			align-items: center;
			grid-template-columns: minmax(0, 1fr) auto;
		}
	}

	@media (max-width: $bp-md) {
		.lesson-item {
			&__letters,
			&__score {
				justify-content: flex-start;
				text-align: left;
			}
		}
	}
</style>
