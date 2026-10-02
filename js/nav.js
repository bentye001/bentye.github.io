/* =====================================================================
   NAVIGATION
   1. Scroll progress line under the header
   2. Header shadow once the page has scrolled
   3. Highlights the nav link for the section on screen
   4. Mobile drop-down menu
   5. Back-to-top button
   ===================================================================== */
(function () {
  var mast     = document.querySelector(".mast");
  var progress = document.getElementById("progress");
  var toTop    = document.getElementById("toTop");
  var menuBtn  = document.getElementById("menuToggle");
  var links    = document.querySelectorAll(".mast nav a");

  /* ---------- 1, 2 and 5: things that follow the scroll position ---------- */
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    mast.classList.toggle("scrolled", y > 8);
    toTop.classList.toggle("show", y > window.innerHeight * 0.9);
    ticking = false;
  }
  // requestAnimationFrame limits the work to once per screen refresh
  window.addEventListener("scroll", function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0 });     // smooth because of scroll-behavior in css/base.css
    document.querySelector(".sig").focus({ preventScroll: true });
  });

  /* ---------- 3: active section ----------
     Watches a thin band across the middle of the screen; whichever
     section crosses it gets its nav link marked with .on */
  if ("IntersectionObserver" in window) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("on"); a.removeAttribute("aria-current"); });
        var link = byId[entry.target.id];
        if (link) { link.classList.add("on"); link.setAttribute("aria-current", "true"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    // above the first section: nothing highlighted
    spy.observe(document.querySelector(".hero"));
  }

  /* ---------- 4: mobile menu ---------- */
  function setMenu(open) {
    mast.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!mast.classList.contains("open")); });
  links.forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mast.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (mast.classList.contains("open") && !mast.contains(e.target)) setMenu(false);
  });
})();
