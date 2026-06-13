# Glyphin Learning Philosophy

> Canonical pedagogical concept document. Curriculum authors, designers, and engineers should treat this file as the source of truth for **what Glyphin teaches, why it teaches that way, how lessons are structured, and which principles bind every course**. Curriculum-specific sequencing (e.g. Thai) lives in sibling concept files such as [approach-thai.md](./approach-thai.md); this file is script-agnostic.

## 1. What Glyphin Is

Glyphin is a **real-word-first reading app for unfamiliar writing systems**. Its job is to turn opaque script into legible text for an adult learner, fast enough that the learner feels useful momentum inside the first session.

Concretely:

- The public unit is a **course**: one language × one script × one ordered curriculum.
- Every lesson is anchored to **one real word** a learner could plausibly encounter outside the app — on a sign, a menu, a packet, a transit display, a shopfront.
- Lessons teach the **smallest set of graphemes and rules** needed to decode that anchor, plus the patterns that generalize from it.
- Practice is drill-based, deterministic, and tightly scoped to what the lesson just introduced, with cumulative review of earlier material.

Glyphin is deliberately **not** an alphabet chart, a grammar course, a phrasebook, a translation tool, or a passive flashcard deck. The unit of progress is _decoded useful text_, not _symbols memorized_.

## 2. Why This Approach — Backed by Research

The conventional way to teach a new script (start at the top of the alphabet chart, march through 44+ symbols in their native lexicographic order, drill them in isolation, then years later try to read something useful) is pedagogically defensible only by tradition. Glyphin inverts that order on the strength of several converging bodies of evidence.

### 2.1 The Usage-Based Account: frequency drives acquisition

