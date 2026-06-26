/* =========================================================================
   Site content. Single source of truth — projects render through ONE template.
   Voice: identity-led, demonstrate-don't-declare, density. No em-dashes in copy.
   Sanitization is LOAD-BEARING here (see PORTFOLIO_BRIEF §9).
   ========================================================================= */

const SITE = {
  name: "Loong Bong",
  tagline: {
    lead: "Same tools, very different rigour.",
    sub: "I direct AI to build things, and match the rigour to the stakes. Five projects below, from vibe-coded to rigorously engineered.",
  },
  about:
    'Hi, I\'m Loong. I trained as a chemical engineer, and a scientific theory I came up with as an undergrad ' +
    'ended up published in <a href="https://doi.org/10.1039/D0PY01311K" target="_blank" rel="noopener"><em>Polymer Chemistry</em></a>, ' +
    'cited 40+ times. I spent the next five years as an engineer at PETRONAS, where a <strong>Lean Six Sigma Green Belt</strong> ' +
    'taught me how to systematically take a process apart, <span class="flow">find where the value flows and blocks, improve on it, ' +
    'and then make the fix last</span>. Today I\'m in Strategy &amp; Transactions at EY-Parthenon, with an MBA, but outside of work I ' +
    'direct AI at the stuff I wish existed, and build it. I vibe-coded a live globe of a Web3 startup\'s node ' +
    'network that the startup adopted, now with 800+ monthly visitors. But for a personality app that\'s an ' +
    'ongoing passion project of mine, I\'m engineering it properly and carefully, with a full roadmap, highly ' +
    'detailed specs, and multiple review layers to ensure security (one of which caught a real security hole ' +
    'before launch). Everyone has the same access to these incredibly powerful AI tools, but having ' +
    'judgement and taste, and <strong>knowing how much rigour each thing needs, is the differentiator</strong>.',
  rangeLine:
    'Outside the build: 20+ essays on personality psychology, and ' +
    '<a href="https://open.spotify.com/artist/3fAP8piejouPJKFnC5IJlu" target="_blank" rel="noopener">a song that once charted on national radio</a>.',
  links: [
    { label: "LinkedIn", href: "https://linkedin.com/in/loong-bong" },
    { label: "Writing", href: "https://lafm.substack.com" },
    { label: "Live globe", href: "https://globe.wirwp.net" },
    { label: "GitHub", href: "https://github.com/loongbong" },
  ],
};

