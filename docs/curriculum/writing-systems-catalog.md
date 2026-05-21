# Writing Systems Catalog

Last reviewed: 2026-05-21

This catalog is a roadmap for scripts and writing systems GlyphBridge could cover
after Thai. It should be read alongside the [curriculum authoring
framework](./authoring-framework.md): every candidate still needs a course
prospectus, source manifest, script inventory, frequency report, and validation
packet before implementation.

The lists below are intentionally broad. They combine Unicode and ISO 15924
script inventories, broad writing-system surveys, and highly visible fictional or
constructed systems. The result is not a licensing decision, a curriculum plan, or
a claim that every obscure community variant is already captured. It is the
working candidate universe for product planning.

## Ranking Rubric

Ranks are relative inside each group. Popularity is estimated for native
Anglophone and European learners, using these signals:

- Language-learning demand among English-speaking and European learners.
- Travel, heritage, religious, academic, or cultural utility.
- Visibility in media, games, fandom, museums, public signs, or classrooms.
- Fit with GlyphBridge's promise: rapid decoding of useful or meaningful text.
- Course feasibility: Unicode coverage, fonts, corpora, transliteration help, and
  available review expertise.

For fictional and commercial-world scripts, popularity does not imply permission
to ship. Any course tied to a living franchise, artwork, font, game, film, book,
or fan convention needs rights and licensing review before content is published.

## Real And Living Systems

These are scripts, script bundles, notation systems, or tactile/manual systems
with current living use, liturgical use, revitalization use, or active technical
use. Modern constructed scripts used by real language communities are listed here
rather than in the fictional section.

