<script lang="ts">
	import LetterDetailPanel from "$lib/components/content/alphabet/LetterDetailPanel.svelte";
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

	function buildSection(
		letters: Letter[],
		headingId: string,
		title: string,
	): { headingId: string; title: string; options: ToggleTileOption[] } {
		return {
			headingId,
			title,
			options: letters.map<ToggleTileOption>((letter) => {
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
		};
	}

	const letterSections = $derived([
		buildSection(consonants, "alphabet-consonants-heading", "Consonants"),
		buildSection(vowels, "alphabet-vowels-heading", "Vowels"),
		buildSection(toneMarks, "alphabet-tone-marks-heading", "Tone Marks"),
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
<div class="alphabet container page-shell">
	<section class="page-intro alphabet__intro">
		<span class="page-intro__eyebrow">Letter map</span>
		<h1 class="page-intro__title">Watch the script fill in as lessons unlock it.</h1>
		<p class="page-intro__body">
			GlyphBridge reveals Thai letters in the order you actually meet them, so the alphabet
			grows with your reading instead of arriving as a giant wall of symbols.
		</p>
		<div class="page-intro__meta">
			<span class="badge badge--primary">{$knownLetters.length} unlocked</span>
			<span class="badge badge--accent">{allLetters.length} taught so far</span>
		</div>
	</section>

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

	<LetterDetailPanel letter={selectedLetter} onClose={() => (selectedCharacter = "")} />
</div>

<style lang="scss">
	/* ========================================
	   Alphabet page styles
	   ======================================== */

	// Page-level wrapper and subtitle
	.alphabet {
		&__intro {
			margin-bottom: $space-sm;
		}

		&__progress {
			margin-bottom: $space-xl;
		}
	}

	// Section wrapper for each letter category (Consonants / Vowels)
	.letter-section {
		background: var(--surface-panel);
		border: 1px solid var(--color-border);
		border-radius: $radius-xl;
		box-shadow: var(--shadow-card);
		margin-top: $space-xl;
		padding: $space-xl;

		h2 {
			margin-bottom: $space-md;
		}
	}
</style>
