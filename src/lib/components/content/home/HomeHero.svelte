<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";

	interface Props {
		authenticated: boolean;
		resumeHref: string;
		resumePhase: "learn" | "practice" | "review";
	}

	let { authenticated, resumeHref, resumePhase }: Props = $props();

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
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Cyrillic",
			sample: "Кириллица",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Greek",
			sample: "Ελληνικά",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Arabic",
			sample: "العربية",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Georgian",
			sample: "ქართული",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Japanese (Kana)",
			sample: "かな",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Devanagari",
			sample: "देवनागरी",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Hebrew",
			sample: "עברית",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Armenian",
			sample: "Հայերեն",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Amharic",
			sample: "አማርኛ",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Vietnamese",
			sample: "Tiếng Việt",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Turkish",
			sample: "Türkçe",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Icelandic",
			sample: "Íslenska",
			status: "Coming Soon",
			available: false,
		},
		{
			name: "Burmese",
			sample: "မြန်မာ",
			status: "Coming Soon",
			available: false,
		},
	] as const;
</script>

<section class="home-hero">
	<div class="home-hero__container card">
		<Reveal delay={40}>
			<div class="home-hero__copy">
				<!-- <span class="badge badge--accent">Learn alphabets by reading, not by drilling</span> -->
				<div class="home-hero__heading">
					<Heading as="h1">Skip the drills. Start reading.</Heading>
				</div>
				<p class="home-hero__lead">
					Glyphin teaches you the highest-frequency letter/word combinations first, so you
					can start reading real words from day one.
				</p>

				<div class="home-hero__actions">
					{#if authenticated}
						<Button href={resumeHref} variant="primary" size="large">
							{resumePhase === "practice"
								? "Continue Practice"
								: resumePhase === "review"
									? "Review What You Know"
									: "Continue Learning"}
						</Button>
					{:else}
						<Button href="/auth" variant="primary" size="large"
							>Get Started for Free</Button
						>
					{/if}
				</div>
			</div>
		</Reveal>

		<Reveal delay={180} distance={24}>
			<div class="home-hero__art">
				<div class="home-hero__language-list">
					{#each languages as language}
						<div
							class={[
								"language-card",
								{ "language-card--inactive": !language.available },
							]}
						>
							<div class="language-card__info">
								<span class="language-card__name">{language.name}</span>
								<span class="language-card__sample">{language.sample}</span>
							</div>
							<div class="language-card__action">
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
			</div>
		</Reveal>
	</div>
</section>

<style lang="scss">
	.home-hero {
		display: flex;
		flex-direction: column;

		&__container {
			align-items: center;
			background: var(--color-surface-card);
			display: grid;
			gap: $space-xl;
			grid-template-columns: minmax(0, 1.05fr) minmax(20rem, 0.95fr);
			overflow: hidden;
			padding: clamp($space-xl, 5vw, $space-3xl);
		}

		&__copy {
			display: flex;
			flex-direction: column;
			gap: $space-lg;
		}

		&__heading {
			--heading-font-size: clamp(2.2rem, 4.5vw, 4.75rem);
			--heading-line-height: 0.98;
			--heading-margin-bottom: 0;
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

		&__art {
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
			padding-top: $space-sm;
			width: 100%;

			&::-webkit-scrollbar {
				width: 4px;
			}
			&::-webkit-scrollbar-thumb {
				background: var(--color-border);
				border-radius: $radius-full;
			}
		}

		.language-card {
			background: var(--color-surface-card);
			border: 1px solid var(--color-border);
			border-radius: $radius-md;
			box-shadow: var(--shadow-sm);
			display: flex;
			gap: $space-sm;
			justify-content: space-between;
			padding: $space-md;
			@include motion-safe-transition(
				border-color $transition-fast,
				box-shadow $transition-fast,
				transform $transition-fast,
				background-color $transition-fast
			);

			@media (max-width: $bp-sm) {
				align-items: center;
				flex-direction: column;
			}
			&--inactive {
				background: var(--color-surface-muted);
				border-color: var(--color-border-muted);
				box-shadow: none;
				filter: grayscale(1);
				opacity: 0.6;
				pointer-events: none;
				transform: none;

				&:hover {
					border-color: var(--color-border-muted);
					box-shadow: none;
					transform: none;
				}
			}

			&__info {
				align-items: center;
				display: flex;
				gap: $space-md;
			}

			&__name {
				color: var(--color-text);
				font-size: $font-size-lg;
				font-weight: 500;
			}

			&__sample {
				color: var(--color-text-muted);
				font-size: $font-size-lg;
				font-weight: 600;
				min-width: 3rem;
				text-align: center;
			}

			&__action {
				align-self: flex-end;

				@media (max-width: $bp-sm) {
					align-self: unset;
				}
			}
		}
	}

	@media (max-width: $bp-lg) {
		.home-hero {
			&__container {
				grid-template-columns: 1fr;
			}

			&__art {
				order: -1;
			}
		}
	}

	@media (max-width: $bp-sm) {
		.home-hero {
			&__actions {
				flex-direction: column;
			}
		}
	}
</style>
