# Codzee Evaluation Feedback

**Candidate:** Viraj Patil  
**Repository:** https://github.com/vrajjptl/codzee-evaluation-test  
**Date:** 12 October 2026

## Setup completed

1. Created a public Task Tracker API repository
2. Installed and connected Codzee on the repository *(complete in Codzee dashboard if not done yet)*
3. Opened three meaningful pull requests with different change types:
   - **Bug fix:** blank title + invalid dueDate validation
   - **Feature:** task priorities + list filters/search
   - **Refactor/security:** service layer, API key gate, headers, rate limit, integration tests

## What I liked about the review experience

- *(Fill after reviewing Codzee comments on each PR)*
- Example angle: clarity of findings, severity labels, suggested fixes, and whether comments pointed to exact lines

## What worked particularly well

- *(Fill after review)*
- Example angle: catching validation edge cases, security smells, missing tests, or API contract issues

## What could be improved

- *(Fill after review)*
- Example angle: false positives, vague wording, duplicate comments, or missing context about intentional tradeoffs

## Bugs, inconsistencies, or confusing behaviour

- *(Fill after review)*
- Note anything odd: delayed reviews, duplicate bots, broken deep links, UI glitches, unrelated file comments

## Issues or scenarios Codzee missed

Check whether Codzee noticed these intentionally interesting areas:

1. **PR1 context on `main`:** empty/whitespace titles were accepted; invalid dates could become `"Invalid Date"`
2. **PR2:** filter parsing and priority defaults on create
3. **PR3:** in-memory rate limiter correctness, API key comparison approach, and whether optional auth is documented clearly

Record what it caught vs missed.

## Were the reviews accurate and useful?

- Score usefulness for each PR (1–5) and briefly explain why
- Call out any incorrect advice you would *not* merge

## Feature / DX suggestions

Possible suggestions to discuss (edit based on real experience):

- Better distinction between blocking vs advisory findings
- Suggested unit-test stubs for reported bugs
- Diff-aware summaries (“what changed and why it matters”)
- Repo-level config for ignore rules / severity thresholds
- Faster first review on newly opened PRs

## How I approached this with ownership

I built a small but realistic API, left meaningful review surface area, and varied PR types so Codzee’s strengths and gaps would show up clearly. My goal was not to game the tool — it was to evaluate review quality the way a teammate would before trusting it in a real workflow.
