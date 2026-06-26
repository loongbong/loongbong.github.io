/* =========================================================================
   Render the data array through ONE journey template + the spectrum nav.
   Content in data.js is authored/trusted, so template strings + innerHTML.
   Instrument primitives mount as empty roots here; js/beats.js builds + plays them.
   ========================================================================= */

const $ = (sel, root = document) => root.querySelector(sel);

// split a prose string into ~2-sentence paragraphs for a blog rhythm.
// breaks only at sentence-end + whitespace, so "globe.gl", "BNM's FAST" etc. stay intact.
function paras(text) {
  if (!text) return "";
  const parts = text.match(/.*?[.!?]+(?:\s+|$)/g);
  if (!parts || parts.length < 2) return `<p>${text}</p>`;
  const out = [];
  let buf = "";
  parts.forEach((s) => { buf += s; if (buf.trim().length > 170) { out.push(buf.trim()); buf = ""; } });
  if (buf.trim()) out.push(buf.trim());
  return out.map((s) => `<p>${s}</p>`).join("");
}

// beat header: label + an optional "replay" button (only beats with a replayable animation get one)
function beatHead(label, withReplay) {
  const btn = withReplay
    ? `<button class="beat__replay" type="button" aria-label="Replay this animation">↺ replay</button>`
    : "";
  return `<div class="beat__hd"><div class="beat__label">${label}</div>${btn}</div>`;
}

// split reasoning into one bullet per sentence (decision cards) — same sentence-safe boundary as paras()
function bullets(text, cls) {
  if (!text) return "";
  const parts = text.match(/.*?[.!?]+(?:\s+|$)/g);
  if (!parts || parts.length < 2) return `<p class="${cls}">${text}</p>`;
  return `<ul class="${cls}">${parts.map((s) => `<li>${s.trim()}</li>`).join("")}</ul>`;
}

function linkBtn(link, primary) {
  const ext = link.ext ? ' target="_blank" rel="noopener"' : "";
  const glyph = link.ext ? ' <span aria-hidden="true">↗</span>' : "";
  const cls = primary ? "btn" : "btn btn--ghost";
  return `<a class="${cls}" href="${link.href}"${ext}>${link.label}${glyph}</a>`;
}

/* ---- Hero ---- */
function renderHero() {
  $("#hero-title").textContent = SITE.tagline.lead;
  $("#hero-sub").textContent = SITE.tagline.sub;
}

/* ---- Spectrum (full, in hero) + mini (sticky topbar) ---- */
function renderSpectrum() {
  const nodes = PROJECTS.map(
    (p, i) => `
    <button class="node" data-target="proj-${p.id}" style="--pos:${p.pos * 100}%; --node:${p.accent}; --i:${i}"
            aria-label="${p.name}: ${p.preview}">
      <span class="node__dot"></span>
      <span class="node__label">${p.name}</span>
      <span class="node__preview">${p.preview}</span>
    </button>`
  ).join("");

  // ruler: minor tick every 10, numeral every 20
  let ticks = "";
  for (let v = 0; v <= 100; v += 10) {
    const major = v % 20 === 0;
    ticks += `<span class="tick ${major ? "tick--major" : "tick--minor"}" style="left:${v}%"></span>`;
    if (major) ticks += `<span class="tick__num" style="left:${v}%">${v}</span>`;
  }

  $("#spectrum").innerHTML = `
    <div class="spectrum__cue mono">scroll, or tap a project <span aria-hidden="true">↓</span></div>
    <div class="spectrum__labels">
      <span class="spectrum__label spectrum__label--left">vibe-coded, shipped fast</span>
      <span class="spectrum__label spectrum__label--right">rigorously engineered</span>
    </div>
    <div class="spectrum__track">
      <div class="spectrum__axis"></div>
      ${nodes}
    </div>
    <div class="spectrum__ruler">${ticks}</div>`;

  // mini sticky spectrum
  const miniNodes = PROJECTS.map(
    (p) => `<span class="mini-node" data-target="proj-${p.id}" data-id="${p.id}"
             style="left:${p.pos * 100}%; --node:${p.accent}" title="${p.name}"></span>`
  ).join("");
  $("#sticky-spectrum").innerHTML = `<span class="mini-axis"></span>${miniNodes}`;
}

