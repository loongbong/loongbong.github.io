/* =========================================================================
   Render the data array through ONE journey template + the spectrum nav.
   Content in data.js is authored/trusted, so template strings + innerHTML.
   ========================================================================= */

const $ = (sel, root = document) => root.querySelector(sel);

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

/* ---- decision tree: animated branching viz for the "key decisions" beat ----
   Data-driven from p.decisions[] {choice, alt, why}. The tree (left) branches from a
   root to one glowing node per decision, each with a ghosted "alternative" stub;
   hovering/focusing a branch reveals that decision in the detail panel.
   NOTE: PENDING a dedicated visual-refinement session. Loong prefers this fan look
   over the all-visible vertical-trunk variant (which read card-like). Goal for that
   session: keep this branching pop AND make all decisions visible without hover. */
function decisionTree(p) {
  const ds = p.decisions || [];
  const N = ds.length;
  if (!N) return "";
  const W = 400;
  const H = Math.max(220, N * 92 + 36);
  const rootX = 38, rootY = H / 2, nodeX = 296;
  const ys = ds.map((_, i) => 36 + (H - 72) * (N === 1 ? 0.5 : i / (N - 1)));

  let branches = "";
  ds.forEach((d, i) => {
    const y = ys[i];
    const dir = y < rootY - 1 ? -1 : y > rootY + 1 ? 1 : i % 2 ? 1 : -1;
    const ax = nodeX + 56, ay = y + dir * 22;
    branches +=
      `<path class="dtree__branch" data-i="${i}" pathLength="1" d="M${rootX} ${rootY} C ${rootX + 150} ${rootY}, ${nodeX - 120} ${y}, ${nodeX} ${y}"/>` +
      `<path class="dtree__ghost" data-i="${i}" pathLength="1" d="M${nodeX} ${y} C ${nodeX + 26} ${y}, ${ax - 18} ${ay}, ${ax} ${ay}"/>`;
  });
  let marks = "";
  ds.forEach((d, i) => {
    const y = ys[i];
    marks +=
      `<circle class="dtree__node" data-i="${i}" cx="${nodeX}" cy="${y}" r="6.5"/>` +
      `<text class="dtree__num" data-i="${i}" x="${nodeX}" y="${y - 13}">0${i + 1}</text>` +
      `<circle class="dtree__hit" data-i="${i}" cx="${nodeX}" cy="${y}" r="24" tabindex="0" role="button" aria-label="${d.choice}"/>`;
  });

  const svg =
    `<svg class="dtree__svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="How I made the key decisions">` +
    `<circle class="dtree__root" cx="${rootX}" cy="${rootY}" r="4.5"/>` +
    `<text class="dtree__rootlabel" x="${rootX}" y="${rootY + 22}">the call</text>` +
    branches + marks +
    `</svg>`;

  const detail = ds
    .map(
      (d, i) => `
      <div class="dtree__item ${i === 0 ? "is-active" : ""}" data-i="${i}">
        <div class="dtree__choice"><span class="dtree__chose">chose</span>${d.choice}</div>
        <div class="dtree__alt"><b>instead of:</b> ${d.alt}</div>
        <div class="dtree__why">${d.why}</div>
      </div>`
    )
    .join("");

  return `<div class="dtree reveal"><div class="dtree__viz">${svg}</div><div class="dtree__detail">${detail}</div></div>`;
}

/* ---- One project through the journey template ---- */
function renderProject(p) {
  const links = (p.links || []).map((l, i) => linkBtn(l, i === 0)).join("");
  const full = !!p.problem;

  let beats = "";
  if (full) {
    const howBtn = `<a class="btn btn--ghost" href="#proj-${p.id}-decisions">how I think about it</a>`;

    beats = `
      <div class="beat reveal">
        <div class="beat__label">The problem</div>
        <div class="beat__body">${p.problem}</div>
      </div>
      <div class="beat reveal" id="proj-${p.id}-decisions">
        <div class="beat__label">Key decisions &amp; tradeoffs</div>
        ${decisionTree(p)}
      </div>
      <div class="beat reveal">
        <div class="beat__label">The hard part</div>
        <div class="beat__body">${p.hardPart}</div>
      </div>
      <div class="beat reveal">
        <div class="beat__label">What I'd do differently / next</div>
        <div class="beat__body">${p.next}</div>
      </div>
      <div class="demo reveal" id="demo-${p.id}" data-demo="${p.demo ? p.demo.type : ""}">
        <div class="demo__bar"><span>demo</span><span>${p.maturity}</span></div>
        <div class="demo__body" id="demo-body-${p.id}"></div>
      </div>`;

    // inject the "how I think about it" affordance into the meta row for full projects
    var metaExtra = howBtn;
  } else {
    beats = `<div class="project__placeholder">Full write-up landing in Phase 2 (this is the template proof).</div>`;
    var metaExtra = "";
  }

  return `
    <section class="project" id="proj-${p.id}" data-id="${p.id}" data-pos="${p.pos}" style="--accent:${p.accent}">
      <div class="project__inner">
        <div class="project__hero reveal">
          <h2 class="project__title">${p.name}</h2>
          <p class="project__sub">${p.sub}</p>
          <div class="project__meta">
            <span class="tag">${p.maturity}</span>
            ${links}${metaExtra}
          </div>
        </div>
        ${beats}
      </div>
    </section>`;
}

function renderProjects() {
  $("#projects").innerHTML = PROJECTS.map(renderProject).join("");
}

/* ---- About ---- */
function renderAbout() {
  const links = SITE.links
    .map((l) => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`)
    .join("");
  $("#about").innerHTML = `
    <div class="about__inner">
      <div class="reveal">
        <img class="about__photo" src="assets/headshot.jpg" alt="Loong Bong" loading="lazy" />
      </div>
      <div class="reveal">
        <div class="about__label">About</div>
        <p class="about__body">${SITE.about}</p>
        <p class="about__range">${SITE.rangeLine}</p>
        <div class="about__links">${links}</div>
      </div>
    </div>`;
}

/* ---- Colophon (honest instrument readout) ---- */
function renderColophon() {
  $("#colophon").innerHTML = `
    <span>built with vanilla HTML · CSS · JS · no framework</span>
    <span>hosted on GitHub Pages</span>
    <span>© ${"Loong Bong"}</span>`;
}

function renderAll() {
  renderHero();
  renderSpectrum();
  renderProjects();
  renderAbout();
  renderColophon();
}

document.addEventListener("DOMContentLoaded", renderAll);
