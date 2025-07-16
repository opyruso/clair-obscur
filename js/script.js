    const jsonUrl = "data/picto-dictionnary.json";
    const myPictosUrl = "data/myPictos.json";
    let pictos = [];
    let pictosFiltered = [];
    let myPictosSet = new Set();
    let currentView = "cards";
    let sortCol = null, sortDir = 1; // 1 asc, -1 desc
    let ownedCount = 0;
    let totalCount = 0;

    function togglePicto(id) {
      if(myPictosSet.has(id)) myPictosSet.delete(id); else myPictosSet.add(id);
      ownedCount = myPictosSet.size;
      updateTitle();
      render();
    }

    function showModal(text) {
      const modal = document.getElementById('modal');
      if(!modal) return;
      modal.querySelector('.modal-content').textContent = text;
      modal.style.display = 'flex';
    }

    document.addEventListener('click', () => {
      const modal = document.getElementById('modal');
      if(modal && modal.style.display !== 'none') modal.style.display = 'none';
    });

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

    function levenshtein(a, b) {
      const al = a.length, bl = b.length;
      if (al === 0) return bl;
      if (bl === 0) return al;
      const matrix = Array.from({length: bl + 1}, (_, i) => [i]);
      for (let j = 0; j <= al; j++) matrix[0][j] = j;
      for (let i = 1; i <= bl; i++) {
        for (let j = 1; j <= al; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
          else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
      return matrix[bl][al];
    }

    function similarity(a, b) {
      a = a.toLowerCase();
      b = b.toLowerCase();
      const dist = levenshtein(a, b);
      return 1 - dist / Math.max(a.length, b.length);
    }

    function bestMatch(name) {
      let best = null;
      let score = 0;
      pictos.forEach(p => {
        const s = similarity(name, p.name);
        if (s > score) { score = s; best = p; }
      });
      return {picto: best, score};
    }

    function handleUpload(file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const arr = JSON.parse(e.target.result);
          if (!Array.isArray(arr)) throw new Error('Invalid format');
          let added = 0;
          arr.forEach(entry => {
            if (typeof entry !== 'string') return;
            let p = pictos.find(x => x.id === entry);
            if (!p) p = pictos.find(x => x.name.toLowerCase() === entry.toLowerCase());
            if (!p) {
              const {picto, score} = bestMatch(entry);
              if (picto && score >= 0.75) {
                if (confirm(`No exact match for "${entry}". Use "${picto.name}"?`)) p = picto;
              }
            }
            if (p) {
              if (!myPictosSet.has(p.id)) {
                myPictosSet.add(p.id);
                added++;
              }
            }
          });
          ownedCount = myPictosSet.size;
          updateTitle();
          render();
          alert(`${added} pictos added.`);
        } catch(err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }

    function downloadJson() {
      const data = JSON.stringify(Array.from(myPictosSet), null, 2);
      const blob = new Blob([data], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'myPictos.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

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
      document.getElementById('downloadBtn').addEventListener('click', downloadJson);
      document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('fileInput').click());
      document.getElementById('fileInput').addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
          handleUpload(e.target.files[0]);
          e.target.value = '';
        }
      });
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
      document.getElementById("cards").style.display = currentView === "cards" ? "grid" : "none";
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
        card.addEventListener('click', () => togglePicto(p.id));
        container.appendChild(card);
      });
    }

    // Vue Tableau
    function renderTable() {
      const div = document.getElementById("table");
      const hideUnlock = window.innerWidth < 1920;
      let html = `<table><thead><tr>`;
      tableCols.forEach((col, i) => {
        if(col.key==="checkbox") html += `<th></th>`;
        else if(col.key==="unlock_description" && hideUnlock) html += `<th>ℹ️</th>`;
        else html += `<th onclick="window.sortTableCol(${i})" class="${sortCol===i ? (sortDir==1?'sorted-asc':'sorted-desc') : ''}">${col.label}</th>`;
      });
      html += `</tr></thead><tbody>`;
      pictosFiltered.forEach(p => {
        const owned = myPictosSet.has(p.id);
        html += `<tr${owned ? ' class="owned"' : ''}>`;
        html += `<td class="checkbox-cell"><input type="checkbox" class="picto-checkbox" data-id="${p.id}"${owned ? " checked" : ""}></td>`;
        tableCols.slice(1).forEach(col => {
          if(col.key==="unlock_description" && hideUnlock) {
            const val = p[col.key] || "";
            html += `<td class="info-cell"><span class="info-icon" data-info="${(val || '').replace(/"/g,'&quot;')}">ℹ️</span></td>`;
            return;
          }
          let val = "";
          if (["defence","speed","critical-luck","health"].includes(col.key)) {
            val = (p.bonus_picto && typeof p.bonus_picto[col.key] !== "undefined") ? p.bonus_picto[col.key] : "";
            if(col.key==="critical-luck" && val!=="") val = val+"%";
          } else if (col.key === "level") {
            val = p.level || "";
          } else {
            val = p[col.key] || "";
          }
          let cls = ["defence","speed","critical-luck","health"].includes(col.key) ? 'nowrap' : '';
          if(col.key==='name') cls += ' name-cell';
          if(col.key==='level') cls += ' level-cell';
          html += `<td class="${cls.trim()}">${val}</td>`;
        });
        html += `</tr>`;
      });
      html += `</tbody></table>`;
      div.innerHTML = html;
      div.querySelectorAll('.picto-checkbox').forEach(cb => {
        cb.addEventListener('change', e => togglePicto(e.target.dataset.id));
      });
      div.querySelectorAll('.info-icon').forEach(ic => {
        ic.addEventListener('click', e => {
          e.stopPropagation();
          showModal(e.currentTarget.dataset.info);
        });
      });
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

    // Re-render table on window resize so Unlock column visibility updates
    window.addEventListener('resize', () => {
      if(currentView === 'table') renderTable();
    });
