/* =========================================================================
   Per-project demos. Exactly ONE interactive element per project.
   Registry keyed by demo type; main.js calls initDemos() after render.
   Phase 1: globe (live iframe, lazy). Phase 2: asr, pipeline, ocean, badminton.
   ========================================================================= */

/* ---- globe: embed the live product, lazy-loaded, with a fallback link ---- */
function demoGlobe(demoEl, project) {
  const src = project.demo.src;
  const bar = demoEl.querySelector(".demo__bar");
  const body = demoEl.querySelector(".demo__body");

  bar.innerHTML =
    `<span>live demo · globe.wirwp.net</span>` +
    `<a class="demo__open" href="${src}" target="_blank" rel="noopener">open live ↗</a>`;

  body.innerHTML =
    `<div class="globe-embed">
       <div class="globe-embed__poster">
         <span class="mono globe-embed__title">live 3D node globe</span>
         <span class="globe-embed__hint">loads when in view · fully interactive · or open live ↗</span>
       </div>
     </div>`;

  const wrap = body.querySelector(".globe-embed");
  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    const f = document.createElement("iframe");
    f.src = src;
    f.title = "Live node-network globe";
    f.loading = "lazy";
    f.setAttribute("allow", "fullscreen");
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.className = "globe-embed__frame";
    f.addEventListener("load", () => wrap.classList.add("is-loaded"));
    wrap.appendChild(f);
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            load();
            io.disconnect();
          }
        });
      },
      { rootMargin: "300px" }
    );
    io.observe(demoEl);
  } else {
    load();
  }
}

const DEMO_REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

/* shared: lazy-mount an iframe into a host wrapper once it scrolls near view */
function mountLazyIframe(host, src, title) {
  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    const f = document.createElement("iframe");
    f.src = src;
    f.title = title;
    f.loading = "lazy";
    f.setAttribute("allow", "fullscreen");
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.className = "embed__frame";
    f.addEventListener("load", () => host.classList.add("is-loaded"));
    host.appendChild(f);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { load(); io.disconnect(); } }),
      { rootMargin: "300px" }
    );
    io.observe(host);
  } else {
    load();
  }
}

/* ---- badminton: embed the live app (lazy) + the browsable-source link ---- */
function demoBadminton(demoEl, project) {
  const { src, repo } = project.demo;
  const bar = demoEl.querySelector(".demo__bar");
  const body = demoEl.querySelector(".demo__body");

  bar.innerHTML =
    `<span>live app · loongbong.github.io</span>` +
    `<a class="demo__open" href="${src}" target="_blank" rel="noopener">open live ↗</a>`;

  body.innerHTML =
    `<div class="embed embed--app">
       <div class="embed__poster">
         <span class="mono embed__title">live match logger</span>
         <span class="embed__hint">loads when in view · fully interactive · or open live ↗</span>
       </div>
     </div>
     <div class="embed-foot mono">
       <span>the one project with public source.</span>
       <a href="${repo}" target="_blank" rel="noopener">browse the code ↗</a>
     </div>`;

  mountLazyIframe(body.querySelector(".embed"), src, "Badminton match logger");
}

/* ---- asr: step-through reconciliation reveal on a NEUTRAL invented example ----
   Rows reference -> Whisper -> Qwen -> reconciled reveal in order. Per-model
   errors are highlighted; hovering any span lights the same segment across rows
   and explains the arbiter's call. Taxonomy is real; the sentence is invented. */
