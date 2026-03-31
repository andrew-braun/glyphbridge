<script lang="ts">
	// SvelteKit page state used for determining the active nav link
	import { page } from '$app/state';
	// Progress stores supply the counts displayed as badges next to nav links
	import { knownLetters, knownWords } from '$lib/stores/progress';
</script>

<!--
  Nav Component
  Top-level sticky navigation bar rendered on every page via the root layout.
  - Logo links back to the home page.
  - Four nav links: Learn, Letters, Words, Practice.
  - Letters and Words links display a live count badge from the progress stores.
  - Active state is determined by matching the current URL pathname:
    "/learn" uses startsWith() so it highlights for all lesson sub-routes,
    while the others use exact equality.
-->
<nav class="nav">
	<div class="nav__inner container">
		<a href="/" class="nav__logo">
			<span class="nav__logo-spark">Spark</span><span class="nav__logo-scripts">Scripts</span>
		</a>

		<div class="nav__links">
			<!-- Learn uses startsWith so /learn/1, /learn/2, etc. all highlight this link -->
		<a href="/learn" class="nav__link" class:active={page.url.pathname.startsWith('/learn')}>
				Learn
			</a>
			<!-- Badge shows how many letters the user knows -->
		<a href="/alphabet" class="nav__link" class:active={page.url.pathname === '/alphabet'}>
				Letters <span class="nav__count">{$knownLetters.length}</span>
			</a>
			<!-- Badge shows how many words the user knows -->
		<a href="/words" class="nav__link" class:active={page.url.pathname === '/words'}>
				Words <span class="nav__count">{$knownWords.length}</span>
			</a>
			<a href="/practice" class="nav__link" class:active={page.url.pathname === '/practice'}>
				Practice
			</a>
		</div>
	</div>
</nav>

<style lang="scss">
	/* ========================================
	   Nav component styles
	   ======================================== */

	// Sticky top bar with card background and bottom border
	.nav {
		background: $color-bg-card;
		border-bottom: 1px solid $color-border;
		position: sticky;
		top: 0;
		z-index: 100;

		&__inner {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 60px;
		}

		&__logo {
			font-size: $font-size-xl;
			font-weight: 800;
			text-decoration: none;

			&-spark {
				color: $color-primary;
			}

			&-scripts {
				color: $color-text;
			}
		}

		&__links {
			display: flex;
			gap: $space-xs;
		}

		&__link {
			display: flex;
			align-items: center;
			gap: $space-xs;
			padding: $space-sm $space-md;
			font-size: $font-size-sm;
			font-weight: 600;
			color: $color-text-light;
			text-decoration: none;
			border-radius: $radius-md;
			transition: all $transition-fast;

			&:hover {
				color: $color-primary;
				background: rgba($color-primary, 0.05);
			}

			&.active {
				color: $color-primary;
				background: rgba($color-primary, 0.1);
			}
		}

		// Circular pill badge showing a numeric count next to link text
		&__count {
			background: $color-primary;
			color: white;
			font-size: $font-size-xs;
			min-width: 20px;
			height: 20px;
			border-radius: $radius-full;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 5px;
		}
	}

	// Mobile: tighten spacing and shrink font size to fit all links
	@media (max-width: $bp-sm) {
		.nav__links {
			gap: 0;
		}

		.nav__link {
			padding: $space-sm $space-sm;
			font-size: $font-size-xs;
		}
	}
</style>
