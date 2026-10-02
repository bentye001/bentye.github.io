/* =====================================================================
   COUNTERS
   Headline numbers (.metric .n) count up from zero when they scroll
   into view. js/reveal.js fires a "reveal" event on each .metric; this
   file listens for it. Units and symbols around the number are kept,
   so "0.068 mm", "2,000+" and "83.6%" all work without extra markup.
   ===================================================================== */
(function () {
  var DURATION = 1600;   // milliseconds

  // fast at first, easing gently into the final value
  function easeOut(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function countUp(metric, delay) {
    var el = metric.querySelector(".n");
    if (!el) return;

    // split "0.068 mm" into  prefix ""  number "0.068"  suffix " mm"
    var text = el.textContent.trim();
    var m = text.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m) return;
    var prefix = m[1], numText = m[2], suffix = m[3];
    var target   = parseFloat(numText.replace(/,/g, ""));
    var decimals = (numText.split(".")[1] || "").length;
    var commas   = numText.indexOf(",") > -1;

    function format(v) {
      return prefix + (commas
        ? v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : v.toFixed(decimals)) + suffix;
    }

    // hold the box at its final width so the row does not shuffle while counting
    metric.style.minWidth = metric.getBoundingClientRect().width + "px";
    el.setAttribute("aria-label", text);   // screen readers get the real value
    el.textContent = format(0);

    setTimeout(function () {
      var start = null;
      function frame(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / DURATION, 1);
        el.textContent = format(target * easeOut(t));
        if (t < 1) requestAnimationFrame(frame);
        else { el.textContent = text; metric.style.minWidth = ""; }
      }
      requestAnimationFrame(frame);
    }, delay);
  }

  document.querySelectorAll(".metric").forEach(function (metric) {
    metric.addEventListener("reveal", function (e) { countUp(metric, e.detail.delay); }, { once: true });
  });
})();
