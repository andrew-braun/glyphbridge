<script lang="ts">
	import { RadioGroup } from "bits-ui";

	export type RadioButtonTone = "default" | "correct" | "wrong";

	export type RadioButtonOption = {
		value: string;
		label: string;
		disabled?: boolean;
		isThai?: boolean;
		tone?: RadioButtonTone;
	};

	let {
		options,
		value = $bindable(""),
		labelledBy,
		columns = 2,
		class: className = "",
	}: {
		options: RadioButtonOption[];
		value?: string;
		labelledBy?: string;
		columns?: number;
		class?: string;
	} = $props();

	const classes = $derived(["radio-buttons", className].filter(Boolean).join(" "));

	function getOptionClasses(option: RadioButtonOption, checked: boolean) {
		return [
			"radio-buttons__option",
			checked ? "radio-buttons__option--selected" : "",
			option.tone === "correct" ? "radio-buttons__option--correct" : "",
			option.tone === "wrong" ? "radio-buttons__option--wrong" : "",
		]
			.filter(Boolean)
			.join(" ");
	}
</script>

<RadioGroup.Root
	class={classes}
	aria-labelledby={labelledBy}
	bind:value
	style={`--radio-buttons-columns: ${columns}`}
>
	{#each options as option}
		<RadioGroup.Item value={option.value} disabled={option.disabled}>
			{#snippet child({ props, checked })}
				<button {...props} class={getOptionClasses(option, checked)}>
					<span class={["radio-buttons__label", { thai: option.isThai }]}
						>{option.label}</span
					>
				</button>
			{/snippet}
		</RadioGroup.Item>
	{/each}
</RadioGroup.Root>

<style lang="scss">
	.radio-buttons {
		display: grid;
		gap: $space-md;
		grid-template-columns: repeat(var(--radio-buttons-columns), minmax(0, 1fr));

		&__option {
			@include drill-option;
			@include drill-option-states;
		}

		&__label.thai {
			font-size: $font-size-thai;
		}
	}

	@media (max-width: $bp-sm) {
		.radio-buttons {
			grid-template-columns: 1fr;
		}
	}
</style>
