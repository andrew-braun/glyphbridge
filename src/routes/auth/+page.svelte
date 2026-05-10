<script lang="ts">
	import Button from "$lib/components/ui/Button.svelte";
	import {
		authSession,
		learnerProjection,
		learnerProjectionStatus,
		refreshLearnerProjection,
	} from "$lib/stores/learner";

	import type { PageProps } from "./$types";

	let { data, form }: PageProps = $props();
	let refreshingProjection = $state(false);

	const email = $derived(typeof form?.email === "string" ? form.email : "");
	const codeRequested = $derived(form?.codeRequested === true);
	const requestError = $derived(
		typeof form?.requestError === "string" ? form.requestError : null,
	);
	const verifyError = $derived(typeof form?.verifyError === "string" ? form.verifyError : null);
	const accountEmail = $derived(data.userEmail ?? $authSession.email ?? null);
	const completedLessonCount = $derived($learnerProjection?.completedLessonIds.length ?? 0);
	const resumeLessonId = $derived($learnerProjection?.resumeLessonId ?? null);
	const resumeHref = $derived(resumeLessonId ? `/learn/${resumeLessonId}` : "/learn");
	const syncBadgeClass = $derived.by(() => {
		switch ($learnerProjectionStatus) {
			case "loaded":
				return "badge badge--success";
			case "error":
				return "badge badge--warning";
			default:
				return "badge badge--primary";
		}
	});
	const syncLabel = $derived.by(() => {
		switch ($learnerProjectionStatus) {
			case "loaded":
				return "Synced";
			case "error":
				return "Retry needed";
			case "loading":
				return "Refreshing";
			default:
				return "Checking sync";
		}
	});
	const syncedAtLabel = $derived.by(() => {
		const syncedAt = $learnerProjection?.syncedAt;

		if (!syncedAt) return null;

		const date = new Date(syncedAt);
		return Number.isNaN(date.getTime()) ? null : date.toLocaleString();
	});

	function normalizeCodeInput(event: Event) {
		const input = event.currentTarget;

		if (!(input instanceof HTMLInputElement)) return;

		input.value = input.value.replace(/\D/g, "").slice(0, 6);
	}

	async function handleRefreshProjection() {
		refreshingProjection = true;

		try {
			await refreshLearnerProjection();
		} finally {
			refreshingProjection = false;
		}
	}
</script>

<svelte:head>
	<title>Sign in - GlyphBridge</title>
	<meta
		name="description"
		content="Sign in to GlyphBridge with an email code and sync your Thai reading progress across devices."
	/>
</svelte:head>

