# First version

Visual thesis: the warm paper, charcoal text, brass accent, Space Grotesk and Fraunces of tony-dong.com, adapted to a quiet working surface.

Content plan: a small masthead; two origins, convenience and meeting time; one recommendation with two alternatives; a discreet expandable shortlist.

Interaction thesis: Product's five-stop Base UI slider follows the pointer freely and settles to the nearest stop; labels softly crossfade on Product's 200 ms ease-out curve; results and extra context reveal without abrupt jumps. Honour reduced motion.

Scope: San Francisco, walking, an editable starter café list with sourced weekly hours, exact SF-local dates and times, a minimum 30-minute open window, a warning below one hour, and Google Calendar / ICS handoff. No accounts or database.

Deployment: standard Next.js App Router, Vercel, intended domain meet.tony-dong.com. Do not publish or change DNS as part of initial local implementation.

Evidence: the workspace was empty at start; no pre-existing application or before screenshot exists. Verify the completed initial, results, closing-soon, no-results, shortlist and mobile states.

## Simplification — 19 October 2026

Visual thesis: keep the warm paper, serif wordmark and brass accent, with a compact form as the initial working surface.

Content plan: two labelled origins, one balance control, date and time, and one search action. Show the recommended café after searching. Keep alternatives and the café list behind disclosures. Remove the numbered section headings, A/B markers, initial diagram, repeated walking labels and separate hours link.

Interaction thesis: retain the freely moving five-stop slider and crossfading balance label. Fade between café recommendations; use a native disclosure for alternatives. Preserve keyboard controls, live announcements, closing warnings and reduced motion.

Evidence: baseline `b54118fa1a93a3c2c4c0f934cae1c4f44059fd38`, local route `http://127.0.0.1:3017/`, light appearance, all 34 cafés included. Desktop captures use the existing 1280×720 browser viewport; mobile captures use 390×844. Matched empty and result screenshots are retained outside Git in the task's `simplify` artifact directory. The mobile result captures have different scroll offsets because the shorter page reaches its bottom sooner.
