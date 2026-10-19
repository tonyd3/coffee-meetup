# Meet

A small Next.js app for choosing a San Francisco coffee spot between two starting points. Styled after `tony-dong.com`, with Product's five-stop slider interaction and motion curve.

## Run

Requires Node.js 22. The deployment uses the same major version as local verification.

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

Edit **`data/cafes.ts`** to maintain the whitelist. Each café has a stable ID, coordinates, address, note, hours source, last-checked date, and seven daily schedules in **Sunday-first order**. Use `null` when a day has no confirmed opening hours. Optional `dateHours` entries override the weekly schedule for an exact `YYYY-MM-DD` date, including `null` for a date-specific closure. The first version supports same-day opening intervals, rather than overnight hours or split shifts.

The 29-place whitelist covers downtown, the Mission, Mission Bay, Dogpatch, the Marina, the Sunset, and the Richmond. It includes every public SF city café listed by Verve, Saint Frank, and Ritual when checked, plus the individually selected venues in `data/cafes.ts`. Capital One Café at 101 Post serves Verve coffee and is labelled under its actual business name. Saint Frank Mira appears once, and The Coffee Movement has been removed. Historical meetup counts and dates do not affect ranking or availability. The [meeting-place research](docs/meeting-places-research.md) explains the latest ten additions, seating tradeoffs, sources, and excluded candidates.

Ritual FiDi opens on **22 October 2026**; only its confirmed opening-day hours (8am–3pm) are eligible until its regular schedule is published. Airport cafés, out-of-city locations, and the Ritual roastery closed to the public are excluded. Hours were checked against the linked sources on **19 October 2026**. Blue Bottle Sansome, Capital One, and La Promenade use business-listing hours where official hours were unavailable. Blue Bottle South Park uses the official page's embedded café data. Conflicting Golden Goat, Delah, and Equator SoMa schedules use conservative confirmed windows, with the relevant uncertainty flagged. Holiday hours, special closures, and seating availability need confirmation with the café. Every recommendation links to its hours source.

Visitors can exclude places in the expandable shortlist. Those preferences are saved in their browser's local storage; origins and meeting details are not saved by the app.

## Location and routing services

No API key is required for light personal use:

- [Photon](https://github.com/komoot/photon) finds addresses and places from OpenStreetMap. Search is restricted to a San Francisco bounding box, debounced in the browser, and cached by Next.js for one day. A built-in neighbourhood list remains available if address search fails.
- [Valhalla](https://valhalla.github.io/valhalla/api/matrix/api-reference/) calculates one pedestrian matrix from both origins to the shortlist, cached for one hour. Slider and date/time changes reuse that matrix.
- If live routing is unavailable, results explicitly show **estimated walks**, using straight-line distance with a 1.3 street-network factor at 4.5 km/h. Hills and the actual street route can take longer. A café without a route in an otherwise valid live response is omitted.

Typed search text is sent to Photon, and origin/café coordinates are sent to Valhalla. The app has no accounts, analytics, database, or application-level location logging. Hosting and upstream providers have their own operational logs.

The public community endpoints have no availability guarantee and may throttle traffic. For higher traffic, host compatible services and set `PHOTON_URL` and `VALHALLA_URL` in Vercel. See `.env.example`. These are server-side variables; do not prefix them with `NEXT_PUBLIC_`.

## Deploy to meet.tony-dong.com

The app is deployed to the **coffee-meetup** project in Vercel's **tonyd3s-projects** account, using Next.js App Router with server route handlers and Node 22.x. The custom domain is [meet.tony-dong.com](https://meet.tony-dong.com), with [coffee-meetup.vercel.app](https://coffee-meetup.vercel.app) as a fallback. Namecheap's CNAME is configured and accepted by Vercel; local DNS caches may take time to refresh after the initial setup.

The source is published on [tonyd3/coffee-meetup](https://github.com/tonyd3/coffee-meetup)'s `main` branch. Vercel's GitHub app has access to this repository, and Vercel is connected with `main` as its production branch. `vercel.json` enables automatic deployments from `main` only, matching Winery Simulator's convention. The project uses the repository root and the default `npm run build` command. No environment variables are required for the default services.

For an explicit deployment after reviewing, verifying, committing, and pushing changes, run from this directory:

```sh
npx vercel --prod --scope tonyd3s-projects
```

On another machine, run `npx vercel login` and `npx vercel link --scope tonyd3s-projects --project coffee-meetup` first.

The custom domain uses a **CNAME** in Namecheap's Advanced DNS for `tony-dong.com`: host **`meet`**, value **`76d4351de78264c4.vercel-dns-017.com`**, TTL **Automatic**. This is the project-specific value returned by Vercel on 19 October 2026; consult the project's **Settings → Domains** if reconfiguring it later.

Canonical metadata and calendar UIDs use `meet.tony-dong.com`. Deployment results and any remaining setup are recorded in `docs/verification.md`.

## Verification

The focused tests cover weekday/weekend hours, opening boundaries, the exact 30-minute cutoff, slider ranking, unreachable routes, SF daylight-saving offsets, and calendar end times and ICS encoding. Browser checks and screenshots are recorded in `docs/verification.md`.
