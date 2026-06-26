/* =========================================================================
   Instrument layer — builds + plays the data-driven beat primitives and the
   About sequence. Wrapped in ONE IIFE: shares no globals with render.js
   (which owns `$`). Exposes only window.initBeats; main.js calls it once.
   Motion split: entrance/reveal slow; interaction (--d-int) fast.
   armBeats() is the SOLE writer of .is-in on instrument roots.
   ========================================================================= */
(function () {
  "use strict";

  const ns = "http://www.w3.org/2000/svg";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const RM = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function el(tag, attrs, txt) {
    const e = document.createElementNS(ns, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }
  function projectOf(root) {
    const sec = root.closest(".project");
    if (!sec || typeof PROJECTS === "undefined") return null;
    return PROJECTS.find((p) => p.id === sec.dataset.id) || null;
  }
  function fmt(v, dec) {
    return dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US");
  }

  /* ---- count-up (slow, eased) ---- */
  function countUp(root) {
    $$(".num", root).forEach((numEl) => {
      const to = parseFloat(numEl.dataset.to);
      const dec = parseInt(numEl.dataset.dec || "0", 10);
      if (RM()) { numEl.textContent = fmt(to, dec); return; }
      const stat = numEl.closest(".stat");
      if (stat) stat.classList.add("is-live");
      const dur = 2200, t0 = performance.now();
      (function frame(t) {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        numEl.textContent = fmt(to * e, dec);
        if (p < 1) requestAnimationFrame(frame);
        else { numEl.textContent = fmt(to, dec); if (stat) setTimeout(() => stat.classList.remove("is-live"), 500); }
      })(t0);
    });
  }

  /* ---- 2 · decision fan v2 (cards already in the DOM; this draws the fan + wires it) ---- */
  function buildFan(root) {
    const list = $(".dt2__list", root);
    const items = $$(".dt2__item", root);
    const N = items.length;
    let activeIdx = 0;
    const lit = (i) => {
      [".dt2__branch", ".dt2__flow", ".dt2__node", ".dt2__nodeg"].forEach((s) =>
        $$(s, root).forEach((b) => b.classList.toggle("is-hot", b.dataset.i === String(i)))
      );
    };
    const open = (i) => {
      activeIdx = +i;
      items.forEach((it) => {
        const on = it.dataset.i === String(i);
        it.classList.toggle("is-active", on);
        const h = $(".dt2__head", it);
        if (h) h.setAttribute("aria-expanded", on);
      });
      lit(i);
    };
    items.forEach((it) => {
      const i = it.dataset.i, head = $(".dt2__head", it);
      head.addEventListener("click", () => open(i));
      head.addEventListener("focus", () => open(i));
      head.addEventListener("mouseenter", () => lit(i));
    });
    if (list) list.addEventListener("mouseleave", () => lit(activeIdx));
    open(0);

    // single decision: the CSS hides the viz, so skip the fan entirely
    if (root.classList.contains("dt2--single")) return;

    const svg = $(".dt2__svg", root), viz = $(".dt2__viz", root);
    function drawFan() {
      const narrow = window.matchMedia("(max-width: 720px)").matches;
      const W = Math.max(260, Math.round(viz.clientWidth) || 320);
      const Hh = narrow ? 260 : Math.max(240, Math.round(list.offsetHeight) || 320);
      const rootX = 24, rootY = Hh / 2, nodeX = W - 40, m = 30;
      const ys = items.map((_, i) => m + (Hh - 2 * m) * (N === 1 ? 0.5 : i / (N - 1)));
      let h = `<circle class="dt2__root" cx="${rootX}" cy="${rootY}" r="5"/><text class="dt2__rootlabel" x="${rootX}" y="${rootY + 20}">the call</text>`;
      ys.forEach((y, i) => {
        const d = `M${rootX} ${rootY} C ${Math.round(rootX + W * 0.34)} ${rootY}, ${Math.round(nodeX - W * 0.42)} ${y}, ${nodeX} ${y}`;
        h += `<path class="dt2__branch" data-i="${i}" pathLength="1" d="${d}"/><path class="dt2__flow" data-i="${i}" d="${d}"/>`;
      });
      ys.forEach((y, i) => {
        h += `<g class="dt2__nodeg" data-i="${i}"><circle class="dt2__hit" data-i="${i}" cx="${nodeX}" cy="${y}" r="30"/><circle class="dt2__node" data-i="${i}" cx="${nodeX}" cy="${y}" r="18"/><text class="dt2__nodenum" data-i="${i}" x="${nodeX}" y="${y}">0${i + 1}</text></g>`;
      });
      svg.setAttribute("viewBox", `0 0 ${W} ${Hh}`);
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.style.height = Hh + "px";
      svg.innerHTML = h;
      lit(activeIdx);
    }
    drawFan();
    // node hover / click via delegation (mouse/touch enhancement; keyboard + AT use the cards)
    svg.addEventListener("mouseover", (e) => { const n = e.target.closest(".dt2__nodeg"); if (n) lit(n.dataset.i); });
    svg.addEventListener("mouseleave", () => lit(activeIdx));
    svg.addEventListener("click", (e) => { const n = e.target.closest(".dt2__nodeg"); if (n) open(n.dataset.i); });
    let raf;
    const redraw = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawFan); };
    if ("ResizeObserver" in window) new ResizeObserver(redraw).observe(viz);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawFan);
  }

  /* ---- 3 · obstacle -> reroute (travelling dot leaves the trail) ----
     baseline y=150; wall at x=330; the jump arc clears the wall top. */
  const HP_GEO = { by: 150, sx: 50, bumpX: 322, backX: 275, wallX: 330, wallTop: 112, wallBot: 200, gx: 640 };
  function buildHardPart(root) {
    const p = projectOf(root), hp = (p && p.hard) || {};
    const svg = $(".hp__svg", root), G = HP_GEO;
    svg.appendChild(el("path", { class: "hp__attempt", pathLength: 1, d: `M${G.sx} ${G.by} L${G.bumpX} ${G.by}` }));
    svg.appendChild(el("path", { class: "hp__route", pathLength: 1, d: `M${G.backX} ${G.by} C 300 40, 540 40, ${G.gx} ${G.by}` }));
    svg.appendChild(el("line", { class: "hp__wall", x1: G.wallX, y1: G.wallTop, x2: G.wallX, y2: G.wallBot }));
    const f = el("g", { class: "hp__fault" }), fs = 7;
    f.appendChild(el("line", { x1: G.bumpX - fs, y1: G.by - fs, x2: G.bumpX + fs, y2: G.by + fs, stroke: "var(--text-dim)", "stroke-width": 2.4, "stroke-linecap": "round" }));
    f.appendChild(el("line", { x1: G.bumpX + fs, y1: G.by - fs, x2: G.bumpX - fs, y2: G.by + fs, stroke: "var(--text-dim)", "stroke-width": 2.4, "stroke-linecap": "round" }));
    svg.appendChild(f);
    svg.appendChild(el("circle", { class: "hp__goal", cx: G.gx, cy: G.by, r: 12 }));
    svg.appendChild(el("path", { class: "hp__check", d: `M${G.gx - 6} ${G.by} l3.6 3.8 l6.6 -8` }));
    svg.appendChild(el("circle", { class: "hp__dot", cx: G.sx, cy: G.by, r: 6 }));
    const labels = [
      { k: "attempt", c: "hp__lab--dim", x: G.sx, y: G.by + 28, a: "start", t: hp.attempt || "the attempt" },
      { k: "goal", c: "hp__lab--ok", x: G.gx, y: G.by + 28, a: "end", t: hp.goal || "it works" },
      { k: "problem", c: "hp__lab--warn", x: G.wallX, y: 228, a: "middle", t: "✕  " + (hp.problem || "hit a wall") },
      { k: "solution", c: "hp__lab--ok", x: 405, y: 44, a: "middle", t: hp.solution || "found a way" },
    ];
    labels.forEach((L) => {
      const t = el("text", { class: "hp__lab hp__lab--" + L.k + " " + L.c, x: L.x, y: L.y }, L.t);
      t.setAttribute("text-anchor", L.a);
      svg.appendChild(t);
    });
  }
  function setHardPartFinal(root) {
    const g = (s) => $(s, root);
    g(".hp__attempt").style.strokeDashoffset = 0;
    g(".hp__route").style.strokeDashoffset = 0;
    g(".hp__wall").style.opacity = 0.85;
    g(".hp__fault").style.opacity = 1;
    g(".hp__goal").classList.add("is-lit");
    g(".hp__check").style.opacity = 1;
    g(".hp__dot").style.opacity = 0;
    $$(".hp__lab", root).forEach((l) => (l.style.opacity = 1));
  }
  function animateHardPart(root) {
    if (RM()) return setHardPartFinal(root);
    if (root._raf) cancelAnimationFrame(root._raf);
    const g = (s) => $(s, root), G = HP_GEO;
    const dot = g(".hp__dot"), appr = g(".hp__attempt"), jump = g(".hp__route"), wall = g(".hp__wall"), fault = g(".hp__fault"), goal = g(".hp__goal"), check = g(".hp__check");
    const labAtt = g(".hp__lab--attempt"), labGoal = g(".hp__lab--goal"), labProb = g(".hp__lab--problem"), labSol = g(".hp__lab--solution");
    const aLen = appr.getTotalLength(), jLen = jump.getTotalLength();
    const backFrac = (G.backX - G.sx) / (G.bumpX - G.sx);
    const put = (pt) => { dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y); };
    dot.style.opacity = 1; put(appr.getPointAtLength(0));
    appr.style.strokeDashoffset = 1; jump.style.strokeDashoffset = 1;
    wall.style.opacity = 0; fault.style.opacity = 0; check.style.opacity = 0; goal.classList.remove("is-lit");
    [labAtt, labGoal, labProb, labSol].forEach((l) => l && (l.style.opacity = 0));
    const cl = (t) => (t < 0 ? 0 : t > 1 ? 1 : t), ease = (t) => 1 - Math.pow(1 - t, 3);
    const t0 = performance.now();
    function frame(now) {
      const e = now - t0;
      if (e > 300 && labAtt) labAtt.style.opacity = 1;
      if (e >= 1050) wall.style.opacity = 0.85;
      if (e < 1200) {
        const p = cl((e - 200) / 1000);
        put(appr.getPointAtLength(p * aLen)); appr.style.strokeDashoffset = 1 - p;
      } else if (e < 1550) {
        put(appr.getPointAtLength(aLen)); appr.style.strokeDashoffset = 0;
        fault.style.opacity = 1; if (labProb) labProb.style.opacity = 1;
      } else if (e < 1950) {
        const p = ease(cl((e - 1550) / 400)); put(appr.getPointAtLength(aLen * (1 - (1 - backFrac) * p)));
      } else if (e < 2200) {
        put(appr.getPointAtLength(aLen * backFrac));
      } else if (e < 3500) {
        const p = ease(cl((e - 2200) / 1300));
        put(jump.getPointAtLength(p * jLen)); jump.style.strokeDashoffset = 1 - p;
        if (e > 2650 && labSol) labSol.style.opacity = 1;
      } else {
        jump.style.strokeDashoffset = 0; dot.style.opacity = 0;
        goal.classList.add("is-lit"); check.style.opacity = 1; if (labSol) labSol.style.opacity = 1; if (labGoal) labGoal.style.opacity = 1;
        root._raf = null; return;
      }
      root._raf = requestAnimationFrame(frame);
    }
    root._raf = requestAnimationFrame(frame);
  }

  /* ---- 4 · rigor trajectory (N-aware: solid up to "now", dashed projection after) ---- */
  function buildTraj(root) {
    const p = projectOf(root), T = (p && p.traj) || [];
    const svg = $(".traj__svg", root), N = T.length;
    if (!N) return;
    const W = 660, H = 220, padL = 50, padR = 55, yTop = 52, yBot = 166;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const xs = T.map((_, i) => (N === 1 ? W / 2 : padL + (W - padL - padR) * (i / (N - 1))));
    const ys = T.map((_, i) => (N === 1 ? (yTop + yBot) / 2 : yBot - (yBot - yTop) * (i / (N - 1))));
    let nowI = T.findIndex((t) => t.now); if (nowI < 0) nowI = 0;

    svg.appendChild(el("line", { class: "traj__base", x1: 40, y1: 188, x2: 620, y2: 188 }));
    svg.appendChild(el("text", { class: "traj__axis", x: 40, y: 208 }, "less rigour"));
    const ax = el("text", { class: "traj__axis", x: 620, y: 208 }, "more rigour"); ax.setAttribute("text-anchor", "end"); svg.appendChild(ax);

    const seg = (a, b) => { let d = `M ${xs[a]} ${ys[a]}`; for (let i = a + 1; i <= b; i++) d += ` L ${xs[i]} ${ys[i]}`; return d; };
    if (nowI >= 1) svg.appendChild(el("path", { class: "traj__solid", pathLength: 1, d: seg(0, nowI) }));
    else svg.appendChild(el("path", { class: "traj__solid", pathLength: 1, d: `M ${xs[0] - 18} ${ys[0]} L ${xs[0]} ${ys[0]}` }));
    if (nowI < N - 1) svg.appendChild(el("path", { class: "traj__proj", d: seg(nowI, N - 1) }));

    T.forEach((t, i) => {
      svg.appendChild(el("circle", { class: "traj__dot" + (t.now ? " is-now" : ""), "data-i": i, cx: xs[i], cy: ys[i], r: t.now ? 8 : 6 }));
      const above = i % 2 === 0, ly = above ? ys[i] - 16 : ys[i] + 28;
      const tx = el("text", { class: "traj__lab" + (t.now ? " is-now" : ""), "data-i": i, x: xs[i], y: ly }, t.lab);
      tx.setAttribute("text-anchor", i === 0 ? "start" : i === N - 1 ? "end" : "middle");
      svg.appendChild(tx);
    });
  }

  /* ---- 5 · rigor gauge (compact; needle origin is view-box 110,110) ---- */
  function buildGauge(root) {
    const pos = parseFloat(root.dataset.pos), accent = root.dataset.accent;
    const sec = root.closest(".project"), pid = (sec && sec.dataset.id) || Math.round(pos * 100);
    root.style.setProperty("--gc", accent);
    const cx = 110, cy = 110, r = 86;
    const polar = (pp) => { const a = Math.PI * (1 - pp); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; };
    const [sx, sy] = polar(0), [ex, ey] = polar(1), [mx, my] = polar(pos);
    const arc = `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
    root.style.setProperty("--deg", (pos * 180).toFixed(1) + "deg");
    root.innerHTML = `<svg class="gauge__svg" viewBox="0 0 220 150" role="img" aria-label="rigour gauge">
      <defs><linearGradient id="gg-${pid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f0532e"/><stop offset=".26" stop-color="#f5933f"/><stop offset=".5" stop-color="#e7ddc9"/><stop offset=".74" stop-color="#8ccff9"/><stop offset="1" stop-color="#55bacc"/>
      </linearGradient></defs>
      <path class="gauge__track" d="${arc}"/>
      <path class="gauge__arc" d="${arc}" style="stroke:url(#gg-${pid})"/>
      <g class="gauge__needle"><line x1="${cx}" y1="${cy}" x2="${(cx - r + 14).toFixed(1)}" y2="${cy}" stroke="${accent}" stroke-width="3" stroke-linecap="round"/></g>
      <circle class="gauge__mark" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="6.5"/>
      <circle class="gauge__hub" cx="${cx}" cy="${cy}" r="5"/>
    </svg>
    <div class="gauge__ends"><span>vibe</span><span>rigour</span></div>
    <div class="gauge__read"><span class="gauge__num"><span class="num" data-to="${Math.round(pos * 100)}" data-dec="0">0</span><span class="u"> / 100</span></span></div>
    <div class="gauge__cap">where it sits</div>`;
  }

  /* ---- About signature graphic: range across the spectrum → one focal lens → one output ---- */
  const HUES = ["#f0532e", "#f5933f", "#efc98a", "#e7ddc9", "#a9cfe0", "#8ccff9", "#55bacc"];
  function buildFlow(root) {
    const svg = $(".flowsig__svg", root);
    const fx = 470, fy = 115, outX = 872, N = HUES.length, top = 24, bot = 206;
    HUES.forEach((c, i) => {
      const y0 = top + (bot - top) * (i / (N - 1));
      const p = el("path", { class: "fs__thread", "data-i": i, pathLength: 1, d: `M30 ${y0.toFixed(0)} C 220 ${y0.toFixed(0)}, 330 ${fy}, ${fx} ${fy}` });
      p.style.stroke = c; p.style.transitionDelay = (0.1 + i * 0.08) + "s"; svg.appendChild(p);
    });
    [20, 13].forEach((r) => svg.appendChild(el("circle", { class: "fs__iris", cx: fx, cy: fy, r })));
    svg.appendChild(el("circle", { class: "fs__core", cx: fx, cy: fy, r: 5 }));
    svg.appendChild(el("path", { class: "fs__beam", pathLength: 1, d: `M${fx} ${fy} L${outX} ${fy}` }));
    svg.appendChild(el("circle", { class: "fs__out", cx: outX, cy: fy, r: 9 }));
    const lf = el("text", { class: "fs__lab fs__lab--focus", x: fx, y: fy + 42 }, "find the flow"); lf.setAttribute("text-anchor", "middle"); svg.appendChild(lf);
    const lo = el("text", { class: "fs__lab fs__lab--out", x: outX, y: fy + 36 }, "make it last"); lo.setAttribute("text-anchor", "end"); svg.appendChild(lo);
  }

  /* ---- humanized typewriter (the bio) ---- */
  function setupTypewriter() {
    const bio = $(".bio__text"), extras = $(".bio__extras"), toggleBtn = $('[data-act="toggle"]');
    if (!bio || !toggleBtn) return null;
    const chars = [];
    const walker = document.createTreeWalker(bio, NodeFilter.SHOW_TEXT);
    const tns = []; while (walker.nextNode()) tns.push(walker.currentNode);
    tns.forEach((tn) => {
      const frag = document.createDocumentFragment();
      for (const ch of tn.textContent) { const s = document.createElement("span"); s.className = "tw-char"; s.textContent = ch; frag.appendChild(s); chars.push(s); }
      tn.replaceWith(frag);
    });
    let i = 0, running = false, timer = null, lastCur = -1;
    const SPEED = 0.8; // tuned for the real (longer) bio → ~31s
    const cursor = (k) => {
      if (lastCur >= 0 && chars[lastCur]) chars[lastCur].classList.remove("tw-cursor");
      if (k >= 0 && chars[k]) { chars[k].classList.add("tw-cursor"); lastCur = k; }
    };
    function delayAfter(prev, next) {
      let d = 15 + Math.random() * 16;
      if (next === " ") d = 32 + Math.random() * 34;
      if (/[.!?]/.test(prev)) d = 300 + Math.random() * 220;
      else if (/[,;:]/.test(prev)) d = 160 + Math.random() * 140;
      return d * SPEED;
    }
    function finish() { running = false; clearTimeout(timer); chars.forEach((c) => c.classList.remove("tw-cursor")); lastCur = -1; if (extras) extras.classList.add("shown"); toggleBtn.textContent = "done"; toggleBtn.disabled = true; }
    function step() {
      if (!running) return;
      if (i >= chars.length) { finish(); return; }
      chars[i].classList.add("shown"); cursor(i);
      const typed = chars[i].textContent; i++;
      if (i >= chars.length) { finish(); return; }
      timer = setTimeout(step, delayAfter(typed, chars[i].textContent));
    }
    function start() { running = true; toggleBtn.disabled = false; toggleBtn.textContent = "⏸ pause"; step(); }
    function pause() { if (!running) return; running = false; clearTimeout(timer); toggleBtn.textContent = "▶ resume"; }
    function resume() { if (running || i >= chars.length) return; running = true; toggleBtn.textContent = "⏸ pause"; step(); }
    function skip() { running = false; clearTimeout(timer); for (; i < chars.length; i++) chars[i].classList.add("shown"); finish(); }
    function reset() { running = false; clearTimeout(timer); chars.forEach((c) => c.classList.remove("shown", "tw-cursor")); lastCur = -1; i = 0; if (extras) extras.classList.remove("shown"); toggleBtn.disabled = false; toggleBtn.textContent = "⏸ pause"; }
    function replay() { reset(); start(); }
    function showAll() { running = false; clearTimeout(timer); chars.forEach((c) => { c.classList.add("shown"); c.classList.remove("tw-cursor"); }); lastCur = -1; i = chars.length; if (extras) extras.classList.add("shown"); }
    toggleBtn.addEventListener("click", () => { if (toggleBtn.disabled) return; running ? pause() : resume(); });
    $('[data-act="skip"]').addEventListener("click", skip);
    $('[data-act="replay"]').addEventListener("click", replay);
    return { start, showAll, reset, replay };
  }

  /* ---- About sequence: graphic plays first, then the bio types ---- */
  function initAbout() {
    const fs = $(".flowsig");
    if (!fs) return;
    buildFlow(fs);
    const tw = setupTypewriter();
    if (!tw) return;
    const FLOW_MS = 2900;
    let seqTimer = null;
    function playSequence() {
      clearTimeout(seqTimer);
      if (RM()) { fs.classList.add("is-in"); tw.showAll(); const c = $(".tw-controls"); if (c) c.style.display = "none"; return; }
      fs.classList.add("is-in");
      seqTimer = setTimeout(() => tw.start(), FLOW_MS);
    }
    if (RM()) playSequence();
    else if ("IntersectionObserver" in window) {
      new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { playSequence(); o.unobserve(e.target); } }), { threshold: 0.25 }).observe($(".about"));
    } else playSequence();
  }

  /* ---- play dispatch + scroll-arming for the project instruments ---- */
  function settle(v) {
    if (v.dataset.viz === "hardpart") return setHardPartFinal(v);
    v.classList.add("is-in");
    $$(".num", v).forEach((n) => (n.textContent = fmt(parseFloat(n.dataset.to), parseInt(n.dataset.dec || "0", 10))));
  }
  function playViz(v) {
    const t = v.dataset.viz;
    if (RM()) return settle(v);
    if (t === "hardpart") return animateHardPart(v);
    v.classList.add("is-in");
    if (t === "readout" || t === "gauge") countUp(v);
  }
  function replayViz(v) {
    const t = v.dataset.viz;
    if (RM()) return settle(v);
    if (t === "hardpart") return animateHardPart(v); // resets + replays internally
    // readout / traj: reset to the pre-animation state with no transition, then replay
    v.classList.add("no-tween");
    v.classList.remove("is-in");
    $$(".num", v).forEach((n) => (n.textContent = "0"));
    void v.offsetWidth;
    v.classList.remove("no-tween");
    void v.offsetWidth;
    v.classList.add("is-in");
    if (t === "readout") countUp(v);
  }
  function armBeats() {
    const vizzes = $$("[data-viz]").filter((v) => v.dataset.viz !== "flowsig");
    if (RM() || !("IntersectionObserver" in window)) { vizzes.forEach(settle); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { playViz(e.target); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -18% 0px", threshold: 0.2 }
    );
    vizzes.forEach((v) => io.observe(v));
  }

  function initBeats() {
    $$('[data-viz="dt2"]').forEach(buildFan);
    $$('[data-viz="hardpart"]').forEach(buildHardPart);
    $$('[data-viz="traj"]').forEach(buildTraj);
    $$('[data-viz="gauge"]').forEach(buildGauge);
    initAbout();
    armBeats();
    // per-beat replay buttons (problem · hard part · what's next)
    $$(".beat__replay").forEach((btn) => {
      btn.addEventListener("click", () => {
        const beat = btn.closest(".beat");
        const viz = beat && beat.querySelector("[data-viz]");
        if (viz) replayViz(viz);
      });
    });
  }

  window.initBeats = initBeats;
})();
