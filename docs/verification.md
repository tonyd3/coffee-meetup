# Initial verification — 19 October 2026

The workspace started empty, with no existing application or baseline screenshot. This is an initial implementation, not a before/after UI change.

## Automated checks

- `npm run typecheck` passed.
- `npm test` passed: 11 focused tests, including opening/closing boundaries, weekend hours, the exact 30-minute cutoff, ranking, SF daylight-saving changes, calendar end times, invalid origins, live matrix conversion, unreachable routes, and provider outages.
- `npm run build` passed with standard Next.js App Router pages and two server route handlers.

## Exercised in the browser

- Empty initial screen and example flow.
- Live walking routes from Hayes Valley and the Ferry Building: balanced ranking selected Sightglass SoMa (20 / 34 minutes). Moving to the other person's end selected Saint Frank Mira (45 / 10 minutes).
- Slider pointer drag from the middle toward 3.3 settled on stop 3; Home, End and arrow keys worked one stop at a time.
- Live address search for `415 Mission` returned the Salesforce address. Selecting that result and the Ferry Building produced Saint Frank Mira (8 / 10 minutes).
- With only Coffee Movement Chinatown enabled, Tuesday 20 October at 1:30pm showed the 2pm closing warning and a 30-minute calendar event. At 1:31pm it was excluded and the empty-state recovery appeared.
- Weekend shortcut selected Saturday 24 October and used that café's 4pm closing time.
- Google Calendar link contained the expected `America/Los_Angeles` zone and 20:30–21:00 UTC event interval for the 1:30pm Tuesday meeting.
- Apple Calendar / Outlook downloaded a real `coffee-meetup.ics` file. Read back its bytes and confirmed CRLF, the expected start time, and the 30-minute end time. The in-app browser's download-event notification did not resolve; the downloaded file itself was successfully verified.
- Café inclusion checkboxes worked and persisted across reloads. All eight cafés were restored after testing.
- Mobile layout at 390 × 844: full flow worked, document width equalled viewport width, and no horizontal overflow was present.
- Browser error/warning log was empty during the production-flow checks.

## Evidence

Screenshots were captured from the real running application and visually inspected. Binaries are outside the Git repository:

- `/tmp/coffee-meetup-proof/closing-soon-desktop.png` — 1440px desktop, closing-soon warning and calendar options.
- `/tmp/coffee-meetup-proof/no-results-desktop.png` — 1440px desktop, 29-minute exclusion.
- `/tmp/coffee-meetup-proof/results-mobile.png` — 390px mobile, address-based result.
- Task visualization directory: `coffee-meetup-initial.png` and `coffee-meetup-preview.png` — final interface.

## Local development

This Mac exhausted its native watcher resources: Turbopack reported an FSEvent error and native Webpack watching reported EMFILE. The dev script uses Next's Webpack runner with Watchpack polling; the local page then returned HTTP 200. The production build uses the standard Next.js build pipeline.

## Deployment state and limits

No remote repository, Vercel project, deployment, or DNS record was created. The README documents the path to `meet.tony-dong.com`.

The shortlist is an editable starter set. Regular hours are source-checked rather than a live business-hours feed; holiday closures and seating are not guaranteed. Community location/routing endpoints have no availability guarantee. Routing outages use an explicitly labelled estimate. Overnight opening hours and split shifts are outside the first version.

## Compact desktop follow-up

The desktop layout now places the origins side by side, reduces header and section spacing, and presents the calendar choices and café shortlist above their triggers so opening them does not extend the document. At shorter desktop heights, supporting descriptions yield space to the meeting controls. Mobile rules and the slider motion are unchanged.

Verified the initial screen, recommendation, closing warning, calendar choices, and shortlist. At 1066 × 600, the page height stayed at 600 and the closing-warning footer ended at 583px. At 1280 × 720, the page height stayed at 720. At 1440 × 900, the page height stayed at 900 and the footer ended at 797px. Both expanded panels remained inside the viewport, and café inclusion controls worked.

The production build (including TypeScript) and CSS formatting checks passed. Before/after screenshots are retained under `/tmp/coffee-meetup-compact/`; initial baseline capture used 120% browser zoom while later capture used 100%, so these are visual references rather than pixel-matched comparisons. The viewport-fit claims above come from live DOM measurements. No pull request or screenshot uploads were created.
