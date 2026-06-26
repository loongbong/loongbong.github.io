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
    `<div class="globe-note mono"><b>Built for desktop.</b> On a phone, open it on a larger screen for the full 3D globe.</div>
     <div class="globe-embed">
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
    `<span>live app · mobile view</span>` +
    `<a class="demo__open" href="${src}" target="_blank" rel="noopener">open live ↗</a>`;

  body.innerHTML =
    `<div class="phonebay">
       <div class="phone">
         <span class="phone__notch"></span>
         <div class="embed embed--phone">
           <div class="embed__poster">
             <span class="mono embed__title">live match logger</span>
             <span class="embed__hint">loads when in view · tap to log a match · or open live ↗</span>
           </div>
         </div>
       </div>
     </div>
     <div class="embed-foot mono">
       <span>the one project with public source. built mobile-first.</span>
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
       <div class="asr__callout"><span class="asr__callout-mark mono">›</span><span class="asr__callout-text"></span></div>
       <div class="asr__legend mono">
         <span><i class="ldot ldot--structural"></i>Whisper · repetition loop</span>
         <span><i class="ldot ldot--semantic"></i>Qwen · hallucination / drift</span>
         <span><i class="ldot ldot--flag"></i>flagged unclear</span>
       </div>
       <div class="asr__stack">${rowsHtml}</div>
       <div class="asr__detail mono">${d.caption}</div>
     </div>`;

  const root = body.querySelector(".asr");
  const detail = root.querySelector(".asr__detail");
  const stageLabel = root.querySelector(".asr__stagelabel");
  const callout = root.querySelector(".asr__callout-text");
  const rowsEls = Array.from(root.querySelectorAll(".asr-row"));
  const stepBtn = root.querySelector('[data-act="step"]');
  const stageNames = ["reference", "+ Whisper", "+ Qwen", "+ reconciled"];
  const steps = d.steps || [];
  let stage = 0;

  const applyStage = () => {
    rowsEls.forEach((el) => {
      const shown = Number(el.dataset.stage) <= stage;
      el.classList.toggle("is-shown", shown);
      el.setAttribute("aria-hidden", shown ? "false" : "true");
      el.querySelectorAll(".seg").forEach((sg) => { sg.tabIndex = shown ? 0 : -1; });
    });
    stageLabel.textContent = stageNames[stage];
    if (callout) { callout.textContent = steps[stage] || ""; }
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
  const padL = 46, padR = 162, padT = 20, padB = 34;
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
      dots += `<circle class="ychart__dot" data-fx="${(N === 1 ? 1 : i / (N - 1)).toFixed(3)}" cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="2.6" style="fill:${c}"/>`;
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
           <span class="pipe__metric mono">${s.metric || ""}</span>
         </div>` + (i < d.stages.length - 1 ? `<span class="pipe__conn" data-i="${i}"></span>` : "")
    )
    .join("");

  body.innerHTML =
    `<div class="pipe-demo">
       <div class="pipe__controls">
         <button class="chip-btn" data-act="run" type="button">▶ run pipeline</button>
         <span class="pipe__status mono">idle</span>
       </div>
       <div class="pipe__monitor">
         <div class="pipe__readout">
           <span class="pipe__count mono"><b class="pipe__num">0</b><span class="pipe__count-sfx">+ observations</span></span>
           <span class="pipe__sub mono">daily yields · 10 maturities · audit-trailed</span>
         </div>
         <div class="pipe__range mono">
           <span>2001</span>
           <span class="pipe__track"><span class="pipe__fill"></span><span class="pipe__head"></span></span>
           <span>2026</span>
         </div>
       </div>
       <div class="pipe">${stagesHtml}</div>
       <div class="pipe__detail mono">Hover a stage, or run the pipeline.</div>
       <div class="pipe__manifest mono" hidden>manifest · sha256 <b>9f2a1c7e…b4c0</b> · every value range-checked + provenance-logged</div>
       <div class="pipe__toasts" aria-live="polite">
         <div class="pipe__toast"><span class="pipe__toast-ico">✓</span><span class="mono">160,000+ observations scraped</span></div>
         <div class="pipe__toast"><span class="pipe__toast-ico">✓</span><span class="mono">validated to source · hash manifest written</span></div>
       </div>
       <div class="ychart-wrap">${buildYieldChart(d.chart)}</div>
       <div class="demo-caption mono">${d.chart.caption}</div>
     </div>`;

  const root = body.querySelector(".pipe-demo");
  const stageEls = Array.from(root.querySelectorAll(".pipe__stage"));
  const connEls = Array.from(root.querySelectorAll(".pipe__conn"));
  const detail = root.querySelector(".pipe__detail");
  const status = root.querySelector(".pipe__status");

  const numEl = root.querySelector(".pipe__num");
  const fillEl = root.querySelector(".pipe__fill");
  const headEl = root.querySelector(".pipe__head");
  const manifest = root.querySelector(".pipe__manifest");
  const toasts = Array.from(root.querySelectorAll(".pipe__toast"));
  const OBS = 160000;

  // yield chart: drive the line draw + dot reveal in lockstep with the run progress
  const ychart = root.querySelector(".ychart");
  const ylines = Array.from(root.querySelectorAll(".ychart__line"));
  const ydots = Array.from(root.querySelectorAll(".ychart__dot"));
  const drawChart = (e) => {
    ylines.forEach((l) => (l.style.strokeDashoffset = (1 - e).toFixed(3)));
    ydots.forEach((dt) => (dt.style.opacity = parseFloat(dt.dataset.fx) <= e + 1e-6 ? "1" : "0"));
  };

  let running = false, raf = null;
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

  const setProgress = (p) => {
    fillEl.style.width = (p * 100).toFixed(1) + "%";
    headEl.style.left = (p * 100).toFixed(1) + "%";
    numEl.textContent = Math.round(OBS * p).toLocaleString("en-US");
  };
  const finalState = () => {
    stageEls.forEach((s) => s.classList.add("is-done"));
    connEls.forEach((c) => c.classList.add("is-done"));
    setProgress(1);
    if (ychart) ychart.classList.add("is-run");
    drawChart(1);
    manifest.hidden = false;
    toasts.forEach((t) => t.classList.add("is-show"));
    status.textContent = "✓ 160,000+ observations · manifest verified";
  };

  const run = () => {
    if (running) return;
    if (DEMO_REDUCE) return finalState();
    running = true;
    stageEls.forEach((s) => s.classList.remove("is-done", "is-hot"));
    connEls.forEach((c) => c.classList.remove("is-done"));
    manifest.hidden = true;
    toasts.forEach((t) => t.classList.remove("is-show"));
    setProgress(0);
    if (ychart) ychart.classList.add("is-run");
    drawChart(0);
    status.textContent = "scraping the portal, one date at a time…";
    // linear per-stage dwell so each stage's detail stays readable (not eased — easing flashed the early stages by)
    const N = stageEls.length, DWELL = 1800, TOTAL = N * DWELL, t0 = performance.now();
    let lit = -1;
    const tick = (t) => {
      const elapsed = t - t0;
      const p = Math.min(1, elapsed / TOTAL);
      const e = 1 - Math.pow(1 - p, 1.6); // counter + bar + chart ease gently toward the end
      setProgress(e);
      drawChart(e);
      const idx = Math.min(N - 1, Math.floor(elapsed / DWELL));
      if (idx > lit) {
        for (let k = lit + 1; k <= idx; k++) {
          if (k > 0) {
            stageEls[k - 1].classList.remove("is-hot");
            stageEls[k - 1].classList.add("is-done");
            if (connEls[k - 1]) connEls[k - 1].classList.add("is-done");
          }
          stageEls[k].classList.add("is-hot");
          showDetail(k);
        }
        lit = idx;
      }
      if (elapsed < TOTAL) { raf = requestAnimationFrame(tick); return; }
      stageEls[N - 1].classList.remove("is-hot");
      stageEls[N - 1].classList.add("is-done");
      if (connEls[N - 1]) connEls[N - 1].classList.add("is-done");
      setProgress(1);
      drawChart(1);
      manifest.hidden = false;
      status.textContent = "✓ 160,000+ observations · manifest verified";
      if (toasts[0]) toasts[0].classList.add("is-show");
      if (toasts[1]) setTimeout(() => toasts[1].classList.add("is-show"), 500);
      running = false;
    };
    raf = requestAnimationFrame(tick);
  };
  root.querySelector('[data-act="run"]').addEventListener("click", run);

  if (DEMO_REDUCE) finalState();
}