| Rank | Candidate                                  | Likely course boundary                                                                                     | Popularity rationale                                                                      |
| :--- | :----------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| 1    | Japanese writing system                    | Hiragana, katakana, and high-frequency kanji for Japanese                                                  | Very high demand from anime, games, travel, food, and language learning.                  |
| 2    | Han characters for Chinese                 | Simplified and traditional Chinese characters, possibly separate Mandarin and Cantonese tracks             | Major world-language market, travel use, food/menu decoding, and character curiosity.     |
| 3    | Hangul                                     | Korean                                                                                                     | Strong K-pop, K-drama, food, beauty, travel, and beginner-friendly script appeal.         |
| 4    | Arabic script                              | Arabic first, with later Persian, Urdu, Pashto, Kurdish, and Jawi variants                                 | Large global script, religious and travel utility, high perceived difficulty.             |
| 5    | Cyrillic                                   | Russian, Ukrainian, Bulgarian, Serbian, Macedonian, and related variants                                   | Familiar to Europeans through geography, news, Slavic languages, and signage.             |
| 6    | Greek                                      | Modern Greek first, optional classical reading mode                                                        | European travel, classical education, science symbols, and approachable alphabet size.    |
| 7    | Hebrew                                     | Modern Hebrew plus liturgical and Yiddish-aware notes                                                      | Heritage, religious, travel, and biblical-study demand.                                   |
| 8    | Devanagari                                 | Hindi first, with Sanskrit, Nepali, Marathi, and yoga or mantra reading modes                              | India travel, Hindi media, Sanskrit interest, and visible abugida payoff.                 |
| 9    | Thai                                       | Thai                                                                                                       | Existing GlyphBridge course; strong tourism and food-menu utility.                        |
| 10   | International Phonetic Alphabet            | IPA for English speakers learning world languages                                                          | Not a natural language script, but very high cross-language pronunciation utility.        |
| 11   | Tibetan                                    | Tibetan and Dzongkha reading basics                                                                        | Buddhism, Himalayan travel, calligraphic appeal, and manuscript culture.                  |
| 12   | Bengali-Assamese                           | Bengali first, Assamese variant later                                                                      | Large speaker base and diaspora, but lower general European learner demand than Hindi.    |
| 13   | Tamil                                      | Tamil                                                                                                      | Strong diaspora, classical-language prestige, South India and Sri Lanka travel.           |
| 14   | Gurmukhi                                   | Punjabi in India                                                                                           | Sikh religious and heritage reading plus Punjabi music visibility.                        |
| 15   | Georgian                                   | Georgian                                                                                                   | Distinctive alphabet, strong travel niche, unusually satisfying script-learning target.   |
| 16   | Armenian                                   | Armenian                                                                                                   | Heritage, church, travel, and distinctive alphabet appeal.                                |
| 17   | Khmer                                      | Khmer                                                                                                      | Cambodia travel, temple/signage utility, and visual kinship with Thai-style learning.     |
| 18   | Lao                                        | Lao                                                                                                        | Southeast Asia travel and high transfer value for learners who know Thai.                 |
| 19   | Myanmar                                    | Burmese first, later Mon, Shan, and Karen variants                                                         | Travel and regional interest; rendering and font behavior need careful handling.          |
| 20   | Ethiopic                                   | Amharic and Tigrinya                                                                                       | Heritage, religion, Ethiopia/Eritrea travel, and visually distinctive syllabic inventory. |
| 21   | Latin extensions and diacritics            | European Latin orthographies, Turkish, Vietnamese, Polish, Czech, Icelandic, and others                    | Familiar base script but useful for diacritics, pronunciation, and confusable letters.    |
| 22   | Bopomofo                                   | Zhuyin for Mandarin and Taiwanese reading support                                                          | Useful for Chinese learners and Taiwan-focused learners; niche outside language study.    |
| 23   | Telugu                                     | Telugu                                                                                                     | Large speaker base and South Indian media; moderate Anglophone demand.                    |
| 24   | Kannada                                    | Kannada                                                                                                    | South India travel and heritage; visually rich but niche.                                 |
| 25   | Malayalam                                  | Malayalam                                                                                                  | Kerala travel, literature, and diaspora; visually distinctive.                            |
| 26   | Gujarati                                   | Gujarati                                                                                                   | Diaspora and business/travel utility; moderate course demand.                             |
| 27   | Sinhala                                    | Sinhala                                                                                                    | Sri Lanka travel and heritage; moderate niche.                                            |
| 28   | Mongolian                                  | Traditional Mongolian and Clear Script-aware notes                                                         | Vertical layout novelty, Mongolia travel, and historical bridge to Manchu.                |
| 29   | Thaana                                     | Dhivehi in the Maldives                                                                                    | Travel appeal is high, but learner market is small.                                       |
| 30   | Syriac                                     | Classical Syriac plus Neo-Aramaic awareness                                                                | Liturgical and heritage interest; specialist but culturally durable.                      |
| 31   | Tifinagh                                   | Amazigh and Tuareg contexts                                                                                | North Africa travel, identity, and distinctive geometric script.                          |
| 32   | Baybayin or Tagalog script                 | Filipino revival and historical Tagalog                                                                    | Strong social-media and heritage revival interest, especially in diaspora.                |
| 33   | Cherokee                                   | Cherokee syllabary                                                                                         | Recognizable North American Indigenous script with active revitalization.                 |
| 34   | Canadian Aboriginal syllabics              | Cree, Inuktitut, Ojibwe, and related syllabics                                                             | Revitalization and Canada-facing cultural interest; lower mass-market demand.             |
| 35   | Javanese                                   | Javanese and related Indonesian heritage use                                                               | Large language community, but modern daily use is limited.                                |
| 36   | Balinese                                   | Balinese                                                                                                   | Tourism and cultural interest; practical daily reading is narrower.                       |
| 37   | Sundanese                                  | Sundanese                                                                                                  | Regional identity and revival use; niche outside Indonesia.                               |
| 38   | Batak                                      | Batak languages                                                                                            | Heritage and manuscript interest; niche app audience.                                     |
| 39   | Buginese or Lontara                        | Buginese, Makassar, and Mandar                                                                             | Indonesian heritage niche with compact visual system.                                     |
| 40   | N'Ko                                       | Manding languages                                                                                          | Active literacy movement and West African cultural importance.                            |
| 41   | Adlam                                      | Fula                                                                                                       | Modern script with real community adoption and strong identity story.                     |
| 42   | Odia                                       | Odia                                                                                                       | Large regional script, moderate diaspora interest.                                        |
| 43   | Meitei Mayek                               | Meitei or Manipuri                                                                                         | Active revival, official status, and distinctive glyph set.                               |
| 44   | Ol Chiki                                   | Santali                                                                                                    | Official community script; niche but strong identity value.                               |
| 45   | Vai                                        | Vai syllabary                                                                                              | Historically important living syllabary; specialist appeal.                               |
| 46   | Bamum                                      | Bamum syllabary                                                                                            | Visually compelling African script with museum and heritage appeal.                       |
| 47   | Syloti Nagri                               | Sylheti                                                                                                    | Diaspora and regional-script interest; limited general demand.                            |
| 48   | Newa                                       | Nepal Bhasa and liturgical Sanskrit/Pali contexts                                                          | Heritage and manuscript niche.                                                            |
| 49   | Tirhuta                                    | Maithili                                                                                                   | Regional and scholarly interest; low general demand.                                      |
| 50   | Chakma                                     | Chakma and related use                                                                                     | Community-script value; niche.                                                            |
| 51   | Lisu or Fraser                             | Lisu                                                                                                       | Compact alphabet with Christian missionary and community history.                         |
| 52   | Lepcha                                     | Lepcha                                                                                                     | Himalayan cultural niche.                                                                 |
| 53   | Limbu                                      | Limbu                                                                                                      | Revitalization and heritage niche.                                                        |
| 54   | Pahawh Hmong                               | Hmong Daw                                                                                                  | Strong constructed-script story and Hmong heritage use.                                   |
| 55   | Nyiakeng Puachue Hmong                     | Hmong                                                                                                      | Modern community script with US diaspora relevance.                                       |
| 56   | Pollard or Miao                            | Miao and Hmongic languages                                                                                 | Missionary-script history and minority-language value.                                    |
| 57   | Tai Tham                                   | Northern Thai, Khun, and liturgical contexts                                                               | Strong regional heritage and Thai-adjacent interest.                                      |
| 58   | Tai Viet                                   | Tai Dam and Tai Don                                                                                        | Minority-language heritage; niche.                                                        |
| 59   | New Tai Lue                                | Tai Lue                                                                                                    | Regional travel and heritage niche.                                                       |
| 60   | Tai Le                                     | Tai Nuea                                                                                                   | Small but teachable regional script.                                                      |
| 61   | Kayah Li                                   | Kayah                                                                                                      | Community-script interest; niche.                                                         |
| 62   | Hanifi Rohingya                            | Rohingya                                                                                                   | Human-rights and diaspora relevance; small learner market.                                |
| 63   | Bassa Vah                                  | Bassa                                                                                                      | West African script revival and heritage niche.                                           |
| 64   | Osmanya                                    | Somali                                                                                                     | Historic Somali script with cultural interest, though Latin dominates.                    |
| 65   | Mro                                        | Mru                                                                                                        | Community-script niche.                                                                   |
| 66   | Medefaidrin                                | Oberi Okaime religious language                                                                            | Distinctive religious constructed script; specialist.                                     |
| 67   | Mende Kikakui                              | Mende                                                                                                      | Historic and partly community-oriented syllabary; specialist.                             |
| 68   | Warang Citi                                | Ho                                                                                                         | Community identity and revival niche.                                                     |
| 69   | Sora Sompeng                               | Sora                                                                                                       | Community script with limited broader demand.                                             |
| 70   | Masaram Gondi                              | Gondi                                                                                                      | Community and revival interest.                                                           |
| 71   | Gunjala Gondi                              | Gondi                                                                                                      | Community and revival interest.                                                           |
| 72   | Wancho                                     | Wancho                                                                                                     | Small modern-script audience.                                                             |
| 73   | Tangsa                                     | Tangsa                                                                                                     | Very small modern-script audience.                                                        |
| 74   | Toto                                       | Toto                                                                                                       | Very small modern-script audience.                                                        |
| 75   | Sunuwar                                    | Sunuwar                                                                                                    | Small community-script audience.                                                          |
| 76   | Kirat Rai                                  | Bantawa and related Kirat languages                                                                        | Newer encoded community-script niche.                                                     |
| 77   | Nag Mundari                                | Mundari                                                                                                    | Newer encoded community-script niche.                                                     |
| 78   | Garay                                      | Wolof and Mandinka                                                                                         | Newer script with possible future interest if adoption grows.                             |
| 79   | Beria Erfe                                 | Zaghawa or Beria                                                                                           | Newer community script; likely specialist.                                                |
| 80   | Rejang                                     | Rejang                                                                                                     | Indonesian heritage script; low general demand.                                           |
| 81   | Lampung and Rencong                        | Lampung and related Sumatran traditions                                                                    | Heritage and manuscript niche.                                                            |
| 82   | Hanunoo                                    | Hanunoo                                                                                                    | Indigenous Philippine script with small but meaningful audience.                          |
| 83   | Buhid                                      | Buhid                                                                                                      | Indigenous Philippine script, specialist audience.                                        |
| 84   | Tagbanwa                                   | Tagbanwa languages                                                                                         | Indigenous Philippine script, specialist audience.                                        |
| 85   | Kulitan                                    | Kapampangan revival                                                                                        | Revival interest, especially in Filipino diaspora communities.                            |
| 86   | SignWriting                                | Sign languages                                                                                             | Strong accessibility and linguistic value, but outside GlyphBridge's current text model.  |
| 87   | Braille                                    | Unified English Braille first, other braille systems later                                                 | High accessibility importance; requires tactile/visual pedagogy decisions.                |
| 88   | HamNoSys and Stokoe notation               | Sign-language transcription systems                                                                        | Linguistics and accessibility niche.                                                      |
| 89   | Morse code                                 | International Morse                                                                                        | Familiar, game-like, and historically useful; not a script in the usual visual sense.     |
| 90   | Flag semaphore and maritime flags          | Letter-signaling systems                                                                                   | Puzzle and scouting appeal; low language-learning demand.                                 |
| 91   | Gregg shorthand                            | English shorthand                                                                                          | Historic productivity niche and hobbyist interest.                                        |
| 92   | Pitman shorthand                           | English shorthand                                                                                          | Similar to Gregg, with UK historical interest.                                            |
| 93   | Duployan shorthand                         | Shorthand plus Chinook Jargon historical use                                                               | Specialist, but encoded and typologically interesting.                                    |
| 94   | Moon type                                  | Tactile reading system                                                                                     | Accessibility history niche.                                                              |
| 95   | Mandombe                                   | Kikongo, Lingala, Ciluba, and Kiswahili contexts                                                           | Geometric script with cultural interest, low general demand.                              |
| 96   | Mwangwego                                  | Chewa and other Malawi languages                                                                           | Community-created script, very niche.                                                     |
| 97   | Avoiuli                                    | Raga and Vanuatu cultural movement                                                                         | Specialist cultural-script audience.                                                      |
| 98   | Coorgi-Cox                                 | Kodava                                                                                                     | Proposed/community script, very niche.                                                    |
| 99   | Tulu-Tigalari                              | Tulu and Sanskrit manuscript contexts where actively revived                                               | Better treated as historic unless a living-revival course is chosen.                      |
| 100  | Other active or emerging community scripts | Chisoi, Dhimal, Gurung Khema, Khamti, Magar Akkha, Naasioi, Ol Onal, Tani, Tikamuli, and similar proposals | Keep on watchlist; likely not early roadmap material.                                     |

