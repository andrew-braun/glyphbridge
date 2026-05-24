<script lang="ts">
	import Progress from "$lib/components/ui/Progress.svelte";

	let {
		currentStep,
		totalSteps,
		value,
	}: {
		currentStep: number;
		totalSteps: number;
		value: number;
	} = $props();

	const valueLabel = $derived(`${currentStep} of ${totalSteps} steps complete`);
</script>

<div class="lesson-progress surface-panel card card--flat">
	<div class="lesson-progress__bar">
		<Progress label="Lesson progress" {value} {valueLabel} showValueLabel={false} />
	</div>
	<span class="lesson-progress__step-label">{currentStep} / {totalSteps}</span>
</div>

<style lang="scss">
	.lesson-progress {
		align-items: center;
		display: flex;
		gap: $space-sm;
		padding: $space-xs $space-md;

		&__bar {
			flex: 1;
			min-width: 6rem;
		}

		&__step-label {
			@include step-counter;
			font-size: $font-size-xs;
			white-space: nowrap;
		}
	}
</style>
