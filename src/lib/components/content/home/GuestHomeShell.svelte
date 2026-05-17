<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";

	interface Props {
		authenticated: boolean;
		currentLessonId: number;
	}

	let { authenticated, currentLessonId }: Props = $props();

	const languages = [
		{
			name: "Thai",
			sample: "ไทย",
			status: "Active",
			href: "/learn/1",
			available: true,
		},
		{
			name: "Korean",
			sample: "한국어",
			status: "Inactive",
			available: false,
		},
		{
			name: "Cyrillic",
			sample: "Кириллица",
			status: "Inactive",
			available: false,
		},
		{
			name: "Greek",
			sample: "Ελληνικά",
			status: "Inactive",
			available: false,
		},
		{
			name: "Arabic",
			sample: "العربية",
			status: "Inactive",
			available: false,
		},
		{
			name: "Georgian",
			sample: "ქართული",
			status: "Inactive",
			available: false,
		},
		{
			name: "Japanese (Kana)",
			sample: "かな",
			status: "Inactive",
			available: false,
		},
		{
			name: "Devanagari",
			sample: "देवनागरी",
			status: "Inactive",
			available: false,
		},
		{
			name: "Hebrew",
			sample: "עברית",
			status: "Inactive",
			available: false,
		},
		{
			name: "Armenian",
			sample: "Հայերեն",
			status: "Inactive",
			available: false,
		},
		{
			name: "Amharic",
			sample: "አማርኛ",
			status: "Inactive",
			available: false,
		},
		{
			name: "Vietnamese",
			sample: "Tiếng Việt",
			status: "Inactive",
			available: false,
		},
		{
			name: "Turkish",
			sample: "Türkçe",
			status: "Inactive",
			available: false,
		},
		{
			name: "Icelandic",
			sample: "Íslenska",
			status: "Inactive",
			available: false,
		},
		{
			name: "Burmese",
			sample: "မြန်မာ",
			status: "Inactive",
			available: false,
		},
	] as const;
</script>

<section class="guest-home">
	<div class="guest-home__hero card">
		<Reveal class="guest-home__copy" delay={40}>
			<span class="badge badge--accent">Learn a language by reading it</span>
			<Heading as="h1" class="guest-home__title"
				>Pick a language. Start in under a minute.</Heading
			>
			<p class="guest-home__lead">
				GlyphBridge teaches script and vocabulary together, so your first lesson already
				feels like reading the real thing.
			</p>

			<div class="guest-home__actions">
				{#if authenticated}
					<Button href={`/learn/${currentLessonId}`} variant="primary" size="large"
						>Continue</Button
					>
				{:else}
					<Button href="/auth" variant="primary" size="large">Sign Up</Button>
				{/if}
			</div>
		</Reveal>

		<Reveal class="guest-home__art" delay={180} distance={24}>
			<div class="guest-home__language-list">
				{#each languages as language}
					<div
						class={["language-row", { "language-row--inactive": !language.available }]}
					>
						<div class="language-row__info">
							<span class="language-row__sample">{language.sample}</span>
							<span class="language-row__name">{language.name}</span>
						</div>
						<div class="language-row__action">
							{#if language.available}
								<Button href={language.href} variant="primary" size="sm"
									>Learn Thai</Button
								>
							{:else}
								<span class="badge badge--muted">{language.status}</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</Reveal>
	</div>
</section>

<style lang="scss">
	.guest-home {
		display: flex;
		flex-direction: column;
		gap: $space-2xl;

		&__hero {
			align-items: center;
			background: var(--color-surface-card);
			display: grid;
			gap: $space-xl;
			grid-template-columns: minmax(0, 1.05fr) minmax(15rem, 0.95fr);
			overflow: hidden;
			padding: clamp($space-xl, 5vw, $space-3xl);
		}

		:global(.guest-home__copy) {
			display: flex;
			flex-direction: column;
			gap: $space-lg;
		}

		:global(.guest-home__title) {
			font-size: clamp(2.2rem, 4.5vw, 4.75rem);
			line-height: 0.98;
			margin-bottom: 0;
		}

		&__lead {
			color: var(--color-text-muted);
			font-size: $font-size-lg;
			max-width: 34rem;
		}

		&__actions {
			display: flex;
			flex-wrap: wrap;
			gap: $space-md;
		}

		:global(.guest-home__art) {
			display: flex;
			justify-content: center;
		}

		&__language-list {
			display: flex;
			flex-direction: column;
			gap: $space-sm;
			max-height: clamp(25rem, 60vh, 35rem);
			overflow-y: auto;
			padding-right: $space-sm;

			&::-webkit-scrollbar {
				width: 4px;
			}
			&::-webkit-scrollbar-thumb {
				background: var(--color-border);
				border-radius: $radius-full;
			}
		}

		.language-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: $space-md;
			padding: $space-sm $space-md;
			border-radius: $radius-md;
			transition: background 0.2s;
			background: transparent;

			&--inactive {
				opacity: 0.6;
				pointer-events: none;
				filter: grayscale(1);
			}

			&__info {
				display: flex;
				align-items: center;
				gap: $space-md;
			}

			&__sample {
				font-size: $font-size-lg;
				font-weight: 600;
				color: var(--color-primary-strong);
				min-width: 3rem;
				text-align: center;
			}

			&__name {
				font-weight: 500;
				color: var(--color-text);
			}

			&__action {
				flex-shrink: 0;
			}
		}
	}

	@media (max-width: $bp-lg) {
		.guest-home__hero {
			grid-template-columns: 1fr;
		}

		:global(.guest-home__art) {
			order: -1;
		}
	}

	@media (max-width: $bp-sm) {
		.guest-home__actions {
			flex-direction: column;
		}
	}
</style>