## Dead, Historical, And Undeciphered Systems

These systems are not in broad daily living use. Some are deciphered and can
support real reading courses. Others are undeciphered or only partly deciphered;
those can support recognition, history, glyph inventory, and inscription-tour
courses, but not full reading instruction.

| Rank | Candidate                                 | Status                                                                             | Popularity rationale                                                       |
| :--- | :---------------------------------------- | :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| 1    | Egyptian hieroglyphs                      | Deciphered historical logosyllabic system                                          | Huge museum, travel, mythology, and visual-recognition appeal.             |
| 2    | Runic scripts                             | Historical Germanic alphabets                                                      | Norse, Anglo-Saxon, fantasy, tattoo, and archaeology interest.             |
| 3    | Cuneiform                                 | Sumerian, Akkadian, Hittite, and related historical use                            | Oldest-writing appeal, museum value, and strong ancient-history market.    |
| 4    | Maya hieroglyphs                          | Deciphered Mesoamerican logosyllabic system                                        | Archaeology, travel, calendrical, and visual puzzle appeal.                |
| 5    | Linear B                                  | Deciphered Mycenaean Greek syllabary                                               | Classics and decipherment-story appeal.                                    |
| 6    | Phoenician                                | Historical abjad                                                                   | Alphabet-origin story and Mediterranean archaeology.                       |
| 7    | Ogham                                     | Early medieval Irish and Brittonic inscriptions                                    | Celtic heritage, archaeology, and compact glyph inventory.                 |
| 8    | Glagolitic                                | Historical Slavic alphabet                                                         | Slavic church, medieval manuscript, and visual novelty appeal.             |
| 9    | Gothic                                    | Historical alphabet for Gothic                                                     | Germanic language and manuscript niche.                                    |
| 10   | Coptic                                    | Historical Egyptian alphabet, still liturgical                                     | Egyptology, Christian liturgy, and Greek-adjacent learning.                |
| 11   | Old Italic family                         | Etruscan, Oscan, Umbrian, Venetic, and related alphabets                           | Italy archaeology and alphabet-history appeal.                             |
| 12   | Brahmi                                    | Ancient South Asian source script                                                  | Major script-family origin story and archaeology value.                    |
| 13   | Old Persian cuneiform                     | Deciphered semi-alphabetic cuneiform                                               | Compact, teachable, and tied to Achaemenid history.                        |
| 14   | Ugaritic                                  | Deciphered cuneiform alphabet                                                      | Biblical-adjacent and alphabet-history niche.                              |
| 15   | Imperial Aramaic                          | Historical abjad                                                                   | Bridge into Hebrew, Syriac, Arabic, Nabataean, and Central Asian scripts.  |
| 16   | Avestan                                   | Historical liturgical alphabet                                                     | Zoroastrian and Iranian-studies interest.                                  |
| 17   | Manichaean                                | Historical Middle Iranian script                                                   | Silk Road and religious manuscript niche.                                  |
| 18   | Pahlavi scripts                           | Inscriptional, Psalter, and Book Pahlavi                                           | Iranian history and Zoroastrian manuscript niche.                          |
| 19   | Inscriptional Parthian                    | Historical Iranian abjad                                                           | Specialist Iranian-studies interest.                                       |
| 20   | Sogdian and Old Sogdian                   | Historical Silk Road scripts                                                       | Central Asian trade, Buddhism, and manuscript interest.                    |
| 21   | Old Uyghur                                | Historical Central Asian alphabet                                                  | Bridge to Mongolian and Manchu script history.                             |
| 22   | Old Turkic or Orkhon                      | Historical Turkic runiform script                                                  | Turkic heritage and inscription appeal.                                    |
| 23   | Tangut                                    | Deciphered historical logographic system                                           | Dense, unusual, and attractive to script enthusiasts.                      |
| 24   | Khitan small script                       | Partly deciphered historical script                                                | Niche but fascinating East Asian undecipherment story.                     |
| 25   | Khitan large script                       | Largely undeciphered historical script                                             | Specialist; recognition more feasible than reading.                        |
| 26   | Jurchen                                   | Partly deciphered historical script                                                | Manchuria and East Asian history niche.                                    |
| 27   | Phags-pa                                  | Historical Yuan dynasty block script                                               | Mongolian, Tibetan, Chinese, and Persian imperial history.                 |
| 28   | Old Hungarian                             | Historical Hungarian runic script                                                  | European heritage and revival curiosity.                                   |
| 29   | Old Permic                                | Historical Komi alphabet                                                           | Specialist medieval Uralic and church-history niche.                       |
| 30   | Anatolian or Luwian hieroglyphs           | Deciphered historical Anatolian system                                             | Ancient Anatolia and Hittite-adjacent appeal.                              |
| 31   | Linear A                                  | Undeciphered Aegean script                                                         | High curiosity because of Minoan mystery; cannot be a full reading course. |
| 32   | Indus script                              | Undeciphered or disputed writing system                                            | Very high curiosity; course would be history and sign recognition only.    |
| 33   | Rongorongo                                | Undeciphered Rapa Nui glyph system                                                 | High visual and mystery appeal; reading claims remain unsafe.              |
| 34   | Voynich manuscript script                 | Undeciphered manuscript or cipher                                                  | Famous mystery; not a normal language-script course.                       |
| 35   | Meroitic hieroglyphs and cursive          | Sound values known, language not fully understood                                  | Egypt/Sudan archaeology niche with partial-reading limits.                 |
| 36   | Demotic Egyptian                          | Historical Egyptian cursive script                                                 | Egyptology value, high complexity.                                         |
| 37   | Hieratic Egyptian                         | Historical Egyptian cursive script                                                 | Egyptology and manuscript niche.                                           |
| 38   | Proto-Sinaitic                            | Early alphabetic or proto-alphabetic system                                        | Alphabet-origin interest, sparse corpus.                                   |
| 39   | Old South Arabian                         | Historical Arabian abjad                                                           | Arabian archaeology and Ethiopic ancestry.                                 |
| 40   | Old North Arabian                         | Historical Arabian abjads                                                          | Archaeology niche.                                                         |
| 41   | Nabataean                                 | Historical Aramaic-derived abjad                                                   | Petra travel and Arabic-script ancestry.                                   |
| 42   | Palmyrene                                 | Historical Aramaic-derived abjad                                                   | Syrian archaeology and museum interest.                                    |
| 43   | Hatran                                    | Historical Aramaic-derived abjad                                                   | Specialist Mesopotamian archaeology.                                       |
| 44   | Elymaic                                   | Historical Aramaic-derived script                                                  | Specialist Iranian and Mesopotamian studies.                               |
| 45   | Chorasmian                                | Historical Iranian script                                                          | Specialist Central Asian studies.                                          |
| 46   | Kharoshthi                                | Historical Gandhari and Sanskrit abugida                                           | Buddhist manuscript and Silk Road niche.                                   |
| 47   | Sharada                                   | Historical Kashmir script                                                          | Sanskrit, Kashmir, and manuscript interest.                                |
| 48   | Siddham                                   | Historical Sanskrit and Buddhist script                                            | Buddhism, mantra, and Japanese esoteric tradition.                         |
| 49   | Grantha                                   | Historical Sanskrit script in South India                                          | Sanskrit and Tamil-region manuscript niche.                                |
| 50   | Nandinagari                               | Historical Sanskrit script                                                         | Manuscript specialist audience.                                            |
| 51   | Bhaiksuki                                 | Historical Buddhist script                                                         | Specialist Buddhist manuscript interest.                                   |
| 52   | Kaithi                                    | Historical North Indian script                                                     | Archival and genealogy niche.                                              |
| 53   | Modi                                      | Historical Marathi script                                                          | Archival, genealogy, and Maharashtra heritage niche.                       |
| 54   | Mahajani                                  | Historical merchant script                                                         | Archival and business-record niche.                                        |
| 55   | Multani                                   | Historical Saraiki/Landa script                                                    | Archival and regional heritage niche.                                      |
| 56   | Khojki                                    | Historical Sindhi and religious community script                                   | Ismaili and manuscript niche.                                              |
| 57   | Khudawadi                                 | Historical Sindhi script                                                           | Archival and regional heritage niche.                                      |
| 58   | Takri                                     | Historical western Himalayan scripts                                               | Archival and regional manuscript niche.                                    |
| 59   | Dogra                                     | Historical Dogri script                                                            | Revitalization and archival niche.                                         |
| 60   | Ahom                                      | Historical Tai Ahom script                                                         | Northeast India heritage and revival interest.                             |
| 61   | Kawi                                      | Historical Java and Southeast Asian script                                         | Indonesian history, inscriptions, and Pallava-derived lineage.             |
| 62   | Pallava                                   | Historical South Indian and Southeast Asian source script                          | Script-family origin story across Southeast Asia.                          |
| 63   | Kadamba                                   | Historical southern Brahmic script                                                 | Specialist epigraphy.                                                      |
| 64   | Vatteluttu                                | Historical Tamil-Malayalam region script                                           | South Indian inscription niche.                                            |
| 65   | Tocharian                                 | Historical Central Asian Brahmic script                                            | Indo-European and Silk Road studies.                                       |
| 66   | Pyu                                       | Historical Myanmar-region script                                                   | Southeast Asian epigraphy niche.                                           |
| 67   | Marchen and Zhang-Zhung scripts           | Historical Tibetan-adjacent scripts                                                | Bon and Himalayan manuscript niche.                                        |
| 68   | Zanabazar Square                          | Historical Mongolian script                                                        | Buddhist and Mongolian manuscript interest.                                |
| 69   | Soyombo                                   | Historical Mongolian script                                                        | Flag-symbol familiarity and Mongolian cultural niche.                      |
| 70   | Cypriot syllabary                         | Deciphered historical Greek and Eteocypriot syllabary                              | Classics niche.                                                            |
| 71   | Cypro-Minoan                              | Undeciphered or partly understood syllabary                                        | Aegean mystery niche.                                                      |
| 72   | Cretan hieroglyphs                        | Undeciphered Aegean script                                                         | Minoan archaeology niche.                                                  |
| 73   | Phaistos Disc signs                       | Unique undeciphered artifact                                                       | Famous mystery, but too little corpus for normal curriculum.               |
| 74   | Linear Elamite                            | Partly deciphered or debated historical script                                     | Ancient Iran niche.                                                        |
| 75   | Proto-Elamite                             | Undeciphered early administrative script                                           | Ancient-writing origin niche.                                              |
| 76   | Byblos syllabary                          | Undeciphered or disputed script                                                    | Alphabet-history curiosity.                                                |
| 77   | Carian                                    | Deciphered Anatolian alphabet                                                      | Specialist classics and Anatolian studies.                                 |
| 78   | Lycian                                    | Deciphered Anatolian alphabet                                                      | Specialist archaeology and Turkey travel niche.                            |
| 79   | Lydian                                    | Deciphered Anatolian alphabet                                                      | Specialist archaeology niche.                                              |
| 80   | Sidetic                                   | Historical Anatolian script                                                        | Very specialist.                                                           |
| 81   | Caucasian Albanian                        | Deciphered historical Caucasus alphabet                                            | Caucasus and Christian manuscript niche.                                   |
| 82   | Elbasan                                   | Historical Albanian alphabet                                                       | Albanian heritage and manuscript niche.                                    |
| 83   | Vithkuqi                                  | Historical Albanian alphabet                                                       | Albanian heritage niche.                                                   |
| 84   | Todhri                                    | Historical Albanian alphabet                                                       | Albanian manuscript specialist.                                            |
| 85   | Old Nubian                                | Historical Christian Nubian writing tradition                                      | Nile Valley and manuscript niche.                                          |
| 86   | Nushu                                     | Historical women-associated script in China                                        | Strong story appeal, very small corpus and specialist review need.         |
| 87   | Chu Nom                                   | Historical Vietnamese character system                                             | High Vietnam and sinographic interest, but complex.                        |
| 88   | Sawndip                                   | Zhuang character tradition, historically and locally used                          | Specialist sinographic and minority-language niche.                        |
| 89   | Naxi Dongba                               | Pictographic and ritual tradition                                                  | Visual appeal, but reading model is not straightforward.                   |
| 90   | Naxi Geba                                 | Syllabic support script for Naxi                                                   | Specialist and usually paired with Dongba.                                 |
| 91   | Ersu Shaba                                | Pictographic ritual system                                                         | Recognition and culture course, not normal full reading.                   |
| 92   | Shuishu                                   | Sui script tradition                                                               | Specialist logographic and ritual niche.                                   |
| 93   | Mi'kmaw hieroglyphs                       | Historical logographic/religious writing                                           | Indigenous and missionary-history niche.                                   |
| 94   | Testerian                                 | Historical pictorial missionary system                                             | Mesoamerican religious-history niche.                                      |
| 95   | Aztec or Nahua pictograms                 | Historical Mesoamerican pictorial writing                                          | Mexico travel, codex, and visual-history appeal.                           |
| 96   | Mixtec writing                            | Historical Mesoamerican pictorial/logographic tradition                            | Codex and archaeology niche.                                               |
| 97   | Zapotec script                            | Undeciphered or partly understood Mesoamerican script                              | Archaeology niche.                                                         |
| 98   | Epi-Olmec or Isthmian                     | Undeciphered or disputed Mesoamerican script                                       | Decipherment controversy interest.                                         |
| 99   | Olmec signs                               | Possible early Mesoamerican writing                                                | High origin-story value, limited teachability.                             |
| 100  | Teotihuacan writing                       | Poorly understood Mesoamerican system                                              | Visual-history niche.                                                      |
| 101  | Quipu                                     | Knot-recording system, possibly beyond numerals                                    | Andean culture and data-system curiosity, but not normal visual script.    |
| 102  | Vinča symbols                             | Proto-writing or symbol system                                                     | Prehistory curiosity, not a reading course.                                |
| 103  | Jiahu, Banpo, and other Neolithic signs   | Proto-writing or disputed signs                                                    | Prehistory curiosity only.                                                 |
| 104  | Proto-cuneiform                           | Early administrative proto-writing                                                 | Strong ancient-writing origin story, limited beginner readability.         |
| 105  | Oracle bone script                        | Early Chinese writing                                                              | High sinographic history appeal, better after Han-character foundations.   |
| 106  | Bronze and seal scripts                   | Historical Chinese forms                                                           | Calligraphy and etymology niche.                                           |
| 107  | Book Pahlavi                              | Historical Iranian script not fully encoded                                        | Specialist and rendering-limited.                                          |
| 108  | Hieratic variants and cursive hands       | Historical script styles                                                           | Better as advanced Egyptology extension than first course.                 |
| 109  | New York Point                            | Defunct tactile reading system                                                     | Accessibility-history niche.                                               |
| 110  | American Morse                            | Defunct Morse variant                                                              | Telegraphy-history niche.                                                  |
| 111  | Optical telegraph systems                 | Defunct signaling systems                                                          | History and puzzle niche.                                                  |
| 112  | Rohonc Codex script                       | Undeciphered manuscript                                                            | Mystery appeal, but not a stable curriculum.                               |
| 113  | Dorabella cipher                          | Undeciphered cipher-like text                                                      | Puzzle course only.                                                        |
| 114  | Hamptonese                                | Private or visionary script                                                        | Art-history niche.                                                         |
| 115  | Other regional historical Brahmic scripts | Chola, Goykanadi, Sirmauri, Tulu-Tigalari, and related manuscript scripts          | Keep for specialist expansion after higher-demand Indic scripts.           |
| 116  | Other historical Central Asian scripts    | Khotanese, Landa, Marchung, Pungchen, Pungchung, and related manuscript traditions | Specialist expansion only.                                                 |
| 117  | Other possible undeciphered systems       | Trojan, Para-Lydian, Pseudo-hieroglyphic, and similarly sparse candidates          | Recognition and history only unless scholarship changes.                   |

