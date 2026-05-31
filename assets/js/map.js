/* GoPickleball — carte interactive des lieux (Leaflet + OpenStreetMap)
   Charge assets/data/lieux.json, affiche les marqueurs, gère les filtres
   par pays, la recherche texte et la liste latérale synchronisée. */
(function () {
  "use strict";

  var mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  var TYPE_LABELS = { club: "Club", association: "Association", complexe: "Complexe sportif" };
  var FLAGS = { FR: "🇫🇷", BE: "🇧🇪" };

  // Carte centrée entre France et Belgique
  var map = L.map(mapEl, { scrollWheelZoom: false }).setView([48.5, 4.0], 5);
  map.on("click", function () { map.scrollWheelZoom.enable(); });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var ballIcon = L.divIcon({
    className: "gp-marker",
    html: '<span style="display:block;width:20px;height:20px;border-radius:50%;background:#C9F24B;border:3px solid #0B5D4E;box-shadow:0 2px 6px rgba(7,63,53,.4)"></span>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -12]
  });

  var listEl = document.getElementById("venueList");
  var countEl = document.getElementById("venueCount");
  var searchEl = document.getElementById("venueSearch");
  var chips = Array.prototype.slice.call(document.querySelectorAll(".filter-chip"));

  var allVenues = [];
  var markers = {};   // id -> marker
  var state = { country: "ALL", query: "" };

  function matches(v) {
    if (state.country !== "ALL" && v.pays !== state.country) return false;
    if (state.query) {
      var q = state.query.toLowerCase();
      var hay = (v.nom + " " + v.ville + " " + (v.pays === "FR" ? "france" : "belgique")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  function metaLine(v) {
    var parts = [];
    parts.push(TYPE_LABELS[v.type] || v.type);
    if (v.courts) parts.push(v.courts + (v.courts > 1 ? " terrains" : " terrain"));
    parts.push(v.indoor ? "Intérieur" : "Extérieur");
    return parts.join(" · ");
  }

  function render() {
    var visible = allVenues.filter(matches);
    var group = [];

    // Marqueurs
    allVenues.forEach(function (v) {
      var m = markers[v.id];
      if (!m) return;
      if (matches(v)) { if (!map.hasLayer(m)) m.addTo(map); group.push(m.getLatLng()); }
      else if (map.hasLayer(m)) map.removeLayer(m);
    });

    // Liste latérale
    listEl.innerHTML = "";
    if (visible.length === 0) {
      listEl.innerHTML = '<p style="color:var(--ink-soft)">Aucun lieu ne correspond. Élargissez votre recherche.</p>';
    } else {
      visible.forEach(function (v) {
        var btn = document.createElement("button");
        btn.className = "venue-item";
        btn.type = "button";
        btn.innerHTML =
          '<h4><span class="venue-flag">' + (FLAGS[v.pays] || "") + "</span> " + esc(v.nom) + "</h4>" +
          '<div class="meta"><span>' + esc(v.ville) + "</span><span>" + esc(metaLine(v)) + "</span></div>";
        btn.addEventListener("click", function () {
          var m = markers[v.id];
          if (m) { map.setView(m.getLatLng(), 12, { animate: true }); m.openPopup(); }
          document.querySelectorAll(".venue-item.active").forEach(function (e) { e.classList.remove("active"); });
          btn.classList.add("active");
        });
        listEl.appendChild(btn);
      });
    }

    if (countEl) {
      countEl.textContent = visible.length + (visible.length > 1 ? " lieux trouvés" : " lieu trouvé");
    }
    if (group.length) {
      map.fitBounds(L.latLngBounds(group).pad(0.2), { maxZoom: 11 });
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function popupHtml(v) {
    var link = v.lien
      ? '<a href="' + esc(v.lien) + '" target="_blank" rel="nofollow noopener">Site du lieu →</a>'
      : "";
    return '<h4>' + (FLAGS[v.pays] || "") + " " + esc(v.nom) + "</h4>" +
      '<div class="meta">' + esc(v.ville) + " — " + esc(metaLine(v)) + "</div>" +
      (link ? '<div style="margin-top:.4rem">' + link + "</div>" : "");
  }

  // Filtres pays
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      state.country = chip.getAttribute("data-country");
      render();
    });
  });

  // Recherche
  if (searchEl) {
    searchEl.addEventListener("input", function () {
      state.query = searchEl.value.trim();
      render();
    });
  }

  // Chargement des données
  fetch("/assets/data/lieux.json")
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (data) {
      allVenues = Array.isArray(data) ? data : (data.lieux || []);
      allVenues.forEach(function (v) {
        if (typeof v.lat !== "number" || typeof v.lng !== "number") return;
        var m = L.marker([v.lat, v.lng], { icon: ballIcon }).bindPopup(popupHtml(v));
        markers[v.id] = m;
      });
      render();
    })
    .catch(function (err) {
      if (countEl) countEl.textContent = "Impossible de charger les lieux pour le moment.";
      console.error("Chargement lieux.json :", err);
    });
})();
