<script lang="ts">
	import type { PageData } from './$types';
	import type { DrillQuestion } from '$lib/data/types';
	import { completeLesson, isLessonCompleted, progress } from '$lib/stores/progress';
	import { goto } from '$app/navigation';
	import { thaiPack } from '$lib/data/thai';

	let { data }: { data: PageData } = $props();
	const lesson = $derived(data.lesson);

	// Lesson flow steps
	type Step = 'intro' | 'breakdown' | 'letters' | 'rules' | 'drills' | 'complete';
	const stepOrder: Step[] = ['intro', 'breakdown', 'letters', 'rules', 'drills', 'complete'];

	let currentStepIndex = $state(0);
	let currentStep = $derived(stepOrder[currentStepIndex]);

	// Letter teaching state
	let currentLetterIndex = $state(0);

	// Rule teaching state
	let currentRuleIndex = $state(0);

	// Drill state
	let currentDrillIndex = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let drillAnswered = $state(false);
	let correctCount = $state(0);
	let wrongAnswers = $state<number[]>([]);

	const currentDrill = $derived<DrillQuestion | undefined>(lesson.drills[currentDrillIndex]);
	const isCorrect = $derived(selectedAnswer === currentDrill?.correctIndex);

	function nextStep() {
		if (currentStepIndex < stepOrder.length - 1) {
			currentStepIndex++;
			// Reset sub-states
			currentLetterIndex = 0;
			currentRuleIndex = 0;
			currentDrillIndex = 0;
			selectedAnswer = null;
			drillAnswered = false;
		}
	}

	function nextLetter() {
		if (currentLetterIndex < lesson.newLetters.length - 1) {
			currentLetterIndex++;
		} else {
			nextStep();
		}
	}

	function nextRule() {
		if (currentRuleIndex < lesson.rulesIntroduced.length - 1) {
			currentRuleIndex++;
		} else {
			nextStep();
		}
	}

	function selectDrillAnswer(index: number) {
		if (drillAnswered) return;
		selectedAnswer = index;
		drillAnswered = true;
		if (index === currentDrill?.correctIndex) {
			correctCount++;
		} else {
			wrongAnswers = [...wrongAnswers, currentDrillIndex];
		}
	}

	function nextDrill() {
		if (currentDrillIndex < lesson.drills.length - 1) {
			currentDrillIndex++;
			selectedAnswer = null;
			drillAnswered = false;
		} else {
			// Drills done — complete the lesson
			const score = Math.round((correctCount / lesson.drills.length) * 100);
			completeLesson(lesson.id, score);
			nextStep();
		}
	}

	function goToNextLesson() {
		const next = thaiPack.lessons.find((l) => l.id > lesson.id);
		if (next) {
			goto(`/learn/${next.id}`);
		} else {
			goto('/learn');
		}
	}

	const progressPercent = $derived(((currentStepIndex) / (stepOrder.length - 1)) * 100);
</script>

<svelte:head>
	<title>{lesson.title} — SparkScripts</title>
</svelte:head>