/* ---- stat icons: inline SVG keyed from data.stats.items[].icon ---- */
const ICONS = {
  network: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="5.5" r="1.7"/><circle cx="15.5" cy="6.5" r="1.7"/><circle cx="9.5" cy="15.5" r="1.7"/><path d="M6 6 L14 6.4 M5.6 7 L8.7 13.9 M14.3 8 L10.6 13.9"/></svg>',
  eye: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10 C5 5.5,15 5.5,18 10 C15 14.5,5 14.5,2 10 Z"/><circle cx="10" cy="10" r="2.3"/></svg>',
  globe: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.3"/><path d="M2.7 10 H17.3"/><ellipse cx="10" cy="10" rx="3.2" ry="7.3"/></svg>',
  coin: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="10" cy="6.4" rx="6.4" ry="2.7"/><path d="M3.6 6.4 V13 C3.6 14.5 6.5 15.7 10 15.7 C13.5 15.7 16.4 14.5 16.4 13 V6.4"/><path d="M3.6 9.7 C3.6 11.2 6.5 12.4 10 12.4 C13.5 12.4 16.4 11.2 16.4 9.7"/></svg>',
  check: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7.5"/><path d="M6.4 10.2 l2.4 2.4 l4.8 -5.2"/></svg>',
  chart: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3 V17 H17"/><path d="M5.5 13 L9 9.5 L11.5 11.5 L16 6"/></svg>',
  gear: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="2.6"/><path d="M10 2.4 V4.2 M10 15.8 V17.6 M17.6 10 H15.8 M4.2 10 H2.4 M15.4 4.6 L14.1 5.9 M5.9 14.1 L4.6 15.4 M15.4 15.4 L14.1 14.1 M5.9 5.9 L4.6 4.6"/></svg>',
  crew: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7.5" r="2.4"/><circle cx="14.2" cy="8.4" r="1.9"/><path d="M3 16 C3 12.7 5 11.5 7 11.5 C9 11.5 11 12.7 11 16"/><path d="M12 15.6 C12 13 13.2 12.2 14.6 12.2 C16 12.2 17 13.2 17 15.6"/></svg>',
  grid: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5.5" height="5.5" rx="1"/><rect x="11.5" y="3" width="5.5" height="5.5" rx="1"/><rect x="3" y="11.5" width="5.5" height="5.5" rx="1"/><rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1"/></svg>',
  shield: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2.5 L16 4.8 V10 C16 14 13.2 16.4 10 17.5 C6.8 16.4 4 14 4 10 V4.8 Z"/><path d="M7.4 10 l1.8 1.8 l3.4 -3.8"/></svg>',
  bug: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6.4" y="7" width="7.2" height="8.6" rx="3.6"/><path d="M10 7 V5.4 M7.6 5.2 L6.6 4 M12.4 5.2 L13.4 4 M6.4 9.6 L3.7 8.8 M13.6 9.6 L16.3 8.8 M6.3 12 H3.5 M13.7 12 H16.5 M6.5 14.4 L4 15.6 M13.5 14.4 L16 15.6"/></svg>',
};

/* ---- 1 · stat readout (the problem beat); count-up played by beats.js ---- */
function statReadout(p) {
  const s = p.stats;
  if (!s || !s.items || !s.items.length) return "";
  const cells = s.items
    .map((it) => {
      const pfx = it.pfx ? `<span class="pfx">${it.pfx}</span>` : "";
      const sfx = it.sfx ? `<span class="sfx">${it.sfx}</span>` : "";
      const ico = ICONS[it.icon] || "";
      return `
      <div class="stat">
        <div class="stat__hd"><span class="stat__ico">${ico}</span><span class="stat__field">${it.field}</span></div>
        <div class="stat__val">${pfx}<span class="num" data-to="${it.val}" data-dec="${it.dec || 0}">0</span>${sfx}</div>
        <div class="stat__label">${it.label}</div>
      </div>`;
    })
    .join("");
  return `<div class="readout" data-viz="readout" style="--cols:${s.items.length}">
      <div class="readout__lead">${s.lead}</div>${cells}
    </div>`;
}