Modern second-language acquisition research is dominated by **usage-based** models, which hold that linguistic knowledge — including the mapping of graphemes to phonemes — emerges from statistical regularities in the input a learner actually encounters ([Ellis, 2002, _Frequency effects in language processing_](https://sites.lsa.umich.edu/nickellis-new/wp-content/uploads/sites/1284/2021/07/4-Ellis.pdf); [Ellis & Wulff on the usage-based approach](https://www.researchgate.net/publication/388617427_The_Role_of_Input_Frequency_and_Different_Proficiency_Levels_on_the_Perception_of_English_Nominal_Suffixes_by_L1_Thai_Learners_A_Case_of_the_Usage-Based_Account)). High-frequency forms acquire stronger, more entrenched representations; rare forms remain weak until enough encounters accumulate ([_Word Frequency Levels and L2 Learners' Vocabulary Knowledge_, TESL-EJ](https://tesl-ej.org/wordpress/issues/volume22/ej85/ej85a1/)).

The direct implication for a script app: teach the **graphemes and words that appear most often first**, because every minute of study returns more decoded text per unit of effort. A corpus-frequency-ordered Thai curriculum, for example, can have a learner reading ~80% of common consonants after only ~10 graphemes ([Onsuwan et al., _Frequency of Occurrence of Phonemes and Syllables in Thai_, ICPhS 2015](https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2015/Papers/ICPHS1013.pdf); [_Corpus-Based Vocabulary List for Thai Language_, JAIT](https://www.jait.us/uploadfile/2023/JAIT-V14N2-319.pdf)).

### 2.2 Systematic grapheme–phoneme correspondence beats whole-word guessing

The Science of Reading consensus, drawn from the National Reading Panel and replicated across decades, is that **explicit, systematic teaching of grapheme–phoneme correspondences (GPCs)** produces significantly better reading outcomes than meaning-first or whole-language approaches ([National Reading Panel, 2003](https://eric.ed.gov/?id=ED479646); [Castles, Rastle & Nation, 2018, _Ending the Reading Wars_](https://eric.ed.gov/?id=EJ1267539)). Glyphin's lesson contract — _introduce only the new graphemes required for this lesson, then surface the rule that ties them to sound, then drill it_ — is a direct implementation of systematic phonics applied to a non-Roman script.

### 2.3 Orthographic mapping is what makes a "sight word"

Ehri's orthographic-mapping research is the bridge between "decode a word" and "recognize it instantly." Sight-word recognition is **not** rote memorization of a shape; it is the automatic recall of a fully decoded word whose letter–sound mapping has been internalized through repeated, phonologically grounded exposure ([Ehri, 2014, _Orthographic Mapping in the Acquisition of Sight Word Reading_](https://library.ecu.edu/networkingsummit/wp-content/pv-uploads/sites/257/2019/07/ehri.pdf)). Once a learner has the GPCs in place, only **one to four well-decoded exposures** are typically needed to make a word automatic.

This is exactly why Glyphin anchors every lesson to a real word and decodes it before drilling: we are not asking the learner to memorize a glyph in the abstract, we are giving them an immediate, repeatable mapping from the glyph to a meaningful, pronounceable, real-world unit.

### 2.4 Cognitive load theory: small cumulative sets, not symbol firehoses

Cognitive Load Theory ([Sweller, 1988; Paas & van Merriënboer, 2020](https://journals.sagepub.com/doi/10.1177/0963721420922183)) shows working memory can hold roughly four chunks of novel information at once, and that **extraneous and intrinsic load compete for the same limited budget**. A first lesson that dumps 44 consonants, 32 vowels, 4 tone marks, and 3 consonant classes onto an adult learner will saturate working memory before any of it can be encoded.

Glyphin's lesson contract minimizes intrinsic load by:

- introducing only the graphemes the anchor word requires,
- making rules concrete by attaching them to the word that just used them,
- offloading extraneous load through consistent step structure (intro → breakdown → letters → rules → drills → complete).

This is a deliberate "chunk-and-pass" design — small cumulative sets that the learner can actually integrate before more material is layered on.

### 2.5 Real-world anchors drive motivation and self-efficacy

Motivation is one of the strongest non-cognitive predictors of language-learning success ([Dörnyei, in _Motivation in SLA: A State of the Art_](https://files.eric.ed.gov/fulltext/ED585770.pdf)). The strongest single motivator for an adult beginner is **noticing that the script is working** — that a sign, a menu, a station name suddenly makes sense. Self-efficacy ("I can do this") is itself positively correlated with retention ([Wang et al. on Thai learning self-efficacy](https://pmc.ncbi.nlm.nih.gov/articles/PMC10046007/)).

Environmental print — the script the learner physically lives next to — is therefore not a "fun extra," it is **the validation surface** for the curriculum. We pick anchor words because a learner has a high probability of seeing them in the wild within hours of the lesson.

### 2.6 Desirable difficulties: drills earn their keep when retrieval is effortful

Robert Bjork's framework of [_desirable difficulties_](https://bjorklab.psych.ucla.edu/research/) holds that learning is durably stronger when retrieval is _harder_ in the moment — spaced rather than massed, mixed rather than blocked, recalled rather than re-read ([Bjork & Bjork; Roediger & Karpicke on the testing effect](https://pmc.ncbi.nlm.nih.gov/articles/PMC4480221/)). A drill that asks the learner to retrieve the sound of a glyph after a short gap and among distractors does more for long-term retention than another minute of staring at a flashcard.

This is why Glyphin ends every lesson with drills rather than re-reading, and why review graphemes from prior lessons keep appearing in later lessons rather than being declared "done."

## 3. How Glyphin Structures a Curriculum

Every Glyphin course is defined by a strict, repeatable architecture. The same shape works for any script because the contract is script-agnostic — it carries content, it does not enshrine any particular language's quirks.

### 3.1 The Lesson Contract (learning + practice)

Every lesson, in every course, follows the same two-phase flow:

1. **Learning** — present the anchor word, break it down, teach the new graphemes, surface the governing rules, and end with two guided same-letters reads before any score is involved.
2. **Practice** — move into a separate practice deck, a quick recap pass, and a scored checkpoint that unlocks the next lesson only after a passing score.

This contract is enforced by the runtime data model ([`src/lib/data/types.ts`](../../src/lib/data/types.ts#L114-L133)) and by the step components in [`src/lib/components/lesson/`](../../src/lib/components/lesson/). Components render the contract — they do not invent lesson-specific structures, and curriculum facts are never duplicated into UI code.

### 3.2 Lesson Anatomy

Each lesson must define:

- A stable numeric `id` and a `stage` (the curriculum band it belongs to).
- A human-readable `title` whose first half is the anchor word in script.
- One `anchorWord` with Thai/script form, romanization, gloss, category, a syllable breakdown, and a context note explaining where the learner will actually meet this word.
- An ordered `vocabulary` list of `LessonVocabularyEntry` items, each tagged as `core` or `extension`, labeled as `real`, `phrase`, or `nonsense`, and flagged for drill eligibility. Every lesson should aim for at least ten core practice targets. Later lessons should also include an optional extension set for extra transfer reps.
- A `newLetters` set — only the graphemes introduced for the first time in this lesson.
- A `rulesIntroduced` set — concise, named, reusable orthographic/phonetic rules with examples.
- A `drills` set covering at least recognition, mapping, sound, and visual discrimination.
- An optional `reviewLetters` list of prior-lesson graphemes that should resurface for spaced reinforcement.

### 3.3 Stage Bands

Courses are organized into ordered **stages** that move from highest decoding payoff to most marginal coverage:

- **Early stages** introduce the small core of graphemes and vowels that decode the largest share of real text, in CV / CVC frames with predictable tone behavior.
- **Middle stages** add structural complexity (non-linear vowels, tone markers, dead/live syllables, silent carriers) by anchoring each new piece in a high-frequency sight word that needs that rule.
- **Late stages** introduce loanwords, complex clusters, silent markers, and irregular forms, using the learner's existing L1 phonology as scaffolding where possible.

For the Thai course, the concrete six-level sequence is specified in [approach-thai.md](./approach-thai.md) and tracked in [.ai/curriculum/thai.md](../../.ai/curriculum/thai.md).

### 3.4 Progress Model

- Progression is **linear** by default — the next lesson unlocks only after the previous lesson's scored Practice phase is passed.
- Progress is **course-scoped**, not global. A second course starts fresh.
- The canonical learner state is learning completion plus scored Practice results. Everything else (known graphemes, known words, unlock state, review eligibility) is **derived**, never stored as a parallel source of truth.
- Review and free-practice surfaces draw from lessons whose Practice phase has been passed, so the learner is never asked to retrieve material that was never taught.

### 3.5 Data ownership and boundaries

- Curriculum content is **canonical data**: serializable, schema-driven, free of presentation markup, and stable across releases.
- Routes own page orchestration and metadata; reusable components own rendering; state layers own persistence and derived progress. Curriculum data never leaks into rendering, and rendering never invents curriculum facts.
- Components and DTOs are **script-agnostic** — they speak in `course`, `text`, `segments`, `graphemes`, never in language-specific field names.

## 4. Principles Every Course Must Follow

These are the binding rules. If a proposed lesson, drill, vocabulary item, or curriculum change violates one, the burden of proof is on the change.

### 4.1 Pedagogical Principles

1. **Decoding payoff over symbol coverage.** Order graphemes by the volume of real text they unlock, not by the order they appear in a native chart.
2. **Every lesson has exactly one real-world anchor word.** No abstract symbol-of-the-day lessons. If you can't name where a learner would see this word outside the app, it is not yet an anchor.
3. **Teach rules from words, not theory from rules.** Rules are surfaced in service of the word the learner is currently decoding. The 3×5 tone matrix is not a Lesson 1 concept.
4. **Introduce the smallest cumulative set that the anchor requires.** Resist the urge to "cover" a category exhaustively because the word touches it.
5. **Reinforce earlier material through review, not repetition of the primary path.** Old graphemes resurface in new lessons; the learner is never moved backwards.
6. **Anchor mnemonics in the glyph's visual or behavioral shape, not in arbitrary L1 puns.** Mnemonics buy initial encoding, but only if they connect to a feature that will still be true the next time the learner sees the glyph.
7. **Validate every level against environmental print.** Each stage must measurably increase the percentage of signage / menus / packaging / transit text the learner can decode. If a stage doesn't move that needle, it doesn't ship.

### 4.2 Authoring Principles

1. **One anchor word per lesson, plus substantial practice vocabulary.** Core practice targets should reuse only graphemes already introduced (or being introduced this lesson), should appear inside the lesson before scored drills, and should usually number at least ten. Later lessons should also include an optional extension set. Show the target first, then reveal pronunciation and meaning after the learner has tried to read it. When the real pool is too small, clearly tagged nonsense targets are acceptable as sound-only decoding practice.
2. **Every new grapheme is introduced exactly once.** Subsequent appearances are `review`, not `new`.
3. **Every rule has a name, a one-line summary, an explanation, and concrete examples.** Rules are reusable named units; do not paraphrase the same rule under three names.
4. **Every drill targets a specific competence** — recognition (glyph → sound), mapping (word → meaning), sound (correct pronunciation), or visual discrimination (the right form among near look-alikes). Don't ship four drills that test the same competence.
5. **Distractors must be plausible.** Near look-alikes, near sounds, semantically adjacent meanings. Random distractors waste the slot.
6. **Context notes must be honest.** "You'll see this on menus" is acceptable only if you can name a menu where you saw it.

### 4.3 Engineering Principles

1. **Curriculum lives in data, never in components.** No lesson facts in `.svelte` files.
2. **Identifiers are stable.** Ordering and IDs are part of the learning design, not free-floating.
3. **DTOs are script-agnostic.** Names like `text`, `segments`, `graphemes` carry across languages; `thai`, `consonant_class`, etc. live in curriculum metadata, not in the route or component API.
4. **Derive, don't store, anything that can be derived.** Known graphemes, unlock state, review eligibility are functions of completed lessons.
5. **Server boundaries are non-negotiable for any privileged read or write** (see [AGENTS.md](../../AGENTS.md) and [db.md](../db.md)).

### 4.4 Decision Filter

When considering any change to a course or to the framework, run it through these questions in order:

- Does this help learners decode useful text sooner?
- Is this concept owned by curriculum data, by rendering, or by progress state?
- Can this model still describe another writing system without renaming core concepts?
- Are we about to store a fact that should be derived?
- Does this preserve the fixed lesson flow unless there is a concrete product reason to change it?

A "no" on any of the first three is a strong signal the change is wrong-shaped.

## 5. Potential Improvements and Open Tensions

This section is honest. Our approach is well-supported in its core, but the literature also flags places where current Glyphin defaults are weaker than they could be. Each item below is a research-backed candidate for the roadmap, not a current promise.

### 5.1 Multiple-choice drills under-train production

Glyphin's drill primitives (`recognize`, `match`, `sound`, `spot`) are all four-option multiple-choice. Multiple-choice testing **is** a desirable difficulty and does drive retention, but the literature is clear that it preferentially trains **recognition** at the cost of **production**, and can occasionally encode plausible-but-wrong distractors as "false knowledge" if a learner picks a lure repeatedly ([Roediger & Marsh, 2005, _The Positive and Negative Consequences of Multiple-Choice Testing_](http://psychnet.wustl.edu/memory/wp-content/uploads/2018/04/Roediger-Marsh-2005_JEPLMC.pdf); [Little & Bjork, _Optimizing multiple-choice tests as tools for learning_](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2017/01/LittleBjorkMC2014.pdf)). A linguistic critique additionally notes MC items "cannot assess productive language skills" ([_A Linguistic Perspective on Multiple Choice Questioning_](https://www.researchgate.net/publication/238398042_A_Linguistic_Perspective_on_Multiple_Choice_Questioning)).

**Candidate change:** add at least one **production-style** drill per lesson — type the romanization, tap-to-build the word from its graphemes, or speak-and-compare against a reference. This raises drill difficulty in the desirable direction and closes the recognition / production gap.

### 5.2 No explicit spacing or retrieval scheduling

Our review system surfaces prior graphemes inside later lessons, which is a form of cumulative review, but we do not yet do **explicitly scheduled spaced retrieval**. The spacing effect is one of the most replicated findings in learning science ([Kornell, Castel, Eich & Bjork on retrieval practice and spacing effects](https://pmc.ncbi.nlm.nih.gov/articles/PMC4480221/)), and Bjork's research is clear that spaced retrieval beats massed practice substantially for long-term retention.

**Candidate change:** add a lightweight spaced-review surface that draws from completed lessons on an expanding interval (Leitner-style is sufficient; full SM-2/FSRS is optional). Keep it _outside_ the linear lesson path so it does not pollute the progression contract, but treat it as a first-class learner activity. The `.ai/curriculum/thai.md` tracker already lists spaced-repetition projections as "not in scope yet" — this is the research-backed argument for moving it into scope.

### 5.3 Mnemonics are useful but oversold

Glyphin writes a mnemonic for every new grapheme. The keyword/mnemonic method does work — meta-analyses show modest retention gains — but it has documented weaknesses: it equates dissimilar L1/L2 phonemes, generates extended recall latencies, and **provided** mnemonics consistently underperform **learner-generated** ones ([Wang, Thomas & Ouellette, summarized in _Use of Mnemonics in Learning Novel Foreign Vocabulary: Help or Hindrance?_](https://journals.library.columbia.edu/index.php/SALT/article/view/1661/705); [Levin et al. on long-term limitations of keyword mnemonics](https://www.researchgate.net/publication/232550022_Mnemotechnics_Some_limitations_of_the_mnemonic_keyword_method_for_the_study_of_foreign_language_vocabulary)). [Adding keyword mnemonics _to_ retrieval practice can compound benefits](https://link.springer.com/article/10.3758/s13421-019-00936-2), but mnemonics in isolation are a fragile crutch.

**Candidate change:** keep authored mnemonics as defaults but (a) bias them toward **shape- and behavior-based** associations (which generalize) over **L1-pun** associations (which don't), and (b) consider giving learners a slot to **write their own** mnemonic at lesson time, since learner-generated cues encode more durably.

### 5.4 Tone is currently taught visually only — no audio

The Thai curriculum teaches tone marks as visual modifiers and tone-bearing sight words. That matches our reading-first scope, but tone is fundamentally **auditory**, and the strongest known training method for L2 lexical tone is **High-Variability Phonetic Training (HVPT)** — multiple speakers, multiple contexts, immediate auditory feedback ([_Multimodal cues in L2 lexical tone acquisition_, Frontiers in Education, 2024](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1410795/full)). Multimodal cues (audio + visual pitch contour) reliably outperform unimodal.

**Candidate change:** treat audio as a v2 first-class asset rather than an "optional nice-to-have" (the Thai tracker currently classes audio as out-of-scope). At minimum, attach a reference recording to every anchor word and every tone-marked drill prompt. The reading-first identity of the app does not have to change for this; tone perception is the bottleneck the audio fixes.

### 5.5 Interleaving may be premature for absolute beginners

Bjork's framework recommends interleaved over blocked practice — but recent applied research in L2 instruction shows the picture is more nuanced. **Blocked early practice followed by interleaved later practice** ("hybrid" scheduling) outperforms either pure strategy for declarative knowledge in low-achieving or beginner learners ([Hwang, 2025, _Undesirable Difficulty of Interleaved Practice_, Language Learning](https://onlinelibrary.wiley.com/doi/10.1111/lang.12659); [Nakata & Suzuki, 2019, _Effects of Blocking, Interleaving, and Increasing Practice_, MLJ](https://yuichisuzuki.net/wp-content/uploads/2023/04/Nakata-Suzuki-2019-MLJ.pdf)).

**Current state:** within a lesson, Glyphin is essentially blocked (all drills target the lesson's new material). Across lessons, we get implicit interleaving via review graphemes. This is approximately right for beginners, but we have not made the choice deliberately.

**Candidate change:** make the schedule explicit. State in the curriculum-authoring guide that drills _inside_ a lesson should remain blocked, and that interleaving should happen at the cross-lesson review surface (see §5.2). This is one of the few cases where the research supports keeping our default and being more confident in it.

### 5.6 Extensive-reading exposure is missing

The single best-supported finding in L2 vocabulary research is that **repeated, meaningful, contextual exposure** drives durable retention — typically 8–20 encounters in context are needed for stable acquisition ([Pigada & Schmitt, 2006, _Vocabulary acquisition from extensive reading_](https://www2.hawaii.edu/~readfl/rfl/April2006/pigada/pigada.html); [_Extensive Reading and Vocabulary Acquisition_, Nation summarized in TESL-EJ](https://tesl-ej.org/wordpress/issues/volume22/ej85/ej85a1/); [Webb & Chang on frequency and distribution in extensive reading](https://eric.ed.gov/?id=EJ1075485)). Twelve lessons in a row that each feature an anchor once do not give a word twelve meaningful encounters.

**Candidate change:** introduce a low-friction "extensive reading" surface — short, level-appropriate decodable strings (a menu line, a sign, a transit display) assembled from already-taught graphemes — that the learner can read between lessons. This is the highest-leverage missing piece if we want decoding fluency, not just decoding ability.

### 5.7 Linear unlock model may not match retention reality

Our progress model is "lesson is complete when its drills are scored." That is operationally simple but it doesn't measure **retention** — a learner can score 5/5 on Lesson 3 and have forgotten Lesson 1's graphemes entirely. The orthographic-mapping literature suggests retention only stabilizes after spaced retrievals, not first-pass drills ([Ehri, 2014](https://library.ecu.edu/networkingsummit/wp-content/pv-uploads/sites/257/2019/07/ehri.pdf)).

**Candidate change:** keep the linear unlock model (it protects the lesson contract and the simplicity story), but add a **retention check** — a periodic, low-stakes review session covering 3–5 random items from older completed lessons — as a non-blocking quality signal. If retention on lesson N's graphemes is dropping below threshold, surface a targeted review nudge rather than rewinding the path.

### 5.8 Sight-word lists are weakly motivated above level 5

Our level-6 Thai list is mostly globalization loanwords (`คอมพิวเตอร์`, `เซเว่น`, `แบงก์`, `ไวไฟ`). These are defensible on token-frequency grounds for an urban traveler and they exploit L1 phonological scaffolding ([Tsukada on Thai final stops vs. English](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/discrimination-of-english-and-thai-words-ending-with-voiceless-stops-by-native-thai-listeners-differing-in-english-experience/CCAD189EDBE6B79624B7B6C52B8EB2D1)) — but they also teach the learner a register (transliterated English) that does not generalize to native vocabulary. Worth noting in the curriculum-authoring guide so we don't over-rely on them.

**Candidate change:** at level 6 and beyond, cap loanwords at roughly 1 per 3 lessons and bias the rest toward native high-frequency forms whose graphemes are now in reach. The frequency dividend is roughly equal; the generalization dividend is much higher.

## 6. Summary

Glyphin teaches script-illiterate adults to read real text in a new writing system, fast. It does that by sequencing graphemes by **decoding payoff**, anchoring every lesson in **one real-world word**, asking learners to transfer those graphemes into **same-lesson practice reads before answers are revealed**, teaching **rules from words**, splitting instruction from mastery checking, and treating environmental print as the validation surface.

The approach is consistent with the usage-based account of L2 acquisition, systematic-phonics evidence, Ehri's orthographic mapping, cognitive-load theory, Bjork's desirable-difficulty framework, and motivation research. The main places it can still grow are: adding **production drills**, adding **scheduled spaced retrieval**, adding **audio for tone**, adding a **between-lessons extensive-reading surface**, and being **explicit about the blocked-then-interleaved schedule** the research supports.

## Related Documents

- [app-philosophy.md](../app-philosophy.md) — product-shape framing and decision rules
- [approach-thai.md](./approach-thai.md) — concrete Thai-language sequencing
- [.ai/curriculum/thai.md](../../.ai/curriculum/thai.md) — current Thai authoring status
- [db.md](../db.md) and [database-dto-spec.md](../database-dto-spec.md) — schema and DTO contracts for curriculum delivery
- [AGENTS.md](../../AGENTS.md) — repo-wide engineering standards
