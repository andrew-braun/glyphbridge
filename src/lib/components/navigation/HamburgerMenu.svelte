<script lang="ts">
	import { Dialog } from "bits-ui";
	import type { Snippet } from "svelte";

	interface Props {
		links: Snippet<[(event?: Event) => void]>;
		footer: Snippet;
	}

	let { links, footer }: Props = $props();

	let mobileMenuOpen = $state(false);

	const closeDrawer = (_event?: Event) => {
		mobileMenuOpen = false;
	};
</script>

<Dialog.Root bind:open={mobileMenuOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<button {...props} class="nav__hamburger" aria-label="Open navigation menu">
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
			</button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open })}
				<div
					{...props}
					class="nav__drawer-overlay"
					style:pointer-events={open ? "auto" : "none"}
					aria-hidden="true"
				></div>
			{/snippet}
		</Dialog.Overlay>
		<Dialog.Content forceMount>
			{#snippet child({ props, open })}
				<div {...props} class="nav__drawer" aria-hidden={open ? undefined : "true"}>
					<Dialog.Title class="visually-hidden">Navigation Menu</Dialog.Title>
					<div class="nav__drawer-header">
						<Dialog.Close>
							{#snippet child({ props })}
								<button
									{...props}
									class="nav__drawer-close"
									aria-label="Close navigation menu"
								>
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
								</button>
							{/snippet}
						</Dialog.Close>
					</div>
					<div class="nav__drawer-links">
						{@render links(closeDrawer)}
					</div>
					<div class="nav__drawer-footer">
						{@render footer()}
					</div>
				</div>
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style lang="scss">
	.nav__hamburger {
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

	.nav__drawer-overlay {
		background: rgb(0 0 0 / 0.6);
		inset: 0;
		opacity: 0;
		position: fixed;
		transition: opacity 200ms ease;

		&[data-state="open"] {
			opacity: 1;
		}
	}

	.nav__drawer {
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
		transform: translateX(100%);
		transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
		width: min(280px, 80vw);
		will-change: transform;

		&[data-state="open"] {
			transform: translateX(0);
		}

		.nav__drawer-header {
			display: flex;
			justify-content: flex-end;

			.nav__drawer-close {
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
		}

		.nav__drawer-links {
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: $space-xs;
			--nav-form-display: block;
			--nav-link-button-width: 100%;
			--nav-link-font-size: #{$font-size-base};
			--nav-link-min-height: 44px;
			--nav-link-padding: 0.75rem 1rem;
			--nav-link-radius: #{$radius-md};
		}

		.nav__drawer-footer {
			border-top: 1px solid var(--color-border);
			padding-top: $space-md;
		}
	}
</style>
