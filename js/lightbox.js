/* =====================================================================
   LIGHTBOX
   Click (or press Enter on) any project image to view it full screen.
   ← / → or the arrow buttons step through the other images in the same
   project. Esc, the Close button or a click on the backdrop closes it.
   ===================================================================== */
(function () {
  var lb      = document.getElementById("lb");
  var img     = document.getElementById("lbImg");
  var cap     = document.getElementById("lbCap");
  var count   = document.getElementById("lbCount");
  var btnX    = document.getElementById("lbClose");
  var btnPrev = document.getElementById("lbPrev");
  var btnNext = document.getElementById("lbNext");

  var group = [];      // the images you can step through
  var index = 0;       // which one is showing
  var opener = null;   // the image clicked, so focus can return to it

  function show(i, animate) {
    index = (i + group.length) % group.length;          // wrap around at either end
    var shot = group[index];
    var source = shot.querySelector("img");

    function apply() {
      img.src = source.src;
      img.alt = source.alt;
      // caption: the plate's figcaption, else data-cap (CAD gallery), else the alt text
      var fig = shot.closest(".plate");
      cap.textContent = (fig && fig.querySelector("figcaption").textContent) ||
                        shot.getAttribute("data-cap") || source.alt;
      count.textContent = group.length > 1 ? (index + 1) + " / " + group.length : "";
      img.classList.remove("swap");
    }
    if (animate) { img.classList.add("swap"); setTimeout(apply, 180); } else apply();
  }

  function open(shot) {
    // images in the same project card (or the CAD practice gallery) form a set
    var scope = shot.closest(".proj, .practice") || document;
    group = Array.prototype.slice.call(scope.querySelectorAll(".shot"));
    opener = shot;
    btnPrev.hidden = btnNext.hidden = group.length < 2;

    show(group.indexOf(shot), false);
    lb.classList.add("on");
    document.body.style.overflow = "hidden";             // stop the page scrolling behind
    btnX.focus();
  }

  function close() {
    lb.classList.remove("on");
    document.body.style.overflow = "";
    setTimeout(function () { if (!lb.classList.contains("on")) img.src = ""; }, 300);
    if (opener) { opener.focus(); opener = null; }
  }

  document.querySelectorAll(".shot").forEach(function (shot) {
    shot.addEventListener("click", function () { open(shot); });
  });

  btnX.addEventListener("click", close);
  btnPrev.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1, true); });
  btnNext.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1, true); });

  // clicking the dark backdrop (not the image itself) closes it
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target.tagName === "FIGURE") close();
  });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft"  && group.length > 1) show(index - 1, true);
    if (e.key === "ArrowRight" && group.length > 1) show(index + 1, true);

    // keep Tab cycling between the lightbox buttons while it is open
    if (e.key === "Tab") {
      var stops = [btnX, btnPrev, btnNext].filter(function (b) { return !b.hidden; });
      var at = stops.indexOf(document.activeElement);
      e.preventDefault();
      stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
    }
  });
})();
