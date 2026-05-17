<script lang="ts">
	let {
		mode,
		ontoggle,
		class: className = "",
	}: {
		mode: "dark" | "light";
		ontoggle?: () => void;
		class?: string;
	} = $props();

	const isDark = $derived(mode === "dark");
</script>

<button
	type="button"
	class={`theme-toggle ${className}`}
	aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
	aria-pressed={!isDark}
	onclick={ontoggle}
>
	<span class="theme-toggle__track">
		<span class="theme-toggle__label">{isDark ? "Dark" : "Light"}</span>
		<span class="theme-toggle__thumb" aria-hidden="true">
			<span class="theme-toggle__icon theme-toggle__icon--sun"></span>
			<span class="theme-toggle__icon theme-toggle__icon--moon"></span>
		</span>
	</span>
</button>

<style lang="scss">
	.theme-toggle {
		appearance: none;
		background: transparent;
		border: 0;
		cursor: pointer;
		padding: 0;

		&:focus-visible {
			outline: 2px solid var(--color-primary);
			outline-offset: 4px;
		}

		.theme-toggle__track {
			align-items: center;
			background: var(--color-surface-muted);
			border: 1px solid var(--color-border-strong);
			border-radius: $radius-full;
			box-shadow: var(--shadow-soft);
			display: inline-flex;
			gap: $space-sm;
			padding: 0.25rem 0.35rem 0.25rem 0.75rem;
			transition:
				background-color $transition-fast,
				border-color $transition-fast,
				transform $transition-fast;
		}

		&:hover {
			.theme-toggle__track {
				border-color: var(--color-primary);
				transform: translateY(-1px);
			}
		}

		.theme-toggle__label {
			color: var(--color-text-muted);
			font-size: $font-size-xs;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
		}

		.theme-toggle__thumb {
			align-items: center;
			background: var(--color-primary);
			border-radius: $radius-full;
			display: inline-flex;
			height: 1.9rem;
			justify-content: center;
			position: relative;
			width: 3rem;
		}

		.theme-toggle__icon {
			position: absolute;
			transition:
				opacity $transition-fast,
				transform $transition-fast;

			&::before,
			&::after {
				content: "";
				position: absolute;
			}
		}

		.theme-toggle__icon--sun {
			height: 0.8rem;
			left: 0.45rem;
			opacity: 0.2;
			transform: scale(0.8);
			width: 0.8rem;

			&::before {
				background: rgba(255, 255, 255, 0.98);
				border-radius: $radius-full;
				inset: 0;
			}

			&::after {
				border: 1px solid rgba(255, 255, 255, 0.45);
				border-radius: $radius-full;
				inset: -0.22rem;
			}
		}

		.theme-toggle__icon--moon {
			height: 0.85rem;
			opacity: 1;
			right: 0.55rem;
			width: 0.85rem;

			&::before {
				background: rgba(255, 255, 255, 0.95);
				border-radius: $radius-full;
				inset: 0;
			}

			&::after {
				background: var(--color-surface-muted);
				border-radius: $radius-full;
				height: 0.85rem;
				right: -0.08rem;
				top: -0.08rem;
				width: 0.65rem;
			}
		}

		&[aria-pressed="true"] {
			.theme-toggle__icon--sun {
				opacity: 1;
				transform: scale(1);
			}

			.theme-toggle__icon--moon {
				opacity: 0.2;
				transform: scale(0.75);
			}
		}
	}
</style>
