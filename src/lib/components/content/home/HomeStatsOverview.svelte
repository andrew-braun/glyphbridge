<script lang="ts">
	import Row from "$lib/components/layout/Row.svelte"
	import StatCard from "$lib/components/ui/StatCard.svelte"
	import {
		currentLessonId,
		knownLetters,
		knownWords,
		totalLessons,
	} from "$lib/stores/progress"
</script>

{#if $knownLetters.length > 0}
	<section>
		<Row gap="1.5rem" stackAt="md" class="stats-row">
			<StatCard value={$knownLetters.length.toString()} label="Letters Learned">
				{#snippet children()}
					<div class="thai thai--sm">{$knownLetters.join(" ")}</div>
				{/snippet}
			</StatCard>
			<StatCard value={$knownWords.length.toString()} label="Words Known">
				{#snippet children()}
					<div class="thai thai--sm">
						{$knownWords.map((w) => w.thai).join(" ")}
					</div>
				{/snippet}
			</StatCard>
			<StatCard
				value={`${$currentLessonId - 1}/${totalLessons}`}
				label="Lessons Complete"
			>
				{#snippet children()}
					<div class="progress-bar">
						<div
							class="progress-bar__fill"
							style="width: {(($currentLessonId - 1) / totalLessons) * 100}%"
						></div>
					</div>
				{/snippet}
			</StatCard>
		</Row>
	</section>
{/if}
