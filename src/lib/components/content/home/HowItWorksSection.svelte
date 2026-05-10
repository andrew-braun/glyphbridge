<script lang="ts">
	import Row from "$lib/components/layout/Row.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";
	import IconBox from "$lib/components/ui/IconBox.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";

	type StepTone = "primary" | "accent" | "success" | "warning";

	const steps: Array<{
		number: number;
		tone: StepTone;
		title: string;
		description: string;
	}> = [
		{
			number: 1,
			tone: "primary",
			title: "Start with a real word",
			description:
				"Every lesson begins with Thai you will actually meet on a sign, menu, appliance, or street corner.",
		},

		{
			number: 2,
			tone: "success",
			title: "Unlock only the letters you need",
			description:
				"Instead of a giant alphabet dump, you learn just enough new script to read the word with confidence.",
		},
		{
			number: 3,
			tone: "warning",
			title: "Read it back in drills",
			description:
				"Quick practice locks the pattern in so you can recognize the same letters out in the real world.",
		},
	];
</script>

<section class="method">
	<Reveal class="method__header" delay={60}>
		<Heading class="method__title" align="center">How it works</Heading>
		<p class="method__lead">
			GlyphBridge teaches reading the way you actually use it: spot the word, understand the
			pieces, then read it back yourself.
		</p>
	</Reveal>
	<Row class="method__steps" gap="1.25rem" stackAt="md" align="stretch">
		{#each steps as step, index}
			<Reveal class="method__step" delay={120 + index * 90} distance={20}>
				<IconBox
					number={step.number}
					tone={step.tone}
					align="start"
					title={step.title}
					description={step.description}
				/>
			</Reveal>
		{/each}
	</Row>
</section>

<style lang="scss">
	.method {
		background:
			radial-gradient(circle at top left, rgb(var(--rgb-accent) / 0.16), transparent 34%),
			linear-gradient(180deg, rgb(var(--rgb-primary) / 0.08), transparent 45%),
			var(--color-surface-card);
		border: 1px solid var(--color-border);
		border-radius: calc($radius-xl * 1.25);
		box-shadow: var(--shadow-card);
		padding: clamp($space-xl, 4vw, $space-2xl);

		:global(.method__header) {
			margin: 0 auto $space-2xl;
			max-width: var(--text-max-width);
		}

		:global(.method__title) {
			margin-bottom: $space-md;
		}

		&__lead {
			color: var(--color-text-muted);
			font-size: $font-size-lg;
			line-height: 1.65;
			text-align: center;
		}

		:global(.method__steps) {
			align-items: stretch;
		}

		:global(.method__step) {
			flex: 1 1 15rem;
		}
	}

	@media (max-width: $bp-sm) {
		.method {
			padding: $space-lg;

			:global(.method__header) {
				margin-bottom: $space-xl;
			}

			&__lead {
				font-size: $font-size-base;
			}
		}
	}
</style>
