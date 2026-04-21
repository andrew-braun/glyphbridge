<script lang="ts">
	import PageHero from "$lib/components/layout/page/PageHero.svelte";
	import Button from "$lib/components/ui/Button.svelte";

	interface Props {
		hasStartedLearning?: boolean;
		showPractice?: boolean;
	}

	let { hasStartedLearning = false, showPractice = false }: Props = $props();
</script>

<PageHero
	badge="Thai Script"
	title="Learn to read Thai"
	highlight="one word at a time"
	subtitle="Don't memorize an alphabet chart. Learn real words you'll see on streets, menus, and signs - and pick up the letters naturally."
>
	{#snippet children()}
		<Button href="/learn" variant="primary" size="large">
			{hasStartedLearning ? "Continue Learning" : "Start Learning"}
		</Button>
		{#if showPractice}
			<Button href="/practice" variant="secondary" size="large">Practice</Button>
		{/if}
	{/snippet}
</PageHero>
