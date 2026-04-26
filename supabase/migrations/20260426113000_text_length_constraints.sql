begin;

alter table curriculum.languages
	drop constraint if exists languages_code_length_check,
	add constraint languages_code_length_check
	check (length(code) <= 35),
	drop constraint if exists languages_name_length_check,
	add constraint languages_name_length_check
	check (length(name) <= 120),
	drop constraint if exists languages_native_name_length_check,
	add constraint languages_native_name_length_check
	check (length(native_name) <= 120);

alter table curriculum.script_systems
	drop constraint if exists script_systems_slug_length_check,
	add constraint script_systems_slug_length_check
	check (length(slug) <= 64),
	drop constraint if exists script_systems_name_length_check,
	add constraint script_systems_name_length_check
	check (length(name) <= 120),
	drop constraint if exists script_systems_native_name_length_check,
	add constraint script_systems_native_name_length_check
	check (length(native_name) <= 120);

alter table curriculum.courses
	drop constraint if exists courses_slug_length_check,
	add constraint courses_slug_length_check
	check (length(slug) <= 64),
	drop constraint if exists courses_name_length_check,
	add constraint courses_name_length_check
	check (length(name) <= 160),
	drop constraint if exists courses_native_name_length_check,
	add constraint courses_native_name_length_check
	check (length(native_name) <= 160),
	drop constraint if exists courses_hero_title_length_check,
	add constraint courses_hero_title_length_check
	check (length(hero_title) <= 160),
	drop constraint if exists courses_hero_subtitle_length_check,
	add constraint courses_hero_subtitle_length_check
	check (length(hero_subtitle) <= 320),
	drop constraint if exists courses_seo_title_length_check,
	add constraint courses_seo_title_length_check
	check (length(seo_title) <= 160),
	drop constraint if exists courses_seo_description_length_check,
	add constraint courses_seo_description_length_check
	check (length(seo_description) <= 320);

alter table curriculum.course_versions
	drop constraint if exists course_versions_display_version_length_check,
	add constraint course_versions_display_version_length_check
	check (length(display_version) <= 64),
	drop constraint if exists course_versions_source_locale_length_check,
	add constraint course_versions_source_locale_length_check
	check (length(source_locale) <= 35),
	drop constraint if exists course_versions_release_title_length_check,
	add constraint course_versions_release_title_length_check
	check (release_title is null or length(release_title) <= 160),
	drop constraint if exists course_versions_release_summary_length_check,
	add constraint course_versions_release_summary_length_check
	check (release_summary is null or length(release_summary) <= 320),
	drop constraint if exists course_versions_content_hash_length_check,
	add constraint course_versions_content_hash_length_check
	check (content_hash is null or length(content_hash) <= 128);

alter table curriculum.graphemes
	drop constraint if exists graphemes_key_length_check,
	add constraint graphemes_key_length_check
	check (length(key) <= 64),
	drop constraint if exists graphemes_text_length_check,
	add constraint graphemes_text_length_check
	check (length(text) <= 64),
	drop constraint if exists graphemes_kind_length_check,
	add constraint graphemes_kind_length_check
	check (length(kind) <= 64);

alter table curriculum.course_version_graphemes
	drop constraint if exists cvg_romanization_length_check,
	add constraint cvg_romanization_length_check
	check (romanization is null or length(romanization) <= 160),
	drop constraint if exists cvg_pronunciation_hint_length_check,
	add constraint cvg_pronunciation_hint_length_check
	check (pronunciation_hint is null or length(pronunciation_hint) <= 160),
	drop constraint if exists cvg_mnemonic_length_check,
	add constraint cvg_mnemonic_length_check
	check (mnemonic is null or length(mnemonic) <= 320),
	drop constraint if exists cvg_position_length_check,
	add constraint cvg_position_length_check
	check (position is null or length(position) <= 64),
	drop constraint if exists cvg_pedagogical_group_key_length_check,
	add constraint cvg_pedagogical_group_key_length_check
	check (pedagogical_group_key is null or length(pedagogical_group_key) <= 64),
	drop constraint if exists cvg_pedagogical_group_label_length_check,
	add constraint cvg_pedagogical_group_label_length_check
	check (pedagogical_group_label is null or length(pedagogical_group_label) <= 160);

