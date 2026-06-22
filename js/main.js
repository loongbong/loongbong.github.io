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
  decisionTrees();
}

/* ---- decision tree (v1): hover/focus a branch to reveal that decision ---- */
function decisionTrees() {
  document.querySelectorAll(".dtree").forEach((tree) => {
    const setActive = (i) => {
      tree.querySelectorAll("[data-i]").forEach((el) =>
        el.classList.toggle("is-active", el.dataset.i === String(i))
      );
    };
    tree.querySelectorAll(".dtree__hit").forEach((hit) => {
      const i = hit.dataset.i;
      ["mouseenter", "focus", "click"].forEach((ev) => hit.addEventListener(ev, () => setActive(i)));
      hit.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(i); }
      });
    });
  });
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