function demoAsr(demoEl, project) {
  const d = project.demo;
  const bar = demoEl.querySelector(".demo__bar");
  const body = demoEl.querySelector(".demo__body");

  bar.innerHTML = `<span>reconciliation walkthrough</span><span>illustrative example</span>`;

  const rows = [
    { key: "reference", tag: "reference", get: (s) => s.ref, stage: 0 },
    { key: "whisper", tag: "Whisper", get: (s) => s.whisper, stage: 1, cls: "structural", err: (s) => s.whisper !== s.ref },
    { key: "qwen", tag: "Qwen", get: (s) => s.qwen, stage: 2, cls: "semantic", err: (s) => s.qwen !== s.ref },
    { key: "verdict", tag: "reconciled", get: (s) => s.verdict, stage: 3, flag: (s) => s.kind === "noise" },
  ];

  const lineHtml = (r) =>
    d.segments
      .map((s, i) => {
        let cls = "seg";
        if (r.err && r.err(s)) cls += " is-err is-" + r.cls;
        if (r.key === "verdict") {
          if (r.flag(s)) cls += " is-flag";
          else if (s.whisper !== s.ref || s.qwen !== s.ref) cls += " is-pick";
        }
        return `<span class="${cls}" data-seg="${i}" tabindex="0">${r.get(s)}</span>`;
      })
      .join(" ");

  const rowsHtml = rows
    .map(
      (r) =>
        `<div class="asr-row" data-stage="${r.stage}" data-key="${r.key}">
           <span class="asr-row__tag mono">${r.tag}</span>
           <span class="asr-line">${lineHtml(r)}</span>
         </div>`
    )
    .join("");

  body.innerHTML =
    `<div class="asr">
       <div class="asr__controls">
         <button class="chip-btn" data-act="step" type="button">▶ step</button>
         <button class="chip-btn chip-btn--ghost" data-act="restart" type="button">↺ restart</button>
         <span class="asr__stagelabel mono"></span>
       </div>
       <div class="asr__stack">${rowsHtml}</div>
       <div class="asr__legend mono">
         <span><i class="ldot ldot--structural"></i>Whisper · repetition loop</span>
         <span><i class="ldot ldot--semantic"></i>Qwen · hallucination / drift</span>
         <span><i class="ldot ldot--flag"></i>flagged unclear</span>
       </div>
       <div class="asr__detail mono">${d.caption}</div>
     </div>`;

  const root = body.querySelector(".asr");
  const detail = root.querySelector(".asr__detail");
  const stageLabel = root.querySelector(".asr__stagelabel");
  const rowsEls = Array.from(root.querySelectorAll(".asr-row"));
  const stepBtn = root.querySelector('[data-act="step"]');
  const stageNames = ["reference", "+ Whisper", "+ Qwen", "+ reconciled"];
  let stage = 0;

  const applyStage = () => {
    rowsEls.forEach((el) => {
      const shown = Number(el.dataset.stage) <= stage;
      el.classList.toggle("is-shown", shown);
      el.setAttribute("aria-hidden", shown ? "false" : "true");
      el.querySelectorAll(".seg").forEach((sg) => { sg.tabIndex = shown ? 0 : -1; });
    });
    stageLabel.textContent = stageNames[stage];
    stepBtn.disabled = stage >= rows.length - 1;
  };

  const segs = Array.from(root.querySelectorAll(".seg"));
  const setActiveSeg = (i) => {
    segs.forEach((sg) => sg.classList.toggle("is-active", sg.dataset.seg === String(i)));
    detail.textContent = d.segments[i].why;
  };
  const clearActive = () => {
    segs.forEach((sg) => sg.classList.remove("is-active"));
    detail.textContent = d.caption;
  };

  stepBtn.addEventListener("click", () => { if (stage < rows.length - 1) { stage++; applyStage(); } });
  root.querySelector('[data-act="restart"]').addEventListener("click", () => { stage = 0; applyStage(); clearActive(); });
  segs.forEach((sg) =>
    ["mouseenter", "focus", "click"].forEach((ev) => sg.addEventListener(ev, () => setActiveSeg(sg.dataset.seg)))
  );

  if (DEMO_REDUCE) {
    // motion off: every row is shown immediately, so stepping is moot — hide the controls
    stage = rows.length - 1;
    root.querySelector(".asr__controls").style.display = "none";
  }
  applyStage();
}

