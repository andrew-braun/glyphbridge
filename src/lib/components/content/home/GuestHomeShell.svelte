<script lang="ts">
	import GlyphOrbit from "$lib/components/illustrations/GlyphOrbit.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";

	const languages = [
		{
			name: "Thai",
			sample: "ไทย",
			status: "Live now",
			description:
				"Script-first lessons built around real words from signs, menus, and everyday life.",
			href: "/learn/1",
			available: true,
		},
		{
			name: "Japanese",
			sample: "日本語",
			status: "Coming soon",
			description: "Kana-first reading paths with the same real-word approach.",
			available: false,
		},
		{
			name: "Arabic",
			sample: "العربية",
			status: "Coming soon",
			description:
				"Short, pattern-based lessons focused on readable vocabulary from day one.",
			available: false,
		},
	] as const;

	const valueProps = [
		"Start free with zero login and keep your progress on this device.",
		"Learn through real words instead of memorizing a giant script chart first.",
		"Short lesson loops keep momentum high and make it easy to come back tomorrow.",
	];
</script>

<section class="guest-home">
	<div class="guest-home__hero card">
		<div class="guest-home__copy">
			<span class="badge badge--accent">Learn a language by reading it</span>
			<Heading as="h1" class="guest-home__title"
				>Pick a language. Start in under a minute.</Heading
			>
			<p class="guest-home__lead">
				GlyphBridge teaches script and vocabulary together, so your first lesson already
				feels like reading the real thing.
			</p>

			<ul class="guest-home__points">
				{#each valueProps as point}
					<li>{point}</li>
				{/each}
			</ul>

			<div class="guest-home__actions">
				<Button href="/learn/1" variant="primary" size="large">Start Thai free</Button>
				<Button href="/auth" variant="secondary" size="large">Save progress later</Button>
			</div>
		</div>

		<div class="guest-home__art">
			<GlyphOrbit />
		</div>
	</div>

	<div class="guest-home__languages">
		<div class="guest-home__section-head">
			<Heading>Choose your path</Heading>
			<p>
				Thai is ready now. The home flow already supports more languages as they come
				online.
			</p>
		</div>

		<div class="guest-home__language-grid">
			{#each languages as language}
				<article
					class={["language-card card", { "language-card--live": language.available }]}
				>
					<div class="language-card__topline">
						<span
							class={[
								"badge",
								language.available ? "badge--success" : "badge--primary",
							]}
						>
							{language.status}
						</span>
						<span class="language-card__sample thai thai--sm">{language.sample}</span>
					</div>
					<h3>{language.name}</h3>
					<p>{language.description}</p>

					{#if language.available}
						<Button href={language.href} variant="primary">Start lesson 1</Button>
					{:else}
						<span class="language-card__coming-soon">More soon</span>
					{/if}
				</article>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.guest-home {
		display: flex;
		flex-direction: column;
		gap: $space-2xl;

		&__hero {
			align-items: center;
			background:
				linear-gradient(145deg, rgb(var(--rgb-primary) / 0.12), transparent 35%),
				radial-gradient(
					circle at top right,
					rgb(var(--rgb-accent) / 0.14),
					transparent 34%
				),
				var(--color-surface-card);
			display: grid;
			gap: $space-xl;
			grid-template-columns: minmax(0, 1.05fr) minmax(15rem, 0.95fr);
			overflow: hidden;
			padding: clamp($space-xl, 5vw, $space-3xl);
		}

		&__copy {
			display: flex;
			flex-direction: column;
			gap: $space-lg;
		}

		:global(.guest-home__title) {
			font-size: clamp(2.5rem, 5vw, 4.75rem);
			line-height: 0.98;
			margin-bottom: 0;
		}

		&__lead {
			color: var(--color-text-muted);
			font-size: $font-size-lg;
			max-width: 34rem;
		}

		&__points {
			display: grid;
			gap: $space-sm;
			list-style: none;
			padding: 0;

			li {
				align-items: center;
				background: rgb(var(--rgb-primary) / 0.08);
				border: 1px solid rgb(var(--rgb-primary) / 0.14);
				border-radius: $radius-lg;
				color: var(--color-text);
				display: flex;
				gap: $space-sm;
				padding: 0.9rem 1rem;

				&::before {
					background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
					border-radius: $radius-full;
					content: "";
					flex: 0 0 0.6rem;
					height: 0.6rem;
				}
			}
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

		&__languages {
			display: flex;
			flex-direction: column;
			gap: $space-lg;
		}

		&__section-head {
			display: flex;
			flex-direction: column;
			gap: $space-sm;

			p {
				color: var(--color-text-muted);
				max-width: 38rem;
			}
		}

		&__language-grid {
			display: grid;
			gap: $space-lg;
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.language-card {
		display: flex;
		flex-direction: column;
		gap: $space-md;
		justify-content: space-between;
		min-height: 100%;

		&--live {
			border-color: rgb(var(--rgb-success) / 0.28);
		}

		&__topline {
			align-items: center;
			display: flex;
			justify-content: space-between;
		}

		&__sample {
			color: var(--color-primary-strong);
		}

		h3 {
			margin: 0;
		}

		p {
			color: var(--color-text-muted);
			flex: 1;
		}

		&__coming-soon {
			color: var(--color-text-soft);
			font-size: $font-size-sm;
			font-weight: 600;
			letter-spacing: 0.04em;
			text-transform: uppercase;
		}
	}

	@media (max-width: $bp-lg) {
		.guest-home__hero {
			grid-template-columns: 1fr;
		}

		.guest-home__art {
			order: -1;
		}

		.guest-home__language-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: $bp-sm) {
		.guest-home__actions {
			flex-direction: column;
		}

		.guest-home__points li {
			align-items: flex-start;
			font-size: $font-size-sm;
			line-height: 1.55;
		}
	}
</style>
