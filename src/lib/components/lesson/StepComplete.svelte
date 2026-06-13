<!--
  StepComplete.svelte — Lesson Step 6: Completion Summary
  ========================================================
  Shows the learner a celebration screen with:
    - Their drill score (e.g. "5/6 Drills Correct")
    - The anchor word they just learned
    - A grid of the new letters they unlocked
    - Navigation to the next lesson or back to the lesson list
-->
<script lang="ts">
	import GlyphRibbon from "$lib/components/illustrations/GlyphRibbon.svelte";
	import ActionGroup from "$lib/components/layout/ActionGroup.svelte";
	import SameLettersWordList from "$lib/components/lesson/SameLettersWordList.svelte";
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import MetricDisplay from "$lib/components/ui/MetricDisplay.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { Lesson, Letter } from "$lib/data/types";

	let {
		lesson,
		correctCount,
		totalDrills,
		onNextLesson,
		hasNextLesson,
	}: {
		lesson: Lesson;
		correctCount: number;
		totalDrills: number;
		onNextLesson: () => void;
		hasNextLesson: boolean;
	} = $props();

	const corePracticeWords = $derived(lesson.vocabulary.filter((entry) => entry.tier === "core"));
	const extensionPracticeWords = $derived(
		lesson.vocabulary.filter((entry) => entry.tier === "extension"),
	);
	const practiceWords = $derived([...corePracticeWords, ...extensionPracticeWords]);
	const newLetterCount = $derived(lesson.newLetters.length);
	const relatedWordCount = $derived(practiceWords.length);
	const drillScorePercent = $derived(
		totalDrills > 0 ? Math.round((correctCount / totalDrills) * 100) : 0,
	);
	const learnedLetterTokens = $derived(
		lesson.newLetters.map((letter) => letter.character).filter(Boolean),
	);
	const fallbackGlyphTokens = $derived(
		Array.from(lesson.anchorWord.thai).filter((character) => character.trim().length > 0),
	);
	const glyphTokens = $derived(
		learnedLetterTokens.length > 0 ? learnedLetterTokens : fallbackGlyphTokens,
	);

	function formatLetterMeta(letter: Letter) {
		const type = letter.type.replace("_", " ");

		return letter.class ? `${type} · ${letter.class} class` : type;
	}
</script>

