<!--
  MethodExplainer.svelte — "How it works" section
  =================================================
  Four-step visual explainer showing the learning methodology:
    1. See a real word → 2. Break it down → 3. Learn the letters → 4. Practice

  Each step has a numbered circle, heading, and brief description.
  This builds trust and sets expectations for new users.
-->

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

<style lang="scss">
	.method {
		&__title {
			text-align: center;
			margin-bottom: $space-xl;
		}

		// Four-column grid of steps (collapses to 2×2 on mobile)
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

		// Numbered circle icon
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

	@media (max-width: $bp-md) {
		.method__steps {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