/* ---- pipeline: animated 5-stage run + a hand-rolled SVG yield-curve chart ---- */
function buildYieldChart(chart) {
  const W = 684, H = 280;
  const padL = 46, padR = 150, padT = 20, padB = 34;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const N = chart.tenors.length;
  const yMin = 2.5, yMax = 4.75;
  const X = (i) => padL + (N === 1 ? plotW / 2 : (plotW * i) / (N - 1));
  const Y = (v) => padT + plotH * (1 - (v - yMin) / (yMax - yMin));

  let grid = "";
  for (let g = 3.0; g <= 4.5 + 1e-9; g += 0.5) {
    const gy = Y(g).toFixed(1);
    grid += `<line class="ychart__grid" x1="${padL}" y1="${gy}" x2="${padL + plotW}" y2="${gy}"/>`;
    grid += `<text class="ychart__ylabel" x="${padL - 9}" y="${(Y(g) + 3).toFixed(1)}">${g.toFixed(1)}</text>`;
  }
  let xlab = "";
  chart.tenors.forEach((t, i) => {
    xlab += `<text class="ychart__xlabel" x="${X(i).toFixed(1)}" y="${H - 12}">${t}</text>`;
  });

  const colors = ["var(--accent)", "var(--text-faint)"];
  let paths = "", dots = "", legend = "";
  chart.series.forEach((s, si) => {
    const c = colors[si % colors.length];
    const pts = s.points.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
    paths += `<polyline class="ychart__line" points="${pts}" style="stroke:${c}" pathLength="1"/>`;
    s.points.forEach((v, i) => {
      dots += `<circle class="ychart__dot" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" style="fill:${c}"/>`;
    });
    const ly = padT + 6 + si * 18;
    legend += `<line class="ychart__legline" x1="${padL + plotW + 14}" y1="${ly}" x2="${padL + plotW + 30}" y2="${ly}" style="stroke:${c}"/>`;
    legend += `<text class="ychart__leg" x="${padL + plotW + 34}" y="${ly + 3.5}">${s.label}</text>`;
  });

  return (
    `<svg class="ychart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Sample archived yield curve across maturities">` +
    `<text class="ychart__unit" x="${padL - 30}" y="${padT - 6}">yield %</text>` +
    grid + xlab + paths + dots + legend +
    `</svg>`
  );
}

function demoPipeline(demoEl, project) {
  const d = project.demo;
  const bar = demoEl.querySelector(".demo__bar");
  const body = demoEl.querySelector(".demo__body");

  bar.innerHTML = `<span>pipeline run + sample output</span><span>auditable</span>`;

  const stagesHtml = d.stages
    .map(
      (s, i) =>
        `<div class="pipe__stage" data-i="${i}" tabindex="0">
           <span class="pipe__idx mono">0${i + 1}</span>
           <span class="pipe__name">${s.name}</span>
         </div>` + (i < d.stages.length - 1 ? `<span class="pipe__conn" data-i="${i}"></span>` : "")
    )
    .join("");

  body.innerHTML =
    `<div class="pipe-demo">
       <div class="pipe__controls">
         <button class="chip-btn" data-act="run" type="button">▶ run pipeline</button>
         <span class="pipe__status mono"></span>
       </div>
       <div class="pipe">${stagesHtml}</div>
       <div class="pipe__detail mono">Hover a stage, or run the pipeline.</div>
       <div class="ychart-wrap">${buildYieldChart(d.chart)}</div>
       <div class="demo-caption mono">${d.chart.caption}</div>
     </div>`;

  const root = body.querySelector(".pipe-demo");
  const stageEls = Array.from(root.querySelectorAll(".pipe__stage"));
  const connEls = Array.from(root.querySelectorAll(".pipe__conn"));
  const detail = root.querySelector(".pipe__detail");
  const status = root.querySelector(".pipe__status");

  let running = false;
  const showDetail = (i) => { detail.textContent = `0${Number(i) + 1} · ${d.stages[i].detail}`; };
  stageEls.forEach((el) => {
    const i = el.dataset.i;
    ["mouseenter", "focus", "click"].forEach((ev) =>
      el.addEventListener(ev, () => {
        if (running) return; // don't fight the animated run's sequential highlight
        stageEls.forEach((s) => s.classList.toggle("is-hot", s === el));
        showDetail(i);
      })
    );
  });

  const run = () => {
    if (running) return;
    running = true;
    stageEls.forEach((s) => s.classList.remove("is-done", "is-hot"));
    connEls.forEach((c) => c.classList.remove("is-done"));
    status.textContent = "running...";
    const step = (i) => {
      if (i >= stageEls.length) { status.textContent = "✓ manifest verified"; running = false; return; }
      stageEls[i].classList.add("is-hot");
      showDetail(i);
      setTimeout(() => {
        stageEls[i].classList.remove("is-hot");
        stageEls[i].classList.add("is-done");
        if (connEls[i]) connEls[i].classList.add("is-done");
        step(i + 1);
      }, 600);
    };
    step(0);
  };
  root.querySelector('[data-act="run"]').addEventListener("click", run);

  if (DEMO_REDUCE) {
    stageEls.forEach((s) => s.classList.add("is-done"));
    connEls.forEach((c) => c.classList.add("is-done"));
    status.textContent = "✓ manifest verified";
  }
}