<StepLayout>
	<div class="complete">
		<section class="complete__hero surface-panel surface-panel--success">
			<Reveal as="div" distance={14}>
				<div class="complete__hero-shell">
					<div class="complete__hero-main">
						<div class="complete__headline">
							<h1>Lesson complete.</h1>
							<p>
								You can now recognize this word shape and the letters that build it.
							</p>
						</div>

						<div class="complete__anchor" aria-label="Word you can now read">
							<span class="complete__anchor-label">You can now read</span>
							<span class="complete__anchor-word thai">{lesson.anchorWord.thai}</span>
							<span class="complete__anchor-meaning">{lesson.anchorWord.meaning}</span
							>
						</div>
					</div>

					<aside class="complete__summary" aria-label="Lesson results">
						<div class="complete__summary-ribbon">
							<GlyphRibbon tokens={glyphTokens} tone="mixed" />
						</div>

						<div class="complete__score">
							<MetricDisplay
								value={`${correctCount}/${totalDrills}`}
								label="Drills Correct"
								tone="primary"
							/>
							<p>{drillScorePercent}% checkpoint score</p>
						</div>

						<dl class="complete__metrics">
							<div>
								<dt>New letters</dt>
								<dd>{newLetterCount}</dd>
							</div>
							{#if relatedWordCount > 0}
								<div>
									<dt>Practice reads</dt>
									<dd>{relatedWordCount}</dd>
								</div>
							{/if}
							{#if extensionPracticeWords.length > 0}
								<div>
									<dt>Extension reads</dt>
									<dd>{extensionPracticeWords.length}</dd>
								</div>
							{/if}
						</dl>
					</aside>
				</div>
			</Reveal>
		</section>

		<div class="complete__learning-grid">
			<section
				class="complete__panel complete__panel--letters surface-panel surface-panel--sky"
			>
				<Reveal as="div" delay={80} distance={12}>
					<div class="complete__panel-inner">
						<div class="complete__section-header">
							<div>
								<p class="complete__section-kicker">New in this lesson</p>
								<h2>Letters unlocked</h2>
							</div>
							<p class="complete__section-copy">
								The core symbols you can now recognize immediately in real words.
							</p>
						</div>

						<ul class="complete__letter-list" aria-label="New letters from this lesson">
							{#each lesson.newLetters as letter, index}
								<li class="complete__letter-card">
									<Reveal as="span" delay={120 + index * 70} distance={10}>
										<span class="complete__letter-character thai"
											>{letter.character}</span
										>
									</Reveal>
									<Reveal as="span" delay={150 + index * 70} distance={10}>
										<span class="complete__letter-label"
											>{letter.romanization}</span
										>
									</Reveal>
									<Reveal as="span" delay={180 + index * 70} distance={10}>
										<span class="complete__letter-meta"
											>{formatLetterMeta(letter)}</span
										>
									</Reveal>
								</li>
							{/each}
						</ul>
					</div>
				</Reveal>
			</section>

			{#if practiceWords.length > 0}
				<section
					class="complete__panel complete__panel--vocabulary surface-panel surface-panel--mango"
				>
					<Reveal as="div" delay={140} distance={12}>
						<div class="complete__panel-inner">
							<div class="complete__section-header">
								<div>
									<p class="complete__section-kicker">
										Practice from this lesson
									</p>
									<h2>Same letters, now familiar</h2>
								</div>
								<p class="complete__section-copy">
									These are the practice reads you worked through before the drill
									checkpoint.
								</p>
							</div>

							<SameLettersWordList
								entries={practiceWords}
								newLetters={lesson.newLetters}
								ariaLabel="Practice reads completed in this lesson"
								revealStart={180}
								revealStep={70}
							/>
						</div>
					</Reveal>
				</section>
			{/if}
		</div>

		<section class="complete__next surface-panel">
			<Reveal as="div" delay={220} distance={10}>
				<div class="complete__next-shell">
					<div class="complete__next-copy">
						<p class="complete__section-kicker">Keep the momentum</p>
						<h2>Ready for the next step?</h2>
						<p class="complete__section-copy">
							Move on while the word shape and spelling pattern are still active.
						</p>
					</div>

					<ActionGroup justify="start" stackAt="sm">
						{#if hasNextLesson}
							<Button variant="primary" size="large" onclick={onNextLesson}>
								Go to the next word
							</Button>
						{:else}
							<Button href="/practice" variant="primary" size="large">
								Practice what you know
							</Button>
						{/if}
						<Button href="/learn" variant="secondary" size="large">All Lessons</Button>
					</ActionGroup>
				</div>
			</Reveal>
		</section>
	</div>
</StepLayout>

<style lang="scss">
	.complete {
		--complete-section-gap: clamp(#{$space-lg}, 3vw, #{$space-2xl});
		--complete-panel-gap: clamp(#{$space-md}, 2vw, #{$space-xl});
		--complete-panel-padding: clamp(#{$space-lg}, 4vw, #{$space-2xl});

		display: grid;
		gap: var(--complete-section-gap);

		.complete__hero,
		.complete__panel,
		.complete__next {
			background: var(--surface-panel);
			display: grid;
			overflow: hidden;
			padding: var(--complete-panel-padding);
			position: relative;

			&::before {
				content: "";
				height: 0.45rem;
				inset: 0 0 auto;
				position: absolute;
			}
		}

		.complete__hero {
			border-color: rgb(var(--rgb-primary) / 0.42);
			color: var(--color-text);

			&::before {
				background: var(--color-primary);
			}

			.complete__hero-shell {
				display: grid;
				gap: var(--complete-panel-gap);
			}

			.complete__hero-main {
				display: grid;
				gap: $space-lg;
				justify-items: start;
			}

			.complete__headline {
				display: grid;
				gap: $space-sm;
				max-width: 34rem;

				p {
					color: var(--color-text-muted);
					font-size: $font-size-lg;
					margin: 0;
				}
			}

			.complete__anchor {
				background: var(--color-primary);
				border: 1px solid var(--color-primary);
				border-radius: $radius-lg;
				box-shadow: var(--shadow-card);
				color: var(--color-on-primary);
				display: grid;
				gap: $space-xs;
				justify-items: center;
				justify-self: center;
				padding: clamp($space-md, 3vw, $space-xl);
				text-align: center;
				width: min(100%, 31rem);

				.complete__anchor-label {
					color: var(--color-on-primary);
					font-size: $font-size-sm;
					font-weight: 800;
					letter-spacing: 0.08em;
					text-transform: uppercase;
				}

				.complete__anchor-word {
					font-size: clamp(3rem, 9vw, 5.25rem);
					font-weight: 750;
					line-height: 1;
				}

				.complete__anchor-meaning {
					color: var(--color-on-primary);
					font-size: $font-size-lg;
				}
			}

			.complete__summary {
				display: grid;
				gap: $space-md;
				justify-items: stretch;

				.complete__summary-ribbon {
					display: grid;
					justify-items: center;
					padding-block: $space-sm;

					:global(.glyph-ribbon) {
						justify-content: center;
						width: 100%;
					}
				}
			}

			.complete__score {
				--metric-display-color: var(--color-on-primary);

				background: var(--color-primary);
				border: 1px solid var(--color-primary);
				border-radius: $radius-lg;
				box-shadow: var(--shadow-card);
				color: var(--color-on-primary);
				display: grid;
				gap: $space-sm;
				padding: $space-lg;
				text-align: center;

				:global(.metric-display__label) {
					color: var(--color-on-primary);
				}

				p {
					color: var(--color-on-primary);
					font-size: $font-size-sm;
					font-weight: 700;
					margin: 0;
				}
			}

			.complete__metrics {
				display: grid;
				gap: $space-sm;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				margin: 0;

				div {
					background: var(--color-surface-card);
					border: 1px solid var(--color-border-strong);
					border-radius: $radius-lg;
					border-top: 0.35rem solid var(--color-primary);
					color: var(--color-text);
					display: grid;
					gap: $space-xs;
					min-width: 0;
					padding: $space-md;
					text-align: center;
				}

				dt {
					color: var(--color-text-muted);
					font-size: $font-size-sm;
					font-weight: 700;
					margin: 0;
				}

				dd {
					color: var(--color-primary-strong);
					font-size: $font-size-3xl;
					font-weight: 850;
					line-height: 1;
					margin: 0;
				}
			}
		}

		.complete__learning-grid {
			display: grid;
			gap: var(--complete-section-gap);
		}

		.complete__panel {
			--complete-panel-accent: var(--color-primary);

			align-content: start;
			border-color: var(--complete-panel-accent);
			color: var(--color-text);

			&::before {
				background: var(--complete-panel-accent);
			}

			&.complete__panel--letters {
				--complete-panel-accent: var(--color-sky);
			}

			&.complete__panel--vocabulary {
				--complete-panel-accent: var(--color-mango);
			}

			.complete__panel-inner {
				display: grid;
				gap: var(--complete-panel-gap);
			}
		}

		.complete__section-header {
			display: grid;
			gap: $space-sm;

			h2 {
				margin: 0;
				max-width: 20rem;
			}
		}

		.complete__section-kicker {
			color: var(--complete-panel-accent, var(--color-primary-strong));
			font-size: $font-size-sm;
			font-weight: 800;
			letter-spacing: 0.08em;
			margin: 0;
			text-transform: uppercase;
		}

		.complete__section-copy {
			color: var(--color-text-muted);
			margin: 0;
			max-width: 25rem;
		}

		.complete__letter-list {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		.complete__letter-list {
			display: grid;
			gap: $space-md;
			grid-template-columns: repeat(auto-fit, minmax(8.25rem, 1fr));
		}

		.complete__letter-card {
			align-content: start;
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			border-top: 0.35rem solid var(--color-sky);
			color: var(--color-text);
			display: grid;
			gap: $space-xs;
			justify-items: center;
			min-height: 8rem;
			padding: $space-md;
			text-align: center;

			.complete__letter-character {
				color: var(--color-sky);
				font-size: clamp(2.65rem, 8vw, 3.35rem);
				font-weight: 750;
				line-height: 1;
			}

			.complete__letter-label {
				font-size: $font-size-lg;
				font-weight: 800;
			}

			.complete__letter-meta {
				color: var(--color-text-muted);
				font-size: $font-size-sm;
				line-height: 1.35;
			}
		}

		.complete__next {
			border-color: rgb(var(--rgb-accent) / 0.52);
			color: var(--color-text);

			&::before {
				background: var(--color-accent);
			}

			.complete__section-kicker {
				color: var(--color-accent);
			}

			.complete__next-shell {
				display: grid;
				gap: var(--complete-panel-gap);
			}

			.complete__next-copy {
				display: grid;
				gap: $space-xs;
			}
		}

		:global(.action-group) {
			align-items: stretch;
		}
	}

	@media (min-width: $bp-md) {
		.complete {
			.complete__hero {
				align-items: start;

				.complete__hero-shell {
					align-items: start;
					grid-template-columns: minmax(0, 1.1fr) minmax(17rem, 0.68fr);
				}
			}

			.complete__learning-grid {
				align-items: start;
				grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
			}

			.complete__section-header {
				gap: $space-md;
			}

			.complete__next {
				.complete__next-shell {
					align-items: center;
					grid-template-columns: minmax(0, 1fr) auto;
				}
			}

			:global(.action-group) {
				justify-content: flex-end;
			}
		}
	}

	@media (max-width: $bp-sm) {
		.complete {
			.complete__hero,
			.complete__panel,
			.complete__next {
				padding: $space-lg;
			}

			.complete__hero {
				.complete__metrics {
					grid-template-columns: 1fr;
				}
			}

			:global(.action-group) {
				width: 100%;
			}

			:global(.action-group > *) {
				width: 100%;
			}
		}
	}
</style>
