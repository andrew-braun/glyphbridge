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
				class={["nav__link", { active: page.url.pathname.startsWith("/learn") }]}
			>
				Learn
			</a>
			<a
				href="/alphabet"
				class={["nav__link", { active: page.url.pathname === "/alphabet" }]}
			>
				Letters <span class="nav__count">{$knownLetters.length}</span>
			</a>
			<a href="/words" class={["nav__link", { active: page.url.pathname === "/words" }]}>
				Words <span class="nav__count">{$knownWords.length}</span>
			</a>
			<a
				href="/practice"
				class={["nav__link", { active: page.url.pathname === "/practice" }]}
			>
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
			align-items: center;
			display: flex;
			height: 60px;
			justify-content: space-between;
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
			align-items: center;
			border-radius: $radius-md;
			color: $color-text-light;
			display: flex;
			font-size: $font-size-sm;
			font-weight: 600;
			gap: $space-xs;
			padding: $space-sm $space-md;
			text-decoration: none;
			transition: all $transition-fast;

			&:hover {
				background: rgba($color-primary, 0.05);
				color: $color-primary;
			}

			&.active {
				background: rgba($color-primary, 0.1);
				color: $color-primary;
			}
		}

		&__count {
			align-items: center;
			background: $color-primary;
			border-radius: $radius-full;
			color: white;
			display: flex;
			font-size: $font-size-xs;
			height: 20px;
			justify-content: center;
			min-width: 20px;
			padding: 0 5px;
		}
	}

	@media (max-width: $bp-sm) {
		.nav__links {
			gap: 0;
		}

		.nav__link {
			font-size: $font-size-xs;
			padding: $space-sm $space-sm;
		}
	}
</style>
