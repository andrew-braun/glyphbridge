<script lang="ts">
	import { page } from "$app/state";
	import { knownLetters, knownWords } from "$lib/stores/progress";
</script>

<nav class="nav">
	<div class="nav__inner container">
		<a href="/" class="nav__logo">
			<span class="nav__logo-spark">Glyph</span><span class="nav__logo-scripts">Bridge</span>
		</a>

		<div class="nav__links">
			<a
				href="/learn"
				class="nav__link"
				class:active={page.url.pathname.startsWith("/learn")}
			>
				Learn
			</a>
			<a href="/alphabet" class="nav__link" class:active={page.url.pathname === "/alphabet"}>
				Letters <span class="nav__count">{$knownLetters.length}</span>
			</a>
			<a href="/words" class="nav__link" class:active={page.url.pathname === "/words"}>
				Words <span class="nav__count">{$knownWords.length}</span>
			</a>
			<a href="/practice" class="nav__link" class:active={page.url.pathname === "/practice"}>
				Practice
			</a>
		</div>
	</div>
</nav>

<style lang="scss">
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
