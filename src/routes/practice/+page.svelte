<script lang="ts">
	import { knownLetters, knownWords, progress } from '$lib/stores/progress';
	import { thaiPack } from '$lib/data/thai';
	import type { DrillQuestion } from '$lib/data/types';

	// Gather all drills from completed lessons
	const availableDrills = $derived.by(() => {
		const completedIds = $progress.lessonProgress.filter((lp) => lp.completed).map((lp) => lp.lessonId);
		return thaiPack.lessons
			.filter((l) => completedIds.includes(l.id))
			.flatMap((l) => l.drills);
	});

	let drillPool = $state<DrillQuestion[]>([]);
	let currentDrillIndex = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let drillAnswered = $state(false);
	let correctCount = $state(0);
	let totalAnswered = $state(0);
	let sessionActive = $state(false);
	let sessionSize = $state(10);

	const currentDrill = $derived<DrillQuestion | undefined>(drillPool[currentDrillIndex]);
	const isCorrect = $derived(selectedAnswer === currentDrill?.correctIndex);
	const sessionComplete = $derived(totalAnswered >= sessionSize || (sessionActive && currentDrillIndex >= drillPool.length));

	function shuffle<T>(arr: T[]): T[] {
		const shuffled = [...arr];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	function startSession() {
		drillPool = shuffle(availableDrills).slice(0, sessionSize);
		currentDrillIndex = 0;
		selectedAnswer = null;
		drillAnswered = false;
		correctCount = 0;
		totalAnswered = 0;
		sessionActive = true;
	}

	function selectAnswer(index: number) {
		if (drillAnswered) return;
		selectedAnswer = index;
		drillAnswered = true;
		totalAnswered++;
		if (index === currentDrill?.correctIndex) {
			correctCount++;
		}
	}

	function nextDrill() {
		if (currentDrillIndex < drillPool.length - 1) {
			currentDrillIndex++;
			selectedAnswer = null;
			drillAnswered = false;
		}
	}
</script>

<svelte:head>
	<title>Practice — SparkScripts</title>
</svelte:head>

<div class="practice container">
	<h1>Practice</h1>
	<p class="practice__subtitle">Review what you've learned with randomized drills.</p>

	{#if availableDrills.length === 0}
		<div class="empty card">
			<div class="empty__icon">&#127947;</div>
			<h2>Nothing to practice yet!</h2>
			<p>Complete at least one lesson to unlock practice drills.</p>
			<a href="/learn" class="btn btn--primary btn--large">Start Learning</a>
		</div>
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
				Start Practice Session ({Math.min(sessionSize, availableDrills.length)} questions)
			</button>
		</div>
	{:else if sessionComplete}
		<div class="results card">
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
	{:else if currentDrill}
		<div class="session">
			<div class="session__header">
				<div class="progress-bar" style="flex:1">
					<div class="progress-bar__fill" style="width: {(totalAnswered / sessionSize) * 100}%"></div>
				</div>
				<span class="session__count">{totalAnswered + 1} / {Math.min(sessionSize, drillPool.length)}</span>
			</div>

			<div class="drill">
				<h2 class="drill__prompt">{currentDrill.prompt}</h2>
				<div class="drill__options">
					{#each currentDrill.options as option, i}
						<button
							class="drill__option"
							class:drill__option--selected={selectedAnswer === i}
							class:drill__option--correct={drillAnswered && i === currentDrill.correctIndex}
							class:drill__option--wrong={drillAnswered && selectedAnswer === i && i !== currentDrill.correctIndex}
							onclick={() => selectAnswer(i)}
							disabled={drillAnswered}
						>
							<span class="drill__option-text" class:thai={option.match(/[\u0E00-\u0E7F]/)}>
								{option}
							</span>
						</button>
					{/each}
				</div>
				{#if drillAnswered}
					<div class="drill__feedback" class:drill__feedback--correct={isCorrect} class:drill__feedback--wrong={!isCorrect}>
						{#if isCorrect}
							<strong>Correct!</strong>
						{:else}
							<strong>Not quite.</strong> The answer is: <span class="thai thai--sm">{currentDrill.options[currentDrill.correctIndex]}</span>
						{/if}
					</div>
					<button class="btn btn--primary btn--large btn--full" onclick={nextDrill}>
						{currentDrillIndex < drillPool.length - 1 && totalAnswered < sessionSize ? 'Next Question →' : 'See Results →'}
					</button>
				{/if}
			</div>

			<div class="session__score">
				Score: {correctCount} / {totalAnswered}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.practice {
		&__subtitle {
			color: $color-text-light;
			margin-top: $space-sm;
			margin-bottom: $space-xl;
		}
	}

	.empty, .start, .results {
		text-align: center;
		padding: $space-3xl;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-lg;
		max-width: 500px;
		margin: 0 auto;

		p {
			color: $color-text-light;
		}
	}

	.empty__icon, .results__emoji {
		font-size: 4rem;
	}

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
			font-size: $font-size-sm;
			color: $color-text-light;
			text-transform: uppercase;
			font-weight: 600;
		}
	}

	.results {
		&__score {
			display: flex;
			flex-direction: column;
			gap: $space-xs;

			&-num {
				font-size: $font-size-3xl;
				font-weight: 800;
				color: $color-success;
			}

			&-label {
				font-size: $font-size-sm;
				color: $color-text-light;
				text-transform: uppercase;
				font-weight: 600;
			}
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
			font-size: $font-size-sm;
			color: $color-text-muted;
			font-weight: 600;
			white-space: nowrap;
		}

		&__score {
			text-align: center;
			font-size: $font-size-sm;
			color: $color-text-muted;
			font-weight: 600;
		}
	}

	.drill {
		display: flex;
		flex-direction: column;
		gap: $space-xl;

		&__prompt {
			text-align: center;
			font-size: $font-size-xl;
		}

		&__options {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: $space-md;
		}

		&__option {
			padding: $space-lg;
			border: 2px solid $color-border;
			border-radius: $radius-lg;
			background: $color-bg-card;
			cursor: pointer;
			transition: all $transition-fast;
			font-family: inherit;
			font-size: $font-size-base;

			&:hover:not(:disabled) {
				border-color: $color-primary;
				background: rgba($color-primary, 0.03);
			}

			&--selected {
				border-color: $color-primary;
			}

			&--correct {
				border-color: $color-success !important;
				background: rgba($color-success, 0.08) !important;
			}

			&--wrong {
				border-color: $color-error !important;
				background: rgba($color-error, 0.08) !important;
			}

			&-text.thai {
				font-size: $font-size-thai;
			}
		}

		&__feedback {
			text-align: center;
			padding: $space-md $space-lg;
			border-radius: $radius-md;

			&--correct {
				background: rgba($color-success, 0.1);
				color: #008c6e;
			}

			&--wrong {
				background: rgba($color-error, 0.1);
				color: #e55655;
			}
		}
	}

	@media (max-width: $bp-sm) {
		.drill__options {
			grid-template-columns: 1fr;
		}
	}
</style>
