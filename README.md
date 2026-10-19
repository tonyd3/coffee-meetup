# Meet

A small Next.js app for choosing a San Francisco coffee spot between two starting points. Styled after `tony-dong.com`, with Product's five-stop slider interaction and motion curve.

## Run

Requires Node.js 22 or later.

```sh
npm install
npm run dev
```

Open the Local URL printed by Next.js. Local development uses Webpack with polling to avoid macOS native file-watcher limits. To check the production build:

```sh
npm run typecheck
npm test
npm run build
npm start
```

## How it works

- Choose an address, landmark, or neighbourhood for each person. Neighbourhoods use the representative point described below the input.
- The slider moves freely under the pointer and glides to one of five stops when released. Keyboard arrows move one stop; Home and End move to either end.
- In the middle, ranking minimises the longer walk. Moving toward a person gives their walk more weight. The extremes minimise only that person's walk.
- Select an exact date and time. Weekday/weekend shortcuts choose the next matching day on or after the selected date.
- The app checks that the café is open at the meeting time and for at least 30 more minutes. With 30–59 minutes remaining, it displays a closing-soon warning and shortens the calendar event accordingly. Otherwise events last one hour.
- Google Calendar opens a prefilled event for the visitor to review and save. Apple Calendar / Outlook downloads an `.ics` file. The app does not send invitations or access anyone's calendar.
- All meeting times use `America/Los_Angeles`, independently of the visitor's timezone.

## Your café list

Edit **`data/cafes.ts`** to maintain the whitelist. Each café has a stable ID, coordinates, address, note, official hours source, last-checked date, and seven daily schedules in **Sunday-first order**. Use `null` when a day has no confirmed opening hours. Optional `dateHours` entries override the weekly schedule for an exact `YYYY-MM-DD` date, including `null` for a date-specific closure. The first version supports same-day opening intervals, rather than overnight hours or split shifts.

The whitelist includes every public San Francisco city café currently listed by Verve (1), Saint Frank (3), and Ritual (3), plus the two retained Sightglass locations. The Coffee Movement has been removed. Ritual FiDi opens on **22 October 2026**; only its confirmed opening-day hours (8am–3pm) are eligible until its regular schedule is published. Airport cafés, out-of-city locations, and the Ritual roastery closed to the public are excluded. Hours were checked against the linked official sites on **19 October 2026**. Holiday hours, special closures, and seating availability need confirmation with the café. Every recommendation links to its official hours source.

Visitors can exclude places in the expandable shortlist. Those preferences are saved in their browser's local storage; origins and meeting details are not saved by the app.

## Location and routing services

No API key is required for light personal use:

- [Photon](https://github.com/komoot/photon) finds addresses and places from OpenStreetMap. Search is restricted to a San Francisco bounding box, debounced in the browser, and cached by Next.js for one day. A built-in neighbourhood list remains available if address search fails.
- [Valhalla](https://valhalla.github.io/valhalla/api/matrix/api-reference/) calculates one pedestrian matrix from both origins to the shortlist, cached for one hour. Slider and date/time changes reuse that matrix.
- If live routing is unavailable, results explicitly show **estimated walks**, using straight-line distance with a 1.3 street-network factor at 4.5 km/h. Hills and the actual street route can take longer. A café without a route in an otherwise valid live response is omitted.

Typed search text is sent to Photon, and origin/café coordinates are sent to Valhalla. The app has no accounts, analytics, database, or application-level location logging. Hosting and upstream providers have their own operational logs.

The public community endpoints have no availability guarantee and may throttle traffic. For higher traffic, host compatible services and set `PHOTON_URL` and `VALHALLA_URL` in Vercel. See `.env.example`. These are server-side variables; do not prefix them with `NEXT_PUBLIC_`.

## Deploy to meet.tony-dong.com

This is standard **Next.js App Router**, with server route handlers. It is ready for a Vercel project, matching the hosting provider used by the personal site and winery simulator. It does not use a static export.

1. Push this repository to GitHub and import it into Vercel as a **Next.js** project. Use the repository root, Node 22+, and the default `npm run build` command. No environment variables are required for the default services.
2. Set the production branch to `main`. `vercel.json` allows automatic deployments from `main` only, matching the winery simulator's convention.
3. In the project's **Settings → Domains**, add `meet.tony-dong.com`.
4. In the DNS provider for `tony-dong.com`, add the record Vercel displays for the `meet` subdomain. Use Vercel's project-specific target; leave the root-domain records in place.
5. Wait for Vercel to verify the domain and provision HTTPS, then check location search, a recommendation, and a calendar download on the deployed origin.

Canonical metadata and calendar UIDs already use `meet.tony-dong.com`. No GitHub repository, Vercel project, production deployment, or DNS change is created by the initial local implementation.

## Verification

The focused tests cover weekday/weekend hours, opening boundaries, the exact 30-minute cutoff, slider ranking, unreachable routes, SF daylight-saving offsets, and calendar end times and ICS encoding. Browser checks and screenshots are recorded in `docs/verification.md`.