<div class="lesson container">
	<!-- Progress bar -->
	<div class="lesson__progress">
		<a href="/learn" class="btn btn--ghost">&larr; Lessons</a>
		<div class="progress-bar" style="flex:1">
			<div class="progress-bar__fill" style="width: {progressPercent}%"></div>
		</div>
		<span class="lesson__step-label">{currentStepIndex + 1} / {stepOrder.length}</span>
	</div>

	<!-- STEP: Intro — Show the word -->
	{#if currentStep === 'intro'}
		<div class="step step--intro">
			<span class="badge badge--primary">Stage {lesson.stage}</span>
			<h1 class="step__title">{lesson.title}</h1>
			<div class="word-reveal">
				<div class="word-reveal__thai thai thai--lg">{lesson.anchorWord.thai}</div>
				<p class="word-reveal__hint">Can you guess what this says?</p>
			</div>
			{#if lesson.anchorWord.contextNote}
				<div class="context-note card card--flat">
					<p>{lesson.anchorWord.contextNote}</p>
				</div>
			{/if}
			<button class="btn btn--primary btn--large btn--full" onclick={nextStep}>
				Show Me the Breakdown &rarr;
			</button>
		</div>

	<!-- STEP: Breakdown -->
	{:else if currentStep === 'breakdown'}
		<div class="step step--breakdown">
			<h2>Breaking down: <span class="thai">{lesson.anchorWord.thai}</span></h2>
			<div class="breakdown">
				<div class="breakdown__word thai thai--lg">{lesson.anchorWord.thai}</div>
				<div class="breakdown__arrow">&darr;</div>
				<div class="breakdown__syllables">
					{#each lesson.anchorWord.syllables as syllable}
						<div class="syllable-card card">
							<span class="syllable-card__thai thai">{syllable.thai}</span>
							<span class="syllable-card__sound">{syllable.sound}</span>
						</div>
					{/each}
				</div>
				<div class="breakdown__full">
					<span class="breakdown__pronunciation">{lesson.anchorWord.pronunciation}</span>
					<span class="breakdown__meaning">= "{lesson.anchorWord.meaning}"</span>
				</div>
			</div>
			<button class="btn btn--primary btn--large btn--full" onclick={nextStep}>
				Learn the New Letters &rarr;
			</button>
		</div>

	<!-- STEP: Letters -->
	{:else if currentStep === 'letters'}
		{@const letter = lesson.newLetters[currentLetterIndex]}
		<div class="step step--letters">
			<div class="step__counter">
				Letter {currentLetterIndex + 1} of {lesson.newLetters.length}
			</div>
			<div class="letter-intro">
				<div class="letter-intro__char thai" style="font-size: 5rem; line-height: 1;">
					{letter.character}
				</div>
				<div class="letter-intro__details">
					<div class="letter-intro__row">
						<span class="letter-intro__label">Sound</span>
						<span class="letter-intro__value">{letter.romanization}</span>
					</div>
					<div class="letter-intro__row">
						<span class="letter-intro__label">Pronunciation</span>
						<span class="letter-intro__value">{letter.pronunciation}</span>
					</div>
					<div class="letter-intro__row">
						<span class="letter-intro__label">Type</span>
						<span class="letter-intro__value badge badge--primary">{letter.type}{letter.class ? ` (${letter.class} class)` : ''}</span>
					</div>
					{#if letter.position && letter.position !== 'standalone'}
						<div class="letter-intro__row">
							<span class="letter-intro__label">Position</span>
							<span class="letter-intro__value">Written {letter.position} the consonant</span>
						</div>
					{/if}
				</div>
				<div class="letter-intro__mnemonic card card--flat">
					<strong>Remember:</strong> {letter.mnemonic}
				</div>
			</div>
			<button class="btn btn--primary btn--large btn--full" onclick={nextLetter}>
				{currentLetterIndex < lesson.newLetters.length - 1 ? 'Next Letter →' : 'Learn the Rules →'}
			</button>
		</div>

	<!-- STEP: Rules -->
	{:else if currentStep === 'rules'}
		{@const rule = lesson.rulesIntroduced[currentRuleIndex]}
		<div class="step step--rules">
			<div class="step__counter">
				Rule {currentRuleIndex + 1} of {lesson.rulesIntroduced.length}
			</div>
			<div class="rule-card">
				<h2>{rule.name}</h2>
				<p class="rule-card__short">{rule.shortDescription}</p>
				<div class="rule-card__explanation card card--flat">
					<p>{rule.explanation}</p>
				</div>
				<div class="rule-card__examples">
					<h4>Examples:</h4>
					{#each rule.examples as example}
						<div class="rule-card__example">
							<span class="thai thai--sm">{example.split(' ')[0]}</span>
							<span>{example}</span>
						</div>
					{/each}
				</div>
			</div>
			<button class="btn btn--primary btn--large btn--full" onclick={nextRule}>
				{currentRuleIndex < lesson.rulesIntroduced.length - 1 ? 'Next Rule →' : 'Start Drills →'}
			</button>
		</div>

	<!-- STEP: Drills -->
	{:else if currentStep === 'drills'}
		{#if currentDrill}
			<div class="step step--drills">
				<div class="step__counter">
					Drill {currentDrillIndex + 1} of {lesson.drills.length}
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
								onclick={() => selectDrillAnswer(i)}
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
							{currentDrillIndex < lesson.drills.length - 1 ? 'Next Question →' : 'See Results →'}
						</button>
					{/if}
				</div>
			</div>
		{/if}

	<!-- STEP: Complete -->
	{:else if currentStep === 'complete'}
		<div class="step step--complete">
			<div class="complete-card">
				<div class="complete-card__emoji">&#127881;</div>
				<h1>Lesson Complete!</h1>
				<p class="complete-card__word">
					You learned: <span class="thai">{lesson.anchorWord.thai}</span>
					({lesson.anchorWord.meaning})
				</p>
				<div class="complete-card__score">
					<span class="complete-card__score-num">{correctCount}/{lesson.drills.length}</span>
					<span class="complete-card__score-label">Drills Correct</span>
				</div>
				<div class="complete-card__letters">
					<h3>New letters learned:</h3>
					<div class="complete-card__letter-grid">
						{#each lesson.newLetters as letter}
							<div class="complete-card__letter">
								<span class="thai" style="font-size:2.5rem">{letter.character}</span>
								<span>{letter.romanization}</span>
							</div>
						{/each}
					</div>
				</div>
				<div class="complete-card__actions">
					{#if thaiPack.lessons.find(l => l.id > lesson.id)}
						<button class="btn btn--primary btn--large" onclick={goToNextLesson}>
							Next Lesson &rarr;
						</button>
					{:else}
						<a href="/practice" class="btn btn--primary btn--large">
							Practice What You've Learned
						</a>
					{/if}
					<a href="/learn" class="btn btn--secondary btn--large">All Lessons</a>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.lesson {
		&__progress {
			display: flex;
			align-items: center;
			gap: $space-md;
			margin-bottom: $space-xl;
		}

		&__step-label {
			font-size: $font-size-sm;
			color: $color-text-muted;
			font-weight: 600;
			white-space: nowrap;
		}
	}

	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		max-width: 640px;
		margin: 0 auto;
		animation: fadeIn 300ms ease;

		&__counter {
			font-size: $font-size-sm;
			color: $color-text-muted;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		&__title {
			font-size: $font-size-2xl;
		}
	}

	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	// Word reveal
	.word-reveal {
		text-align: center;
		padding: $space-2xl;
		background: linear-gradient(135deg, rgba($color-primary, 0.04), rgba($color-accent, 0.04));
		border-radius: $radius-xl;

		&__thai {
			color: $color-primary;
		}

		&__hint {
			margin-top: $space-md;
			color: $color-text-light;
			font-style: italic;
		}
	}

	.context-note {
		font-size: $font-size-sm;
		color: $color-text-light;
		line-height: 1.6;
	}

	// Breakdown
	.breakdown {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-lg;

		&__word {
			color: $color-primary;
		}

		&__arrow {
			font-size: $font-size-2xl;
			color: $color-text-muted;
		}

		&__syllables {
			display: flex;
			gap: $space-md;
			flex-wrap: wrap;
			justify-content: center;
		}

		&__full {
			display: flex;
			flex-direction: column;
			gap: $space-xs;
		}

		&__pronunciation {
			font-size: $font-size-xl;
			font-weight: 600;
			color: $color-primary;
		}

		&__meaning {
			color: $color-text-light;
			font-size: $font-size-lg;
		}
	}

	.syllable-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-sm;
		padding: $space-lg $space-xl;

		&__thai {
			color: $color-primary;
		}

		&__sound {
			font-size: $font-size-sm;
			color: $color-text-light;
			font-weight: 500;
		}
	}

	// Letter intro
	.letter-intro {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-xl;
		text-align: center;

		&__char {
			color: $color-primary;
			background: rgba($color-primary, 0.06);
			width: 140px;
			height: 140px;
			border-radius: $radius-xl;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__details {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			width: 100%;
		}

		&__row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: $space-sm 0;
			border-bottom: 1px solid $color-border;
		}

		&__label {
			font-weight: 600;
			color: $color-text-light;
			font-size: $font-size-sm;
		}

		&__value {
			font-weight: 500;
		}

		&__mnemonic {
			width: 100%;
			text-align: left;
			font-size: $font-size-sm;
			line-height: 1.6;
		}
	}

	// Rule card
	.rule-card {
		display: flex;
		flex-direction: column;
		gap: $space-md;

		&__short {
			font-size: $font-size-lg;
			color: $color-primary;
			font-weight: 500;
		}

		&__explanation {
			line-height: 1.7;
		}

		&__examples {
			display: flex;
			flex-direction: column;
			gap: $space-sm;

			h4 {
				color: $color-text-light;
				font-size: $font-size-sm;
				text-transform: uppercase;
				letter-spacing: 0.05em;
			}
		}

		&__example {
			display: flex;
			align-items: center;
			gap: $space-md;
			padding: $space-sm $space-md;
			background: rgba($color-primary, 0.04);
			border-radius: $radius-md;
			font-size: $font-size-sm;
		}
	}

	// Drills
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
			font-family: $font-body;
			font-size: $font-size-base;

			&:hover:not(:disabled) {
				border-color: $color-primary;
				background: rgba($color-primary, 0.03);
			}

			&--selected {
				border-color: $color-primary;
				background: rgba($color-primary, 0.05);
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
			font-size: $font-size-lg;

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

	// Complete
	.complete-card {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: $space-xl;

		&__emoji {
			font-size: 4rem;
		}

		&__word {
			font-size: $font-size-lg;
			color: $color-text-light;
		}

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
				letter-spacing: 0.05em;
			}
		}

		&__letters {
			width: 100%;

			h3 {
				margin-bottom: $space-md;
			}
		}

		&__letter-grid {
			display: flex;
			gap: $space-lg;
			justify-content: center;
			flex-wrap: wrap;
		}

		&__letter {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $space-xs;
			padding: $space-md;
			background: rgba($color-primary, 0.06);
			border-radius: $radius-lg;
			min-width: 80px;
		}

		&__actions {
			display: flex;
			gap: $space-md;
			flex-wrap: wrap;
			justify-content: center;
		}
	}

	@media (max-width: $bp-sm) {
		.drill__options {
			grid-template-columns: 1fr;
		}
	}
</style>
