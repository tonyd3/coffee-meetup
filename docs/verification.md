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

## Café whitelist follow-up

Updated the shortlist to every public SF city location listed by Verve (1), Saint Frank (3), and Ritual (3), retaining the two Sightglass cafés and removing both Coffee Movement locations. Official location pages and hours were checked on 19 October 2026. Airport locations, cafés outside San Francisco, and the Ritual roastery closed to the public are excluded.

Ritual FiDi opens on 22 October. Its official page confirms 8am–3pm for that date but does not publish a regular schedule. Date-specific hours keep it eligible only on that opening day, including the existing 30-minute minimum and closing-time calendar limit. The shortlist explains that its regular hours are unconfirmed.

`npm run typecheck`, all 13 tests, and `npm run build` passed. New tests cover FiDi's opening-day window, the exact 30-minute cutoff, and a date-specific closure overriding regular hours. A data check confirmed nine unique café IDs, seven-day schedules, SF coordinates, the expected brand counts, and no Coffee Movement entries.

A fresh visual check was unavailable: browser automation rejected access to the existing tabs under its URL policy. No new after screenshot is claimed; the previously verified compact layout remains the visual baseline.

## Personal meetup locations follow-up

Added Andytown at 747 Front, Blue Bottle at 115 Sansome, Cento at 140 Sutter, Flywheel at 22 Battery, Loveski at 499 Jackson, and Paper Son at 303 2nd (N102). Saint Frank Mira at 120 Folsom was already present and retains its existing ID. There are now 15 unique cafés in alphabetical order. The supplied meetup counts and historical dates are background context, with no change to recommendation ranking.

Sources checked on 19 October 2026: [Andytown](https://andytownsf.com/pages/locations), [Cento](https://centocoffee.com/pages/locations), [Flywheel](https://flywheelcoffee.com/), [Loveski](https://www.loveskideli.com/location/san-francisco/), and [Paper Son](https://papersoncoffee.com/faq). Blue Bottle's official site returned contradictory schedules (including all days closed and a shifted weekday list); its weekday 6:30am–5:30pm / weekend 8am–2pm schedule uses [Restaurantji](https://www.restaurantji.com/ca/san-francisco/blue-bottle-coffee-8/), corroborated by Restaurant Guru and Wanderlog, with a visible confirmation note. Coordinates matched exact address POIs through OpenStreetMap/Photon, with Andytown's exact street number resolved through Nominatim and cross-checked against ArcGIS after Photon returned unrelated addresses.

Type checking, all 13 tests, formatting, and the production build passed. A targeted data check verified all six additions qualify at 30 minutes before closing and fail at 29, the three weekday-only cafés are excluded on Saturday, and Cento's later Tuesday closing is respected. The running `/api/routes` endpoint returned HTTP 200 with real pedestrian routes for all 15 cafés (`estimated: false`), including both walking times for each new location.

This follow-up changes café data only. The existing browser URL-policy restriction still prevents fresh visual proof; no browser workaround or new screenshot is claimed.

## Painted Leopard follow-up

Added Painted Leopard's permanent SF storefront at 166 Maiden Lane, open daily 9am–5pm according to its [official Find Us page](https://paintedleopard.com/pages/find-us), checked 19 October 2026. The entrance coordinates use an ArcGIS street-address match. The whitelist now has 16 unique, alphabetically ordered cafés. Pop-up locations are outside this addition.

Type checking, all 13 tests, formatting, and the production build passed. A targeted check verified its opening time and exact 30-minute closing cutoff on a weekday, Saturday, and Sunday. The running routing endpoint returned all 16 cafés and both walking times for Painted Leopard. Fresh visual verification remains unavailable under the previously recorded browser restriction.

## Additional Verve option follow-up

Rechecked [Verve's official directory](https://www.vervecoffee.com/pages/locations) on 19 October 2026: 2101 Market is its only listed SF café and was already included. Added Capital One Café at 101 Post as another SF option serving Verve, under its actual business name. [Capital One's official location page](https://www.capitalone.com/local/sanfrancisco-unionsquare/) confirms Verve service and access for everyone. Its hours were absent from the available official page data, so the weekday 7am–6pm and weekend 9am–5pm schedule uses [Eater's venue listing](https://sf.eater.com/venue/934882/capital-one-cafe), corroborated by Cylex and Yellow Pages. The shortlist identifies it as serving Verve and using business-listing hours. Coordinates match the exact OpenStreetMap/Photon POI.

Type checking, all 13 tests, formatting, and the production build passed. Targeted checks verified 17 unique cafés in alphabetical order, weekday/weekend opening times and the 30-minute closing cutoff, and a single retained Market Street entry. The local routing endpoint returned HTTP 200 with all 17 cafés and real pedestrian times for the addition (`estimated: false`). Fresh visual verification remains unavailable under the previously recorded browser restriction.

## Empty-state diagram alignment follow-up

The user supplied and I inspected the actual empty-state screenshot before editing; an untouched copy is retained at `/tmp/coffee-meetup-diagram/user-before.png`. Before commit `66db979`, the circle centres were at 105/195 while the origin dots were at 62/238, and the HTML labels were positioned independently with CSS percentages. The fix centres each origin in its circle at 90/210, keeps the meeting point at 150, and uses centred SVG text for the labels. The viewBox remains 300 × 150, preserving the illustration's layout footprint and loading animation.

Formatting, type checking, and the production build passed. Rendered the exact updated SVG markup and relevant CSS with Sharp at the four existing illustration widths (180, 210, 245, and 270px), and inspected every output for aligned markers, centred labels, clear outlines, and clipping. The previews use a sans-serif fallback font; their SVG geometry and styles come from the source. SVGs and PNGs are retained under `/tmp/coffee-meetup-diagram/`.

These isolated SVG renders are previews, not browser screenshots or a matched full-page before/after pair. Fresh browser verification remains unavailable under the previously recorded URL-policy restriction. No pull request or screenshot upload was created.
