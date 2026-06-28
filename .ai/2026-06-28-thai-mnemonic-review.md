# Thai Mnemonic Review

## Scope

- Review the Thai lesson grapheme mnemonics shown in the lesson `Remember:` sections.
- Prefer established Thai alphabet/object associations when they support recall.
- Replace weak abstract shape descriptions with stronger visual, sound, or canonical-name cues.
- Keep the current curriculum data shape and defer mnemonic illustrations as a future feature.

## Progress

- Created tracker.
- Identified `src/lib/data/thai.ts` as the lesson content source for the app.
- Reviewed the current 24 introduced Thai grapheme mnemonics.
- Replaced weak abstract shape mnemonics with standard Thai letter-name object
  anchors for consonants and clearer placement/length cues for vowels and tone
  marks.
- Regenerated `supabase/seed.sql` from `src/lib/data/thai.ts`.

## Decisions

- Use text-only mnemonic improvements for this pass.
- Treat Supabase seed output as generated from the TypeScript curriculum unless verification shows otherwise.
- Prefer the established Thai acrophonic consonant-name system (`ก ไก่`,
  `ม ม้า`, `ข ไข่`, etc.) for consonants.
- For vowels and tone marks, use scan-position and duration cues rather than
  inventing arbitrary picture mnemonics.

## Research Notes

- Thai consonant names conventionally pair each consonant with an object word;
  this is the mnemonic backbone used for this pass.
- The current lesson set introduces consonants that map cleanly to the standard
  anchors: `ม ม้า`, `ก ไก่`, `ด เด็ก`, `น หนู`, `ต เต่า`, `ล ลิง`, `บ ใบไม้`,
  `ร เรือ`, `ช ช้าง`, `ส เสือ`, `ข ไข่`, `ว แหวน`, `ห หีบ`, `อ อ่าง`, and
  `ผ ผึ้ง`.

## Follow-Up Ideas

- Consider adding optional illustrated mnemonic assets once the lesson content model supports them.
