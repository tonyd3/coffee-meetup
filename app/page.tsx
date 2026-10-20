import { Meetup } from "@/components/meetup";
import { sfToday } from "@/lib/meeting";

export const dynamic = "force-dynamic";
export default function Home() {
  const tomorrow = new Date(
    new Date(`${sfToday()}T12:00:00Z`).getTime() + 86400000,
  )
    .toISOString()
    .slice(0, 10);
  return (
    <div className="shell">
      <header className="masthead">
        <a className="wordmark" href="/" aria-label="Meet home">
          meet<span>.</span>
        </a>
        <div className="masthead-note">
          <span>SAN FRANCISCO</span>
        </div>
      </header>
      <main>
        <h1 className="page-intro">Let’s meet for coffee.</h1>
        <Meetup initialDate={tomorrow} />
      </main>
      <footer>
        <a href="https://tony-dong.com" target="_blank" rel="noreferrer">
          Tony Dong <span aria-hidden="true">↗</span>
        </a>
        <span>
          Places & routes ©{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/valhalla/valhalla"
            target="_blank"
            rel="noreferrer"
          >
            Valhalla
          </a>
        </span>
      </footer>
    </div>
  );
}