/* ---- 2 · decision fan v2 (key-decisions beat); fan SVG drawn in beats.js ---- */
function decisionFan(p) {
  const ds = p.decisions || [];
  if (!ds.length) return "";
  const single = ds.length === 1; // a one-prong "fan" reads thin → cards only (CSS hides the viz)
  const cards = ds
    .map(
      (d, i) => `
      <li class="dt2__item${i === 0 ? " is-active" : ""}" data-i="${i}">
        <button class="dt2__head" aria-expanded="${i === 0}"><span class="dt2__num">0${i + 1}</span><span class="dt2__choice">${d.choice}</span></button>
        <div class="dt2__body"><div class="dt2__bodyinner"><div class="dt2__alt"><b>instead of</b> ${d.alt}</div>${bullets(d.why, "dt2__why")}</div></div>
      </li>`
    )
    .join("");
  return `<div class="dt2${single ? " dt2--single" : ""}" data-viz="dt2">
      <div class="dt2__viz"><svg class="dt2__svg" aria-hidden="true" focusable="false"></svg></div>
      <ol class="dt2__list">${cards}</ol>
    </div>`;
}

/* ---- 3 · obstacle -> reroute (the hard part); travelling-dot timeline in beats.js ---- */
function obstacleReroute(p) {
  const prose = p.hardPart ? `<div class="hp__prose">${paras(p.hardPart)}</div>` : "";
  if (!p.hard) return prose ? `<div class="hp">${prose}</div>` : "";
  return `<div class="hp" data-viz="hardpart">
      <svg class="hp__svg" viewBox="0 0 680 252" role="img" aria-label="The hard part: an attempt hits a wall, then reroutes around it to a working build"></svg>
      ${prose}
    </div>`;
}

/* ---- 4 · rigor trajectory (the next beat); line drawn in beats.js ---- */
function rigorTrajectory(p) {
  const prose = p.next ? `<div class="hp__prose">${paras(p.next)}</div>` : "";
  if (!p.traj || !p.traj.length) return prose ? `<div class="traj-beat">${prose}</div>` : "";
  return `<div class="traj-beat">
      <div class="traj" data-viz="traj"><svg class="traj__svg" role="img" aria-label="Rigour trajectory, from where it sits now into the planned work"></svg></div>
      ${prose}
    </div>`;
}

/* ---- 5 · rigor gauge (compact, sits in the project hero); built in beats.js ---- */
function rigorGauge(p) {
  return `<div class="gauge" data-viz="gauge" data-pos="${p.pos}" data-accent="${p.accent}"
       role="img" aria-label="Rigour gauge: ${p.name} sits at ${Math.round(p.pos * 100)} of 100, vibe-coded to rigorously engineered"></div>`;
}

