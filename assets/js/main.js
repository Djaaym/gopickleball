/* GoPickleball — interactions globales
   Menu mobile · animations au scroll · sommaire d'article · année du footer */
(function () {
  "use strict";

  /* ----- Menu mobile ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector('nav[aria-label="Navigation principale"]');
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    // Referme le menu après un clic sur un lien
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Ouvrir le menu");
      }
    });
  }

  /* ----- Année courante dans le footer ----- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ----- Animations d'apparition au scroll ----- */
  var revealEls = document.querySelectorAll("[data-reveal], .reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ----- Sommaire automatique d'article -----
     Génère un sommaire à partir des <h2 id> dans .prose si un
     élément [data-toc] est présent sur la page. */
  var tocHost = document.querySelector("[data-toc]");
  var prose = document.querySelector(".prose");
  if (tocHost && prose) {
    var headings = prose.querySelectorAll("h2[id]");
    if (headings.length >= 2) {
      var ol = document.createElement("ol");
      headings.forEach(function (h) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        ol.appendChild(li);
      });
      var label = document.createElement("strong");
      label.textContent = "Sommaire";
      tocHost.classList.add("toc");
      tocHost.appendChild(label);
      tocHost.appendChild(ol);
    }
  }
})();
