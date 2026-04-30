<script lang="ts">
	import Row from "$lib/components/layout/Row.svelte";
	import Heading from "$lib/components/ui/Heading.svelte";
	import IconBox from "$lib/components/ui/IconBox.svelte";

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
	<div class="method__header">
		<Heading class="method__title" align="center">How it works</Heading>
		<p class="method__lead">
			GlyphBridge teaches reading the way you actually use it: spot the word, understand the
			pieces, then read it back yourself.
		</p>
	</div>
	<Row class="method__steps" gap="1.25rem" stackAt="md" align="stretch">
		{#each steps as step}
			<IconBox
				number={step.number}
				tone={step.tone}
				align="start"
				title={step.title}
				description={step.description}
				class="method__step"
			/>
		{/each}
	</Row>
</section>

<style lang="scss">
	.method {
		background:
			radial-gradient(circle at top left, rgba($color-accent, 0.14), transparent 34%),
			linear-gradient(180deg, rgba($color-primary, 0.05), rgba(white, 0.88));
		border: 1px solid rgba($color-primary, 0.08);
		border-radius: calc($radius-xl * 1.25);
		padding: clamp($space-xl, 4vw, $space-2xl);

		&__header {
			margin: 0 auto $space-2xl;
			max-width: var(--text-max-width);
		}

		:global(.method__title) {
			margin-bottom: $space-md;
		}

		&__lead {
			color: $color-text-light;
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

			&__header {
				margin-bottom: $space-xl;
			}

			&__lead {
				font-size: $font-size-base;
			}
		}
	}
</style>
