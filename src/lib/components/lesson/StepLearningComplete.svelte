<script lang="ts">
	import GlyphRibbon from "$lib/components/illustrations/GlyphRibbon.svelte";
	import ActionGroup from "$lib/components/layout/ActionGroup.svelte";
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Eyebrow from "$lib/components/ui/Eyebrow.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { Lesson } from "$lib/data/types";

	let {
		lesson,
		guidedWordCount,
		practiceWordCount,
		onStartPractice,
	}: {
		lesson: Lesson;
		guidedWordCount: number;
		practiceWordCount: number;
		onStartPractice: () => void;
	} = $props();
</script>

<StepLayout>
	<section class="learning-complete surface-panel surface-panel--sky">
		<Reveal as="div" distance={16}>
			<div class="learning-complete__hero">
				<div class="learning-complete__copy">
					<Eyebrow tone="accent">Learning complete</Eyebrow>
					<h1>You have the reading tools. Now lock them in.</h1>
					<p>
						You just learned how <span class="thai">{lesson.anchorWord.thai}</span> works.
						The scored practice phase is where this lesson unlocks the next one.
					</p>
				</div>

				<div class="learning-complete__anchor" aria-label="Lesson anchor word">
					<span class="learning-complete__anchor-label">Anchor word</span>
					<span class="learning-complete__anchor-word thai">{lesson.anchorWord.thai}</span
					>
					<span class="learning-complete__anchor-meta"
						>{lesson.anchorWord.pronunciation} · {lesson.anchorWord.meaning}</span
					>
				</div>
			</div>
		</Reveal>

		<Reveal as="div" delay={90} distance={12}>
			<div class="learning-complete__summary">
				<div>
					<dt>New letters</dt>
					<dd>{lesson.newLetters.length}</dd>
				</div>
				<div>
					<dt>Guided reads</dt>
					<dd>{guidedWordCount}</dd>
				</div>
				<div>
					<dt>Practice queue</dt>
					<dd>{practiceWordCount}</dd>
				</div>
			</div>
		</Reveal>

		<Reveal as="div" delay={150} distance={10}>
			<div class="learning-complete__practice-callout">
				<div class="learning-complete__practice-copy">
					<h2>Practice decides progression.</h2>
					<p>
						Work through the card stack, do the quick recap, then clear the scored
						checkpoint to unlock the next lesson.
					</p>
				</div>
				<div class="learning-complete__practice-art">
					<GlyphRibbon
						tokens={lesson.newLetters.map((letter) => letter.character)}
						tone="mixed"
					/>
				</div>
			</div>
		</Reveal>

		<Reveal as="div" delay={210} distance={10}>
			<ActionGroup justify="start" stackAt="sm">
				<Button variant="primary" size="large" onclick={onStartPractice}>
					Start practice
				</Button>
				<Button href="/learn" variant="secondary" size="large">All lessons</Button>
			</ActionGroup>
		</Reveal>
	</section>
</StepLayout>

<style lang="scss">
	.learning-complete {
		display: grid;
		gap: clamp(#{$space-lg}, 3vw, #{$space-2xl});
		padding: clamp(#{$space-lg}, 4vw, #{$space-2xl});

		.learning-complete__hero,
		.learning-complete__practice-callout {
			display: grid;
			gap: $space-lg;
		}

		.learning-complete__copy {
			display: grid;
			gap: $space-sm;
			max-width: 42rem;

			h1,
			p {
				margin: 0;
			}

			p {
				color: var(--color-text-muted);
				font-size: $font-size-lg;
				line-height: 1.55;
			}
		}

		.learning-complete__anchor {
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			display: grid;
			gap: $space-xs;
			padding: $space-lg;
		}

		.learning-complete__anchor-label,
		.learning-complete__summary dt {
			color: var(--color-text-soft);
			font-size: $font-size-xs;
			font-weight: 800;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.learning-complete__anchor-word {
			color: var(--color-primary-strong);
			font-size: clamp(2.1rem, 5vw, 3.25rem);
			font-weight: 800;
			line-height: 1;
		}

		.learning-complete__anchor-meta,
		.learning-complete__practice-copy p {
			color: var(--color-text-muted);
		}

		.learning-complete__summary {
			display: grid;
			gap: $space-md;
			grid-template-columns: repeat(3, minmax(0, 1fr));

			div {
				background: rgb(var(--rgb-primary) / 0.08);
				border: 1px solid rgb(var(--rgb-primary) / 0.14);
				border-radius: $radius-lg;
				display: grid;
				gap: $space-xs;
				padding: $space-md;
			}

			dd {
				font-size: clamp(1.35rem, 3vw, 1.75rem);
				font-weight: 800;
				margin: 0;
			}
		}

		.learning-complete__practice-callout {
			align-items: center;
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			padding: clamp(#{$space-md}, 3vw, #{$space-xl});
		}

		.learning-complete__practice-copy {
			display: grid;
			gap: $space-sm;

			h2,
			p {
				margin: 0;
			}

			p {
				line-height: 1.5;
			}
		}

		.learning-complete__practice-art {
			max-width: 14rem;
		}
	}

	@media (min-width: $bp-md) {
		.learning-complete {
			.learning-complete__hero,
			.learning-complete__practice-callout {
				grid-template-columns: minmax(0, 1fr) minmax(15rem, 0.8fr);
			}
		}
	}

	@media (max-width: $bp-sm) {
		.learning-complete {
			.learning-complete__summary {
				grid-template-columns: 1fr;
			}
		}
	}
</style>