## Fictional And Constructed Systems

This group includes scripts from fictional worlds, conlangs, occult traditions,
alternate English orthographies, symbolic systems, and experimental designs.
Modern scripts with real community language use are in the living section even if
they were deliberately constructed.

| Rank | Candidate                                                 | Source or domain                                                     | Popularity rationale and cautions                                                                               |
| :--- | :-------------------------------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| 1    | Tengwar                                                   | Tolkien, Middle-earth                                                | Highest likely fictional-script demand; strong fan learning culture and English modes. Rights review required.  |
| 2    | Aurebesh                                                  | Star Wars                                                            | Extremely recognizable substitution alphabet with signage-style use. Rights review required.                    |
| 3    | Klingon pIqaD                                             | Star Trek and Klingon community                                      | Strong conlang community and media recognition. Rights review required.                                         |
| 4    | Cirth                                                     | Tolkien, Middle-earth                                                | High Tolkien demand, especially for runic/dwarven aesthetics. Rights review required.                           |
| 5    | Hylian scripts                                            | The Legend of Zelda series                                           | Strong game fandom; multiple era-specific ciphers need course boundaries. Rights review required.               |
| 6    | Sheikah and Zonai scripts                                 | The Legend of Zelda series                                           | Recent high visibility from Breath of the Wild and Tears of the Kingdom. Rights review required.                |
| 7    | Dovahzul dragon alphabet                                  | The Elder Scrolls: Skyrim                                            | Popular fantasy script with usable in-game corpus. Rights review required.                                      |
| 8    | Daedric alphabet                                          | The Elder Scrolls                                                    | Long-running game-script appeal and simple cipher structure. Rights review required.                            |
| 9    | Unown                                                     | Pokemon                                                              | Massive brand visibility; limited corpus and simple glyph recognition. Rights review required.                  |
| 10   | Standard Galactic Alphabet                                | Commander Keen and Minecraft enchanting table                        | High game familiarity, especially through Minecraft. Rights review required.                                    |
| 11   | Gallifreyan fan scripts                                   | Doctor Who fandom                                                    | High fan visibility, but canonical status and variant fragmentation are issues. Rights review required.         |
| 12   | Futurama Alienese                                         | Futurama                                                             | Puzzle-friendly substitution script with fan decoding culture. Rights review required.                          |
| 13   | D'ni                                                      | Myst and Riven                                                       | Strong script-and-language fan culture with deeper grammar potential. Rights review required.                   |
| 14   | Atlantean                                                 | Disney's Atlantis: The Lost Empire                                   | Designed with real conlang/script appeal; moderate nostalgia demand. Rights review required.                    |
| 15   | Mandalorian script                                        | Star Wars                                                            | Strong fandom, often used with Mando'a culture. Rights review required.                                         |
| 16   | Sith, High Galactic, and other Star Wars scripts          | Star Wars                                                            | Fandom-rich but fragmented; likely extensions after Aurebesh. Rights review required.                           |
| 17   | Heaven's Vault Ancient                                    | Heaven's Vault                                                       | Built around decipherment gameplay, excellent pedagogical fit. Rights review required.                          |
| 18   | Warframe Tennobet and Orokin scripts                      | Warframe                                                             | Active game community and in-world signage. Rights review required.                                             |
| 19   | Splatoon Inkling and Octarian scripts                     | Splatoon                                                             | Strong visual identity and fan decoding; variants need careful scoping. Rights review required.                 |
| 20   | Kryptonian scripts                                        | DC Comics and Superman media                                         | High brand recognition, but many incompatible versions. Rights review required.                                 |
| 21   | Matoran                                                   | Bionicle                                                             | Nostalgia and fan community; usually cipher-like. Rights review required.                                       |
| 22   | Wakandan scripts                                          | Marvel media                                                         | High visibility but limited stable public corpus. Rights review required.                                       |
| 23   | Na'vi fan or community scripts                            | Avatar fandom                                                        | Na'vi officially uses Latin; non-Latin scripts are community/fan conventions. Rights review required.           |
| 24   | Hymmnos                                                   | Ar tonelico                                                          | Deep niche conlang and music fandom. Rights review required.                                                    |
| 25   | Ultima runes and Gargish                                  | Ultima games                                                         | Classic RPG nostalgia, moderate niche. Rights review required.                                                  |
| 26   | Al Bhed script                                            | Final Fantasy X                                                      | Recognizable game-language puzzle; mostly cipher-like. Rights review required.                                  |
| 27   | Eorzean scripts                                           | Final Fantasy XIV                                                    | Large active game audience; needs variant inventory. Rights review required.                                    |
| 28   | Kirby New World script                                    | Kirby and the Forgotten Land                                         | Smaller but recent fan-decoding interest. Rights review required.                                               |
| 29   | Interlac and other DC futuristic alphabets                | DC Comics                                                            | Niche but recognizable to comics and sci-fi fans. Rights review required.                                       |
| 30   | Vulcan and Romulan scripts                                | Star Trek fandom                                                     | Niche after Klingon, with multiple fan and canon variants. Rights review required.                              |
| 31   | Sarati                                                    | Tolkien's early scripts                                              | Tolkien completist interest; lower than Tengwar and Cirth. Rights review required.                              |
| 32   | Valmaric and other Tolkien draft scripts                  | Tolkien legendarium                                                  | Specialist Tolkien-script audience. Rights review required.                                                     |
| 33   | Sitelen Pona                                              | Toki Pona                                                            | Strong conlang community, public learning culture, and compact logographic design. License review still needed. |
| 34   | Sitelen Sitelen                                           | Toki Pona community                                                  | Beautiful nonlinear system, higher complexity and variant handling. License review needed.                      |
| 35   | Shavian                                                   | English spelling reform                                              | Unicode encoded, public-domain-adjacent history, and strong script-nerd appeal.                                 |
| 36   | Deseret alphabet                                          | English spelling reform and Mormon history                           | Unicode encoded and historically documented; niche but teachable.                                               |
| 37   | Quikscript                                                | English spelling reform                                              | Hobbyist and orthography-reform niche.                                                                          |
| 38   | Unifon                                                    | English spelling reform                                              | Simple learner appeal, limited active demand.                                                                   |
| 39   | Visible Speech                                            | Phonetic notation                                                    | Historical phonetics and speech-science niche.                                                                  |
| 40   | Blissymbolics                                             | Constructed ideographic AAC system                                   | Accessibility and symbol-system value; not ordinary language decoding.                                          |
| 41   | iConji                                                    | Constructed ideographic communication                                | Symbol-system curiosity; low active demand.                                                                     |
| 42   | LoCoS                                                     | Constructed pictorial communication                                  | Design and semiotics niche.                                                                                     |
| 43   | Yerkish lexigrams                                         | Ape-language research                                                | Semiotics and cognitive-science niche.                                                                          |
| 44   | Theban alphabet                                           | Occult and magical alphabet tradition                                | High esoteric visibility; mainly substitution alphabet.                                                         |
| 45   | Enochian alphabet                                         | Occult constructed language tradition                                | Esoteric and conlang interest; sensitive source framing needed.                                                 |
| 46   | Celestial, Malachim, and Transitus Fluvii                 | Early modern occult alphabets                                        | Occult-history niche; likely combined course.                                                                   |
| 47   | Litterae Ignotae                                          | Hildegard of Bingen                                                  | Medieval mystic and constructed-language interest.                                                              |
| 48   | Real Character                                            | John Wilkins philosophical language                                  | History of universal-language projects; specialist.                                                             |
| 49   | Universal Alphabet                                        | Thomas Harriot and Algonquian transcription                          | Historical phonetic-transcription niche.                                                                        |
| 50   | aUI alphabet                                              | Philosophical constructed language                                   | Conlang-history niche.                                                                                          |
| 51   | Ithkuil script                                            | Ithkuil constructed language                                         | Strong conlang-nerd appeal, but high complexity.                                                                |
| 52   | Kelen script                                              | Sylvia Sotomayor's constructed language                              | Established conlang community niche.                                                                            |
| 53   | Dritok script                                             | Experimental conlang                                                 | Specialist conlang niche.                                                                                       |
| 54   | Unker Non-Linear Writing System                           | Experimental constructed script                                      | Interesting pedagogy challenge, very niche.                                                                     |
| 55   | Nyctography                                               | Lewis Carroll's night writing                                        | Charming history/puzzle niche.                                                                                  |
| 56   | Night writing                                             | Barbier's tactile precursor to Braille                               | Accessibility history, better paired with Braille.                                                              |
| 57   | Solresol notation                                         | Musical constructed language                                         | Cross-modal curiosity, not a normal visual script course.                                                       |
| 58   | Aiha                                                      | Kesh in Ursula K. Le Guin's Always Coming Home                       | Literary conlang niche. Rights review required.                                                                 |
| 59   | Ath                                                       | Baronh in Crest of the Stars                                         | Anime/light-novel conlang niche. Rights review required.                                                        |
| 60   | Utopian                                                   | Utopia television series                                             | Small media-script niche. Rights review required.                                                               |
| 61   | Loxian                                                    | Enya and Roma Ryan projects                                          | Music-conlang niche. Rights review required.                                                                    |
| 62   | Engsvanyali                                               | Empire of the Petal Throne                                           | Tabletop RPG conlang niche. Rights review required.                                                             |
| 63   | Alternian                                                 | Homestuck                                                            | Webcomic fandom interest, mostly cipher-like. Rights review required.                                           |
| 64   | Orokin-adjacent corpus variants                           | Warframe extended scripts                                            | Better as advanced extension after Tennobet/Orokin. Rights review required.                                     |
| 65   | Gargish variants and Ultima scripts                       | Ultima franchise                                                     | Better as an extension after a core Ultima-script course. Rights review required.                               |
| 66   | Mandel and other Klingon script variants                  | Star Trek and Klingon community                                      | Fragmented alternatives after pIqaD. Rights review required.                                                    |
| 67   | On Beyond Zebra alphabet                                  | Dr. Seuss                                                            | Recognizable literary novelty, limited serious course depth. Rights review required.                            |
| 68   | Fictional map, prophecy, and magic alphabets by franchise | The Witcher, Dragon Age, Warhammer, No Man's Sky, and similar worlds | Track only after a specific fandom target is selected. Rights review required.                                  |
| 69   | Original app-created fictional scripts                    | Future GlyphBridge-owned practice worlds or public-domain texts      | Lowest external popularity, but highest legal control if we create them.                                        |
| 70   | Other Omniglot or ConScript community scripts             | Independent conlang scripts and private-use scripts                  | Long-tail source of ideas; evaluate only when there is an active community or corpus.                           |

