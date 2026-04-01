<!--
  HeroSection.svelte — Landing page hero
  ========================================
  The first thing a user sees. Shows the app tagline, a brief
  description of the learning method, and a CTA to start or
  continue learning. Adjusts CTA text based on whether the
  user has any progress.
-->
<script lang="ts">
	import { knownLetters, currentLessonId } from '$lib/stores/progress';
</script>

<section class="hero">
	<span class="hero__badge badge badge--primary">Thai Script</span>
	<h1 class="hero__title">
		Learn to read Thai<br />
		<span class="hero__highlight">one word at a time</span>
	</h1>
	<p class="hero__subtitle">
		Don't memorize an alphabet chart. Learn real words you'll see on streets,
		menus, and signs — and pick up the letters naturally.
	</p>
	<div class="hero__actions">
		<!-- CTA text adapts: "Start" for new users, "Continue" for returning users -->
		<a href="/learn" class="btn btn--primary btn--large">
			{$currentLessonId === 1 && $knownLetters.length === 0 ? 'Start Learning' : 'Continue Learning'}
		</a>
		{#if $knownLetters.length > 0}
			<a href="/practice" class="btn btn--secondary btn--large">Practice</a>
		{/if}
	</div>
</section>

<style lang="scss">
	.hero {
		text-align: center;
		padding: $space-3xl 0 $space-xl;

		&__title {
			font-size: $font-size-4xl;
			margin-top: $space-md;
			line-height: 1.1;
		}

		// Gradient text effect for the highlighted phrase
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

	@media (max-width: $bp-md) {
		.hero__title {
			font-size: $font-size-2xl;
		}
	}
</style>
