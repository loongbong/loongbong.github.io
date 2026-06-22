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
    demo: { type: "badminton", src: "https://loongbong.github.io/badminton-match-logger/" },
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
    demo: { type: "asr" },
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
    demo: { type: "pipeline" },
  },

  /* ----------------------------------------------------------------------
     P2 · OCEAN Crew — far right (rigorously engineered). [stub: Phase 2]
     ---------------------------------------------------------------------- */
  {
    id: "ocean",
    name: "OCEAN",
    sub: "meet your crew, a Big Five personality app",
    maturity: "built + tested, pre-launch",
    pos: 0.95,
    accent: "#55bacc",
    preview: "A full-stack personality app. Built rigorously, and hardened by a pre-launch security review.",
    links: [{ label: "oceancrew.me", href: "https://oceancrew.me", ext: true }],
    demo: { type: "ocean" },
  },
];