/* ---- One project through the journey template ---- */
function renderProject(p) {
  const links = (p.links || []).map((l, i) => linkBtn(l, i === 0)).join("");
  const full = !!p.problem;

  let beats = "";
  if (full) {
    beats = `
      <div class="beat reveal">
        ${beatHead("The problem", !!p.stats)}
        ${statReadout(p)}
        <div class="beat__body">${paras(p.problem)}</div>
      </div>
      <div class="beat reveal" id="proj-${p.id}-decisions">
        <div class="beat__label">Key decisions &amp; tradeoffs</div>
        ${decisionFan(p)}
      </div>
      <div class="beat reveal">
        ${beatHead("The hard part", !!p.hard)}
        ${obstacleReroute(p)}
      </div>
      <div class="beat reveal">
        ${beatHead("What I'd do differently / next", !!p.traj)}
        ${rigorTrajectory(p)}
      </div>
      <div class="demo reveal" id="demo-${p.id}" data-demo="${p.demo ? p.demo.type : ""}">
        <div class="demo__bar"><span>demo</span><span>${p.maturity}</span></div>
        <div class="demo__body" id="demo-body-${p.id}"></div>
      </div>`;
  } else {
    beats = `<div class="project__placeholder">Full write-up landing in Phase 2 (this is the template proof).</div>`;
  }

  return `
    <section class="project" id="proj-${p.id}" data-id="${p.id}" data-pos="${p.pos}" style="--accent:${p.accent}">
      <div class="project__inner">
        <div class="project__hero reveal">
          <div class="project__head">
            <h2 class="project__title">${p.name}</h2>
            <p class="project__sub">${p.sub}</p>
            <div class="project__meta">
              <span class="tag">${p.maturity}</span>
              ${links}
            </div>
          </div>
          ${full ? rigorGauge(p) : ""}
        </div>
        ${beats}
      </div>
    </section>`;
}

function renderProjects() {
  $("#projects").innerHTML = PROJECTS.map(renderProject).join("");
}

/* ---- About: operator card (headshot bezel + signature graphic) + typewriter bio ---- */
function renderAbout() {
  const links = SITE.links
    .map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`)
    .join("");
  // full plain-text bio for the aria-label, so the char-span typewriter still reads cleanly to AT
  const bioPlain = SITE.about.replace(/<[^>]+>/g, "").replace(/"/g, "&quot;");
  $("#about").innerHTML = `
    <div class="about__inner">
      <div class="about__label">About</div>
      <div class="about__top reveal">
        <div class="idplate">
          <div class="idplate__frame">
            <span class="tick-bl"></span><span class="tick-br"></span>
            <img class="idplate__photo" src="assets/headshot.jpg" alt="Loong Bong" loading="lazy" />
          </div>
          <div class="idplate__id">
            <div class="idplate__name">LOONG BONG</div>
            <div class="idplate__role">chemical engineer · MBA · strategy &amp; transactions · directs AI to build</div>
          </div>
        </div>
        <div class="flowsig" data-viz="flowsig">
          <svg class="flowsig__svg" viewBox="0 0 960 230" role="img" aria-label="Range across the warm-to-cool rigour spectrum, converging through one focal habit into a single focused output"></svg>
        </div>
      </div>
      <div class="bio">
        <p class="bio__text" aria-label="${bioPlain}">${SITE.about}</p>
        <div class="tw-controls mono">
          <button class="tw-btn" data-act="toggle">⏸ pause</button>
          <button class="tw-btn" data-act="skip">⏭ skip</button>
          <button class="tw-btn" data-act="replay">↺ replay</button>
        </div>
        <div class="bio__extras">
          <p class="bio__range">${SITE.rangeLine}</p>
          <div class="bio__links">${links}</div>
        </div>
      </div>
    </div>`;
}

/* ---- Colophon (honest instrument readout) ---- */
function renderColophon() {
  const links = SITE.links
    .map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`)
    .join("");
  $("#colophon").innerHTML = `
    <div class="colophon__cta">
      <p class="colophon__line">These five are a sample of what I'm building. Each is its own call on how much rigour it needs: the tools are the same every time, the judgement of how far to push them isn't.</p>
      <nav class="colophon__links" aria-label="Profiles and links">${links}</nav>
    </div>
    <div class="colophon__meta mono">
      <span>built with vanilla HTML · CSS · JS · no framework</span>
      <span>hosted on GitHub Pages</span>
      <span>© Loong Bong</span>
    </div>`;
}

function renderAll() {
  renderHero();
  renderSpectrum();
  renderProjects();
  renderAbout();
  renderColophon();
}

document.addEventListener("DOMContentLoaded", renderAll);
