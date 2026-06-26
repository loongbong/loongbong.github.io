/* =========================================================================
   Motion + interaction orchestrator. Runs after data.js/render.js/demos.js.
   - signature entrance (hero + spectrum)
   - scroll-reveal (.reveal)
   - spectrum nav (full + sticky) with smooth scroll
   - scroll-spy: active node + accent warms->cools as you travel globe->OCEAN
   - sticky dock (condensed spectrum) past the hero
   All motion respects prefers-reduced-motion.
   ========================================================================= */

const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function init() {
  if (typeof initDemos === "function") initDemos();
  entrance();
  scrollReveal();
  spectrumNav();
  scrollSpy();
  stickyDock();
  scrollAffordances();
  if (typeof initBeats === "function") initBeats(); // builds + plays the instrument primitives + About
}

/* ---- floating scroll affordances: a "continue" cue that advances section-by-section,
   a back-to-top button, and the sticky bar's active-section label ---- */
function scrollAffordances() {
  const cue = document.getElementById("scrollcue");
  const toTop = document.getElementById("totop");
  const activeLabel = document.getElementById("topbar-active");
  const about = document.getElementById("about");
  const projects = Array.from(document.querySelectorAll(".project[data-id]"));

  const targets = [];
  if (about) targets.push({ el: about, name: "About" });
  projects.forEach((s) => {
    const t = s.querySelector(".project__title");
    targets.push({ el: s, name: (t && t.textContent) || s.dataset.id });
  });
  if (!cue || !toTop || !targets.length) return;

  // Cache each target's absolute document offset and recompute only on resize / height
  // change. The offsetTop chain ignores transforms, so the entrance animation can't skew
  // it. Reading layout (getBoundingClientRect) on every scroll frame forced a synchronous
  // reflow that fought the typewriter's per-character DOM writes — the About-scroll jitter.
  let tops = [];
  const absTop = (el) => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
  const measure = () => { tops = targets.map((t) => absTop(t.el)); };

  const nextTarget = () => { const y = window.scrollY + 120; for (let k = 0; k < targets.length; k++) if (tops[k] > y) return targets[k]; return null; };

  const update = () => {
    const y = window.scrollY;
    const nxt = nextTarget();
    const nearBottom = window.innerHeight + y >= document.body.scrollHeight - 80;
    cue.hidden = !nxt || nearBottom;
    toTop.hidden = y < window.innerHeight * 0.9;
    if (activeLabel) { let cur = ""; for (let k = 0; k < targets.length; k++) if (tops[k] <= y + 140) cur = targets[k].name; activeLabel.textContent = cur; }
  };

  cue.addEventListener("click", () => {
    const n = nextTarget();
    if (n) n.el.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
  });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: REDUCE ? "auto" : "smooth" }));

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  measure();
  window.addEventListener("resize", () => { measure(); update(); });
  if ("ResizeObserver" in window) new ResizeObserver(() => measure()).observe(document.body);

  // reveal the cue only after the hero entrance has played ("after the landing animation")
  setTimeout(update, REDUCE ? 0 : 2600);
}

/* ---- signature entrance: axis draws in, nodes ignite, hero settles ---- */
function entrance() {
  const hero = document.querySelector(".hero");
  const spectrum = document.querySelector(".spectrum");
  const go = () => {
    hero && hero.classList.add("is-in");
    spectrum && spectrum.classList.add("is-in");
  };
  if (REDUCE) return go();
  requestAnimationFrame(() => requestAnimationFrame(go));
}

/* ---- scroll-reveal: one reusable pattern, applied everywhere ---- */
function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (REDUCE || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---- spectrum nav (delegated; works for full nodes + sticky mini-nodes) ---- */
function spectrumNav() {
  document.addEventListener("click", (e) => {
    const hit = e.target.closest("[data-target]");
    if (!hit) return;
    const target = document.getElementById(hit.dataset.target);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth", block: "start" });
  });
}

/* ---- scroll-spy: active project drives node highlight + accent tween ---- */
function scrollSpy() {
  const sections = Array.from(document.querySelectorAll(".project[data-id]"));
  if (!sections.length || !("IntersectionObserver" in window)) return;

  const setActive = (id, accent) => {
    document.querySelectorAll(".node").forEach((n) =>
      n.classList.toggle("is-active", n.dataset.target === "proj-" + id)
    );
    document.querySelectorAll(".mini-node").forEach((n) =>
      n.classList.toggle("is-active", n.dataset.id === id)
    );
    if (accent) document.body.style.setProperty("--accent", accent);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.dataset.id;
          const accent = getComputedStyle(e.target).getPropertyValue("--accent").trim();
          setActive(id, accent);
        }
      });
    },
    // a thin band across the middle of the viewport = "you are here"
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );
  sections.forEach((s) => io.observe(s));
}

/* ---- sticky dock: reveal the condensed spectrum once past the hero ---- */
function stickyDock() {
  const hero = document.querySelector(".hero");
  const topbar = document.getElementById("topbar");
  if (!hero || !topbar || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        topbar.classList.toggle("is-visible", !e.isIntersecting);
        topbar.setAttribute("aria-hidden", e.isIntersecting ? "true" : "false");
      });
    },
    { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
  );
  io.observe(hero);
}

document.addEventListener("DOMContentLoaded", init);
