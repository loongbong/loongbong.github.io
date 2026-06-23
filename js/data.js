/* =========================================================================
   Site content. Single source of truth — projects render through ONE template.
   Voice: identity-led, demonstrate-don't-declare, density. No em-dashes in copy.
   Sanitization is LOAD-BEARING here (see PORTFOLIO_BRIEF §9).
   ========================================================================= */

const SITE = {
  name: "Loong Bong",
  tagline: {
    lead: "Same tools, very different rigor.",
    sub: "Vibe-code the prototype, then engineer what people actually use.",
  },
  about:
    'I\'m Loong Bong. I started in chemical engineering, where a theory I worked out as an undergrad ' +
    'became a paper in <a href="https://doi.org/10.1039/D0PY01311K" target="_blank" rel="noopener"><em>Polymer Chemistry</em></a> ' +
    '(cited ~40 times), spent five years as an engineer at PETRONAS, and now work in Strategy &amp; Transactions ' +
    'at EY-Parthenon. Along the way I started directing AI agents to build the things I needed, and didn\'t stop: ' +
    'a Web3 node-monitor the startup it tracks adopted, a full-stack personality app a pre-launch security review ' +
    'hardened, an auditable data pipeline, a model-evaluation spike. <strong>The projects below aren\'t all built ' +
    'the same way. That\'s deliberate.</strong> I match the rigor to the stakes: vibe-code the throwaway, engineer ' +
    'the thing people have to trust.',
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
    preview: "A live 3D globe of a Web3 startup's node network. Shipped, and adopted by the startup it tracks.",
    links: [{ label: "live demo", href: "https://globe.wirwp.net", ext: true }],
    problem:
      "A Web3 startup needed to see its node network the way operators actually think about it: who is online, " +
      "where they are, and how coverage is spreading across the world. The data existed but sat in tables nobody " +
      "opened. I built a live 3D globe that makes roughly 326k IP ranges and 300+ operators legible at a glance, " +
      "and about 800 people a month check it.",
    decisions: [
      {
        choice: "Vibe-code it, and match the rigor to the stakes",
        alt: "a hand-engineered build with a backend, tests, and hardening",
        why:
          "A monitoring view a startup might iterate on or drop does not need the rigor a payments app does. I built " +
          "it fast on about $250 of credits with a cheap model, got something useful in front of people, and it got " +
          "adopted. For these stakes, that was the right level.",
      },
      {
        choice: "Show the data on a globe, not in a dashboard",
        alt: "tables, charts, a metrics panel",
        why:
          "Operators think geographically, so coverage and the gaps in it read instantly on a map in a way they never " +
          "did in a spreadsheet. The glanceable view is why people actually open it.",
      },
      {
        choice: "Stop at 'works and adopted', and say so",
        alt: "keep piling features onto the vibe-coded base",
        why:
          "It does its job, but the foundation is loose. I would refactor the core before adding anything load-bearing. " +
          "Knowing when to stop building is part of the judgment.",
      },
    ],
    hardPart:
      "The hard part of vibe-coding on a tight budget was not getting code, it was knowing where a cheap model would " +
      "quietly get things wrong. I let it run on the parts I could verify by eye, the globe and the interactions, and " +
      "checked anything touching data accuracy myself. A monitor that looks right but reports wrong is worse than none.",
    next:
      "It is adopted and stable enough for now. Before I extend it with alerting, history, or per-operator views, I would " +
      "refactor the vibe-coded core and add tests. Today a bug is cheap. The moment people make decisions on it, the rigor " +
      "has to rise to meet that.",
    demo: { type: "globe", src: "https://globe.wirwp.net" },
  },

  /* ----------------------------------------------------------------------
     P5 · badminton — left (simple, clean, shipped). [stub: Phase 2]
     ---------------------------------------------------------------------- */
  {
    id: "badminton",
    name: "badminton",
    sub: "a match logger I actually use",
    maturity: "shipped",
    pos: 0.25,
    accent: "#f5933f",
    preview: "A badminton match logger I built for myself. localStorage, no backend, shipped.",
    links: [
      { label: "live app", href: "https://loongbong.github.io/badminton-match-logger/", ext: true },
      { label: "source", href: "https://github.com/loongbong/badminton-match-logger", ext: true },
    ],
    problem:
      "I play most weeks and wanted to know who actually wins, not who remembers winning. The apps I tried wanted an " +
      "account, served ads, and made a server round-trip to log a single game. I built a logger that opens instantly, " +
      "records a match in a few taps, and keeps the running head-to-head on the device.",
    decisions: [
      {
        choice: "Keep everything on the device, no backend",
        alt: "accounts, a database, a hosted API",
        why:
          "It is a scorekeeper for a handful of players, not a social network. localStorage means it loads instantly, " +
          "costs nothing to run, and keeps working offline at the court. These stakes did not justify a server.",
      },
      {
        choice: "Ship one small useful thing, then stop",
        alt: "tournaments, rankings, multi-sport, a social feed",
        why:
          "The whole value is logging a match in seconds and seeing the head-to-head. I built exactly that and left it " +
          "there. A tool I actually use beats a roadmap I never finish.",
      },
      {
        choice: "Publish the source",
        alt: "keep it private like the others",
        why:
          "This is the one project meant to be read. It is small, clean, and vanilla, so it can stand as the browsable " +
          "proof that the building is real.",
      },
    ],
    hardPart:
      "The fiddly part was the data model. A match is simple, but head-to-head records across players, partners, and " +
      "sessions tangle fast. I kept one flat list of match records and compute every stat on read, so there is no " +
      "derived state to keep in sync and nothing to migrate when I add a view. Slower in theory, instant in practice " +
      "at this scale.",
    next:
      "It does its job. If I extended it I would add a real export so the history is not trapped in one browser, and " +
      "optional sync for people who switch phones. Neither is worth a backend yet. The moment the data has to outlive " +
      "a device, the rigor has to rise to match.",
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
      "I needed accurate transcripts of difficult audio: accented, noisy, meeting-room recordings where one wrong span " +
      "can flip a meaning. No single off-the-shelf model held up on the hard parts. I ran two very different speech " +
      "models against the same clip to map where each one broke, and whether they broke in the same places.",
    decisions: [
      {
        choice: "Pit two models against each other, not against a leaderboard",
        alt: "pick the highest-scoring model and move on",
        why:
          "A single accuracy score hides where a model fails. Running two very different models on the same hard audio " +
          "showed their errors land in different places, which is the whole basis for combining them.",
      },
      {
        choice: "Design the ensemble around complementary failure modes",
        alt: "average the two outputs, or just trust the higher scorer",
        why:
          "Whisper collapses structurally and loops a phrase on noisy spans. Qwen fails semantically and invents " +
          "plausible wrong text. Where two different failure modes disagree is where an arbiter actually has signal.",
      },
      {
        choice: "Run it locally on the hardware I have",
        alt: "a cloud transcription API",
        why:
          "Sensitive audio should not leave the machine. I ran quantized models on Apple Silicon with MLX and staged " +
          "the heavier passes to a stronger Mac. Privacy and cost both pointed local.",
      },
    ],
    hardPart:
      "The catch is that the two models fail in ways that look nothing alike. Whisper locks into a repetition loop and " +
      "can lose a sixth of a clip to one repeated phrase. Qwen never loops, but it will calmly invent a sentence over " +
      "silence and swap a person's name for a brand it recognizes. Averaging them is meaningless. The design instead " +
      "aligns them by timestamp and, where they disagree, takes the contextually plausible reading or flags the span " +
      "as unclear rather than guessing.",
    next:
      "The evaluation is real and the reconciliation logic is drafted, but the arbiter is not built end to end, so I " +
      "label this a spike and a design, not a product. Next is wiring a small local model as the arbiter and measuring " +
      "whether reconciled accuracy actually beats the better single model on the hard spans. If it does not, the honest " +
      "result is that the ensemble is not worth building.",
    demo: {
      type: "asr",
      reference:
        "Priya will coordinate the shipment to terminal KLG-7. The vendor quoted around 2,300 ringgit. [unclear]",
      caption:
        "Illustrative example. The failure modes are real; the sentence is invented. The original audio stays private.",
      segments: [
        { kind: "name", ref: "Priya", whisper: "Priya", qwen: "Prada", verdict: "Priya",
          why: "Qwen swapped the name for a brand it recognized. Whisper held it. The arbiter keeps Whisper." },
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
      "I wanted a clean, queryable history of Malaysian bond yields across maturities, the kind of yield-curve record a " +
      "public portal publishes one date at a time and never as a dataset. Pulling it by hand is slow, and a single " +
      "mistyped figure quietly corrupts everything downstream. I built a pipeline that collects it, reshapes it into " +
      "one tidy table, and proves the result is faithful to the source.",
    decisions: [
      {
        choice: "Write the spec before writing any code",
        alt: "start scraping and shape the data as I go",
        why:
          "An archive is only as good as its definition. I pinned down the exact fields, maturities, and date range " +
          "first, so the scraper had a target and the output had a contract. Planning caught ambiguities that would " +
          "have meant re-running everything later.",
      },
      {
        choice: "Build for audit, not just for output",
        alt: "a script that prints a CSV and exits",
        why:
          "If I cannot prove a number came from the source unchanged, the archive is worthless for anything serious. " +
          "Every run writes validation logs and a hash manifest, so any row traces back and any silent change is caught.",
      },
      {
        choice: "Make the backfill resumable and polite",
        alt: "one long loop that hammers the server and dies halfway",
        why:
          "Years of daily data is a lot of requests. The scraper backs off, retries, and checkpoints its progress, so a " +
          "dropped connection resumes instead of restarting, and the public source is never hit harder than a careful " +
          "human would.",
      },
      {
        choice: "Parse to a long, tidy table",
        alt: "keep the portal's wide, per-page layout",
        why:
          "The source publishes one date per page, laid out for reading rather than analysis. Reshaping to one row per " +
          "date and maturity makes the whole history filterable and chartable in a line, which is the entire point of " +
          "having an archive.",
      },
    ],
    hardPart:
      "The hard part was trust. A scraper that returns plausible-looking numbers is more dangerous than one that " +
      "crashes, because nobody notices the quiet corruption. I made the pipeline prove itself: it range-checks every " +
      "value and type on the way in, hashes each stage's output into a manifest, and logs the page every final row came " +
      "from. If the source shifts or a parse slips, the run fails loudly instead of saving bad data.",
    next:
      "It runs and the output checks out. To make it genuinely hands-off I would put it on a schedule with alerting, so " +
      "a failed or changed source pings me instead of waiting to be noticed, and publish a small data dictionary so the " +
      "archive explains itself to anyone but me. The core call, spend the effort on auditability, is the one I would keep.",
    demo: {
      type: "pipeline",
      stages: [
        { key: "listing", name: "Listing scrape", detail: "Walk the public portal's date index, resumable and rate-limited." },
        { key: "detail", name: "Detail scrape", detail: "Fetch each date's yield page with backoff and retries." },
        { key: "parse", name: "Parse to long", detail: "Reshape wide per-page tables into one row per date and maturity." },
        { key: "build", name: "Build dataset", detail: "Assemble the tidy archive across the full date range." },
        { key: "validate", name: "Validate + hash", detail: "Range-check every value, log provenance, write a hash manifest." },
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
    preview: "A full-stack personality app. Built rigorously, and hardened by a pre-launch security review.",
    problem:
      "OCEAN Crew turns a Big Five personality result into something people want to look at: a two-minute quiz that " +
      "renders your traits as a crew of five characters around a radar. It is built to be used by strangers and to " +
      "handle a login, a payment step, and personal results. That pushes the stakes well past a throwaway prototype, " +
      "so I engineered it like something that has to be trusted.",
    decisions: [
      {
        choice: "Engineer it properly, full stack, from the start",
        alt: "vibe-code a pretty front end and bolt the rest on later",
        why:
          "This is the far end of the spectrum from the node globe. A login, payments, and personal data mean the rigor " +
          "has to be high, so I built it as a real full-stack app, SvelteKit and Hono and PostgreSQL with Stripe, with " +
          "the validation and structure that implies.",
      },
      {
        choice: "Stay validation-first and lean",
        alt: "build every feature I could imagine before launch",
        why:
          "Rigorous does not mean bloated. I kept the surface small and the validation tight: prove the core funnel " +
          "works and is safe, ship that, and add features only once the foundation holds.",
      },
      {
        choice: "Run a real security review before launch",
        alt: "launch, then patch what breaks",
        why:
          "An OWASP-style pass before anyone signs in is cheap. After a breach it is not. The review treated the app as " +
          "hostile input and went looking for the holes a happy-path build never sees.",
      },
    ],
    hardPart:
      "The review caught a real one. The login callback decided where to send you after sign-in by checking the " +
      "destination started with a slash, which looks safe but is not: a value like /\\evil.com slips past that check and " +
      "the browser redirects off-site, a clean phishing setup right after login. The fix tightened the validation to " +
      "reject a backslash, an at-sign, or a second slash after the leading one, and stripped the session token at the " +
      "BFF boundary so it never rides along on a redirect. It was an open-redirect, not a way into anyone's account, " +
      "but on a login flow it is exactly what a pre-launch review exists to catch.",
    next:
      "It is built and integration-tested but currently offline while I rework the design, so I call it pre-launch " +
      "and nothing more. Before it goes public I want the security review repeated on the final build, basic abuse " +
      "monitoring on the auth and payment paths, and a proper load pass. The judgment I am most sure of is that this " +
      "project earned the heavy treatment, where the node globe did not.",
    demo: {
      type: "ocean",
      crew: "assets/ocean/crew-emma.webp",
      crewCaption: "Demo persona. The crew page renders five characters around a Big Five radar.",
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
