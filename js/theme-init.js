/* =====================================================================
   THEME INIT
   Loaded in <head>, before anything is drawn, so a returning visitor who
   chose dark mode never sees a flash of the light page first.
   Uses their saved choice if there is one, otherwise their system setting.
   ===================================================================== */
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  } catch (e) { /* storage blocked: CSS falls back to the system setting */ }
})();
