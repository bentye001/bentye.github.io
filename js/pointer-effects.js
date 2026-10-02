/* =====================================================================
   POINTER EFFECTS
   Mouse-only touches; skipped on touch screens and for reduced motion.
   1. The hero foot figure tilts slightly towards the cursor.
   2. A soft spotlight follows the cursor across the contact links (the glow itself is styled in css/motion.css).
   ===================================================================== */
(function () {
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduce) return;

  /* ---------- 1: figure tilt ---------- */
  var hero = document.querySelector(".hero");
  var svg  = document.querySelector(".figure svg");
  var MAX_TILT = 6;   // degrees

  if (hero && svg) {
    hero.addEventListener("pointermove", function (e) {
      var box = svg.getBoundingClientRect();
      // -1 … 1 depending on where the cursor is relative to the figure's centre
      var x = Math.max(-1, Math.min(1, (e.clientX - box.left - box.width / 2) / box.width));
      var y = Math.max(-1, Math.min(1, (e.clientY - box.top - box.height / 2) / box.height));
      svg.style.transform =
        "perspective(900px) rotateY(" + (x * MAX_TILT) + "deg) rotateX(" + (-y * MAX_TILT) + "deg)";
    });
    hero.addEventListener("pointerleave", function () { svg.style.transform = ""; });
  }

  /* ---------- 2: spotlight ---------- */
  document.querySelectorAll(".clink").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var box = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - box.left) + "px");
      card.style.setProperty("--my", (e.clientY - box.top) + "px");
    });
  });
})();
