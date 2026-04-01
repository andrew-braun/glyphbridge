<script lang="ts">
	import Row from "$lib/components/layout/Row.svelte"
	import IconBox from "$lib/components/ui/IconBox.svelte"

	const steps = [
		{
			number: 1,
			title: "See a real word",
			description:
				"Each lesson starts with a word you'd actually see in Thailand - on a sign, menu, or map.",
		},
		{
			number: 2,
			title: "Break it down",
			description:
				"We show you how the word splits into syllables and which letters make which sounds.",
		},
		{
			number: 3,
			title: "Learn the letters",
			description:
				"Only 1-3 new letters per lesson. Each one comes with a memory trick and examples.",
		},
		{
			number: 4,
			title: "Practice and drill",
			description:
				"Quick drills using only letters you know. Builds real pattern recognition.",
		},
	]
</script>

<section class="method">
	<h2 class="method__title">How it works</h2>
	<Row class="method__steps" gap="1.5rem" stackAt="md" align="start">
		{#each steps as step}
			<IconBox
				number={step.number}
				title={step.title}
				description={step.description}
				class="method__step"
			/>
		{/each}
	</Row>
</section>

<style lang="scss">
	.method {
		&__title {
			text-align: center;
			margin-bottom: $space-xl;
		}
	}
</style>
