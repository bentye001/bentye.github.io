/* =====================================================================
   THEME TOGGLE
   The moon / sun button in the header. Flips data-theme on <html>
   (css/tokens.css swaps every colour from that) and remembers the choice.
   ===================================================================== */
(function () {
  var btn = document.getElementById("themeToggle");
  var root = document.documentElement;
  if (!btn) return;

  // keep the button's accessible label in step with the current theme
  function sync() {
    var dark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  sync();

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();

    // replay the little spin on the icon (see .spin in css/header.css)
    btn.classList.remove("spin");
    void btn.offsetWidth;            // forces the browser to restart the animation
    btn.classList.add("spin");
  });
})();