## Ranking By Available Data

This ranking estimates bootstrap difficulty from easiest to hardest. It is a
separate axis from learner popularity: a system can be popular but hard to
bootstrap if frequency lists, corpora, tooling, licensing, or reviewer access are
thin. Conversely, a niche system can rank higher here when its structure is well
documented and the source ecosystem is unusually clean.

The ranking weighs these data-readiness signals:

- Unicode, ISO 15924, CLDR, font, normalization, and segmentation metadata.
- Glyph, word, structure, component, syllable, or rule-frequency resources.
- Public corpora, dictionaries, transliteration systems, and pronunciation data.
- Mature tokenizers, analyzers, OCR tools, keyboard/input tooling, and NLP
  libraries.
- Academic research, grammars, textbooks, teaching sequences, and review access.
- License clarity for analysis, scoring, and learner-visible shipped content.

| Rank | Candidate                                      | Bootstrap difficulty | Data-readiness rationale                                                                                                                                         |
| :--- | :--------------------------------------------- | :------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Latin extensions and diacritics                | Very low             | Massive corpora, dictionaries, CLDR data, fonts, keyboards, frequency lists, and pedagogy across European and Latin-script languages.                            |
| 2    | International Phonetic Alphabet                | Very low             | Standardized charts, Unicode support, textbooks, pronunciation literature, and cross-language teaching material; no native corpus dependency.                    |
| 3    | Hangul                                         | Very low             | Algorithmic Unicode decomposition, mature Korean corpora, frequency lists, tokenizers, dictionaries, pedagogical literature, and an existing GlyphBridge packet. |
| 4    | Greek                                          | Very low             | Compact alphabet, strong Unicode/font support, abundant modern and classical resources, dictionaries, frequency lists, and teaching materials.                   |
| 5    | Cyrillic                                       | Low                  | Strong metadata, corpora, keyboards, dictionaries, NLP tools, and pedagogy for Russian plus several Slavic and Central Asian variants.                           |
| 6    | Japanese writing system                        | Low-medium           | Very rich corpora, kana/kanji frequency lists, dictionaries, JLPT/Joyo scaffolds, tokenizers, and pedagogy; complexity is high but data is excellent.            |
| 7    | Han characters for Chinese                     | Low-medium           | Unihan, frequency lists, HSK resources, dictionaries, segmentation tools, corpora, and OCR are abundant; variant and word-boundary choices add work.             |
| 8    | Arabic script                                  | Medium               | Large corpora, morphology tools, Quranic and modern resources, keyboards, and pedagogy; dialects, optional vowels, shaping, and variants increase scope.         |
| 9    | Devanagari                                     | Medium               | Strong Unicode/CLDR support, Hindi/Sanskrit/Nepali corpora, Indic NLP tools, dictionaries, and teaching literature; conjuncts require careful modeling.          |
| 10   | Hebrew                                         | Medium               | Modern and biblical corpora, dictionaries, frequency lists, transliteration, pedagogy, and tooling exist; niqqud and abjad behavior need clear course bounds.    |
| 11   | Thai                                           | Medium               | Existing app expertise, Unicode support, corpora, dictionaries, segmentation tools, and pedagogy exist; word segmentation and tone rules still need review.      |
| 12   | Bopomofo                                       | Medium               | Mandarin-focused pedagogical data is strong, and the inventory is compact; it depends on a Chinese course boundary rather than a standalone language corpus.     |
| 13   | Bengali-Assamese                               | Medium               | Large speaker base, Unicode support, corpora, dictionaries, and Indic tooling; conjuncts and language variants require review.                                   |
| 14   | Tamil                                          | Medium               | Good Unicode support, corpora, dictionaries, transliteration, and pedagogy; classical-versus-modern boundaries need care.                                        |
| 15   | Gurmukhi                                       | Medium               | Punjabi resources, Sikh teaching material, Unicode support, and dictionaries are available; corpus/tooling depth trails the largest Indic scripts.               |
| 16   | Telugu                                         | Medium               | Good Unicode, corpora, dictionaries, and Indic tooling; curriculum design needs script-specific review for clusters and vowel signs.                             |
| 17   | Kannada                                        | Medium               | Good Unicode and regional-language resources; corpora and beginner pedagogy are available but less abundant than Hindi or Tamil.                                 |
| 18   | Malayalam                                      | Medium               | Good Unicode, dictionaries, corpora, and pedagogy; orthographic reforms and conjunct handling add scope.                                                         |
| 19   | Gujarati                                       | Medium               | Solid Unicode, dictionaries, corpora, transliteration, and learner resources; moderate tooling depth.                                                            |
| 20   | Odia                                           | Medium               | Unicode and regional resources are solid, but open corpora, NLP tooling, and pedagogical material are thinner than higher-ranked Indic scripts.                  |
| 21   | Ethiopic                                       | Medium               | Unicode, fonts, dictionaries, Amharic/Tigrinya resources, and grammars exist; syllabary-size and transliteration choices add work.                               |
| 22   | Braille                                        | Medium               | Standards and teaching literature are excellent, but a visual-first app must define tactile-versus-visual pedagogy and language-specific braille boundaries.     |
| 23   | Morse code and signaling systems               | Medium               | Standards, drills, and teaching resources are abundant, but these are not ordinary writing-system courses and require different interaction design.              |
| 24   | Armenian                                       | Medium               | Compact alphabet, strong Unicode support, dictionaries, corpora, and pedagogy; market is smaller but data is adequate.                                           |
| 25   | Georgian                                       | Medium               | Strong Unicode, fonts, dictionaries, and teaching resources; fewer large open corpora and NLP tools than top modern languages.                                   |
| 26   | Coptic                                         | Medium               | Unicode, fonts, grammars, dictionaries, and liturgical resources are strong for a historical script; pronunciation and dialect boundaries need review.           |
| 27   | Tibetan                                        | Medium-high          | Unicode, dictionaries, grammars, and corpora exist; stacked letters, transliteration, segmentation, and font behavior make bootstrap harder.                     |
| 28   | Khmer                                          | Medium-high          | Unicode and some corpora/tools exist; complex shaping, subscripts, and limited beginner frequency resources raise effort.                                        |
| 29   | Lao                                            | Medium-high          | Unicode, fonts, and Thai-adjacent pedagogy help; corpus, segmentation, and frequency tooling are thinner than Thai.                                              |
| 30   | Myanmar                                        | Medium-high          | Unicode and NLP resources exist, but Zawgyi migration, shaping, fonts, and variant languages make source hygiene important.                                      |
| 31   | Sinhala                                        | Medium-high          | Unicode, dictionaries, and learner resources exist; open corpora and NLP tooling are moderate.                                                                   |
| 32   | Egyptian hieroglyphs                           | Medium-high          | Excellent academic literature, sign lists, dictionaries, fonts, and teaching resources; logosyllabic complexity and historical uncertainty add review load.      |
| 33   | Runic scripts                                  | Medium-high          | Unicode, compact inventories, academic literature, and teaching resources are good; many periods and languages need clear boundaries.                            |
| 34   | Phoenician                                     | Medium-high          | Compact encoded abjad with good academic resources; corpus is inscriptional and small but manageable for recognition-first lessons.                              |
| 35   | Ogham                                          | Medium-high          | Compact encoded system, good epigraphic research, and teaching resources; corpus is small but tractable.                                                         |
| 36   | Linear B                                       | Medium-high          | Deciphered, encoded, well researched, and teachable; corpus is finite and academic, not everyday.                                                                |
| 37   | Cuneiform                                      | High                 | Strong academic data and Unicode coverage, but multiple languages, huge sign inventories, transliteration conventions, and specialized tooling raise effort.     |
| 38   | Maya hieroglyphs                               | High                 | Rich scholarship and pedagogy exist, but font/input support, sign variants, visual complexity, and expert review needs are substantial.                          |
| 39   | Old Persian cuneiform                          | High                 | Compact and well documented, with Unicode and teaching resources; still needs historical-language review and limited corpus handling.                            |
| 40   | Ugaritic                                       | High                 | Encoded, compact, and researched; corpus and pedagogy are specialist but usable.                                                                                 |
| 41   | Old Italic family                              | High                 | Unicode and epigraphic research exist, but the family spans several languages and regional alphabets.                                                            |
| 42   | Glagolitic                                     | High                 | Encoded and well researched, with church and Slavic resources; course boundary between script, Old Church Slavonic, and modern interest needs care.              |
| 43   | Gothic                                         | High                 | Compact encoded alphabet and strong grammar resources; corpus is small and historical-language expertise is needed.                                              |
| 44   | Brahmi                                         | High                 | Encoded and central to script history, but paleographic variation, Prakrit/Sanskrit boundaries, and epigraphic sourcing make it specialist.                      |
| 45   | Syriac                                         | High                 | Unicode, fonts, grammars, dictionaries, and liturgical resources exist; multiple styles and language varieties complicate scope.                                 |
| 46   | Mongolian                                      | High                 | Unicode and resources exist, but vertical layout, shaping, variants, and toolchain behavior are high-risk for authoring and UI.                                  |
| 47   | Tifinagh                                       | High                 | Unicode and basic teaching resources exist; corpora, frequency lists, and standardization differ by Amazigh/Tuareg context.                                      |
| 48   | Javanese                                       | High                 | Unicode and cultural resources exist, but modern corpus depth, normalization, and pedagogy are thinner than major living scripts.                                |
| 49   | Balinese                                       | High                 | Unicode and teaching resources exist; domain corpora and practical modern reading targets are limited.                                                           |
| 50   | Baybayin or Tagalog script                     | High                 | Unicode and revival materials are available, but historical versus modern revival conventions and limited corpora need careful handling.                         |
| 51   | Cherokee                                       | High                 | Unicode, keyboards, pedagogy, and revitalization resources exist; open corpora and frequency data are limited.                                                   |
| 52   | Canadian Aboriginal syllabics                  | High                 | Unicode and standards are strong, but language-specific inventories, community review, and data access vary widely.                                              |
| 53   | Adlam                                          | High                 | Unicode, fonts, and community resources exist; open corpora and pedagogical literature are growing but still limited.                                            |
| 54   | N'Ko                                           | High                 | Unicode and educational resources exist; corpora and tooling are more limited than larger scripts.                                                               |
| 55   | Shavian                                        | High                 | Unicode, a compact inventory, and public teaching material exist; word-frequency and pronunciation mapping for English need app-owned decisions.                 |
| 56   | Deseret alphabet                               | High                 | Unicode and historical resources exist; practical corpora and modern pedagogy are small but manageable.                                                          |
| 57   | Sitelen Pona                                   | High                 | Active community and compact corpus help; glyph variants, licensing, and logographic segmentation need review.                                                   |
| 58   | Vai                                            | High                 | Unicode and scholarship exist; corpora, frequency data, and reviewer availability are limited.                                                                   |
| 59   | Bamum                                          | High                 | Unicode and historical resources exist; script-stage selection and limited corpus access make it specialist.                                                     |
| 60   | Thaana                                         | High                 | Unicode and Dhivehi resources exist; small language ecosystem and fewer open analytics tools raise effort.                                                       |
| 61   | Meitei Mayek                                   | High                 | Unicode and revival materials exist; corpora, frequency data, and language review are less abundant.                                                             |
| 62   | Newa, Tirhuta, Syloti Nagri, and related Indic | High-very high       | Encoded and documented, but open corpora, pedagogy, and modern learner demand are uneven.                                                                        |
| 63   | Tengwar and Cirth                              | High-very high       | Fan documentation is extensive, but Unicode is not standard, modes vary, and rights/licensing must be cleared before shipping.                                   |
| 64   | Aurebesh                                       | High-very high       | Mapping data is easy, but useful corpora are franchise-bound and require rights review.                                                                          |
| 65   | Klingon pIqaD                                  | High-very high       | Community resources exist, but Unicode is not standard, orthographic conventions vary, and IP/licensing review is required.                                      |
| 66   | D'ni                                           | High-very high       | Strong fan resources exist, but corpus and rights are game-franchise-bound.                                                                                      |
| 67   | Other franchise cipher scripts                 | High-very high       | Zelda, Elder Scrolls, Unown, Standard Galactic, Futurama, and similar scripts are often easy mappings but weak on licensed corpora.                              |
| 68   | Kharoshthi, Siddham, Grantha, and Sharada      | Very high            | Encoded and academically documented, but paleography, language boundaries, and specialist review make them advanced historical courses.                          |
| 69   | Old Turkic, Sogdian, and Old Uyghur            | Very high            | Encoded and researched, but corpora are specialist and beginner pedagogy is sparse.                                                                              |
| 70   | Avestan, Pahlavi, and Manichaean               | Very high            | Useful scholarship exists, but scripts, languages, and religious-historical contexts require expert handling.                                                    |
| 71   | Tangut                                         | Very high            | Encoded and researched, but enormous character inventory, specialist dictionaries, and low pedagogy make it hard.                                                |
| 72   | Nushu                                          | Very high            | Unicode and cultural research exist, but corpus size, variants, and review expertise are limiting.                                                               |
| 73   | Meroitic scripts                               | Very high            | Signs and sound values are partly known, but language understanding is incomplete; recognition is safer than full reading.                                       |
| 74   | Long-tail active community scripts             | Very high            | Warang Citi, Sora Sompeng, Gondi scripts, Wancho, Tangsa, Toto, Sunuwar, and similar scripts need community review and custom source discovery.                  |
| 75   | Long-tail historical Brahmic scripts           | Very high            | Kaithi, Modi, Mahajani, Multani, Khojki, Takri, Dogra, Ahom, Kawi, and related scripts are feasible only with specialist source curation.                        |
| 76   | Symbolic or AAC systems                        | Very high            | Blissymbolics, iConji, LoCoS, Yerkish, and similar systems need different success metrics from language-script decoding.                                         |
| 77   | Occult and philosophical alphabets             | Very high            | Theban, Enochian, Celestial, Malachim, Transitus Fluvii, Litterae Ignotae, and Real Character are documented but niche and nonstandard.                          |
| 78   | Linear A, Indus, Rongorongo, and Voynich       | Save for later       | Famous and appealing, but undeciphered or disputed; courses can teach history and sign recognition, not reliable reading.                                        |
| 79   | Proto-writing and Neolithic sign systems       | Save for later       | Proto-cuneiform, Vinča, Jiahu, Banpo, and similar systems have thin or disputed language mapping and should wait for history-mode tooling.                       |
| 80   | Other obscure, private, or unencoded systems   | Save for later       | If source data is private, image-only, unencoded, or community-specific, bootstrap should wait until a source manifest and reviewer path are clear.              |

