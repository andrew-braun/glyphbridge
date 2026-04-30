<script lang="ts">
	import Row from "$lib/components/layout/Row.svelte";
	import Progress from "$lib/components/ui/Progress.svelte";
	import StatCard from "$lib/components/ui/StatCard.svelte";
	import type { Word } from "$lib/data/types";

	interface Props {
		knownLetters: string[];
		knownWords: Word[];
		currentLessonId: number;
		totalLessons: number;
	}

	let { knownLetters, knownWords, currentLessonId, totalLessons }: Props = $props();

	const completedLessonCount = $derived(Math.max(0, currentLessonId - 1));
	const lessonProgressPercent = $derived(
		totalLessons === 0 ? 0 : (completedLessonCount / totalLessons) * 100,
	);
</script>

{#if knownLetters.length > 0}
	<section>
		<Row gap="1.5rem" stackAt="md" class="stats-row">
			<StatCard value={knownLetters.length.toString()} label="Letters Learned">
				{#snippet children()}
					<div class="thai thai--sm">{knownLetters.join(" ")}</div>
				{/snippet}
			</StatCard>
			<StatCard value={knownWords.length.toString()} label="Words Known">
				{#snippet children()}
					<div class="thai thai--sm">
						{knownWords.map((word) => word.thai).join(" ")}
					</div>
				{/snippet}
			</StatCard>
			<StatCard value={`${completedLessonCount}/${totalLessons}`} label="Lessons Complete">
				{#snippet children()}
					<Progress
						label="Home lesson progress"
						value={completedLessonCount}
						max={totalLessons}
						valueLabel={`${completedLessonCount} of ${totalLessons} lessons completed`}
					/>
				{/snippet}
			</StatCard>
		</Row>
	</section>
{/if}
