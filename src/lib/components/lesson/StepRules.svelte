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
	import Button from "$lib/components/ui/Button.svelte";
	import type { Rule } from "$lib/data/types";

	let {
		rules,
		onComplete,
	}: {
		rules: Rule[];
		onComplete: () => void;
	} = $props();

	// Track which rule the learner is currently viewing
	let currentIndex = $state(0);
	const currentRule = $derived(rules[currentIndex]);

	/** Advance to next rule, or move to drills if all rules shown. */
	function next() {
		if (currentIndex < rules.length - 1) {
			currentIndex++;
		} else {
			onComplete();
		}
	}
</script>

<div class="step">
	<div class="step__counter">
		Rule {currentIndex + 1} of {rules.length}
	</div>

	<div class="rule-card">
		<h2>{currentRule.name}</h2>
		<p class="rule-card__short">{currentRule.shortDescription}</p>

		<!-- Detailed explanation — this is where the real teaching happens -->
		<div class="rule-card__explanation card card--flat">
			<p>{currentRule.explanation}</p>
		</div>

		<!-- Concrete examples using letters the learner knows -->
		<div class="rule-card__examples">
			<h4>Examples:</h4>
			{#each currentRule.examples as example}
				<div class="rule-card__example">
					<span class="thai thai--sm">{example.split(" ")[0]}</span>
					<span>{example}</span>
				</div>
			{/each}
		</div>
	</div>

	<Button variant="primary" size="large" fullWidth={true} onclick={next}>
		{currentIndex < rules.length - 1 ? "Next Rule ->" : "Start Drills ->"}
	</Button>
</div>

<style lang="scss">
	.step {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		max-width: var(--content-max-width);
		margin: 0 auto;
		@include fade-in-animation;

		&__counter {
			@include step-counter;
		}
	}

	.rule-card {
		display: flex;
		flex-direction: column;
		gap: $space-md;

		// Short description — acts as a subtitle for the rule name
		&__short {
			font-size: $font-size-lg;
			color: $color-primary;
			font-weight: 500;
		}

		&__explanation {
			line-height: 1.7;
		}

		// Example list with Thai script + romanization
		&__examples {
			display: flex;
			flex-direction: column;
			gap: $space-sm;

			h4 {
				@include step-counter; // reuse the small uppercase label style
			}
		}

		// Individual example row
		&__example {
			display: flex;
			align-items: center;
			gap: $space-md;
			padding: $space-sm $space-md;
			background: rgba($color-primary, 0.04);
			border-radius: $radius-md;
			font-size: $font-size-sm;
		}
	}
</style>