alter table curriculum.orthography_rules
	drop constraint if exists orthography_rules_key_length_check,
	add constraint orthography_rules_key_length_check
	check (length(key) <= 64),
	drop constraint if exists orthography_rules_name_length_check,
	add constraint orthography_rules_name_length_check
	check (length(name) <= 160),
	drop constraint if exists orthography_rules_short_description_length_check,
	add constraint orthography_rules_short_description_length_check
	check (length(short_description) <= 320),
	drop constraint if exists orthography_rules_explanation_length_check,
	add constraint orthography_rules_explanation_length_check
	check (length(explanation) <= 4000);

alter table curriculum.orthography_rule_examples
	drop constraint if exists orthography_rule_examples_text_length_check,
	add constraint orthography_rule_examples_text_length_check
	check (length(text) <= 320),
	drop constraint if exists orthography_rule_examples_translation_length_check,
	add constraint orthography_rule_examples_translation_length_check
	check (translation is null or length(translation) <= 320);

alter table curriculum.lessons
	drop constraint if exists lessons_slug_length_check,
	add constraint lessons_slug_length_check
	check (length(slug) <= 64),
	drop constraint if exists lessons_title_length_check,
	add constraint lessons_title_length_check
	check (length(title) <= 160);

alter table curriculum.anchor_targets
	drop constraint if exists anchor_targets_slug_length_check,
	add constraint anchor_targets_slug_length_check
	check (length(slug) <= 64),
	drop constraint if exists anchor_targets_display_text_length_check,
	add constraint anchor_targets_display_text_length_check
	check (length(display_text) <= 160),
	drop constraint if exists anchor_targets_normalized_text_length_check,
	add constraint anchor_targets_normalized_text_length_check
	check (length(normalized_text) <= 160),
	drop constraint if exists anchor_targets_meaning_length_check,
	add constraint anchor_targets_meaning_length_check
	check (length(meaning) <= 160),
	drop constraint if exists anchor_targets_pronunciation_length_check,
	add constraint anchor_targets_pronunciation_length_check
	check (length(pronunciation) <= 160),
	drop constraint if exists anchor_targets_category_key_length_check,
	add constraint anchor_targets_category_key_length_check
	check (category_key is null or length(category_key) <= 64),
	drop constraint if exists anchor_targets_context_note_length_check,
	add constraint anchor_targets_context_note_length_check
	check (context_note is null or length(context_note) <= 320);

alter table curriculum.anchor_segments
	drop constraint if exists anchor_segments_text_length_check,
	add constraint anchor_segments_text_length_check
	check (length(text) <= 128),
	drop constraint if exists anchor_segments_sound_length_check,
	add constraint anchor_segments_sound_length_check
	check (length(sound) <= 128),
	drop constraint if exists anchor_segments_kind_length_check,
	add constraint anchor_segments_kind_length_check
	check (kind is null or length(kind) <= 64);

alter table curriculum.drills
	drop constraint if exists drills_key_length_check,
	add constraint drills_key_length_check
	check (length(key) <= 64),
	drop constraint if exists drills_prompt_length_check,
	add constraint drills_prompt_length_check
	check (length(prompt) <= 320),
	drop constraint if exists drills_hint_length_check,
	add constraint drills_hint_length_check
	check (hint is null or length(hint) <= 320);

alter table curriculum.drill_options
	drop constraint if exists drill_options_text_length_check,
	add constraint drill_options_text_length_check
	check (length(text) <= 160),
	drop constraint if exists drill_options_rationale_length_check,
	add constraint drill_options_rationale_length_check
	check (rationale is null or length(rationale) <= 320);

alter table delivery.course_publications
	drop constraint if exists course_publications_manifest_hash_length_check,
	add constraint course_publications_manifest_hash_length_check
	check (length(manifest_hash) <= 128);

alter table delivery.course_publication_lessons
	drop constraint if exists course_publication_lessons_lesson_slug_length_check,
	add constraint course_publication_lessons_lesson_slug_length_check
	check (length(lesson_slug) <= 64),
	drop constraint if exists course_publication_lessons_payload_hash_length_check,
	add constraint course_publication_lessons_payload_hash_length_check
	check (length(payload_hash) <= 128);

commit;
