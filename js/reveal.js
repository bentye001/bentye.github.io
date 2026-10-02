/* =====================================================================
   SCROLL REVEAL
   Text and images animate in as they scroll into view.

   How it works:
   1. EFFECTS below lists which elements get which effect.
   2. Each matched element gets the classes  rv rv-<effect>  which hide it
      (the look of each effect is in css/motion.css).
   3. An IntersectionObserver watches them. When some come into view
      together, each gets a place in the queue (--i) so they appear one
      after another, then .in is added to play the animation.
   4. Once finished, the classes are removed so the element is back to
      its normal styling and hover effects respond instantly.

   To animate something new, add its selector to one of the lists.
   An element only takes the first effect it matches.
   ===================================================================== */
(function () {
  var EFFECTS = [
    ["type",  ".eyebrow, .proj-tag"],
    ["split", ".sec-title, .proj-head h3, .hero-name"],
    ["wipe",  ".stage-media .shot"],
    ["inner", ".specbar > div, .clink"],
    ["up",    ".hero .lede, .hero .actions, .avail, .figure, " +
              ".sec-note, .practice-note, .focus-grid p, " +
              ".proj, .proj-head p, .stage-n, .stage-text h4, .stage-text p, " +
              ".outcome h4, .outcome li, .metric, .practice figure, " +
              ".cap h3, .cap li, .tl .row, .contact-lede"]
  ];

  // respect "reduce motion": leave the page exactly as it is
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var root = document.documentElement;
  var staggerMs = parseFloat(getComputedStyle(root).getPropertyValue("--stagger")) || 80;

  /* ---------- wrap each word of a heading for the word-by-word effect ---------- */
  function splitWords(el) {
    var n = 0;
    // walk the heading's contents so <br> and inline tags stay where they are
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;                    // only plain text
      var frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var outer = document.createElement("span");
        var inner = document.createElement("span");
        outer.className = "w";
        inner.textContent = part;
        inner.style.setProperty("--w", n++);
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ---------- the hero name rises letter by letter ---------- */
  function splitLetters(el) {
    var text = el.textContent.trim();
    var n = 0;
    el.textContent = "";
    var sr = document.createElement("span");          // read once, as a name
    sr.className = "sr-only";
    sr.textContent = text;
    var visual = document.createElement("span");       // the animated copy
    visual.setAttribute("aria-hidden", "true");
    text.split(" ").forEach(function (word, wi) {
      if (wi) visual.appendChild(document.createTextNode(" "));
      var wordBox = document.createElement("span");
      wordBox.style.whiteSpace = "nowrap";
      word.split("").forEach(function (ch) {
        var outer = document.createElement("span");
        var inner = document.createElement("span");
        outer.className = "w";
        inner.textContent = ch;
        inner.style.setProperty("--w", n++);
        outer.appendChild(inner);
        wordBox.appendChild(outer);
      });
      visual.appendChild(wordBox);
    });
    el.appendChild(sr);
    el.appendChild(visual);
  }

  /* ---------- tag every element with its effect ---------- */
  var targets = [];
  EFFECTS.forEach(function (pair) {
    var effect = pair[0];
    document.querySelectorAll(pair[1]).forEach(function (el) {
      if (el.classList.contains("rv")) return;          // already has an effect
      if (effect === "split") {
        if (el.classList.contains("hero-name")) splitLetters(el); else splitWords(el);
      }
      if (effect === "type") el.style.setProperty("--n", el.textContent.trim().length);
      el.classList.add("rv", "rv-" + effect);
      targets.push(el);
    });
  });

  /* ---------- play them as they arrive ---------- */
  function finish(el) {
    el.classList.remove("rv", "in", "rv-up", "rv-type", "rv-split", "rv-wipe", "rv-inner");
    el.style.removeProperty("--i");
  }

  var observer = new IntersectionObserver(function (entries) {
    // everything arriving in this batch, in page order
    var batch = entries
      .filter(function (e) { return e.isIntersecting; })
      .map(function (e) { return e.target; })
      .sort(function (a, b) {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

    batch.forEach(function (el, i) {
      var place = Math.min(i, 10);                       // cap the queue so nothing waits too long
      el.style.setProperty("--i", place);
      el.classList.add("in");
      observer.unobserve(el);

      // let other scripts react (js/counters.js listens for this)
      el.dispatchEvent(new CustomEvent("reveal", { detail: { delay: place * staggerMs } }));

      // tidy up after the longest animation (the foot outline) has ended
      setTimeout(function () { finish(el); }, place * staggerMs + 2600);
    });
  }, { rootMargin: "0px 0px -8% 0px" });

  targets.forEach(function (el) { observer.observe(el); });
})();
