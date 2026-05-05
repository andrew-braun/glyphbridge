<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";

	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();

	const email = $derived(typeof form?.email === "string" ? form.email : "");
	const codeRequested = $derived(form?.codeRequested === true);
	const requestError = $derived(
		typeof form?.requestError === "string" ? form.requestError : null,
	);
	const verifyError = $derived(typeof form?.verifyError === "string" ? form.verifyError : null);

	function normalizeCodeInput(event: Event) {
		const input = event.currentTarget;

		if (!(input instanceof HTMLInputElement)) return;

		input.value = input.value.replace(/\D/g, "").slice(0, 6);
	}
</script>

<svelte:head>
	<title>Sign in - GlyphBridge</title>
	<meta
		name="description"
		content="Sign in to GlyphBridge with an email code and sync your Thai reading progress across devices."
	/>
</svelte:head>

<div class="auth container">
	<section class="auth__panel card card--flat" aria-labelledby="auth-heading">
		{#if data.userEmail}
			<div class="auth__header">
				<span class="badge badge--success">Signed in</span>
				<h1 id="auth-heading">Account</h1>
				<p>{data.userEmail}</p>
			</div>

			<form method="POST" action="/auth/sign-out" class="auth__form">
				<Button type="submit" variant="secondary">Sign out</Button>
			</form>
		{:else if !data.authConfigured}
			<div class="auth__header">
				<span class="badge badge--warning">Setup needed</span>
				<h1 id="auth-heading">Sign in</h1>
				<p>Authentication is not configured for this environment yet.</p>
			</div>
		{:else}
			<div class="auth__header">
				<span class="badge badge--primary">Email code</span>
				<h1 id="auth-heading">Sign in</h1>
				<p>Use a one-time code to keep your progress synced.</p>
			</div>

			<form method="POST" action="?/requestCode" class="auth__form">
				<label class="auth__field">
					<span>Email</span>
					<input name="email" type="email" autocomplete="email" value={email} required />
				</label>

				{#if requestError}
					<p class="auth__error">{requestError}</p>
				{/if}

				<Button type="submit" variant="primary">Send code</Button>
			</form>

			{#if codeRequested}
				<form method="POST" action="?/verifyCode" class="auth__form auth__form--verify">
					<input type="hidden" name="email" value={email} />
					<input type="hidden" name="next" value={data.next} />

					<label class="auth__field">
						<span>Code</span>
						<span class="auth__hint">Paste the 6-digit code from your email.</span>
						<input
							name="token"
							type="text"
							inputmode="numeric"
							autocomplete="one-time-code"
							oninput={normalizeCodeInput}
							placeholder="123456"
							spellcheck="false"
							required
						/>
					</label>

					{#if verifyError}
						<p class="auth__error">{verifyError}</p>
					{/if}

					<Button type="submit" variant="success">Verify code</Button>
				</form>
			{/if}
		{/if}
	</section>
</div>

<style lang="scss">
	.auth {
		display: grid;
		place-items: start center;
	}

	.auth__panel {
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		max-width: 30rem;
		width: 100%;
	}

	.auth__header {
		display: flex;
		flex-direction: column;
		gap: $space-sm;
	}

	.auth__header p {
		color: $color-text-light;
	}

	.auth__form {
		display: flex;
		flex-direction: column;
		gap: $space-md;
	}

	.auth__form--verify {
		border-top: 1px solid $color-border;
		padding-top: $space-lg;
	}

	.auth__field {
		display: flex;
		flex-direction: column;
		font-weight: 700;
		gap: $space-xs;
	}

	.auth__hint {
		color: $color-text-light;
		font-size: $font-size-sm;
		font-weight: 500;
	}

	.auth__field input {
		border: 1px solid $color-border;
		border-radius: $radius-md;
		font: inherit;
		padding: $space-sm $space-md;
	}

	.auth__field input:focus {
		border-color: $color-primary;
		outline: 3px solid rgba($color-primary, 0.14);
	}

	.auth__error {
		color: $color-error;
		font-size: $font-size-sm;
	}
</style>
