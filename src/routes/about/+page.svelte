<script lang="ts">
	import ActionGroup from "$lib/components/layout/ActionGroup.svelte";
	import PageShell from "$lib/components/layout/PageShell.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Disclosure from "$lib/components/ui/Disclosure.svelte";
	import Eyebrow from "$lib/components/ui/Eyebrow.svelte";
	import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
	import SourceList from "$lib/components/ui/SourceList.svelte";
</script>

<svelte:head>
	<title>How GlyphBridge Works — Reading a new script, fast</title>
	<meta
		name="description"
		content="GlyphBridge teaches you to read a new script by starting with real words you'd actually encounter — not alphabet charts. Here's how, and the research behind it."
	/>
</svelte:head>

<PageShell>
	<!-- =================== HERO =================== -->
	<section class="hero">
		<div class="hero__copy">
			<Eyebrow>How GlyphBridge works</Eyebrow>
			<h1 class="hero__title">
				Read a new script.
				<span class="hero__title-accent">Fast.</span>
			</h1>
			<p class="hero__lede">
				Most apps drop you in front of an alphabet chart and ask you to memorize it.
				GlyphBridge starts with words you'd actually see on a street sign, a menu, or a
				packet — and teaches the letters as you go.
			</p>
			<ActionGroup justify="center" stackAt="sm" class="hero__actions">
				<Button href="/learn" variant="primary" size="large">Start the first lesson</Button>
			</ActionGroup>
		</div>

		<div class="hero__art" aria-hidden="true">
			<!-- Abstract visual: unknown glyph marks resolving into a readable sign -->
			<svg viewBox="0 0 480 380" role="img" class="hero__svg">
				<title>Unfamiliar marks resolving into a readable sign</title>
				<defs>
					<radialGradient id="heroGlow" cx="50%" cy="40%" r="60%">
						<stop offset="0%" stop-color="rgb(var(--rgb-primary) / 0.18)" />
						<stop offset="100%" stop-color="rgb(var(--rgb-primary) / 0)" />
					</radialGradient>
					<linearGradient id="signFill" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color="var(--color-primary)" />
						<stop offset="100%" stop-color="var(--color-primary-strong)" />
					</linearGradient>
				</defs>

				<circle cx="240" cy="160" r="200" fill="url(#heroGlow)" />

				<!-- scattered question marks in the background (unknown glyphs) -->
				<text x="50" y="60" font-size="34" fill="var(--color-text-soft)" opacity="0.32"
					>?</text
				>
				<text x="410" y="80" font-size="40" fill="var(--color-text-soft)" opacity="0.28"
					>?</text
				>
				<text x="70" y="320" font-size="32" fill="var(--color-text-soft)" opacity="0.32"
					>?</text
				>
				<text x="400" y="310" font-size="36" fill="var(--color-text-soft)" opacity="0.28"
					>?</text
				>
				<text x="380" y="200" font-size="28" fill="var(--color-text-soft)" opacity="0.24"
					>?</text
				>
				<text x="60" y="200" font-size="30" fill="var(--color-text-soft)" opacity="0.24"
					>?</text
				>

				<!-- post -->
				<rect
					x="226"
					y="290"
					width="10"
					height="80"
					rx="2"
					fill="var(--color-text-soft)"
					opacity="0.55"
				/>

				<!-- main sign -->
				<rect x="80" y="120" width="320" height="170" rx="14" fill="url(#signFill)" />
				<rect
					x="90"
					y="130"
					width="300"
					height="150"
					rx="9"
					fill="none"
					stroke="white"
					stroke-opacity="0.35"
					stroke-width="2"
				/>

				<!-- abstract "readable text" bars inside the sign -->
				<rect x="120" y="160" width="240" height="12" rx="6" fill="white" opacity="0.95" />
				<rect x="120" y="184" width="200" height="12" rx="6" fill="white" opacity="0.8" />
				<rect x="120" y="208" width="220" height="12" rx="6" fill="white" opacity="0.65" />
				<rect x="120" y="248" width="80" height="10" rx="5" fill="white" opacity="0.55" />
				<circle cx="220" cy="253" r="5" fill="white" opacity="0.55" />

				<!-- floating colorful tokens (abstract glyph stand-ins) -->
				<g>
					<rect
						x="20"
						y="120"
						width="58"
						height="46"
						rx="10"
						fill="var(--color-surface-card)"
						stroke="var(--color-border-strong)"
					/>
					<path
						d="M35 152 Q49 132 63 152"
						stroke="var(--color-accent)"
						stroke-width="4"
						fill="none"
						stroke-linecap="round"
					/>
					<circle cx="49" cy="138" r="2.5" fill="var(--color-accent)" />
				</g>
				<g>
					<rect
						x="402"
						y="120"
						width="58"
						height="46"
						rx="10"
						fill="var(--color-surface-card)"
						stroke="var(--color-border-strong)"
					/>
					<path
						d="M418 138 L444 138 M418 152 L432 152"
						stroke="var(--color-success)"
						stroke-width="4"
						stroke-linecap="round"
					/>
				</g>
				<g>
					<rect
						x="20"
						y="250"
						width="58"
						height="46"
						rx="10"
						fill="var(--color-surface-card)"
						stroke="var(--color-border-strong)"
					/>
					<path
						d="M35 282 Q35 264 49 264 Q63 264 63 282"
						stroke="var(--color-warning)"
						stroke-width="4"
						fill="none"
						stroke-linecap="round"
					/>
				</g>

				<!-- connecting arrows from tokens to sign -->
				<path
					d="M82 143 L120 175"
					stroke="var(--color-accent)"
					stroke-width="2.5"
					fill="none"
					stroke-linecap="round"
					stroke-dasharray="2 5"
				/>
				<path
					d="M400 143 L355 175"
					stroke="var(--color-success)"
					stroke-width="2.5"
					fill="none"
					stroke-linecap="round"
					stroke-dasharray="2 5"
				/>
				<path
					d="M82 273 L150 240"
					stroke="var(--color-warning)"
					stroke-width="2.5"
					fill="none"
					stroke-linecap="round"
					stroke-dasharray="2 5"
				/>
			</svg>
		</div>
	</section>

	<!-- =================== THE PROBLEM (zigzag, image left) =================== -->
	<section class="block block--muted block--zigzag">
		<div class="block__media" aria-hidden="true">
			<svg viewBox="0 0 320 240" role="img" class="art">
				<title>A wall of unfamiliar letters</title>
				<rect
					x="0"
					y="0"
					width="320"
					height="240"
					rx="14"
					fill="var(--color-surface-card)"
					opacity="0.6"
				/>
				{#each Array.from({ length: 44 }) as _, i}
					{@const col = i % 11}
					{@const row = Math.floor(i / 11)}
					<text
						x={22 + col * 26}
						y={48 + row * 48}
						font-family="serif"
						font-size="22"
						fill="var(--color-text-soft)"
						opacity={0.5 + Math.sin(i) * 0.25}>?</text
					>
				{/each}
				<rect
					x="14"
					y="14"
					width="292"
					height="212"
					rx="10"
					fill="none"
					stroke="var(--color-border-strong)"
					stroke-width="1.5"
				/>
			</svg>
		</div>
		<div class="block__body">
			<Eyebrow>The usual approach</Eyebrow>
			<h2 class="block__title">A chart of 44 letters isn't a place to start.</h2>
			<p class="block__text">
				Traditional courses march you through the alphabet in its native order — letters you
				rarely see first, common ones buried deep, and no real words for weeks. You burn
				through your willpower long before anything clicks.
			</p>
			<p class="block__text block__text--soft">
				Reading is more than letter recognition. It's pattern matching against text you care
				about. Start with the patterns; the letters follow.
			</p>
		</div>
	</section>

	<!-- =================== HOW WE DO IT (4 principles, bigger on desktop) =================== -->
	<section class="block block--primary">
		<SectionHeader
			eyebrow="How we do it"
			title="Four ideas, every lesson."
			description="Each one is simple. Together they make the script feel useful from day one."
		/>

		<div class="principles">
			<!-- Principle 1: Real words -->
			<article class="principle principle--primary">
				<div class="principle__icon" aria-hidden="true">
					<svg viewBox="0 0 80 80" role="img">
						<title>Street sign with text</title>
						<rect
							x="12"
							y="18"
							width="56"
							height="30"
							rx="4"
							fill="var(--color-primary)"
						/>
						<rect x="38" y="48" width="4" height="22" fill="var(--color-text-soft)" />
						<circle cx="24" cy="32" r="3" fill="white" />
						<rect
							x="32"
							y="29"
							width="28"
							height="3"
							rx="1"
							fill="white"
							opacity="0.9"
						/>
						<rect
							x="32"
							y="35"
							width="20"
							height="3"
							rx="1"
							fill="white"
							opacity="0.65"
						/>
					</svg>
				</div>
				<h3 class="principle__title">Real words, not loose letters</h3>
				<p class="principle__text">
					Every lesson is built around one word you'd actually meet outside — a place, a
					food, a sign. You learn the letters by reading something real.
				</p>
				<Disclosure summary="Why it works" class="principle__disclosure">
					<p>
						Learning researchers call automatic word recognition <em
							>orthographic mapping</em
						>. Words become instant after you've sounded them out a handful of times —
						but only if the letter-sound link is real, not memorized as a shape.
						Anchoring every lesson to a meaningful word gives your brain that link from
						the start.
					</p>
					<SourceList
						sources={[
							{
								href: "https://library.ecu.edu/networkingsummit/wp-content/pv-uploads/sites/257/2019/07/ehri.pdf",
								label: "Ehri (2014) — Orthographic Mapping in the Acquisition of Sight Word Reading",
							},
							{
								href: "https://eric.ed.gov/?id=EJ1267539",
								label: "Castles, Rastle & Nation (2018) — Ending the Reading Wars",
							},
						]}
					/>
				</Disclosure>
			</article>

			<!-- Principle 2: Frequency -->
			<article class="principle principle--accent">
				<div class="principle__icon" aria-hidden="true">
					<svg viewBox="0 0 80 80" role="img">
						<title>Frequency bars</title>
						<rect
							x="12"
							y="50"
							width="10"
							height="22"
							rx="2"
							fill="var(--color-accent)"
						/>
						<rect
							x="26"
							y="38"
							width="10"
							height="34"
							rx="2"
							fill="var(--color-accent)"
							opacity="0.85"
						/>
						<rect
							x="40"
							y="26"
							width="10"
							height="46"
							rx="2"
							fill="var(--color-accent)"
							opacity="0.65"
						/>
						<rect
							x="54"
							y="14"
							width="10"
							height="58"
							rx="2"
							fill="var(--color-accent)"
							opacity="0.45"
						/>
					</svg>
				</div>
				<h3 class="principle__title">The most useful letters first</h3>
				<p class="principle__text">
					A small handful of letters does most of the work. We sequence them so the first
					few hours of study unlock the biggest share of everyday text.
				</p>
				<Disclosure summary="Why it works" class="principle__disclosure">
					<p>
						The <em>usage-based</em> view of language learning says you acquire what you see
						often, faster. In most writing systems, a small fraction of the letters covers
						the majority of everyday text. Teaching those first means every minute of study
						returns more text you can actually read.
					</p>
					<SourceList
						sources={[
							{
								href: "https://sites.lsa.umich.edu/nickellis-new/wp-content/uploads/sites/1284/2021/07/4-Ellis.pdf",
								label: "Ellis — Usage-based and form-focused SLA",
							},
							{
								href: "https://tesl-ej.org/wordpress/issues/volume22/ej85/ej85a1/",
								label: "Nation — Word Frequency Levels and L2 Vocabulary Knowledge (TESL-EJ)",
							},
						]}
					/>
				</Disclosure>
			</article>

			<!-- Principle 3: Small bites -->
			<article class="principle principle--success">
				<div class="principle__icon" aria-hidden="true">
					<svg viewBox="0 0 80 80" role="img">
						<title>Stair steps</title>
						<rect
							x="8"
							y="54"
							width="16"
							height="18"
							rx="2"
							fill="var(--color-success)"
							opacity="0.55"
						/>
						<rect
							x="24"
							y="42"
							width="16"
							height="30"
							rx="2"
							fill="var(--color-success)"
							opacity="0.75"
						/>
						<rect
							x="40"
							y="28"
							width="16"
							height="44"
							rx="2"
							fill="var(--color-success)"
							opacity="0.9"
						/>
						<rect
							x="56"
							y="14"
							width="14"
							height="58"
							rx="2"
							fill="var(--color-success)"
						/>
					</svg>
				</div>
				<h3 class="principle__title">Small bites your brain can hold</h3>
				<p class="principle__text">
					Each lesson introduces only the new letters that word needs — usually two or
					three. Old ones come back as review so they actually stick.
				</p>
				<Disclosure summary="Why it works" class="principle__disclosure">
					<p>
						Working memory only holds about four new chunks at a time. Cognitive load
						research shows that overloading it stalls learning — you remember nothing
						instead of something. Smaller, cumulative sets let each piece settle before
						the next arrives.
					</p>
					<SourceList
						sources={[
							{
								href: "https://journals.sagepub.com/doi/10.1177/0963721420922183",
								label: "Paas & van Merriënboer (2020) — Cognitive-Load Theory",
							},
							{
								href: "https://www.cambridge.org/core/books/abs/cambridge-handbook-of-working-memory-and-language/cognitive-load-theory-and-instructional-design-for-language-learning/C1A61C6FC46C173594554509664B2757",
								label: "Cambridge Handbook — Cognitive Load Theory for Language Learning",
							},
						]}
					/>
				</Disclosure>
			</article>

			<!-- Principle 4: Practice -->
			<article class="principle principle--warning">
				<div class="principle__icon" aria-hidden="true">
					<svg viewBox="0 0 80 80" role="img">
						<title>Target</title>
						<circle
							cx="40"
							cy="40"
							r="28"
							fill="none"
							stroke="var(--color-warning)"
							stroke-width="3.5"
						/>
						<circle
							cx="40"
							cy="40"
							r="18"
							fill="none"
							stroke="var(--color-warning)"
							stroke-width="3.5"
							opacity="0.75"
						/>
						<circle cx="40" cy="40" r="8" fill="var(--color-warning)" />
					</svg>
				</div>
				<h3 class="principle__title">Practice that tests recall</h3>
				<p class="principle__text">
					Every lesson ends with short drills — pick the letter, match the meaning, spot
					the look-alike. Retrieving an answer is what locks it in.
				</p>
				<Disclosure summary="Why it works" class="principle__disclosure">
					<p>
						This is the testing effect, plus what Robert Bjork calls <em
							>desirable difficulties</em
						>. Pulling information out of your head is harder than re-reading it, and
						that extra effort is exactly what builds durable memory.
					</p>
					<SourceList
						sources={[
							{
								href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4480221/",
								label: "Kornell et al. — Retrieval Practice and Spacing Effects",
							},
							{
								href: "https://bjorklab.psych.ucla.edu/research/",
								label: "Bjork Learning & Forgetting Lab",
							},
						]}
					/>
				</Disclosure>
			</article>
		</div>
	</section>

	<!-- =================== LESSON FLOW (horizontal timeline) =================== -->
	<section class="block block--card">
		<SectionHeader
			eyebrow="Inside a lesson"
			title="Six steps. Every time."
			description="The same shape for every lesson so you always know what's next."
		/>

		<ol class="timeline" aria-label="The six steps of a lesson">
			<li class="timeline__step">
				<span class="timeline__dot timeline__dot--primary">1</span>
				<h3 class="timeline__title">Intro</h3>
				<p class="timeline__text">Meet the anchor word and where you'll see it.</p>
			</li>
			<li class="timeline__step">
				<span class="timeline__dot timeline__dot--accent">2</span>
				<h3 class="timeline__title">Breakdown</h3>
				<p class="timeline__text">See how the word splits into readable pieces.</p>
			</li>
			<li class="timeline__step">
				<span class="timeline__dot timeline__dot--success">3</span>
				<h3 class="timeline__title">Letters</h3>
				<p class="timeline__text">Learn just the new letters this word needs.</p>
			</li>
			<li class="timeline__step">
				<span class="timeline__dot timeline__dot--warning">4</span>
				<h3 class="timeline__title">Rules</h3>
				<p class="timeline__text">Spot the pattern that makes the word readable.</p>
			</li>
			<li class="timeline__step">
				<span class="timeline__dot timeline__dot--primary">5</span>
				<h3 class="timeline__title">Drills</h3>
				<p class="timeline__text">Short checks to lock in the new material.</p>
			</li>
			<li class="timeline__step">
				<span class="timeline__dot timeline__dot--accent">6</span>
				<h3 class="timeline__title">Complete</h3>
				<p class="timeline__text">Score, summary, next lesson unlocked.</p>
			</li>
		</ol>
	</section>

	<!-- =================== HONEST ROADMAP (zigzag, image right) =================== -->
	<section class="block block--accent block--zigzag block--zigzag-reverse">
		<div class="block__media" aria-hidden="true">
			<svg viewBox="0 0 320 240" role="img" class="art">
				<title>Roadmap of upcoming features</title>
				<path
					d="M30 200 C 80 130, 130 220, 180 130 S 280 80, 290 40"
					fill="none"
					stroke="var(--color-accent)"
					stroke-width="3.5"
					stroke-linecap="round"
					stroke-dasharray="6 8"
				/>
				<g>
					<circle cx="30" cy="200" r="11" fill="var(--color-success)" />
					<text
						x="30"
						y="204"
						text-anchor="middle"
						font-size="13"
						font-weight="700"
						fill="white">✓</text
					>
				</g>
				<g>
					<circle cx="115" cy="170" r="11" fill="var(--color-success)" />
					<text
						x="115"
						y="174"
						text-anchor="middle"
						font-size="13"
						font-weight="700"
						fill="white">✓</text
					>
				</g>
				<circle cx="180" cy="130" r="11" fill="var(--color-accent)" />
				<circle cx="240" cy="85" r="10" fill="var(--color-text-soft)" opacity="0.55" />
				<circle cx="290" cy="40" r="10" fill="var(--color-text-soft)" opacity="0.4" />
			</svg>
		</div>
		<div class="block__body">
			<Eyebrow>What we're still working on</Eyebrow>
			<h2 class="block__title">The honest list.</h2>
			<p class="block__text">
				The research that backs our approach also points to places we can get better. Here's
				what's next.
			</p>
		</div>
	</section>

	<!-- improvements grid sits in its own container, full width -->
	<section class="improvements-wrap">
		<ul class="improvements">
			<li class="improvement">
				<h3 class="improvement__title">Speak and type, not just tap</h3>
				<p class="improvement__text">
					Multiple-choice drills train recognition really well, but production lags. We're
					adding type-the-word and tap-to-build drills so reading turns into writing too.
				</p>
				<Disclosure summary="The research" class="improvement__disclosure">
					<SourceList
						sources={[
							{
								href: "http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Marsh-2005_JEPLMC.pdf",
								label: "Roediger & Marsh (2005) — Positive and Negative Consequences of MC Testing",
							},
							{
								href: "https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2017/01/LittleBjorkMC2014.pdf",
								label: "Little & Bjork — Optimizing multiple-choice tests as tools for learning",
							},
						]}
					/>
				</Disclosure>
			</li>

			<li class="improvement">
				<h3 class="improvement__title">Spaced review, scheduled</h3>
				<p class="improvement__text">
					Old letters come back inside new lessons today, but we don't yet schedule them
					on the intervals the memory research recommends. A standalone review surface is
					coming.
				</p>
				<Disclosure summary="The research" class="improvement__disclosure">
					<SourceList
						sources={[
							{
								href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4480221/",
								label: "Kornell, Castel, Eich & Bjork — Retrieval Practice and Spacing Effects",
							},
						]}
					/>
				</Disclosure>
			</li>

			<li class="improvement">
				<h3 class="improvement__title">Audio at every step</h3>
				<p class="improvement__text">
					Some scripts encode features — tones, stress, length — that are fundamentally a
					sound, not a shape. Native-speaker audio for every anchor word will close that
					gap.
				</p>
				<Disclosure summary="The research" class="improvement__disclosure">
					<SourceList
						sources={[
							{
								href: "https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1410795/full",
								label: "Multimodal cues in L2 lexical tone acquisition (Frontiers in Education, 2024)",
							},
						]}
					/>
				</Disclosure>
			</li>

			<li class="improvement">
				<h3 class="improvement__title">Real text between lessons</h3>
				<p class="improvement__text">
					Vocabulary sticks after eight to twenty meaningful encounters. We're adding
					short, decodable bits of real text — a menu line, a sign, a transit display —
					that you can read between lessons.
				</p>
				<Disclosure summary="The research" class="improvement__disclosure">
					<SourceList
						sources={[
							{
								href: "https://www2.hawaii.edu/~readfl/rfl/April2006/pigada/pigada.html",
								label: "Pigada & Schmitt (2006) — Vocabulary acquisition from extensive reading",
							},
							{
								href: "https://eric.ed.gov/?id=EJ1075485",
								label: "Webb & Chang — Vocabulary Learning via Extensive Reading",
							},
						]}
					/>
				</Disclosure>
			</li>
		</ul>
	</section>

	<!-- =================== CTA =================== -->
	<section class="cta">
		<div class="cta__art" aria-hidden="true">
			<svg viewBox="0 0 120 120" role="img">
				<title>Open book with readable text</title>
				<path
					d="M20 30 Q60 14 100 30 L100 92 Q60 78 20 92 Z"
					fill="rgb(var(--rgb-primary) / 0.18)"
					stroke="var(--color-primary)"
					stroke-width="2.5"
				/>
				<line
					x1="60"
					y1="22"
					x2="60"
					y2="86"
					stroke="var(--color-primary)"
					stroke-width="2"
					opacity="0.7"
				/>
				<!-- abstract text lines on each page -->
				<rect
					x="28"
					y="42"
					width="26"
					height="4"
					rx="2"
					fill="var(--color-primary)"
					opacity="0.85"
				/>
				<rect
					x="28"
					y="52"
					width="22"
					height="4"
					rx="2"
					fill="var(--color-primary)"
					opacity="0.65"
				/>
				<rect
					x="28"
					y="62"
					width="24"
					height="4"
					rx="2"
					fill="var(--color-primary)"
					opacity="0.5"
				/>
				<rect
					x="66"
					y="42"
					width="26"
					height="4"
					rx="2"
					fill="var(--color-accent)"
					opacity="0.85"
				/>
				<rect
					x="66"
					y="52"
					width="20"
					height="4"
					rx="2"
					fill="var(--color-accent)"
					opacity="0.65"
				/>
				<rect
					x="66"
					y="62"
					width="24"
					height="4"
					rx="2"
					fill="var(--color-accent)"
					opacity="0.5"
				/>
			</svg>
		</div>
		<div class="cta__copy">
			<h2 class="cta__title">Try the first lesson.</h2>
			<p class="cta__text">
				Eight minutes. One real word. A handful of letters you'll see everywhere after.
			</p>
			<ActionGroup justify="start" stackAt="sm" class="cta__actions">
				<Button href="/learn" variant="primary" size="large">Start learning</Button>
			</ActionGroup>
		</div>
	</section>
</PageShell>

<style lang="scss">
	// ============================================================
	// Hero — desktop: 2 columns with bold illustration on the right
	// ============================================================
	.hero {
		align-items: center;
		display: grid;
		gap: $space-2xl;
		grid-template-columns: 1fr;
		padding: clamp($space-xl, 5vw, $space-3xl) 0 $space-2xl;

		@media (min-width: $bp-lg) {
			gap: $space-3xl;
			grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
		}

		.hero__copy {
			display: flex;
			flex-direction: column;
			gap: $space-md;
			text-align: center;

			@media (min-width: $bp-lg) {
				align-items: flex-start;
				text-align: left;
			}

			.hero__title {
				font-size: clamp($font-size-3xl, 6vw, 3.6rem);
				font-weight: 800;
				line-height: 1.05;
				margin: 0;

				.hero__title-accent {
					color: var(--color-accent);
				}
			}

			.hero__lede {
				color: var(--color-text-muted);
				font-size: $font-size-lg;
				line-height: 1.65;
				margin: 0;
				max-width: 36rem;

				@media (min-width: $bp-lg) {
					font-size: $font-size-xl;
				}
			}

			:global(.hero__actions) {
				margin-top: $space-sm;

				@media (min-width: $bp-lg) {
					justify-content: flex-start;
				}
			}
		}

		.hero__art {
			align-items: center;
			display: flex;
			justify-content: center;

			.hero__svg {
				filter: drop-shadow(0 24px 40px rgb(var(--rgb-primary) / 0.15));
				height: auto;
				max-width: 520px;
				width: 100%;
			}
		}
	}

	// ============================================================
	// Generic block (full-width, colored panels)
	// ============================================================
	.block {
		border-radius: $radius-xl;
		display: flex;
		flex-direction: column;
		gap: $space-xl;
		padding: clamp($space-xl, 4vw, $space-3xl);

		&.block--muted {
			background: var(--color-surface-muted);
			border: 1px solid var(--color-border);
		}

		&.block--primary {
			background: rgb(var(--rgb-primary) / 0.08);
			border: 1px solid rgb(var(--rgb-primary) / 0.2);
		}

		&.block--accent {
			background: var(--surface-panel-accent);
			border: 1px solid rgb(var(--rgb-accent) / 0.24);
		}

		&.block--card {
			background: var(--color-surface-card);
			border: 1px solid var(--color-border);
			box-shadow: var(--shadow-soft);
		}

		&.block--zigzag {
			align-items: center;
			display: grid;
			gap: $space-xl;
			grid-template-columns: 1fr;

			@media (min-width: $bp-md) {
				gap: $space-2xl;
				grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
			}
		}

		&.block--zigzag-reverse {
			@media (min-width: $bp-md) {
				grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);

				.block__media {
					order: 2;
				}
			}
		}

		.block__media {
			display: flex;
			justify-content: center;

			.art {
				height: auto;
				max-width: 360px;
				width: 100%;
			}
		}

		.block__body {
			display: flex;
			flex-direction: column;
			gap: $space-sm;

			.block__title {
				font-size: clamp($font-size-2xl, 3.5vw, $font-size-3xl);
				margin: 0;
			}

			.block__text {
				color: var(--color-text-muted);
				font-size: $font-size-lg;
				line-height: 1.65;
				margin: 0;

				&.block__text--soft {
					color: var(--color-text-soft);
					font-size: $font-size-base;
				}
			}
		}
	}

	// ============================================================
	// Principles — 1 col mobile, 2 col tablet, 4 col desktop
	// ============================================================
	.principles {
		display: grid;
		gap: $space-lg;
		grid-template-columns: 1fr;

		@media (min-width: $bp-sm) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: $bp-lg) {
			gap: $space-md;
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.principle {
		background: var(--color-surface-card);
		border: 1px solid var(--color-border);
		border-radius: $radius-lg;
		box-shadow: var(--shadow-soft);
		display: flex;
		flex-direction: column;
		gap: $space-md;
		padding: $space-lg;
		transition:
			transform $transition-base,
			box-shadow $transition-base;

		&:hover {
			box-shadow: var(--shadow-card-hover);
			transform: translateY(-3px);
		}

		.principle__icon {
			align-items: center;
			background: var(--color-surface-muted);
			border-radius: $radius-lg;
			display: inline-flex;
			height: 4rem;
			justify-content: center;
			width: 4rem;

			svg {
				height: 100%;
				width: 100%;
			}
		}

		&.principle--primary {
			.principle__icon {
				background: rgb(var(--rgb-primary) / 0.12);
			}
		}

		&.principle--accent {
			.principle__icon {
				background: rgb(var(--rgb-accent) / 0.12);
			}
		}

		&.principle--success {
			.principle__icon {
				background: rgb(var(--rgb-success) / 0.12);
			}
		}

		&.principle--warning {
			.principle__icon {
				background: rgb(var(--rgb-warning) / 0.18);
			}
		}

		.principle__title {
			font-size: $font-size-lg;
			line-height: 1.25;
			margin: 0;
		}

		.principle__text {
			color: var(--color-text-muted);
			font-size: $font-size-sm;
			line-height: 1.6;
			margin: 0;

			@media (min-width: $bp-md) {
				font-size: $font-size-base;
			}
		}

		:global(.principle__disclosure) {
			margin-top: auto;
		}
	}

	// ============================================================
	// Timeline — horizontal subway-map style on desktop
	// ============================================================
	.timeline {
		display: grid;
		gap: $space-lg;
		grid-template-columns: 1fr;
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;

		@media (min-width: $bp-md) {
			gap: $space-md;
			grid-template-columns: repeat(6, 1fr);
			padding-top: $space-lg;

			// horizontal connecting line
			&::before {
				background: repeating-linear-gradient(
					to right,
					var(--color-border-strong) 0,
					var(--color-border-strong) 6px,
					transparent 6px,
					transparent 12px
				);
				content: "";
				height: 2px;
				left: 8%;
				position: absolute;
				right: 8%;
				top: calc($space-lg + 1.25rem);
				z-index: 0;
			}
		}

		.timeline__step {
			align-items: flex-start;
			display: flex;
			gap: $space-md;
			position: relative;
			z-index: 1;

			@media (min-width: $bp-md) {
				align-items: center;
				flex-direction: column;
				gap: $space-sm;
				padding: 0 $space-xs;
				text-align: center;
			}

			.timeline__dot {
				align-items: center;
				border-radius: $radius-full;
				box-shadow: 0 0 0 4px var(--color-surface-card);
				color: white;
				display: inline-flex;
				flex-shrink: 0;
				font-size: $font-size-base;
				font-weight: 800;
				height: 2.5rem;
				justify-content: center;
				width: 2.5rem;

				&.timeline__dot--primary {
					background: var(--color-primary);
				}

				&.timeline__dot--accent {
					background: var(--color-accent);
				}

				&.timeline__dot--success {
					background: var(--color-success);
				}

				&.timeline__dot--warning {
					background: var(--color-warning);
					color: #2a1a0e;
				}
			}

			.timeline__title {
				font-size: $font-size-base;
				font-weight: 700;
				margin: 0;

				@media (min-width: $bp-md) {
					margin-top: $space-xs;
				}
			}

			.timeline__text {
				color: var(--color-text-muted);
				font-size: $font-size-sm;
				line-height: 1.5;
				margin: 0;
			}
		}
	}

	// ============================================================
	// Improvements — 2 col grid on desktop
	// ============================================================
	.improvements-wrap {
		display: contents;
	}

	.improvements {
		display: grid;
		gap: $space-md;
		grid-template-columns: 1fr;
		list-style: none;
		margin: 0;
		padding: 0;

		@media (min-width: $bp-md) {
			gap: $space-lg;
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.improvement {
		background: var(--color-surface-card);
		border: 1px solid var(--color-border);
		border-left: 4px solid var(--color-accent);
		border-radius: $radius-lg;
		display: flex;
		flex-direction: column;
		gap: $space-sm;
		padding: $space-lg;
		transition:
			transform $transition-base,
			box-shadow $transition-base;

		&:hover {
			box-shadow: var(--shadow-card-hover);
			transform: translateY(-2px);
		}

		.improvement__title {
			font-size: $font-size-lg;
			margin: 0;
		}

		.improvement__text {
			color: var(--color-text-muted);
			line-height: 1.6;
			margin: 0;
		}

		:global(.improvement__disclosure) {
			margin-top: auto;
		}
	}

	// ============================================================
	// CTA — 2 col with side art on desktop
	// ============================================================
	.cta {
		align-items: center;
		background: linear-gradient(
			135deg,
			rgb(var(--rgb-primary) / 0.14),
			rgb(var(--rgb-accent) / 0.14)
		);
		border: 1px solid var(--color-border);
		border-radius: $radius-xl;
		display: grid;
		gap: $space-lg;
		grid-template-columns: 1fr;
		padding: clamp($space-xl, 4vw, $space-2xl);
		text-align: center;

		@media (min-width: $bp-md) {
			gap: $space-2xl;
			grid-template-columns: auto 1fr;
			padding: $space-2xl $space-3xl;
			text-align: left;
		}

		.cta__art {
			display: flex;
			justify-content: center;

			svg {
				height: 7rem;
				width: 7rem;

				@media (min-width: $bp-md) {
					height: 9rem;
					width: 9rem;
				}
			}
		}

		.cta__copy {
			align-items: center;
			display: flex;
			flex-direction: column;
			gap: $space-sm;

			@media (min-width: $bp-md) {
				align-items: flex-start;
			}

			.cta__title {
				font-size: clamp($font-size-2xl, 3.5vw, $font-size-3xl);
				margin: 0;
			}

			.cta__text {
				color: var(--color-text-muted);
				font-size: $font-size-lg;
				margin: 0;
				max-width: 32rem;
			}

			:global(.cta__actions) {
				margin-top: $space-sm;
			}
		}
	}
</style>
