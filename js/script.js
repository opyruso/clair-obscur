    const jsonUrl = "data/picto-dictionnary.json";
    const myPictosUrl = "data/myPictos.json";
    let pictos = [];
    let pictosFiltered = [];
    let myPictosSet = new Set();
    let currentView = "cards";
    let sortCol = null, sortDir = 1; // 1 asc, -1 desc
    let ownedCount = 0;
    let totalCount = 0;

    function updateTitle() {
      const suffix = ` - ${ownedCount}/${totalCount}`;
      const h1 = document.querySelector("h1");
      if (h1) h1.textContent = `Clair Obscur - Pictos${suffix}`;
      document.title = `Clair Obscur - Pictos${suffix}`;
    }

    // Traduction pour badges
    const pictoLabels = {
      "defence": "Defence",
      "speed": "Speed",
      "critical-luck": "Crit. Luck",
      "health": "Health"
    };

    const tableCols = [
      {key: "checkbox", label: ""},
      {key: "name", label: "Name"},
      {key: "region", label: "Region"},
      {key: "level", label: "Level"},
      {key: "defence", label: "Defence"},
      {key: "speed", label: "Speed"},
      {key: "critical-luck", label: "Crit. Luck"},
      {key: "health", label: "Health"},
      {key: "bonus_lumina", label: "Lumina Bonus"},
      {key: "unlock_description", label: "Unlock"}
    ];

    // On charge les deux fichiers JSON puis on lance le rendu
    Promise.all([
      fetch(jsonUrl).then(r => r.json()),
      fetch(myPictosUrl).then(r => r.json())
    ]).then(([data, myData]) => {
      pictos = data;
      pictosFiltered = pictos.slice();
      myPictosSet = new Set((myData || []).filter(x => x.ref).map(x => x.ref));
      ownedCount = myPictosSet.size;
      totalCount = pictos.length;
      updateTitle();
      render();
    });

    // Recherche/filter
    document.getElementById("search").addEventListener("input", e => {
      const term = e.target.value.trim().toLowerCase();
      pictosFiltered = pictos.filter(p => {
        return Object.values(p).some(v => (v && typeof v === 'string' && v.toLowerCase().includes(term)))
          || (p.bonus_picto && Object.entries(p.bonus_picto).some(([k,v]) => String(v).toLowerCase().includes(term)));
      });
      render();
    });

    // Toggle Vue
    document.getElementById("toggleViewBtn").addEventListener("click", () => {
      currentView = currentView === "cards" ? "table" : "cards";
      document.getElementById("toggleViewBtn").textContent =
        currentView === "cards" ? "🗂️ Switch to Table" : "🃏 Switch to Cards";
      render();
    });

    function render() {
      document.getElementById("cards").style.display = currentView === "cards" ? "block" : "none";
      document.getElementById("table").style.display = currentView === "table" ? "block" : "none";
      if(currentView === "cards") renderCards();
      else renderTable();
    }

    // Vue Cartes
    function renderCards() {
      const container = document.getElementById("cards");
      container.innerHTML = "";
      pictosFiltered.forEach(p => {
        const owned = myPictosSet.has(p.id);
        const card = document.createElement("div");
        card.className = "card" + (owned ? " owned" : "");
        let html = `<div class="name">${p.name}</div>`;
        if (p.bonus_picto && Object.keys(p.bonus_picto).length > 0) {
          html += `<div class="bonus-list">`;
          for (const k in p.bonus_picto) {
            html += `<div class="bonus"><div class="bonus-name">${pictoLabels[k] || k}</div><div class="bonus-value">${p.bonus_picto[k]}${k==="critical-luck"?"%":""}</div></div>`;
          }
          html += `</div>`;
        }
        html += `<hr class="separator">`;
        if (p.bonus_lumina)
          html += `<div class="bonus-lumina">${p.bonus_lumina}</div>`;
        html += `<hr class="separator">`;
        html += `<div class="bottom">`;
        html += `<div class="level">Lv. ${p.level || ''}</div>`;
        html += `<div class="region-block">`;
        if (p.region)
          html += `<div class="region-title">${p.region}</div>`;
        if (p.unlock_description)
          html += `<div class="description">${p.unlock_description}</div>`;
        html += `</div></div>`;
        card.innerHTML = html;
        container.appendChild(card);
      });
    }

    // Vue Tableau
    function renderTable() {
      const div = document.getElementById("table");
      let html = `<table><thead><tr>`;
      tableCols.forEach((col, i) => {
        if(col.key==="checkbox")
          html += `<th></th>`;
        else
          html += `<th onclick="window.sortTableCol(${i})" class="${sortCol===i ? (sortDir==1?'sorted-asc':'sorted-desc') : ''}">${col.label}</th>`;
      });
      html += `</tr></thead><tbody>`;
      pictosFiltered.forEach(p => {
        const owned = myPictosSet.has(p.id);
        html += `<tr${owned ? ' class="owned"' : ''}>`;
        // Checkbox en première colonne
        html += `<td class="checkbox-cell"><input type="checkbox"${owned ? " checked" : ""} disabled></td>`;
        tableCols.slice(1).forEach(col => {
          let val = "";
          if (["defence","speed","critical-luck","health"].includes(col.key)) {
            val = (p.bonus_picto && typeof p.bonus_picto[col.key] !== "undefined") ? p.bonus_picto[col.key] : "";
            if(col.key==="critical-luck" && val!=="") val = val+"%";
          } else if (col.key === "level") {
            val = p.level || "";
          } else {
            val = p[col.key] || "";
          }
          html += `<td class="${["defence","speed","critical-luck","health"].includes(col.key) ? 'nowrap' : ''}">${val}</td>`;
        });
        html += `</tr>`;
      });
      html += `</tbody></table>`;
      div.innerHTML = html;
    }

    // Tri tableau (accessible depuis onClick HTML, pour compatibilité file://)
    window.sortTableCol = function(idx) {
      // Pour les colonnes bonus_picto, tri descendant par défaut (sortDir = -1)
      if(["defence","speed","critical-luck","health"].includes(tableCols[idx].key)) {
        if(sortCol === idx) sortDir = -sortDir;
        else { sortCol = idx; sortDir = -1; }
      } else {
        if(sortCol === idx) sortDir = -sortDir;
        else { sortCol = idx; sortDir = 1; }
      }
      const key = tableCols[idx].key;
      pictosFiltered.sort((a,b) => {
        let av, bv;
        if (["defence","speed","critical-luck","health"].includes(key)) {
          av = a.bonus_picto?.[key] ?? -Infinity;
          bv = b.bonus_picto?.[key] ?? -Infinity;
          av = isNaN(av) ? -Infinity : av;
          bv = isNaN(bv) ? -Infinity : bv;
        } else if (key === "level") {
          av = a.level ?? -Infinity;
          bv = b.level ?? -Infinity;
        } else {
          av = (a[key] || "").toString().toLowerCase();
          bv = (b[key] || "").toString().toLowerCase();
        }
        if(av < bv) return -1*sortDir;
        if(av > bv) return 1*sortDir;
        return 0;
      });
      renderTable();
      // Mise à jour des classes d'entête pour flèches
      document.querySelectorAll("th").forEach((th,i) => {
        th.classList.remove("sorted-asc","sorted-desc");
        if(i===sortCol) th.classList.add(sortDir===1 ? "sorted-asc":"sorted-desc");
      });
    }
