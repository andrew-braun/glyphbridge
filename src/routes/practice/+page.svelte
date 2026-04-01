<!--
  Practice Page — /practice
  ==========================
  Standalone drill session using questions from all completed lessons.
  The user starts a session of N randomized questions, answers them
  one by one, then sees their score.

  Three states:
    1. Start screen — shows stats and a "Start Practice" button
    2. Active session — renders DrillExercise for each question
    3. Results screen — shows score and option to retry

  Drills are pulled from all lessons the user has completed, shuffled,
  and capped at the session size (default: 10 questions).
-->
<script lang="ts">
	import { knownLetters, knownWords, progress } from '$lib/stores/progress';
	import { thaiPack } from '$lib/data/thai';
	import type { DrillQuestion } from '$lib/data/types';
	import DrillExercise from '$lib/components/DrillExercise.svelte';

	// --- Gather available drills from completed lessons ---
	// Reactively re-computed when progress changes (e.g. after completing a new lesson).
	const availableDrills = $derived.by(() => {
		const completedIds = $progress.lessonProgress
			.filter((lp) => lp.completed)
			.map((lp) => lp.lessonId);
		return thaiPack.lessons
			.filter((l) => completedIds.includes(l.id))
			.flatMap((l) => l.drills);
	});

	// --- Session configuration ---
	const SESSION_SIZE = 10;

	// --- Session state ---
	let drillPool = $state<DrillQuestion[]>([]);
	let currentDrillIndex = $state(0);
	let correctCount = $state(0);
	let totalAnswered = $state(0);
	let sessionActive = $state(false);

	// Derived state
	const currentDrill = $derived<DrillQuestion | undefined>(drillPool[currentDrillIndex]);
	const sessionComplete = $derived(
		sessionActive && (totalAnswered >= SESSION_SIZE || currentDrillIndex >= drillPool.length)
	);

	/** Fisher-Yates shuffle to randomize drill order each session. */
	function shuffle<T>(arr: T[]): T[] {
		const shuffled = [...arr];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	/** Initialize a new practice session with shuffled drills. */
	function startSession() {
		drillPool = shuffle(availableDrills).slice(0, SESSION_SIZE);
		currentDrillIndex = 0;
		correctCount = 0;
		totalAnswered = 0;
		sessionActive = true;
	}

	/** Called by DrillExercise after user selects an answer. */
	function handleAnswer(isCorrect: boolean) {
		totalAnswered++;
		if (isCorrect) correctCount++;
	}

	/** Called by DrillExercise when user clicks "Next". */
	function handleNext() {
		if (currentDrillIndex < drillPool.length - 1) {
			currentDrillIndex++;
		}
		// sessionComplete derived state will flip to true on the last question
	}
</script>

<svelte:head>
	<title>Practice — SparkScripts</title>
</svelte:head>

<div class="practice container">
	<h1>Practice</h1>
	<p class="practice__subtitle">Review what you've learned with randomized drills.</p>

	<!-- STATE: No drills available (user hasn't completed any lessons) -->
	{#if availableDrills.length === 0}
		<div class="empty card">
			<div class="empty__icon">&#127947;</div>
			<h2>Nothing to practice yet!</h2>
			<p>Complete at least one lesson to unlock practice drills.</p>
			<a href="/learn" class="btn btn--primary btn--large">Start Learning</a>
		</div>

	<!-- STATE: Session not started — show stats and start button -->
	{:else if !sessionActive}
		<div class="start card">
			<h2>Ready to practice?</h2>
			<p>You have <strong>{availableDrills.length}</strong> drill questions from completed lessons.</p>
			<div class="start__stats">
				<div class="stat">
					<span class="stat__num">{$knownLetters.length}</span>
					<span class="stat__label">Letters</span>
				</div>
				<div class="stat">
					<span class="stat__num">{$knownWords.length}</span>
					<span class="stat__label">Words</span>
				</div>
			</div>
			<button class="btn btn--primary btn--large" onclick={startSession}>
				Start Practice Session ({Math.min(SESSION_SIZE, availableDrills.length)} questions)
			</button>
		</div>

	<!-- STATE: Session complete — show results -->
	{:else if sessionComplete}
		<div class="results card">
			<!-- Emoji adapts to score: trophy for perfect, muscle for good, chat for needs work -->
			<div class="results__emoji">
				{#if correctCount === totalAnswered}
					&#127942;
				{:else if correctCount >= totalAnswered * 0.7}
					&#128170;
				{:else}
					&#128172;
				{/if}
			</div>
			<h2>Session Complete!</h2>
			<div class="results__score">
				<span class="results__score-num">{correctCount}/{totalAnswered}</span>
				<span class="results__score-label">Correct</span>
			</div>
			<div class="results__pct">
				{Math.round((correctCount / totalAnswered) * 100)}%
			</div>
			<div class="results__actions">
				<button class="btn btn--primary btn--large" onclick={startSession}>Practice Again</button>
				<a href="/learn" class="btn btn--secondary btn--large">Back to Lessons</a>
			</div>
		</div>

	<!-- STATE: Active session — show current drill -->
	{:else if currentDrill}
		<div class="session">
			<!-- Progress bar for the session -->
			<div class="session__header">
				<div class="progress-bar" style="flex:1">
					<div class="progress-bar__fill" style="width: {(totalAnswered / SESSION_SIZE) * 100}%"></div>
				</div>
				<span class="session__count">{totalAnswered + 1} / {Math.min(SESSION_SIZE, drillPool.length)}</span>
			</div>

			<!-- Reusable drill component handles the answer UI -->
			<DrillExercise
				prompt={currentDrill.prompt}
				options={currentDrill.options}
				correctIndex={currentDrill.correctIndex}
				onAnswer={handleAnswer}
				onNext={handleNext}
				nextLabel={currentDrillIndex < drillPool.length - 1 && totalAnswered < SESSION_SIZE
					? 'Next Question →'
					: 'See Results →'}
			/>

			<!-- Running score counter -->
			<div class="session__score">
				Score: {correctCount} / {totalAnswered}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.practice {
		&__subtitle {
			@include page-subtitle;
		}
	}

	// Shared layout for empty, start, and results states
	.empty, .start, .results {
		@include empty-state;
	}

	.empty__icon, .results__emoji {
		@include empty-state-icon;
	}

	// Stat chips on the start screen
	.start__stats {
		display: flex;
		gap: $space-xl;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;

		&__num {
			font-size: $font-size-3xl;
			font-weight: 800;
			color: $color-primary;
		}

		&__label {
			@include step-counter;
		}
	}

	// Results screen
	.results {
		&__score {
			@include score-display($color-success);
		}

		&__pct {
			font-size: $font-size-xl;
			font-weight: 700;
			color: $color-primary;
		}

		&__actions {
			display: flex;
			gap: $space-md;
		}
	}

	// Active session layout
	.session {
		max-width: 640px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: $space-xl;

		&__header {
			display: flex;
			align-items: center;
			gap: $space-md;
		}

		&__count {
			@include step-counter;
			white-space: nowrap;
		}

		&__score {
			text-align: center;
			@include step-counter;
		}
	}
</style>