/* ---- ocean: two live mobile screenshots (phone frames) + a horizontally-scrollable portrait strip ---- */
function demoOcean(demoEl, project) {
  const d = project.demo;
  const bar = demoEl.querySelector(".demo__bar");
  const body = demoEl.querySelector(".demo__body");

  bar.innerHTML = `<span>oceancrew.me · screenshots</span><span>offline · in redesign</span>`;

  const thumbs = d.portraits
    .map(
      (p) =>
        `<figure class="ocean__thumb">
           <img src="${p.file}" alt="${p.name}" loading="lazy" />
           <figcaption class="ocean__thumbname mono">${p.name}</figcaption>
         </figure>`
    )
    .join("");

  body.innerHTML =
    `<div class="ocean">
       <div class="ocean__phones">
         <figure class="ocean__phone">
           <div class="phone"><img class="phone__shot" src="${d.login}" alt="OCEAN sign-in screen: email magic link or continue with Google" loading="lazy" /></div>
           <figcaption class="demo-caption mono">${d.loginCaption}</figcaption>
         </figure>
         <figure class="ocean__phone">
           <div class="phone"><img class="phone__shot" src="${d.crew}" alt="OCEAN crew page for a demo persona: five characters around a Big Five radar" loading="lazy" /></div>
           <figcaption class="demo-caption mono">${d.crewCaption}</figcaption>
         </figure>
       </div>
       <div class="ocean__gallerylabel mono">15 of the 45 character archetypes · scroll to browse →</div>
       <div class="ocean__strip">${thumbs}</div>
     </div>`;
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
