---
name: exec-voice
description: Rewrite any piece of writing (drafts, notes, braindumps, technical docs, meeting notes, Slack threads) into a confident, concise, executive-friendly email or readout. Use this skill whenever the user asks to make writing "exec-friendly," "punchier," "more confident," "tighter," "leadership-ready," or asks to draft/rewrite an update, readout, recap, summary email, launch announcement, or writeup for managers, leadership, stakeholders, or a team distribution list. Also use it when the user shares messy notes or a long draft and wants it turned into a polished internal email.
---

# Exec Voice

Convert any input — rough notes, a rambling draft, a technical doc, a meeting transcript — into the kind of internal email senior people actually read: skimmable in 20 seconds, confident without bravado, and always landing on "so what for us."

This style is modeled on high-performing internal readouts at large fintech/payments orgs (think: a launch recap from a VP, a conference writeup circulated to a team). It is NOT for cold outreach — for cold emails to strangers, use the cold-email skill instead.

## The governing principle: the skim test

A busy executive will read only (a) the first two lines and (b) the bolded text. The rewrite passes if a reader who does exactly that walks away with ~80% of the message. Everything else in this skill serves that test.

## Output structure

ALWAYS follow this skeleton, trimming sections that don't apply:

```
[First names of recipients, comma-separated — no "Dear", no "Hi team!" unless broad distribution, then "Hi team," is fine]

[1 line: what this is and why now. "Quick readout from X this week." / "Sharing a writeup on Y from Z."]

[1–2 lines: the headline verdict or key number. The single thing they should remember.]

[Optional ALL-CAPS section header like DETAILS or KEY TAKEAWAYS for longer writeups]

* **[Bold thesis sentence — a complete declarative claim, not a topic label.]** [1–3 sentences of evidence: specifics, names, numbers.] [1 sentence of implication: what this means for us / the strategy / the decision.]
* **[Next thesis...]** ...
* (3–5 bullets max. If you have more, you have more than one email.)

[Closing block, 2–4 sentences: what's in flight, the next concrete milestone with a date, any constraint stated plainly, then a low-friction offer.]

[First name only]
```

## The seven rules

### 1. Thesis-first bullets
Every bullet opens with a bolded sentence that makes an argument. Test: could someone disagree with it? "Onboarding update" — no, it's a label, rewrite it. "**A new aggregator layer is emerging as a potential scaling wedge.**" — yes, it's a claim, keep it. After the bold claim: evidence, then implication. Every bullet must be readable standalone.

### 2. Verdict up front
State the headline judgment in the first three lines, before any detail. "We were pleasantly surprised with the quality of inbound." / "The migration is on track but the timeline has one real risk." Executives read conclusions first and details only if the conclusion earns it.

### 3. Quantify with calibrated hedges
Replace vague hedging with numeric hedging. Never "a lot of interest, I think it could be significant." Always "~40 inbound, of which 10–15 look viable after filtering." Tildes, ranges, and "roughly" are confident; "maybe," "I feel like," and "hopefully" are not. If the source has no numbers, ask the user for them or estimate explicitly ("rough estimate: ...") — do not pad with adjectives where a number belongs.

### 4. Land every point on "so what for us"
Each bullet's last sentence connects the observation to the org: a strategic implication, a decision it informs, a risk it creates, an advantage it opens. "This suggests a potential role for [company] as the bridge between X and Y." Information without implication gets cut.

### 5. Define jargon once, with a familiar analogy
First mention of any term the audience may not know gets one plain-English line anchored to something they already understand: "Think of it as a programmable version of a managed account, but enforced entirely by code." Then use the term freely. Never define more than ~3 terms; if you need more, the audience is wrong for this format.

### 6. Close with forward motion
The last block always contains, in order: current status of work in flight, the next concrete milestone with a date ("first live endpoints by mid next week"), any constraint or limitation stated transparently and framed as deliberate ("we are intentionally limiting rollout to <100 users until X is complete"), and a low-friction offer ("Happy to walk through in more detail."). Optionally one line of gratitude. Then sign with first name only.

### 7. Voice mechanics
- "We" over "I" for team work; "I" only for personal commitments ("I'll send the doc Friday").
- Active voice, present tense where possible.
- Confident verbs: "we believe," "this suggests," "there is a strong signal," "we expect." Never "I was wondering," "it might be worth maybe."
- Zero exclamation marks. Zero emojis.
- NO EM DASHES, ever. Not en dashes used as em dashes either. Restructure the sentence with a comma, period, colon, or parentheses. This is a hard rule: scan the final draft and remove any that slipped in. (Numeric ranges like "10–15" are fine.)
- Kill filler on sight: "just wanted to," "hope this finds you well," "circle back," "touch base," "as you may know," "sorry for the long email."
- No apologies for the content existing. State constraints as decisions, not confessions.
- Links go inline on meaningful anchor text: [merchant landing page](url), never "click here" or a bare URL.

## Transformation procedure

When given source material:

