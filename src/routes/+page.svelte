<script lang="ts">
	import { knownLetters, knownWords, currentLessonId, totalLessons } from '$lib/stores/progress';
	import { thaiPack } from '$lib/data/thai';
</script>

<svelte:head>
	<title>SparkScripts — Learn Thai Through Real Words</title>
</svelte:head>

<div class="home container">
	<section class="hero">
		<span class="hero__badge badge badge--primary">Thai Script</span>
		<h1 class="hero__title">
			Learn to read Thai<br />
			<span class="hero__highlight">one word at a time</span>
		</h1>
		<p class="hero__subtitle">
			Don't memorize an alphabet chart. Learn real words you'll see on streets, menus, and signs — and pick up the letters naturally.
		</p>
		<div class="hero__actions">
			<a href="/learn" class="btn btn--primary btn--large">
				{$currentLessonId === 1 && $knownLetters.length === 0 ? 'Start Learning' : 'Continue Learning'}
			</a>
			{#if $knownLetters.length > 0}
				<a href="/practice" class="btn btn--secondary btn--large">Practice</a>
			{/if}
		</div>
	</section>

	{#if $knownLetters.length > 0}
		<section class="stats">
			<div class="stat-card card">
				<span class="stat-card__number">{$knownLetters.length}</span>
				<span class="stat-card__label">Letters Learned</span>
				<div class="stat-card__preview thai thai--sm">
					{$knownLetters.join(' ')}
				</div>
			</div>
			<div class="stat-card card">
				<span class="stat-card__number">{$knownWords.length}</span>
				<span class="stat-card__label">Words Known</span>
				<div class="stat-card__preview thai thai--sm">
					{$knownWords.map(w => w.thai).join(' ')}
				</div>
			</div>
			<div class="stat-card card">
				<span class="stat-card__number">{$currentLessonId - 1}/{totalLessons}</span>
				<span class="stat-card__label">Lessons Complete</span>
				<div class="progress-bar">
					<div class="progress-bar__fill" style="width: {(($currentLessonId - 1) / totalLessons) * 100}%"></div>
				</div>
			</div>
		</section>
	{/if}

	<section class="method">
		<h2 class="method__title">How it works</h2>
		<div class="method__steps">
			<div class="method__step">
				<div class="method__step-num">1</div>
				<h3>See a real word</h3>
				<p>Each lesson starts with a word you'd actually see in Thailand — on a sign, menu, or map.</p>
			</div>
			<div class="method__step">
				<div class="method__step-num">2</div>
				<h3>Break it down</h3>
				<p>We show you how the word splits into syllables and which letters make which sounds.</p>
			</div>
			<div class="method__step">
				<div class="method__step-num">3</div>
				<h3>Learn the letters</h3>
				<p>Only 1-3 new letters per lesson. Each one comes with a memory trick and examples.</p>
			</div>
			<div class="method__step">
				<div class="method__step-num">4</div>
				<h3>Practice & drill</h3>
				<p>Quick drills using only letters you know. Builds real pattern recognition.</p>
			</div>
		</div>
	</section>

	<section class="upcoming">
		<h2>Your Lessons</h2>
		<div class="lesson-list">
			{#each thaiPack.lessons as lesson}
				{@const isCompleted = $knownWords.some(w => w.thai === lesson.anchorWord.thai)}
				{@const isCurrent = lesson.id === $currentLessonId}
				{@const isLocked = lesson.id > $currentLessonId}
				<a
					href={isLocked ? '#' : `/learn/${lesson.id}`}
					class="lesson-item card"
					class:lesson-item--completed={isCompleted}
					class:lesson-item--current={isCurrent}
					class:lesson-item--locked={isLocked}
				>
					<div class="lesson-item__status">
						{#if isCompleted}
							<span class="lesson-item__check">&#10003;</span>
						{:else if isCurrent}
							<span class="lesson-item__dot"></span>
						{:else}
							<span class="lesson-item__lock">&#128274;</span>
						{/if}
					</div>
					<div class="lesson-item__content">
						<span class="lesson-item__stage badge badge--primary">Stage {lesson.stage}</span>
						<h3 class="lesson-item__title">{lesson.title}</h3>
						<span class="lesson-item__word thai thai--sm">{lesson.anchorWord.thai}</span>
						<span class="lesson-item__meaning">{lesson.anchorWord.meaning}</span>
					</div>
					<div class="lesson-item__letters">
						{#each lesson.newLetters as letter}
							<span class="lesson-item__letter thai thai--sm">{letter.character}</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>

<style lang="scss">
	.home {
		display: flex;
		flex-direction: column;
		gap: $space-3xl;
	}

	// Hero
	.hero {
		text-align: center;
		padding: $space-3xl 0 $space-xl;

		&__title {
			font-size: $font-size-4xl;
			margin-top: $space-md;
			line-height: 1.1;
		}

		&__highlight {
			background: linear-gradient(135deg, $color-primary, $color-accent);
			-webkit-background-clip: text;
			-webkit-text-fill-color: transparent;
			background-clip: text;
		}

		&__subtitle {
			margin-top: $space-lg;
			font-size: $font-size-lg;
			color: $color-text-light;
			max-width: 560px;
			margin-left: auto;
			margin-right: auto;
		}

		&__actions {
			margin-top: $space-xl;
			display: flex;
			gap: $space-md;
			justify-content: center;
		}
	}

	// Stats
	.stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: $space-lg;
	}

	.stat-card {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: $space-sm;

		&__number {
			font-size: $font-size-3xl;
			font-weight: 800;
			color: $color-primary;
		}

		&__label {
			font-size: $font-size-sm;
			color: $color-text-light;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		&__preview {
			color: $color-text-muted;
			margin-top: $space-xs;
		}
	}

	// Method
	.method {
		&__title {
			text-align: center;
			margin-bottom: $space-xl;
		}

		&__steps {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: $space-lg;
		}

		&__step {
			text-align: center;

			h3 {
				margin-top: $space-sm;
				font-size: $font-size-base;
			}

			p {
				margin-top: $space-xs;
				font-size: $font-size-sm;
				color: $color-text-light;
			}
		}

		&__step-num {
			width: 40px;
			height: 40px;
			border-radius: $radius-full;
			background: $color-primary;
			color: white;
			font-weight: 700;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: $font-size-lg;
		}
	}

	// Lesson list
	.lesson-list {
		display: flex;
		flex-direction: column;
		gap: $space-md;
	}

	.lesson-item {
		display: flex;
		align-items: center;
		gap: $space-lg;
		padding: $space-lg $space-xl;
		text-decoration: none;
		color: inherit;
		transition: all $transition-base;

		&--completed {
			border-left: 4px solid $color-success;
		}

		&--current {
			border-left: 4px solid $color-primary;
			box-shadow: $shadow-lg;
		}

		&--locked {
			opacity: 0.5;
			cursor: not-allowed;

			&:hover {
				box-shadow: $shadow-md;
			}
		}

		&__status {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__check {
			color: $color-success;
			font-size: $font-size-xl;
			font-weight: 700;
		}

		&__dot {
			width: 14px;
			height: 14px;
			border-radius: $radius-full;
			background: $color-primary;
			animation: pulse 2s ease-in-out infinite;
		}

		&__lock {
			font-size: $font-size-lg;
		}

		&__content {
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: $space-xs;
		}

		&__title {
			font-size: $font-size-lg;
		}

		&__word {
			color: $color-primary;
		}

		&__meaning {
			color: $color-text-light;
			font-size: $font-size-sm;
		}

		&__letters {
			display: flex;
			gap: $space-sm;
		}

		&__letter {
			width: 44px;
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba($color-primary, 0.08);
			border-radius: $radius-md;
			color: $color-primary;
			font-size: $font-size-xl;
		}
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	@media (max-width: $bp-md) {
		.hero__title {
			font-size: $font-size-2xl;
		}

		.stats {
			grid-template-columns: 1fr;
		}

		.method__steps {
			grid-template-columns: repeat(2, 1fr);
		}

		.lesson-item__letters {
			display: none;
		}
	}
</style>
