<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import Progress from "$lib/components/ui/Progress.svelte";
	import ToggleTiles, { type ToggleTileOption } from "$lib/components/ui/ToggleTiles.svelte";
	import { thaiPack } from "$lib/data/thai";
	import type { Letter } from "$lib/data/types";
	import { knownLetters } from "$lib/stores/progress";

	// Build a flat list of every letter introduced across all lessons
	const allLetters: Letter[] = thaiPack.lessons.flatMap((l) => l.newLetters);

	// Reactively partition letters into consonants, vowels, and tone marks for separate sections
	const consonants = $derived(allLetters.filter((l) => l.type === "consonant"));
	const vowels = $derived(allLetters.filter((l) => l.type === "vowel"));
	const toneMarks = $derived(allLetters.filter((l) => l.type === "tone_mark"));

	// Check whether the user has unlocked a letter by completing its lesson
	function isKnown(char: string): boolean {
		return $knownLetters.includes(char);
	}

	// Tracks which letter tile is selected; empty means the detail panel is closed
	let selectedCharacter = $state("");
	const selectedLetter = $derived(
		selectedCharacter === ""
			? null
			: (allLetters.find((letter) => letter.character === selectedCharacter) ?? null),
	);

	const letterSections = $derived([
		{
			headingId: "alphabet-consonants-heading",
			title: "Consonants",
			options: consonants.map<ToggleTileOption>((letter) => {
				const known = isKnown(letter.character);
				return {
					value: letter.character,
					primaryLabel: letter.character,
					secondaryLabel: known ? letter.romanization : "?",
					disabled: !known,
					primaryIsThai: true,
					variant: known ? "known" : "default",
					secondaryTone: known ? "default" : "muted",
				};
			}),
		},
		{
			headingId: "alphabet-vowels-heading",
			title: "Vowels",
			options: vowels.map<ToggleTileOption>((letter) => {
				const known = isKnown(letter.character);
				return {
					value: letter.character,
					primaryLabel: letter.character,
					secondaryLabel: known ? letter.romanization : "?",
					disabled: !known,
					primaryIsThai: true,
					variant: known ? "known" : "default",
					secondaryTone: known ? "default" : "muted",
				};
			}),
		},
		{
			headingId: "alphabet-tone-marks-heading",
			title: "Tone Marks",
			options: toneMarks.map<ToggleTileOption>((letter) => {
				const known = isKnown(letter.character);
				return {
					value: letter.character,
					primaryLabel: letter.character,
					secondaryLabel: known ? letter.romanization : "?",
					disabled: !known,
					primaryIsThai: true,
					variant: known ? "known" : "default",
					secondaryTone: known ? "default" : "muted",
				};
			}),
		},
	]);
</script>

<svelte:head>
	<title>Alphabet — GlyphBridge</title>
	<meta
		name="description"
		content="Review the Thai consonants, vowels, and tone marks you have unlocked so far, with pronunciation details and memory cues."
	/>
</svelte:head>

<!--
  Alphabet Page
  Displays all Thai letters the curriculum teaches, split into consonant and vowel grids.
  - Unknown letters appear disabled with a "?" placeholder until the user completes
    the lesson that introduces them.
  - Known letters are clickable and reveal a detail panel with pronunciation,
    romanization, consonant class, writing position, and a mnemonic.
  - A progress bar at the top shows how many letters the user has learned out of the total.
-->
<div class="alphabet container">
	<h1>Your Thai Alphabet</h1>
	<p class="alphabet__subtitle">
		Letters unlock as you complete lessons. You know <strong>{$knownLetters.length}</strong>
		of {allLetters.length} letters taught so far.
	</p>

	<!-- Visual progress bar: fill width is the percentage of letters learned -->
	<div class="alphabet__progress">
		<Progress
			label="Letters learned progress"
			value={$knownLetters.length}
			max={allLetters.length}
			valueLabel={`${$knownLetters.length} of ${allLetters.length} letters learned`}
		/>
	</div>

	{#each letterSections as section}
		<section class="letter-section">
			<h2 id={section.headingId}>{section.title}</h2>
			<ToggleTiles
				labelledBy={section.headingId}
				options={section.options}
				bind:value={selectedCharacter}
			/>
		</section>
	{/each}

	<!-- Detail panel: shown when a known letter tile is selected -->
	{#if selectedLetter}
		<div class="detail-panel card">
			<Button
				variant="ghost"
				class="detail-panel__close"
				onclick={() => (selectedCharacter = "")}
			>
				&times;
			</Button>
			<div class="detail-panel__char thai" style=" color: var(--primary);font-size: 4rem;">
				{selectedLetter.character}
			</div>
			<div class="detail-panel__info">
				<div class="detail-panel__row">
					<span class="detail-panel__label">Sound</span>
					<span>{selectedLetter.romanization}</span>
				</div>
				<div class="detail-panel__row">
					<span class="detail-panel__label">Pronunciation</span>
					<span>{selectedLetter.pronunciation}</span>
				</div>
				<div class="detail-panel__row">
					<span class="detail-panel__label">Type</span>
					<span
						>{selectedLetter.type}{selectedLetter.class
							? ` (${selectedLetter.class} class)`
							: ""}</span
					>
				</div>
				<!-- Position row is only relevant for vowels that attach to a consonant -->
				{#if selectedLetter.position && selectedLetter.position !== "standalone"}
					<div class="detail-panel__row">
						<span class="detail-panel__label">Position</span>
						<span>Written {selectedLetter.position}</span>
					</div>
				{/if}
				<div class="detail-panel__mnemonic">
					<strong>Memory trick:</strong>
					{selectedLetter.mnemonic}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	/* ========================================
	   Alphabet page styles
	   ======================================== */

	// Page-level wrapper and subtitle
	.alphabet {
		&__subtitle {
			color: $color-text-light;
			margin-bottom: $space-lg;
			margin-top: $space-sm;
		}

		&__progress {
			margin-bottom: $space-xl;
		}
	}

	// Section wrapper for each letter category (Consonants / Vowels)
	.letter-section {
		margin-top: $space-xl;

		h2 {
			margin-bottom: $space-md;
		}
	}

	// Expandable detail panel: appears below the grids when a known tile is selected
	.detail-panel {
		align-items: flex-start;
		display: flex;
		gap: $space-xl;
		margin-top: $space-xl;
		position: relative;

		--primary: #{$color-primary};

		:global(.detail-panel__close) {
			font-size: $font-size-xl;
			position: absolute;
			right: $space-md;
			top: $space-md;
		}

		&__info {
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: $space-sm;
		}

		&__row {
			border-bottom: 1px solid $color-border;
			display: flex;
			justify-content: space-between;
			padding: $space-xs 0;
		}

		&__label {
			color: $color-text-light;
			font-size: $font-size-sm;
			font-weight: 600;
		}

		&__mnemonic {
			background: rgba($color-primary, 0.04);
			border-radius: $radius-md;
			font-size: $font-size-sm;
			line-height: 1.6;
			margin-top: $space-sm;
			padding: $space-md;
		}
	}

	// Mobile: smaller tiles and stacked detail panel layout
	@media (max-width: $bp-sm) {
		.detail-panel {
			align-items: center;
			flex-direction: column;
			text-align: center;

			&__row {
				flex-direction: column;
				gap: $space-xs;
			}
		}
	}
</style>
