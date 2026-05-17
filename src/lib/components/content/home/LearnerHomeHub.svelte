<script lang="ts">
	import GlyphOrbit from "$lib/components/illustrations/GlyphOrbit.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";

	interface Props {
		authenticated: boolean;
		currentLessonId: number;
		hasPractice: boolean;
		knownLetterCount: number;
		knownWordCount: number;
		totalLessons: number;
	}

	let {
		authenticated,
		currentLessonId,
		hasPractice,
		knownLetterCount,
		knownWordCount,
		totalLessons,
	}: Props = $props();

	const completedLessons = $derived(Math.max(0, currentLessonId - 1));
	const completionCopy = $derived(
		completedLessons > 0
			? `You have finished ${completedLessons} of ${totalLessons} Thai lessons.`
			: `Lesson ${currentLessonId} is ready whenever you are.`,
	);
</script>

<section class="learner-home card">
	<Reveal class="learner-home__copy" delay={40}>
		<span class={["badge", authenticated ? "badge--success" : "badge--primary"]}>
			{authenticated ? "Welcome back" : "Saved on this device"}
		</span>
		<Heading as="h1" class="learner-home__title">Pick up exactly where you left off.</Heading>
		<p class="learner-home__lead">
			{completionCopy}
			{#if authenticated}
				Your account can keep this progress in sync across devices.
			{:else}
				You can keep going without signing in, then attach this progress to an account
				later.
			{/if}
		</p>

		<div class="learner-home__actions">
			<Button href={`/learn/${currentLessonId}`} variant="primary" size="large">
				Continue lesson {currentLessonId}
			</Button>
			{#if hasPractice}
				<Button href="/practice" variant="secondary" size="large"
					>Practice known words</Button
				>
			{/if}
		</div>

		<div class="learner-home__stats">
			<div>
				<span class="learner-home__stat-value">{knownLetterCount}</span>
				<span class="learner-home__stat-label">letters unlocked</span>
			</div>
			<div>
				<span class="learner-home__stat-value">{knownWordCount}</span>
				<span class="learner-home__stat-label">words recognized</span>
			</div>
			<div>
				<span class="learner-home__stat-value">Thai</span>
				<span class="learner-home__stat-label">current language</span>
			</div>
		</div>
	</Reveal>

	<Reveal class="learner-home__panel" delay={180} distance={22}>
		<div class="learner-home__orbit">
			<GlyphOrbit />
		</div>
		<div class="learner-home__aside card card--flat">
			<span class="badge badge--accent">Next step</span>
			<h2>Lesson {currentLessonId}</h2>
			<p>
				Jump straight back into the next reading loop, or browse the lesson map if you want
				a different checkpoint.
			</p>
			<Button href="/learn" variant="ghost">Browse lesson map</Button>
		</div>
	</Reveal>
</section>

<style lang="scss">
	.learner-home {
		align-items: center;
		background: var(--color-surface-card);
		display: grid;
		gap: $space-xl;
		grid-template-columns: minmax(0, 1.1fr) minmax(16rem, 0.9fr);
		padding: clamp($space-xl, 4vw, $space-3xl);

		:global(.learner-home__copy) {
			display: flex;
			flex-direction: column;
			gap: $space-lg;
		}

		:global(.learner-home__title) {
			font-size: clamp(2.25rem, 4.5vw, 4rem);
			line-height: 1.02;
			margin-bottom: 0;
		}

		&__lead {
			color: var(--color-text-muted);
			font-size: $font-size-lg;
			max-width: 42rem;
		}

		&__actions {
			display: flex;
			flex-wrap: wrap;
			gap: $space-md;
		}

		&__stats {
			display: grid;
			gap: $space-md;
			grid-template-columns: repeat(3, minmax(0, 1fr));

			div {
				background: rgb(var(--rgb-primary) / 0.08);
				border: 1px solid rgb(var(--rgb-primary) / 0.14);
				border-radius: $radius-lg;
				display: flex;
				flex-direction: column;
				gap: 0.15rem;
				padding: 0.9rem 1rem;
			}
		}

		&__stat-value {
			color: var(--color-text);
			font-size: $font-size-xl;
			font-weight: 800;
		}

		&__stat-label {
			color: var(--color-text-soft);
			font-size: $font-size-xs;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		:global(.learner-home__panel) {
			display: flex;
			flex-direction: column;
			gap: $space-lg;
			width: 100%;
		}

		&__orbit {
			align-self: center;
			max-width: 18rem;
			width: 100%;
		}

		&__aside {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
		}

		&__aside p {
			color: var(--color-text-muted);
		}
	}

	@media (max-width: $bp-lg) {
		.learner-home {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: $bp-sm) {
		.learner-home__actions {
			flex-direction: column;
		}

		.learner-home__stats {
			grid-template-columns: 1fr;
		}
	}
</style>