const PROJECTS = [
  /* ----------------------------------------------------------------------
     P1 · globe — far left (vibe-coded, shipped, adopted). FULL write-up.
     ---------------------------------------------------------------------- */
  {
    id: "globe",
    name: "globe",
    sub: "a Web3 startup's global node network",
    maturity: "shipped & adopted",
    pos: 0.05,
    accent: "#f0532e",
    preview: "A live 3D globe of a Web3 startup's node network. Vibe-coded on a shoestring, and the startup adopted it anyway.",
    links: [{ label: "live demo", href: "https://globe.wirwp.net", ext: true }],
    problem:
      "I was one of the first 100 operators on this Web3 network, and the first in Malaysia. Before this, seeing the " +
      "network meant reading raw JSON straight off the nodes: a wall of IDs, IP addresses, ports, and statuses like " +
      "Ready and Observing. Checking your own node meant fishing it out of that blob by hand. So I built a live 3D " +
      "globe instead, on top of an open-source library called globe.gl, with a crawler behind it that finds every " +
      "node and works out where it physically sits. It plots 300+ operators on a spinning Earth, and about 800 " +
      "people a month come look. The startup team started using screenshots directly in their marketing, and the " +
      "CEO reached out to say thanks.",
    decisions: [
      {
        choice: "Vibe-code it on a shoestring instead of engineering it like a product",
        alt: "tests, a security pass, and clean architecture from day one",
        why:
          "The binding constraint was the budget: a fixed $250 of free credits that expire, so I optimised for " +
          "shipping fast over polishing the plumbing. A node monitor is a read-only view, so a rough edge there is " +
          "cosmetic, not costly, and it didn't need payments-app rigour. I built it with Claude Code, stayed on " +
          "Sonnet instead of the pricier Opus to stretch the credits, and scoped each session to a batch of " +
          "features I could finish.",
      },
      {
        choice: "Crawl the whole network, not just the startup's seed nodes",
        alt: "read the seed nodes and call it a day, like most monitors",
        why:
          "I had the backend visit every node it found, then ask that node who its neighbours were, and on and on " +
          "until nothing new turned up. That drew a fuller map than the seed nodes alone, and it geolocates " +
          "each node by IP against a database of roughly 326,000 ranges. The full picture also shows how many peers " +
          "can actually see each node, so the isolated ones stick out.",
      },
      {
        choice: "Spend most of the time refining the look and feel",
        alt: "ship more features, rougher",
        why:
          "About three-quarters of the time went into the feel: draggable controls, node pop-ups, little animations, " +
          "filters. I was the entire QA department, clicking every combination and fixing whatever annoyed me. One " +
          "example: the globe auto-rotates (which you can also toggle off), so nodes kept sliding out from under my " +
          "cursor before I could click them, so I made it pause whenever you hover one.",
      },
      {
        choice: "Take the terms of use seriously, line by line",
        alt: "a boilerplate disclaimer, or none",
        why:
          "People could make real mining decisions off what the globe showed, so the risk here was legal, not " +
          "technical. The easy path was to paste in a boilerplate or ship the AI's first draft unread. Instead I " +
          "drafted the terms with AI, then went through every line and edited where it mattered, and made the page " +
          "force you to scroll all the way down before the accept button works.",
      },
    ],
    hardPart:
      "The hard part wasn't any single feature. It was holding a real build together across dozens of short agentic " +
      "sessions. On Sonnet the context window kept filling up and compacting mid-task, so the model would forget " +
      "what we'd already made. I worked in slices instead: each session, a batch of features small enough to build " +
      "and hand-test in full before I moved on.",
    next:
      "It's loose under the hood, and it was the last thing I shipped before stepping back to focus elsewhere, so it " +
      "sits as-is. If I come back to it, I'd rebuild the core the way I now build anything meant to last: a written " +
      "spec before any code, layered reviews that go looking for what breaks, and a proper test suite. That's the " +
      "work that makes it safe to extend with alerting or per-node uptime history.",
    stats: {
      lead: 'first <b>100</b> operators on the network · first in <b>Malaysia</b>',
      items: [
        { field: "operators", val: 300, sfx: "+", label: "mapped on the live globe", icon: "network" },
        { field: "monthly reach", val: 800, pfx: "~", label: "people come look", icon: "eye" },
        { field: "coverage", val: 326, sfx: "k+", label: "IP-address ranges geolocated", icon: "globe" },
        { field: "build cost", val: 250, pfx: "$", label: "in AI credits, total", icon: "coin" },
      ],
    },
    hard: { attempt: "the attempt", problem: "context window fills, compacts", solution: "build in slices, hand-test each", goal: "holds together" },
    traj: [
      { lab: "now: ships as-is", now: true },
      { lab: "a written spec" },
      { lab: "layered reviews" },
      { lab: "a real test suite" },
      { lab: "alerting + uptime" },
    ],
    demo: { type: "globe", src: "https://globe.wirwp.net" },
  },

  /* ----------------------------------------------------------------------
     P5 · badminton — left (simple, clean, shipped). [stub: Phase 2]
     ---------------------------------------------------------------------- */
  {
    id: "badminton",
    name: "badminton",
    sub: "a doubles match logger, the first thing I ever vibe-coded",
    maturity: "shipped",
    pos: 0.25,
    accent: "#f5933f",
    preview: "A badminton match logger, and the first thing I ever vibe-coded. localStorage, no backend, shipped.",
    links: [
      { label: "live app", href: "https://loongbong.github.io/badminton-match-logger/", ext: true },
      { label: "source", href: "https://github.com/loongbong/badminton-match-logger", ext: true },
    ],
    problem:
      "I play doubles most weeks, and I wanted to know who actually wins, not who remembers winning. I also wanted " +
      "an excuse to finally try vibe-coding. So I built a little logger: tap in your partner, the two opponents, and " +
      "the score, and it keeps the running record for every team matchup, all in the browser. It was the first thing " +
      "I ever built this way.",
    decisions: [
      {
        choice: "Keep it all in the browser, no backend",
        alt: "a server, a database, real accounts",
        why:
          "A backend means paying to host it, and this was a fun weekend project, not a startup. So everything lives " +
          "in your browser's local storage: it costs nothing to run, loads instantly, and works at the court with no " +
          "signal.",
      },
    ],
    hardPart:
      "I built it with Gemini, before I'd ever touched Claude, and the code turned out to be the easy part. The real " +
      "fight was GitHub. I'd change something, push it, watch it break on the live page, and have no idea why, then " +
      "go back and forth between the code and the site trying to spot what I'd done. Half the project was just " +
      "learning how putting a thing online works at all. By the end I had a working app on the internet, which at the " +
      "time felt like a much bigger win than the badminton.",
    next:
      "The one real limit is that your logs live on a single browser, so they don't follow you to a new phone. There's " +
      "a JSON export and import to move them by hand, which is the honest workaround for skipping a backend. The day " +
      "my crew wants one shared history across phones, that's when it earns a real server. For now, it settles who " +
      "actually won. That was the whole point.",
    hard: { attempt: "push it live", problem: "breaks on the page, no idea why", solution: "learn how deploying works", goal: "app on the internet" },
    traj: [
      { lab: "now: shipped + exportable", now: true },
      { lab: "a real server" },
      { lab: "shared cross-phone history" },
    ],
    demo: {
      type: "badminton",
      src: "https://loongbong.github.io/badminton-match-logger/",
      repo: "https://github.com/loongbong/badminton-match-logger",
    },
  },

  /* ----------------------------------------------------------------------
     P3 · asr voice — middle (eval spike + ensemble design). [stub: Phase 2]
     ---------------------------------------------------------------------- */
  {
    id: "asr",
    name: "asr",
    sub: "two speech models that fail in opposite ways",
    maturity: "evaluation spike + ensemble design",
    pos: 0.5,
    accent: "#e7ddc9",
    preview: "An A/B evaluation of two speech-to-text models, and a designed ensemble to reconcile them.",
    problem:
      "I record meetings sometimes, so nothing said outside the notes I take in the room slips away. I tried Whisper, " +
      "the obvious open-source option, and it was solid until it wasn't: on the rough patches it mangled words in " +
      "ways that quietly changed what someone said. Qwen had just dropped a new speech model, so I ran it on the same " +
      "audio to compare. They broke in completely different places.",
    decisions: [
      {
        choice: "Test two very different models head-to-head, on my own audio",
        alt: "pick whatever tops a leaderboard and trust it",
        why:
          "A single accuracy score hides where a model actually falls apart. Running Whisper and Qwen on the same " +
          "rough recording showed exactly where each one breaks, and that they break in different spots. That is what " +
          "a leaderboard never tells you.",
      },
      {
        choice: "Reconcile the two models instead of crowning a winner",
        alt: "just ship whichever one scored higher",
        why:
          "Whisper collapses in an obvious way: on a bad patch it locks into a loop and repeats a phrase. Qwen fails " +
          "the opposite way, smoothly inventing plausible words and swapping a name for a brand it knows. Because the " +
          "two don't fail in the same spots, the places they disagree are exactly where there's signal. The idea is an " +
          "arbiter that takes the trustworthy reading at each disagreement, or flags it as unclear instead of guessing.",
      },
      {
        choice: "Run everything locally on my own Mac",
        alt: "a cloud transcription API",
        why:
          "The audio is sensitive, so I didn't want it leaving my machine. Local costs nothing per hour, and it let " +
          "me see what these models can really do on consumer hardware. Local, private AI is the future.",
      },
    ],
    hardPart:
      "The catch is you can't just average two transcripts. Whisper's failure is loud: a repeated phrase you spot in " +
      "a second. Qwen's is the dangerous kind, a clean confident sentence that's simply wrong, with nothing marking " +
      "it as off. So an arbiter can't just trust the smoother output, because the smooth one is often the invented " +
      "one. The design aligns both transcripts in time and leans on the disagreements: where they diverge, take the " +
      "reading that fits the context, or flag the span as unclear instead of letting a confident guess through.",
    next:
      "I ran the evaluation for real, but I stopped at the design. The reconciler is drafted, not built, so this is " +
      "a spike and a design, not a product. Honestly, I don't record enough meetings to justify finishing it just " +
      "for me. If I come back to it, it's because the local-only angle makes it worth turning into a small tool other " +
      "people could actually use.",
    hard: { attempt: "average the two transcripts", problem: "the smooth one is the invented one", solution: "align, lean on the disagreements", goal: "trust it, or flag it" },
    traj: [
      { lab: "evaluation: done" },
      { lab: "now: reconciler designed", now: true },
      { lab: "build the reconciler" },
      { lab: "a small local tool" },
    ],
    demo: {
      type: "asr",
      reference:
        "Priya will coordinate the shipment to terminal KLG-7. The vendor quoted around 2,300 ringgit. [unclear]",
      caption:
        "Illustrative example. The failure modes are real; the sentence is invented. The original audio stays private.",
      steps: [
        "The reference is the ground truth: what was actually said. Watch how each model drifts from it.",
        "Whisper is clean until a rough patch, then locks into a loop and repeats a phrase. A loud failure, easy to catch.",
        "Qwen stays fluent but invents: it swaps a name for a brand it knows, and shifts a number's magnitude. The dangerous kind, because it reads as confident.",
        "The arbiter aligns both transcripts in time and leans on the disagreements: it keeps the trustworthy reading, or flags the span as unclear instead of guessing.",
      ],
      segments: [
        { kind: "name", ref: "Priya", whisper: "Priya", qwen: "Prada", verdict: "Priya",
          why: "Qwen swapped the name for a brand it recognised. Whisper held it. The arbiter keeps Whisper." },
        { kind: "agree", ref: "will coordinate the shipment to", whisper: "will coordinate the shipment to", qwen: "will coordinate the shipment to", verdict: "will coordinate the shipment to",
          why: "Both models agree, so the shared text passes through untouched." },
        { kind: "code", ref: "terminal KLG-7", whisper: "terminal KLG-7", qwen: "terminal KLD-9", verdict: "terminal KLG-7",
          why: "Whisper is stable on codes. Qwen drifted two characters. The arbiter keeps Whisper." },
        { kind: "agree", ref: ". The vendor quoted around", whisper: ". The vendor quoted around", qwen: ". The vendor quoted around", verdict: ". The vendor quoted around",
          why: "Agreement again. No decision needed." },
        { kind: "number", ref: "2,300 ringgit", whisper: "2,300 ringgit", qwen: "23,000 ringgit", verdict: "2,300 ringgit",
          why: "Whisper recovered the figure. Qwen shifted the magnitude tenfold. The arbiter keeps Whisper." },
        { kind: "noise", ref: ". [unclear]", whisper: ". before Friday before Friday before Friday before Friday", qwen: ". the supplier covers the difference", verdict: ". [unclear]",
          why: "The hard span. Whisper loops one phrase; Qwen invents a clean line. They disagree and neither earns trust, so the arbiter flags it instead of guessing." },
      ],
    },
  },

  /* ----------------------------------------------------------------------
     P4 · pipeline — right (auditable, reproducible). [stub: Phase 2]
     ---------------------------------------------------------------------- */
  {
    id: "pipeline",
    name: "pipeline",
    sub: "a reproducible Malaysian bond-yield archive",
    maturity: "working pipeline",
    pos: 0.72,
    accent: "#8ccff9",
    preview: "A reproducible, auditable archive of Malaysian bond-yield history.",
    problem:
      "I had weeks of manual data collection in front of me: Malaysian bond yields from a public central-bank portal " +
      "(BNM's FAST) that only serves one date at a time, going back years. Clicking and copying it by hand would have " +
      "taken weeks. I knew enough about Python scrapers to automate it instead, so I built a pipeline with Claude Code " +
      "that pulls the whole history, reshapes it into one tidy table, and proves every number matches the source page " +
      "it came from.",
    decisions: [
      {
        choice: "Write a proper spec before any code",
        alt: "start scraping and figure out the shape as I went",
        why:
          "Before writing a line, I pinned down exactly what to capture, what a valid page should look like, and what " +
          "evidence to keep for every date. The scraper had a target and the data had a contract. That caught the " +
          "awkward cases, missing dates, public holidays, the page layout shifting, before they could quietly poison " +
          "the dataset.",
      },
      {
        choice: "Make the pipeline prove itself, every run",
        alt: "scrape it, dump a CSV, call it done",
        why:
          "A scraper that returns plausible-looking numbers is more dangerous than one that crashes, because nobody " +
          "notices the quiet corruption. So every run keeps the raw HTML of each page, checks the numbers against what " +
          "the page should contain, logs anything off, and writes a hash manifest. Any figure in the final table " +
          "traces straight back to the page it came from.",
      },
      {
        choice: "Scrape gently, and make it resumable",
        alt: "hammer the portal as fast as it would go",
        why:
          "While I was still building this, the portal itself went down for a good half hour, right when I needed the " +
          "data by the next day. That was enough to make me careful. The scraper waits a couple of seconds between " +
          "pages, backs off and retries on errors, and checkpoints its progress, so a dropped connection picks up " +
          "where it left off and the source never gets hit harder than a careful person clicking.",
      },
    ],
    hardPart:
      "The portal doesn't hand you its data as plain HTML. It's an old-style government web app that builds the tables " +
      "with JavaScript after the page loads, so my first scrapers pulled the page and got almost nothing. I tried a " +
      "few angles, poking at direct URLs and the requests behind the page, before giving up on the lightweight " +
      "approach and driving a real browser with Playwright instead. It loads the page like a person would, waits for " +
      "the data to render, then reads it. Slower, but it actually sees what's on the screen.",
    next:
      "It runs, and the numbers check out against the source. To make it genuinely hands-off I'd put it on a schedule " +
      "with alerting, so the day the portal changes its layout the run fails loudly and pings me instead of quietly " +
      "drifting. If I extended it, the audit trail is the part I'd never cut.",
    stats: {
      lead: 'a public bond portal, <b>one date at a time</b>, <b>two decades</b> deep',
      items: [
        { field: "observations", val: 160000, sfx: "+", label: "daily yield observations, audit-trailed", icon: "chart" },
        { field: "provenance", val: 100, sfx: "%", label: "of figures hash-checked to source", icon: "check" },
        { field: "maturities", val: 10, label: "yields captured per date", icon: "grid" },
      ],
    },
    hard: { attempt: "lightweight scrapers", problem: "JS-rendered page, almost nothing", solution: "drive a real browser", goal: "sees what's on screen" },
    traj: [
      { lab: "now: runs + verified", now: true },
      { lab: "scheduled + alerting" },
      { lab: "fails loud on layout change" },
      { lab: "hands-off archive" },
    ],
    demo: {
      type: "pipeline",
      stages: [
        { key: "listing", name: "Listing scrape", metric: "dates indexed", detail: "Walk the public portal's date index, resumable and rate-limited." },
        { key: "detail", name: "Detail scrape", metric: "pages fetched", detail: "Fetch each date's yield page with backoff and retries." },
        { key: "parse", name: "Parse to long", metric: "reshaped", detail: "Reshape wide per-page tables into one row per date and maturity." },
        { key: "build", name: "Build dataset", metric: "one table", detail: "Assemble the tidy archive across the full date range." },
        { key: "validate", name: "Validate + hash", metric: "hash ✓", detail: "Range-check every value, log provenance, write a hash manifest." },
      ],
      chart: {
        tenors: ["3M", "6M", "1Y", "3Y", "5Y", "7Y", "10Y", "15Y", "20Y", "30Y"],
        series: [
          { label: "latest", points: [2.85, 2.95, 3.05, 3.35, 3.6, 3.85, 3.95, 4.2, 4.35, 4.5] },
          { label: "12 months earlier", points: [3.0, 3.05, 3.1, 3.25, 3.4, 3.55, 3.65, 3.85, 3.95, 4.05] },
        ],
        caption: "Sample of the archived yield curve. Illustrative values from the public bond data.",
      },
    },
  },

  /* ----------------------------------------------------------------------
     P2 · OCEAN Crew — far right (rigorously engineered). [stub: Phase 2]
     ---------------------------------------------------------------------- */
  {
    id: "ocean",
    name: "OCEAN",
    sub: "meet your crew, a Big Five personality app",
    maturity: "built + tested · in redesign",
    pos: 0.95,
    accent: "#55bacc",
    preview: "A full-stack Big Five personality app: login, payments, personal results. The one I engineered properly.",
    problem:
      "A Big Five personality result is normally five abstract scores: hard to grasp, and nothing you'd want to " +
      "share. OCEAN Crew turns each trait into a character instead, so your result is a crew of five you can read at " +
      "a glance and actually want to show people. A two-minute quiz reveals your character; the paid report gives you " +
      "the full crew, one for each trait, around a radar. It takes a login, a card payment, and people's personal " +
      "results, so I built it the careful way from the start.",
    decisions: [
      {
        choice: "Engineer it properly from day one, full stack",
        alt: "vibe-code a pretty front end and bolt the rest on later",
        why:
          "This is the far end of the spectrum from the globe. A login, real payments, and personal results mean a " +
          "bug isn't a cosmetic glitch, it's someone's data or money. So I built it as a real full-stack app, with " +
          "the validation and structure that implies, not a pretty shell I'd have to make safe later.",
      },
      {
        choice: "Build it to grow from day one",
        alt: "make it work now and deal with the mess when I revisit it",
        why:
          "I have a roadmap for this one, so it can't be code that runs fine until you reopen it to add a feature and " +
          "then breaks in ways nobody planned. That is exactly why the globe needs a refactor before I extend it. So " +
          "I planned the architecture up front and built it in clean modules, and let scale drive the stack: Svelte " +
          "and a PostgreSQL backend, with the front end on Cloudflare's CDN so it stays fast as it grows.",
      },
      {
        choice: "Keep the surface lean, but harden anything that touches money or identity",
        alt: "build every feature I could imagine before launch",
        why:
          "Rigorous doesn't mean bloated. I deferred the extra tiers, the AI-written reports, the nice-to-haves, and " +
          "shipped the core funnel. The auth, the input validation, and the Stripe payments got the real treatment " +
          "instead. The payment path alone has three independent ways to confirm a purchase, so a dropped webhook " +
          "can't leave a paid-for report undelivered.",
      },
      {
        choice: "Run a real security review before anyone could sign in",
        alt: "launch, then patch what breaks",
        why:
          "An OWASP-style pass before launch is cheap. After a breach it isn't. I walked the app against the OWASP " +
          "Top 10 and a public payloads list, treated my own code as hostile input, and went looking for the holes a " +
          "happy-path build never sees.",
      },
    ],
    hardPart:
      "The review earned its keep. The login flow decided where to send you after sign-in by checking the " +
      "destination started with a slash, which looks safe and isn't. A value like /\\evil.com slips past that check, " +
      "and the browser happily redirects off your site to an attacker's: a clean phishing setup right after someone " +
      "logs in. The fix was to reject the sneaky cases, a backslash, an at-sign, a second slash, and to strip the " +
      "session token at the boundary so it can never ride along on a redirect. It was an open-redirect, not a way " +
      "into anyone's account. But on a login page, that's exactly the kind of thing a pre-launch review exists to catch.",
    next:
      "It's built and tested, but offline right now because I'm redoing the look. When GPT Image 2.0 came out I could " +
      "see how much better the whole thing could be, so I'd rather take the time to get the design right. " +
      "I'm regenerating the art one piece at a time, down to the backdrop motifs on " +
      "the share cards, until each one is right. Before it goes live, the security review gets run again on the final " +
      "build, plus abuse monitoring on the auth and payment paths and a proper load test.",
    stats: {
      lead: 'a login, card payments, personal results · <b>built careful from day one</b>',
      items: [
        { field: "the crew", val: 5, label: "characters, one per Big Five trait", icon: "crew" },
        { field: "archetypes", val: 45, label: "portraits generated, 15 on show", icon: "grid" },
        { field: "payment path", val: 3, label: "independent purchase confirmations", icon: "shield" },
        { field: "security review", val: 1, label: "real hole caught before launch", icon: "bug" },
      ],
    },
    hard: { attempt: "happy-path login redirect", problem: "open-redirect slips the slash check", solution: "reject sneaky cases, strip the token", goal: "caught before launch" },
    traj: [
      { lab: "built + tested" },
      { lab: "now: redesign", now: true },
      { lab: "re-run the security pass" },
      { lab: "abuse monitoring + load test" },
      { lab: "relaunch" },
    ],
    demo: {
      type: "ocean",
      login: "assets/ocean/m-login.webp",
      loginCaption: "The sign-in. A real login, with payments behind it, is exactly where the pre-launch review caught the open-redirect.",
      crew: "assets/ocean/m-crew.webp",
      crewCaption: "Demo persona. The crew page turns your Big Five scores into five characters around a radar.",
      portraits: [
        { file: "assets/ocean/portraits/the-achiever.webp", name: "The Achiever" },
        { file: "assets/ocean/portraits/the-artist.webp", name: "The Artist" },
        { file: "assets/ocean/portraits/the-cooperator.webp", name: "The Cooperator" },
        { file: "assets/ocean/portraits/the-coordinator.webp", name: "The Coordinator" },
        { file: "assets/ocean/portraits/the-empath.webp", name: "The Empath" },
        { file: "assets/ocean/portraits/the-improviser.webp", name: "The Improviser" },
        { file: "assets/ocean/portraits/the-individualist.webp", name: "The Individualist" },
        { file: "assets/ocean/portraits/the-inquirer.webp", name: "The Inquirer" },
        { file: "assets/ocean/portraits/the-introspector.webp", name: "The Introspector" },
        { file: "assets/ocean/portraits/the-networker.webp", name: "The Networker" },
        { file: "assets/ocean/portraits/the-observer.webp", name: "The Observer" },
        { file: "assets/ocean/portraits/the-pragmatist.webp", name: "The Pragmatist" },
        { file: "assets/ocean/portraits/the-socialite.webp", name: "The Socialite" },
        { file: "assets/ocean/portraits/the-stoic.webp", name: "The Stoic" },
        { file: "assets/ocean/portraits/the-worrier.webp", name: "The Worrier" },
      ],
    },
  },
];