<div class="auth container page-shell page-shell--narrow">
	<section class="page-intro auth__intro">
		<span class="page-intro__eyebrow">Account and sync</span>
		<h1 class="page-intro__title">
			{#if data.userEmail}
				Your progress, with a server-backed checkpoint.
			{:else}
				Sign in with a code. No password ritual required.
			{/if}
		</h1>
		<p class="page-intro__body">
			{#if data.userEmail}
				This account keeps your local-first learning flow intact while adding a verified
				progress projection you can refresh and reuse on another device.
			{:else}
				GlyphBridge starts locally and stays fast. Signing in simply gives that progress a
				place to land beyond this browser.
			{/if}
		</p>
		<div class="page-intro__meta">
			<span class="badge badge--primary">one-time email code</span>
			<span class="badge badge--accent">local-first shell</span>
			<span class="badge badge--success">optional account</span>
		</div>
	</section>

	<section class="auth__panel card card--flat" aria-labelledby="auth-heading">
		{#if data.userEmail}
			<div class="auth__header">
				<span class="badge badge--success">Signed in</span>
				<h1 id="auth-heading">Account</h1>
				<p>{accountEmail}</p>
			</div>

			<div class="auth__summary" aria-label="Account summary">
				<div class="auth__summary-card">
					<span class="auth__summary-label">Sign-in email</span>
					<strong>{accountEmail}</strong>
					<p>You are using GlyphBridge's email code sign-in flow.</p>
				</div>

				<div class="auth__summary-card">
					<div class="auth__summary-row">
						<span class="auth__summary-label">Sync status</span>
						<span class={syncBadgeClass}>{syncLabel}</span>
					</div>
					<p>
						{#if syncedAtLabel}
							Last server refresh: {syncedAtLabel}
						{:else}
							We refresh your learner projection after sign-in and when progress sync
							runs.
						{/if}
					</p>
				</div>

				<div class="auth__summary-card">
					<span class="auth__summary-label">Synced lessons</span>
					<strong>{completedLessonCount}</strong>
					<p>
						{#if resumeLessonId}
							Resume lesson {resumeLessonId} on this or another device.
						{:else}
							Your learner projection will set a resume lesson once synced progress
							exists.
						{/if}
					</p>
				</div>
			</div>

			<div class="auth__actions">
				<Button href={resumeHref} variant="primary">
					{#if resumeLessonId}Continue from lesson {resumeLessonId}{:else}Go to lessons{/if}
				</Button>
				<Button
					type="button"
					variant="secondary"
					disabled={refreshingProjection || $learnerProjectionStatus === "loading"}
					onclick={handleRefreshProjection}
				>
					{#if refreshingProjection || $learnerProjectionStatus === "loading"}
						Refreshing...
					{:else}
						Refresh synced progress
					{/if}
				</Button>
			</div>

			<div class="auth__meta">
				<p>
					Local progress stays instant on this device. Account progress becomes canonical
					only after the server validates and projects it.
				</p>
				<form method="POST" action="/auth/sign-out" class="auth__form">
					<Button type="submit" variant="ghost">Sign out</Button>
				</form>
			</div>
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

		&__intro {
			margin-bottom: $space-sm;
		}
	}

	.auth__panel {
		background: var(--surface-panel);
		border: 1px solid var(--color-border);
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
		color: var(--color-text-muted);
	}

	.auth__form {
		display: flex;
		flex-direction: column;
		gap: $space-md;
	}

	.auth__form--verify {
		border-top: 1px solid var(--color-border);
		padding-top: $space-lg;
	}

	.auth__summary {
		display: grid;
		gap: $space-md;
	}

	.auth__summary-card {
		background: var(--surface-interactive);
		border: 1px solid var(--color-border-strong);
		border-radius: $radius-lg;
		display: flex;
		flex-direction: column;
		gap: $space-xs;
		padding: $space-md;
	}

	.auth__summary-card strong {
		font-size: $font-size-xl;
	}

	.auth__summary-card p,
	.auth__meta p {
		color: var(--color-text-muted);
	}

	.auth__summary-label {
		font-size: $font-size-sm;
		font-weight: 700;
		letter-spacing: 0.02em;
		text-transform: uppercase;
	}

	.auth__summary-row {
		align-items: center;
		display: flex;
		gap: $space-md;
		justify-content: space-between;
	}

	.auth__actions {
		display: flex;
		flex-wrap: wrap;
		gap: $space-sm;
	}

	.auth__meta {
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: $space-md;
		padding-top: $space-lg;
	}

	.auth__field {
		display: flex;
		flex-direction: column;
		font-weight: 700;
		gap: $space-xs;
	}

	.auth__hint {
		color: var(--color-text-muted);
		font-size: $font-size-sm;
		font-weight: 500;
	}

	.auth__field input {
		background: var(--color-surface-card);
		border: 1px solid var(--color-border);
		border-radius: $radius-md;
		color: var(--color-text);
		font: inherit;
		padding: $space-sm $space-md;
	}

	.auth__field input::placeholder {
		color: var(--color-text-soft);
	}

	.auth__field input:focus {
		border-color: var(--color-primary);
		box-shadow: var(--focus-ring);
		outline: none;
	}

	.auth__error {
		color: var(--color-danger);
		font-size: $font-size-sm;
	}
</style>
