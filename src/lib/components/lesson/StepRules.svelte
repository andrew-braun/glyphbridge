<!--
  StepRules.svelte — Lesson Step 4: Rule Introduction
  ====================================================
  Teaches the spelling/pronunciation rules needed for the anchor word.
  Rules are only introduced when the learner encounters them naturally
  in a real word — never as abstract grammar dumps.

  Each rule card shows:
    - Rule name and short description
    - Full explanation with context
    - Concrete examples the learner can already (mostly) read
-->
<script lang="ts">
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Reveal from "$lib/components/ui/Reveal.svelte";
	import type { Rule } from "$lib/data/types";

	let {
		rules,
		onComplete,
		completeLabel = "Bring on the drills ->",
	}: {
		rules: Rule[];
		onComplete: () => void;
		completeLabel?: string;
	} = $props();

	// Track which rule the learner is currently viewing
	let currentIndex = $state(0);
	const currentRule = $derived(rules[currentIndex]);

	/** Advance to next rule, or move to the next lesson step if all rules shown. */
	function next() {
		if (currentIndex < rules.length - 1) {
			currentIndex++;
		} else {
			onComplete();
		}
	}
</script>

<StepLayout counter={`Rule ${currentIndex + 1} of ${rules.length}`}>
	{#key `${currentIndex}-${currentRule.name}`}
		<section class="rule-card surface-panel lesson-accent-panel lesson-accent-panel--accent">
			<h2><Reveal as="span" distance={14}>{currentRule.name}</Reveal></h2>
			<p class="rule-card__short">
				<Reveal as="span" delay={60} distance={12}>{currentRule.shortDescription}</Reveal>
			</p>

			<!-- Detailed explanation — this is where the real teaching happens -->
			<div class="rule-card__explanation card card--flat">
				<Reveal as="div" delay={120} distance={14}>
					<p>{currentRule.explanation}</p>
				</Reveal>
			</div>

			<!-- Concrete examples using letters the learner knows -->
			<div class="rule-card__examples">
				<h4><Reveal as="span" delay={180} distance={10}>Examples:</Reveal></h4>
				{#each currentRule.examples as example, index}
					<div class="rule-card__example">
						<Reveal
							as="span"
							class="thai thai--sm"
							delay={220 + index * 70}
							distance={10}
						>
							{example.split(" ")[0]}
						</Reveal>
						<Reveal as="span" delay={240 + index * 70} distance={10}>{example}</Reveal>
					</div>
				{/each}
			</div>
		</section>
	{/key}

	<Button variant="primary" size="large" fullWidth={true} onclick={next}>
		{currentIndex < rules.length - 1 ? "Next rule ->" : completeLabel}
	</Button>
</StepLayout>

<style lang="scss">
	.rule-card {
		display: grid;
		gap: $space-md;
		padding: clamp(#{$space-lg}, 3vw, #{$space-xl});

		h2 {
			margin: 0;
		}

		&__short {
			color: var(--color-accent);
			font-size: $font-size-lg;
			font-weight: 500;
			margin: 0;
		}

		&__explanation {
			border-top: 0.35rem solid var(--color-accent);
			line-height: 1.55;
			padding: $space-md;

			p {
				margin: 0;
			}
		}

		&__examples {
			display: flex;
			flex-direction: column;
			gap: $space-sm;

			h4 {
				@include step-counter; // reuse the small uppercase label style
			}
		}

		&__example {
			align-items: center;
			background: var(--surface-interactive);
			border: 1px solid var(--color-border);
			border-radius: $radius-md;
			display: flex;
			flex-wrap: wrap;
			font-size: $font-size-sm;
			gap: $space-sm;
			padding: $space-sm $space-md;

			:global(.thai) {
				align-items: center;
				background: var(--color-accent);
				border-radius: $radius-full;
				color: var(--color-on-accent);
				display: inline-flex;
				font-weight: 800;
				justify-content: center;
				line-height: 1.2;
				min-width: 3.25rem;
				padding: $space-xs $space-sm;
			}

			:global(.reveal:not(.thai)) {
				flex: 1 1 12rem;
				min-width: 0;
			}
		}
	}

	@media (min-width: $bp-md) {
		.rule-card {
			display: grid;
			gap: $space-md $space-xl;
			grid-template-columns: minmax(0, 1.05fr) minmax(16rem, 0.95fr);

			h2,
			&__short,
			&__explanation {
				grid-column: 1;
			}

			&__examples {
				align-self: stretch;
				grid-column: 2;
				grid-row: 1 / span 3;
			}
		}
	}
</style>
