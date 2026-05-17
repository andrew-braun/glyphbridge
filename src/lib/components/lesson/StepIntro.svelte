<!--
  StepIntro.svelte — Lesson Step 1: Word Introduction
  ====================================================
  Shows the anchor word in large Thai script with a "Can you guess?"
  prompt. Includes an optional real-world context note explaining
  where the learner would encounter this word in Thailand.

  This is the first thing the learner sees — it creates curiosity
  before any breakdown or instruction happens.
-->
<script lang="ts">
	import StepLayout from "$lib/components/lesson/StepLayout.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import NoticeBox from "$lib/components/ui/NoticeBox.svelte";
	import type { Lesson } from "$lib/data/types";

	let { lesson, onNext }: { lesson: Lesson; onNext: () => void } = $props();
</script>

<StepLayout class="step--intro">
	<Badge>Stage {lesson.stage}</Badge>
	<h1 class="step__title">{lesson.title}</h1>

	<!-- Large word reveal — the learner's first look at the anchor word -->
	<div class="word-reveal">
		<div class="word-reveal__thai thai thai--lg">{lesson.anchorWord.thai}</div>
		<p class="word-reveal__hint">Try reading it once before we pull it apart.</p>
	</div>

	<!-- Context note explaining where this word appears in the real world -->
	{#if lesson.anchorWord.contextNote}
		<NoticeBox>
			<p>{lesson.anchorWord.contextNote}</p>
		</NoticeBox>
	{/if}

	<Button variant="primary" size="large" fullWidth={true} onclick={onNext}>
		Open this word ->
	</Button>
</StepLayout>

<style lang="scss">
	.step__title {
		font-size: $font-size-2xl;
	}

	// Large reveal area with subtle gradient background
	.word-reveal {
		background: var(--surface-hero);
		border: 1px solid var(--color-border);
		border-radius: $radius-xl;
		box-shadow: var(--shadow-card);
		padding: $space-2xl;
		text-align: center;

		&__thai {
			color: var(--color-primary-strong);
		}

		&__hint {
			color: var(--color-text-muted);
			margin-top: $space-md;
		}
	}
</style>
