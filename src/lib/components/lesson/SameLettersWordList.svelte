<script lang="ts">
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { LessonVocabularyEntry, Letter } from "$lib/data/types";

	let {
		entries,
		newLetters,
		ariaLabel = "Practice reads using the same letters",
		revealStart = 0,
		revealStep = 80,
		showAnswers = true,
		hiddenLabel = "Read this word before checking the sound and meaning.",
	}: {
		entries: LessonVocabularyEntry[];
		newLetters: Letter[];
		ariaLabel?: string;
		revealStart?: number;
		revealStep?: number;
		showAnswers?: boolean;
		hiddenLabel?: string;
	} = $props();

	function focusLetters(entry: LessonVocabularyEntry) {
		return newLetters.filter((letter) => entry.word.thai.includes(letter.character));
	}
</script>

<ul class="same-letters-word-list" aria-label={ariaLabel}>
	{#each entries as entry, index}
		{@const wordFocusLetters = focusLetters(entry)}
		<li
			class="same-letters-word-list__item"
			aria-label={showAnswers
				? `${entry.word.thai}, ${entry.word.pronunciation}, ${entry.word.meaning}`
				: `${entry.word.thai}, answer hidden`}
		>
			<Reveal as="div" delay={revealStart + index * revealStep} distance={10}>
				<div class="same-letters-word-list__shell">
					<div class="same-letters-word-list__script">
						<span class="same-letters-word-list__thai thai thai--sm">
							{entry.word.thai}
						</span>
						{#if wordFocusLetters.length > 0}
							<ul
								class="same-letters-word-list__focus-list"
								aria-label={`New letters in ${entry.word.thai}`}
							>
								{#each wordFocusLetters as letter}
									<li class="same-letters-word-list__focus-chip thai">
										{letter.character}
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					{#if showAnswers}
						<div class="same-letters-word-list__body">
							<div class="same-letters-word-list__copy">
								<span class="same-letters-word-list__pronunciation">
									{entry.word.pronunciation}
								</span>
								<span class="same-letters-word-list__meaning">
									{entry.word.meaning}
								</span>
							</div>

							{#if entry.word.syllables.length > 0}
								<ul
									class="same-letters-word-list__syllables"
									aria-label={`Readable parts of ${entry.word.thai}`}
								>
									{#each entry.word.syllables as syllable}
										<li class="same-letters-word-list__syllable">
											<span
												class="same-letters-word-list__syllable-thai thai"
											>
												{syllable.thai}
											</span>
											<span class="same-letters-word-list__syllable-sound">
												{syllable.sound}
											</span>
										</li>
									{/each}
								</ul>
							{/if}

							{#if entry.word.contextNote}
								<p class="same-letters-word-list__context">
									{entry.word.contextNote}
								</p>
							{/if}
						</div>
					{:else}
						<div
							class="same-letters-word-list__body same-letters-word-list__body--hidden"
						>
							<p class="same-letters-word-list__hidden-label">{hiddenLabel}</p>
						</div>
					{/if}
				</div>
			</Reveal>
		</li>
	{/each}
</ul>

<style lang="scss">
	.same-letters-word-list {
		--same-letters-accent: var(--color-mango);
		--same-letters-accent-soft: rgb(var(--rgb-mango) / 0.16);

		display: grid;
		gap: $space-md;
		list-style: none;
		margin: 0;
		padding: 0;

		.same-letters-word-list__item {
			min-width: 0;
		}

		.same-letters-word-list__shell {
			align-items: center;
			background: var(--color-surface-card);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-lg;
			border-top: 0.35rem solid var(--same-letters-accent);
			color: var(--color-text);
			display: grid;
			gap: clamp(#{$space-sm}, 1.5vw, #{$space-lg});
			grid-template-columns: minmax(5.75rem, 0.32fr) minmax(0, 1fr);
			padding: $space-md;
		}

		.same-letters-word-list__script,
		.same-letters-word-list__body {
			display: grid;
			min-width: 0;
		}

		.same-letters-word-list__script {
			gap: $space-sm;
			justify-items: start;
		}

		.same-letters-word-list__thai {
			color: var(--same-letters-accent);
			font-size: clamp(1.6rem, 3.5vw, 2rem);
			font-weight: 750;
			line-height: 1.08;
			overflow-wrap: anywhere;
		}

		.same-letters-word-list__focus-list,
		.same-letters-word-list__syllables {
			display: flex;
			flex-wrap: wrap;
			list-style: none;
			margin: 0;
			padding: 0;
		}

		.same-letters-word-list__focus-list {
			gap: $space-xs;
		}

		.same-letters-word-list__focus-chip {
			align-items: center;
			background: var(--same-letters-accent-soft);
			border: 1px solid var(--same-letters-accent);
			border-radius: 999px;
			color: var(--same-letters-accent);
			display: inline-flex;
			font-size: $font-size-lg;
			font-weight: 800;
			justify-content: center;
			line-height: 1;
			min-height: 2rem;
			min-width: 2rem;
			padding: $space-xs $space-sm;
		}

		.same-letters-word-list__body {
			gap: $space-sm;

			&.same-letters-word-list__body--hidden {
				align-content: center;
				background: var(--surface-interactive);
				border: 1px dashed var(--color-border-strong);
				border-radius: $radius-lg;
				min-height: 4rem;
				padding: $space-sm $space-md;
			}
		}

		.same-letters-word-list__copy {
			align-items: baseline;
			column-gap: $space-sm;
			display: flex;
			flex-wrap: wrap;
			row-gap: $space-xs;
		}

		.same-letters-word-list__pronunciation {
			font-size: $font-size-lg;
			font-weight: 800;
			white-space: nowrap;
		}

		.same-letters-word-list__meaning {
			flex: 1 1 10rem;
			min-width: min(100%, 9rem);
		}

		.same-letters-word-list__meaning,
		.same-letters-word-list__context,
		.same-letters-word-list__hidden-label,
		.same-letters-word-list__syllable-sound {
			color: var(--color-text-muted);
		}

		.same-letters-word-list__hidden-label {
			font-size: $font-size-sm;
			font-weight: 700;
			line-height: 1.55;
			margin: 0;
		}

		.same-letters-word-list__syllables {
			gap: $space-sm;
		}

		.same-letters-word-list__syllable {
			align-items: baseline;
			background: var(--surface-interactive);
			border: 1px solid var(--color-border);
			border-radius: 999px;
			display: inline-flex;
			gap: $space-xs;
			padding: $space-xs $space-sm;
		}

		.same-letters-word-list__syllable-thai {
			color: var(--color-text);
			font-size: $font-size-lg;
			font-weight: 800;
			line-height: 1;
		}

		.same-letters-word-list__syllable-sound {
			font-size: $font-size-sm;
			font-weight: 700;
		}

		.same-letters-word-list__context {
			font-size: $font-size-sm;
			line-height: 1.45;
			margin: 0;
		}
	}

	@media (max-width: $bp-sm) {
		.same-letters-word-list {
			.same-letters-word-list__shell {
				align-items: start;
				grid-template-columns: 1fr;
				padding: $space-lg;
			}
		}
	}

	@media (min-width: $bp-md) {
		.same-letters-word-list {
			.same-letters-word-list__body {
				align-items: center;
				grid-template-columns: minmax(0, 1fr) minmax(10rem, 0.82fr);
			}

			.same-letters-word-list__syllables {
				justify-content: flex-end;
			}

			.same-letters-word-list__context {
				grid-column: 1 / -1;
			}
		}
	}
</style>
