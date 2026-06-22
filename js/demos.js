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

const DEMOS = {
  globe: demoGlobe,
  // asr, pipeline, ocean, badminton: added in Phase 2
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