/* ---- ocean: real crew screenshot + character-portrait lightbox gallery ---- */
function demoOcean(demoEl, project) {
  const d = project.demo;
  const bar = demoEl.querySelector(".demo__bar");
  const body = demoEl.querySelector(".demo__body");

  bar.innerHTML = `<span>oceancrew.me · screenshots</span><span>offline · in redesign</span>`;

  const thumbs = d.portraits
    .map(
      (p) =>
        `<button class="ocean__thumb" type="button" data-full="${p.file}" data-name="${p.name}" aria-label="${p.name}">
           <img src="${p.file}" alt="${p.name}" loading="lazy" />
           <span class="ocean__thumbname mono">${p.name}</span>
         </button>`
    )
    .join("");

  body.innerHTML =
    `<div class="ocean">
       <button class="ocean__shot" type="button" data-full="${d.crew}" data-name="The crew page">
         <img src="${d.crew}" alt="OCEAN Crew demo-persona crew page" loading="lazy" />
       </button>
       <div class="demo-caption mono">${d.crewCaption}</div>
       <div class="ocean__gallerylabel mono">15 of 45 archetypes · select any to enlarge</div>
       <div class="ocean__gallery">${thumbs}</div>
       <div class="lightbox" role="dialog" aria-modal="true" aria-label="Character portrait" aria-hidden="true">
         <button class="lightbox__close" type="button" aria-label="close">✕</button>
         <figure class="lightbox__fig">
           <img class="lightbox__img" alt="" />
           <figcaption class="lightbox__cap mono"></figcaption>
         </figure>
       </div>
     </div>`;

  const root = body.querySelector(".ocean");
  const lb = root.querySelector(".lightbox");
  const lbImg = lb.querySelector(".lightbox__img");
  const lbCap = lb.querySelector(".lightbox__cap");
  const lbClose = lb.querySelector(".lightbox__close");
  let lastFocus = null;
  const onKey = (e) => { if (e.key === "Escape") close(); };

  const open = (src, name) => {
    lbImg.src = src;
    lbImg.alt = name;
    lbCap.textContent = name;
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onKey); // bound on open, removed on close — no leak
    lbClose.focus(); // move focus into the dialog
  };
  const close = () => {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    lbImg.removeAttribute("src");
    document.removeEventListener("keydown", onKey);
    if (lastFocus) lastFocus.focus();
  };

  root.querySelectorAll("[data-full]").forEach((el) =>
    el.addEventListener("click", () => { lastFocus = el; open(el.dataset.full, el.dataset.name); })
  );
  lbClose.addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
}

const DEMOS = {
  globe: demoGlobe,
  badminton: demoBadminton,
  asr: demoAsr,
  pipeline: demoPipeline,
  ocean: demoOcean,
};

function initDemos() {
  document.querySelectorAll(".demo[data-demo]").forEach((el) => {
    const type = el.dataset.demo;
    const pid = el.id.replace("demo-", "");
    const project = (typeof PROJECTS !== "undefined") && PROJECTS.find((p) => p.id === pid);
    const fn = DEMOS[type];
    if (fn && project) fn(el, project);
  });
}