## Early Roadmap Implications

- Best near-term living-script candidates after Thai: Japanese, Korean Hangul,
  Chinese Han characters, Arabic, Cyrillic, Greek, Hebrew, Devanagari, and IPA.
- Lowest bootstrap-risk candidates by data availability: Latin extensions, IPA,
  Hangul, Greek, Cyrillic, Japanese, Han characters for Chinese, Arabic,
  Devanagari, Hebrew, Thai, and Bopomofo.
- Best historical candidates: Egyptian hieroglyphs, runes, cuneiform, Maya,
  Linear B, Phoenician, Ogham, Glagolitic, and Gothic.
- Best fictional or constructed candidates by expected demand: Tengwar,
  Aurebesh, pIqaD, Cirth, Zelda scripts, Elder Scrolls scripts, Unown, Standard
  Galactic Alphabet, Gallifreyan variants, and Futurama Alienese.
- Best low-risk non-franchise constructed candidates: Sitelen Pona, Shavian,
  Deseret, Quikscript, Unifon, Visible Speech, Blissymbolics, and historical
  occult alphabets whose source material is public-domain or otherwise cleared.

## Research Sources Used

- Unicode ISO 15924 code lists and Unicode script status, including encoded,
  unencoded, private-use, and special script codes.
- The World's Writing Systems catalog, which surveys hundreds of systems and
  tracks representative glyphs and Unicode status.
- Wikipedia's writing-system lists, adoption table, undeciphered-system list,
  ISO 15924 overview, and constructed-script list.
- GlyphBridge's own [app philosophy](../app-philosophy.md) and [curriculum
  authoring framework](./authoring-framework.md), which prioritize fast decoding
  payoff, real-world text, corpus validation, and source-license review.
