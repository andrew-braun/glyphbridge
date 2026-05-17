<script lang="ts">
	import { page } from "$app/state";
	import ThemeToggle from "$lib/components/ui/ThemeToggle.svelte";
	import { authSession } from "$lib/stores/learner";
	import { knownLetters, knownWords } from "$lib/stores/progress";
	import { theme } from "$lib/stores/theme.svelte";
</script>

<nav class="nav">
	<div class="nav__inner container">
		<a href="/" class="nav__logo">
			<span class="nav__logo-mark">GB</span>
			<span class="nav__logo-copy">
				<span class="nav__logo-spark">Glyph</span><span class="nav__logo-scripts"
					>Bridge</span
				>
			</span>
		</a>

		<div class="nav__cluster">
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
				{#if $authSession.authenticated}
					<form method="POST" action="/auth/sign-out" class="nav__form">
						<button class="nav__link nav__link--button" type="submit">Sign out</button>
					</form>
				{:else}
					<a href="/auth" class={["nav__link", { active: page.url.pathname === "/auth" }]}
						>Sign in</a
					>
				{/if}
			</div>

			<ThemeToggle mode={theme.mode} ontoggle={() => theme.toggle()} />
		</div>
	</div>
</nav>

<style lang="scss">
	.nav {
		background: var(--color-surface-nav);
		border-bottom: 1px solid var(--color-border);
		box-shadow: var(--shadow-soft);
		position: sticky;
		top: 0;
		z-index: 100;

		&__inner {
			align-items: center;
			display: flex;
			gap: $space-lg;
			height: 76px;
			justify-content: space-between;
		}

		&__logo {
			align-items: center;
			display: inline-flex;
			gap: $space-sm;
			text-decoration: none;

			&-mark {
				align-items: center;
				background: var(--color-primary);
				border-radius: 1rem;
				color: white;
				display: inline-flex;
				font-size: 0.75rem;
				font-weight: 800;
				height: 2.4rem;
				justify-content: center;
				letter-spacing: 0.08em;
				text-transform: uppercase;
				width: 2.4rem;
			}

			&-copy {
				display: inline-flex;
				font-size: $font-size-xl;
				font-weight: 800;
			}

			&-spark {
				color: var(--color-primary);
			}

			&-scripts {
				color: var(--color-text);
			}
		}

		&__cluster {
			align-items: center;
			display: flex;
			gap: $space-md;
		}

		&__links {
			align-items: center;
			background: var(--color-surface-muted);
			border: 1px solid var(--color-border);
			border-radius: $radius-full;
			box-shadow: var(--shadow-soft);
			display: flex;
			gap: 0.15rem;
			padding: 0.25rem;
		}

		&__link {
			align-items: center;
			appearance: none;
			background: transparent;
			border: 0;
			border-radius: $radius-full;
			color: var(--color-text-muted);
			cursor: pointer;
			display: flex;
			font: inherit;
			font-size: $font-size-sm;
			font-weight: 600;
			gap: $space-xs;
			padding: 0.65rem 0.9rem;
			text-decoration: none;
			transition:
				background-color $transition-fast,
				color $transition-fast,
				transform $transition-fast;

			&:hover {
				background: rgb(var(--rgb-primary) / 0.12);
				color: var(--color-primary);
				transform: translateY(-1px);
			}

			&.active {
				background: var(--surface-interactive-strong);
				color: var(--color-primary-strong);
			}
		}

		&__form {
			display: contents;
		}

		&__count {
			align-items: center;
			background: var(--color-primary);
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
		.nav__inner {
			height: auto;
			padding-bottom: $space-sm;
			padding-top: $space-sm;
		}

		.nav__cluster {
			align-items: stretch;
			flex-direction: column-reverse;
		}

		.nav__links {
			flex-wrap: wrap;
			justify-content: center;
		}

		.nav__link {
			font-size: $font-size-xs;
			padding: 0.55rem 0.7rem;
		}
	}
</style>
