<script lang="ts">
	import { Dialog } from "bits-ui";

	import { page } from "$app/state";
	import ThemeToggle from "$lib/components/ui/ThemeToggle.svelte";
	import { authSession } from "$lib/stores/learner";
	import { knownLetters, knownWords } from "$lib/stores/progress";
	import { theme } from "$lib/stores/theme.svelte";

	let mobileMenuOpen = $state(false);

	const closeDrawer = () => {
		mobileMenuOpen = false;
	};
</script>

{#snippet navLinks()}
	<a
		href="/learn"
		class={["nav__link", { active: page.url.pathname.startsWith("/learn") }]}
		onclick={closeDrawer}
	>
		Learn
	</a>
	<a
		href="/alphabet"
		class={["nav__link", { active: page.url.pathname === "/alphabet" }]}
		onclick={closeDrawer}
	>
		Letters <span class="nav__count">{$knownLetters.length}</span>
	</a>
	<a
		href="/words"
		class={["nav__link", { active: page.url.pathname === "/words" }]}
		onclick={closeDrawer}
	>
		Words <span class="nav__count">{$knownWords.length}</span>
	</a>
	<a
		href="/practice"
		class={["nav__link", { active: page.url.pathname === "/practice" }]}
		onclick={closeDrawer}
	>
		Practice
	</a>
	{#if $authSession.authenticated}
		<form method="POST" action="/auth/sign-out" class="nav__form">
			<button class="nav__link nav__link--button" type="submit" onclick={closeDrawer}>
				Sign out
			</button>
		</form>
	{:else}
		<a
			href="/auth"
			class={["nav__link", { active: page.url.pathname === "/auth" }]}
			onclick={closeDrawer}
		>
			Sign in
		</a>
	{/if}
{/snippet}

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

		<div class="nav__cluster nav__cluster--desktop">
			<div class="nav__links">
				{@render navLinks()}
			</div>

			<ThemeToggle mode={theme.mode} ontoggle={() => theme.toggle()} />
		</div>

		<Dialog.Root bind:open={mobileMenuOpen}>
			<Dialog.Trigger class="nav__hamburger" aria-label="Open navigation menu">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<line
						x1="4"
						y1="6"
						x2="20"
						y2="6"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<line
						x1="4"
						y1="12"
						x2="20"
						y2="12"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
					<line
						x1="4"
						y1="18"
						x2="20"
						y2="18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay class="nav__drawer-overlay" />
				<Dialog.Content class="nav__drawer">
					<Dialog.Title class="visually-hidden">Navigation Menu</Dialog.Title>
					<div class="nav__drawer-header">
						<Dialog.Close class="nav__drawer-close" aria-label="Close navigation menu">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden="true"
							>
								<line
									x1="6"
									y1="6"
									x2="18"
									y2="18"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
								<line
									x1="18"
									y1="6"
									x2="6"
									y2="18"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</Dialog.Close>
					</div>
					<div class="nav__drawer-links">
						{@render navLinks()}
					</div>
					<div class="nav__drawer-footer">
						<ThemeToggle mode={theme.mode} ontoggle={() => theme.toggle()} />
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
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

			@media (max-width: $bp-sm) {
				height: auto;
				padding-bottom: $space-sm;
				padding-top: $space-sm;
			}
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

		&__cluster--desktop {
			align-items: center;
			display: flex;
			gap: $space-md;

			@media (max-width: $bp-sm) {
				display: none;
			}
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

	:global(.nav__hamburger) {
		align-items: center;
		appearance: none;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: $radius-full;
		color: var(--color-text-muted);
		cursor: pointer;
		display: none;
		height: 44px;
		justify-content: center;
		padding: 0;
		width: 44px;

		&:hover {
			background: rgb(var(--rgb-primary) / 0.12);
			color: var(--color-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
		}

		@media (max-width: $bp-sm) {
			display: flex;
		}
	}

	:global(.nav__drawer-overlay) {
		background: rgb(0 0 0 / 0.6);
		inset: 0;
		position: fixed;
	}

	:global(.nav__drawer) {
		background: var(--color-surface-nav);
		border-left: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: $space-lg;
		height: 100vh;
		overflow-y: auto;
		padding: $space-lg;
		position: fixed;
		right: 0;
		top: 0;
		width: min(280px, 80vw);
	}

	:global(.nav__drawer-header) {
		display: flex;
		justify-content: flex-end;
	}

	:global(.nav__drawer-close) {
		align-items: center;
		appearance: none;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: $radius-full;
		color: var(--color-text-muted);
		cursor: pointer;
		display: flex;
		height: 44px;
		justify-content: center;
		padding: 0;
		width: 44px;

		&:hover {
			background: rgb(var(--rgb-primary) / 0.12);
			color: var(--color-primary);
		}

		&:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
		}
	}

	:global(.nav__drawer-links) {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: $space-xs;

		:global(.nav__link) {
			border-radius: $radius-md;
			font-size: $font-size-base;
			min-height: 44px;
			padding: 0.75rem 1rem;
		}

		:global(.nav__form) {
			display: block;

			:global(.nav__link--button) {
				width: 100%;
			}
		}
	}

	:global(.nav__drawer-footer) {
		border-top: 1px solid var(--color-border);
		padding-top: $space-md;
	}
</style>