1. **Extract** every claim, number, named entity, implication, decision, and next step from the source. Numbers and proper nouns are the most valuable raw material — preserve all of them.
2. **Find the headline.** Ask: if the reader remembers one sentence, which one? That becomes lines 2–3.
3. **Cluster** the remaining material into 3–5 themes. Write each theme's bold thesis first, as a standalone claim. Then attach evidence and implication.
4. **Cut** anything that survives steps 1–3 without a number, a name, or an implication. Background the reader already knows, process narration ("first we did X, then we did Y"), and hedging all go.
5. **Write the close** from whatever next steps and open items exist in the source. If none exist, ask the user what happens next — a readout without forward motion is incomplete.
6. **Run the skim test.** Read only line 1–3 and the bold text. If the story doesn't hold, fix the bold theses, not the body.

Target length: a launch/status readout should be 150–350 words; a concept writeup (explaining an idea or event) can run 300–500 with DETAILS / KEY TAKEAWAYS headers. If the source is 3x longer than that, the skill is doing its job by cutting.

## Example transformation

**Input (typical messy draft):**
> Hey everyone! Just wanted to give a quick update on the testing stuff. So we've been working on the regression testing for the pipeline and it's going pretty well I think. We found some bugs, a few of them were kind of serious actually, like there was one where the staging environment was letting things through that shouldn't pass. We talked to Michael about it and he agrees we should probably change the gating criteria. Also the test suite is slow, takes like forever to run sometimes which is annoying. We're thinking about parallelizing it maybe. Anyway let me know if you have questions! Sorry for the long message!

**Output:**
> Hi team,
>
> Quick update on regression testing for the staging-to-main pipeline.
>
> The headline: testing surfaced 6 bugs this sprint, including one gating failure that allowed non-passing builds into staging. We believe the gating criteria need revision before the next release cycle.
>
> * **The staging gate has a real escape path.** One bug allowed builds to graduate without passing the required checks. Michael (tech lead) has reviewed and agrees the gating criteria should change. We will propose revised criteria this week.
> * **Suite runtime is becoming a bottleneck.** Full runs currently take ~45 minutes, which slows iteration on every PR. We are evaluating parallelization, which we expect could cut runtime by roughly half.
>
> Next steps: revised gating proposal to Michael by Friday, parallelization spike scoped next sprint. Until the gate is fixed, we recommend manual review of staging promotions.
>
> Happy to walk through any of the findings in more detail.
>
> Anushk

Note what happened: "going pretty well I think" became a verdict with a number; "kind of serious actually" became a bolded thesis; "takes like forever" became "~45 minutes" (when the source lacks the number, ask for it or flag the estimate); "sorry for the long message" disappeared; vague worry became a recommendation with an owner and a date.

## It must not read as AI-written

The output should be indistinguishable from an email a sharp operator typed themselves. Run this de-AI pass on every draft:

- **Ban the AI lexicon.** Never use: "delve," "leverage" (as a verb), "robust," "seamless," "streamline," "landscape," "game-changer," "unlock value," "synergies," "I hope this email finds you well," "in today's fast-paced world," "it's worth noting that," "furthermore," "moreover," "additionally" as a sentence opener. ("Ecosystem" is allowed only if the source genuinely uses it.)
- **No symmetrical triads.** AI loves "X, Y, and Z" lists of three balanced abstractions ("transparency, efficiency, and trust"). Real writers are lopsided: one concrete point gets three sentences, another gets four words.
- **No empty summarizing sentences.** Cut anything shaped like "In summary, this represents a significant opportunity" or "Overall, the results are promising." If a sentence could be appended to any email on any topic, delete it.
- **Vary rhythm.** Mix short sentences with long ones. An occasional fragment is fine. Uniform medium-length sentences are the strongest structural AI tell.
- **Prefer the specific word over the impressive word.** "Slow" not "suboptimal," "broken" not "experiencing issues," "merchants emailed us" not "we received inbound engagement."
- **No hedging boilerplate.** "It's important to note," "it could be argued," "generally speaking" all go.
- **Em dashes are the #1 surface tell.** Reinforcing rule 7: zero em dashes in the final output, no exceptions.

Final check: read the draft aloud in your head. If any sentence sounds like a press release or a LinkedIn post, rewrite it the way you'd say it to a colleague at their desk.

## Anti-patterns (reject these even if the source contains them)

- Topic-label bullets ("**Update on testing:**") instead of thesis bullets
- Burying the verdict below the details
- "I think this is interesting" without saying why it matters to the org
- Three adjectives where one number would do
- Closing with "Thoughts?" or "Let me know!" instead of a concrete next step + offer
- Exclamation marks, emojis, em dashes, "just," "actually," "basically"
- Anything that reads like AI wrote it (see the de-AI pass above); if a sentence sounds like a press release, it fails
- Apologizing for length, for asking, or for the news itself

## Edge cases

- **Bad news**: same structure, no softening preamble. Verdict first ("The migration slipped two weeks; here is why and what changes"), causes as thesis bullets, mitigation in the close. Confidence in this style means owning the miss plainly, not spinning it.
- **Pure concept writeups** (no project status): use the Vault-writeup shape — orientation line, soft offer up front ("Feel free to reach out with questions"), DETAILS section with definition-style bold lead-ins, KEY TAKEAWAYS section where each takeaway still lands on org relevance.
- **Very short asks** (5 lines or less needed): skip bullets entirely. Orientation line, the ask with one supporting number, deadline, sign-off.
- **Audience is external partners, not internal leadership**: keep the structure but soften proprietary implications; "what this means for us" becomes "what this unlocks for both teams."
