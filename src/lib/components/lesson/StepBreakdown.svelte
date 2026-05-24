<!--
  StepBreakdown.svelte — Lesson Step 2: Syllable Breakdown
  =========================================================
  After the learner has seen the anchor word, this step reveals
  how the word splits into syllables. Each syllable is shown as
  a card with the Thai characters and their romanized sound.

  This is where the learner starts to see the internal structure
  of the word — the bridge between "whole word" and "letter-level".
-->
<script lang="ts">
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { Lesson } from "$lib/data/types";

	let { lesson, onNext }: { lesson: Lesson; onNext: () => void } = $props();
</script>

<StepLayout>
	<h2>Let&apos;s take <span class="thai">{lesson.anchorWord.thai}</span> apart.</h2>

	<div class="breakdown">
		<section class="breakdown__panel breakdown__panel--whole surface-panel lesson-accent-panel">
			<div class="breakdown__panel-header">
				<span class="breakdown__eyebrow">Whole word</span>
				<p class="breakdown__hint">Read it as one chunk before splitting it up.</p>
			</div>

			<div class="breakdown__word-wrap">
				<div class="breakdown__word thai thai--lg">
					<Reveal as="span" distance={12}>{lesson.anchorWord.thai}</Reveal>
				</div>
			</div>
		</section>

		<div class="breakdown__connector" aria-hidden="true">
			<div class="breakdown__arrow breakdown__arrow--down">
				<Reveal as="span" delay={80} distance={10}>&darr;</Reveal>
			</div>
			<div class="breakdown__arrow breakdown__arrow--right">
				<Reveal as="span" delay={80} distance={10}>&rarr;</Reveal>
			</div>
			<span class="breakdown__connector-label">Break it apart</span>
		</div>

		<section
			class="breakdown__panel breakdown__panel--parts surface-panel lesson-accent-panel lesson-accent-panel--sky"
		>
			<div class="breakdown__panel-header">
				<span class="breakdown__eyebrow">Broken into syllables</span>
				<p class="breakdown__hint">
					Each block shows one piece and the sound it contributes.
				</p>
			</div>

			<div class="breakdown__syllables">
				{#each lesson.anchorWord.syllables as syllable, index}
					<div class="syllable-card card card--flat">
						<Reveal as="div" delay={140 + index * 90} distance={14}>
							<span class="syllable-card__thai thai">{syllable.thai}</span>
							<span class="syllable-card__sound">{syllable.sound}</span>
						</Reveal>
					</div>
				{/each}
			</div>

			<div class="breakdown__full">
				<div class="breakdown__gloss">
					<Reveal as="div" delay={260} distance={12}>
						<span class="breakdown__chip breakdown__chip--pronunciation">
							{lesson.anchorWord.pronunciation}
						</span>
						<span class="breakdown__chip">&quot;{lesson.anchorWord.meaning}&quot;</span>
					</Reveal>
				</div>
			</div>
		</section>
	</div>

	<Button variant="primary" size="large" fullWidth={true} onclick={onNext}>
		Learn the New Letters ->
	</Button>
</StepLayout>

<style lang="scss">
	h2 {
		margin: 0;
	}

	.breakdown {
		align-items: center;
		display: grid;
		gap: $space-md;
		grid-template-columns: minmax(0, 1fr);
		margin-inline: auto;
		max-width: 72rem;
		width: 100%;

		&__panel {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			padding: clamp($space-md, 2.5vw, $space-xl);
			position: relative;
			width: 100%;
		}

		&__panel--whole {
			overflow: hidden;
		}

		&__panel-header {
			display: flex;
			flex-direction: column;
			gap: $space-xs;
			text-align: left;
		}

		&__eyebrow {
			color: var(--color-text-soft);
			font-size: $font-size-xs;
			font-weight: 700;
			letter-spacing: 0.12em;
			text-transform: uppercase;
		}

		&__hint {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
			line-height: 1.6;
			margin: 0;
		}

		&__word-wrap {
			align-items: center;
			background: var(--color-primary);
			border: 1px solid var(--color-primary);
			border-radius: $radius-xl;
			box-shadow: var(--shadow-card);
			color: var(--color-on-primary);
			display: grid;
			justify-items: center;
			margin-inline: auto;
			max-width: 26rem;
			min-height: clamp(6rem, 15vw, 8rem);
			padding: $space-md;
			width: 100%;
		}

		&__word {
			color: var(--color-on-primary);
			line-height: 1;
			text-align: center;
		}

		&__connector {
			align-items: center;
			align-self: center;
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			justify-content: center;
			justify-self: center;
		}

		&__arrow {
			align-items: center;
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: 999px;
			color: var(--color-text-soft);
			display: grid;
			font-size: $font-size-xl;
			height: 2.5rem;
			justify-items: center;
			width: 2.5rem;

			&--right {
				display: none;
			}
		}

		&__connector-label {
			color: var(--color-text-soft);
			font-size: $font-size-xs;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		&__syllables {
			align-items: stretch;
			display: flex;
			flex-wrap: wrap;
			gap: $space-sm;
			justify-content: flex-start;
		}

		&__full {
			border-top: 1px solid var(--color-border);
			padding-top: $space-sm;
		}

		&__gloss {
			display: flex;
			flex-wrap: wrap;
			gap: $space-sm;
			justify-content: flex-start;
		}

		&__chip {
			background: var(--color-surface-card);
			border: 1px solid var(--color-border);
			border-radius: 999px;
			color: var(--color-text-muted);
			display: inline-flex;
			font-size: $font-size-sm;
			font-weight: 600;
			padding: $space-sm $space-md;
		}

		&__chip--pronunciation {
			color: var(--color-sky);
		}
	}

	@media (min-width: $bp-md) {
		.breakdown {
			align-items: stretch;
			gap: $space-md clamp($space-md, 2vw, $space-lg);
			grid-template-columns: minmax(0, 0.92fr) minmax(4.5rem, 5.5rem) minmax(0, 1.08fr);

			&__panel {
				min-height: 100%;
			}

			&__word-wrap {
				flex: 1;

				:global(.reveal) {
					display: block;
				}
			}

			&__word {
				font-size: clamp(2.75rem, 5vw, 4rem);
			}

			&__connector {
				padding-top: 0;
			}

			&__arrow {
				&--down {
					display: none;
				}

				&--right {
					display: grid;
				}
			}

			&__panel--parts {
				justify-content: space-between;
			}

			&__gloss {
				justify-content: flex-start;
			}
		}
	}

	.syllable-card {
		align-items: center;
		background: var(--surface-panel);
		border: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 5.75rem;
		min-width: min(6.5rem, 100%);
		padding: $space-sm $space-md;

		> :global(.reveal) {
			align-items: center;
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			justify-content: center;
			min-height: 100%;
		}

		&__thai {
			color: var(--color-sky);
			font-size: clamp(1.8rem, 3vw, 2.35rem);
		}

		&__sound {
			color: var(--color-text-muted);
			font-size: $font-size-base;
			font-weight: 500;
		}
	}
</style>
