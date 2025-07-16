    const jsonUrl = "data/picto-dictionnary.json";
    const myPictosUrl = "data/myPictos.json";
    let pictos = [];
    let pictosFiltered = [];
    let myPictosSet = new Set();
    let currentView = "cards";
    let sortCol = null, sortDir = 1; // 1 asc, -1 desc
    let ownedCount = 0;
    let totalCount = 0;
    let hideOwned = false;
    let hideMissing = false;
    let modified = false;

    function togglePicto(id) {
      if(myPictosSet.has(id)) myPictosSet.delete(id); else myPictosSet.add(id);
      ownedCount = myPictosSet.size;
      modified = true;
      updateTitle();
      applyFilters();
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

    function applyFilters() {
      const term = document.getElementById("search").value.trim().toLowerCase();
      pictosFiltered = pictos.filter(p => {
        const match = Object.values(p).some(v => (v && typeof v === 'string' && v.toLowerCase().includes(term)))
          || (p.bonus_picto && Object.entries(p.bonus_picto).some(([k,v]) => String(v).toLowerCase().includes(term)));
        if(!match) return false;
        if(hideOwned && myPictosSet.has(p.id)) return false;
        if(hideMissing && !myPictosSet.has(p.id)) return false;
        return true;
      });
      updateIconStates();
      render();
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
          modified = true;
          updateTitle();
          applyFilters();
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
      modified = false;
      updateIconStates();
    }

    function selectAll() {
      const total = pictosFiltered.length;
      const selected = pictosFiltered.filter(p => myPictosSet.has(p.id)).length;
      if(total === selected) return;
      if(selected > 0 && selected < total) {
        if(!confirm('Select all visible pictos?')) return;
      }
      pictosFiltered.forEach(p => myPictosSet.add(p.id));
      ownedCount = myPictosSet.size;
      modified = true;
      updateTitle();
      applyFilters();
    }

    function clearAll() {
      const total = pictosFiltered.length;
      const selected = pictosFiltered.filter(p => myPictosSet.has(p.id)).length;
      if(selected === 0) return;
      if(selected > 0 && selected < total) {
        if(!confirm('Clear selection of visible pictos?')) return;
      }
      pictosFiltered.forEach(p => myPictosSet.delete(p.id));
      ownedCount = myPictosSet.size;
      modified = true;
      updateTitle();
      applyFilters();
    }

    function updateIconStates() {
      const downloadBtn = document.getElementById('downloadBtn');
      if(downloadBtn) downloadBtn.classList.toggle('disabled', !modified);
      const baseFiltered = pictos.filter(p => {
        const term = document.getElementById('search').value.trim().toLowerCase();
        return Object.values(p).some(v => (v && typeof v === 'string' && v.toLowerCase().includes(term)))
          || (p.bonus_picto && Object.entries(p.bonus_picto).some(([k,v]) => String(v).toLowerCase().includes(term)));
      });
      const ownedVisible = baseFiltered.filter(p => myPictosSet.has(p.id)).length;
      const missingVisible = baseFiltered.filter(p => !myPictosSet.has(p.id)).length;
      const hideOwnedBtn = document.getElementById('hideOwnedBtn');
      const hideMissingBtn = document.getElementById('hideMissingBtn');
      if(hideOwnedBtn) {
        hideOwnedBtn.classList.toggle('disabled', ownedVisible === 0);
        hideOwnedBtn.classList.toggle('toggled', hideOwned);
      }
      if(hideMissingBtn) {
        hideMissingBtn.classList.toggle('disabled', missingVisible === 0);
        hideMissingBtn.classList.toggle('toggled', hideMissing);
      }
      const anyUnselected = pictosFiltered.some(p => !myPictosSet.has(p.id));
      const anySelected = pictosFiltered.some(p => myPictosSet.has(p.id));
      const selectAllBtn = document.getElementById('selectAllBtn');
      const clearAllBtn = document.getElementById('clearAllBtn');
      if(selectAllBtn) selectAllBtn.classList.toggle('disabled', !anyUnselected);
      if(clearAllBtn) clearAllBtn.classList.toggle('disabled', !anySelected);
      const gridViewBtn = document.getElementById('gridViewBtn');
      const tableViewBtn = document.getElementById('tableViewBtn');
      if(gridViewBtn) gridViewBtn.classList.toggle('disabled', currentView === 'cards');
      if(tableViewBtn) tableViewBtn.classList.toggle('disabled', currentView === 'table');
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
      applyFilters();
      document.getElementById('downloadBtn').addEventListener('click', downloadJson);
      document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('fileInput').click());
      document.getElementById('fileInput').addEventListener('change', e => {
        if (e.target.files && e.target.files[0]) {
          handleUpload(e.target.files[0]);
          e.target.value = '';
        }
      });
      document.getElementById('hideOwnedBtn').addEventListener('click', () => {
        hideOwned = !hideOwned;
        if(hideOwned) hideMissing = false;
        applyFilters();
      });
      document.getElementById('hideMissingBtn').addEventListener('click', () => {
        hideMissing = !hideMissing;
        if(hideMissing) hideOwned = false;
        applyFilters();
      });
      document.getElementById('selectAllBtn').addEventListener('click', selectAll);
      document.getElementById('clearAllBtn').addEventListener('click', clearAll);
      updateIconStates();
    });

    // Recherche/filter
    document.getElementById("search").addEventListener("input", applyFilters);

    document.getElementById("gridViewBtn").addEventListener("click", () => {
      if(currentView !== 'cards') {
        currentView = 'cards';
        updateIconStates();
        render();
      }
    });
    document.getElementById("tableViewBtn").addEventListener("click", () => {
      if(currentView !== 'table') {
        currentView = 'table';
        updateIconStates();
        render();
      }
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
      const hideInfo = window.innerWidth < 1280;
      const showInfoCol = hideUnlock || hideInfo;
      let html = `<table><thead><tr>`;
      tableCols.forEach((col, i) => {
        if(col.key === "checkbox") {
          html += `<th></th>`;
        } else if(col.key === "unlock_description") {
          if(showInfoCol) html += `<th>ℹ️</th>`;
          else html += `<th onclick="window.sortTableCol(${i})" class="${sortCol===i ? (sortDir==1?'sorted-asc':'sorted-desc') : ''}">${col.label}</th>`;
        } else if((col.key === "region" || col.key === "level") && hideInfo) {
          /* skip */
        } else {
          html += `<th onclick="window.sortTableCol(${i})" class="${sortCol===i ? (sortDir==1?'sorted-asc':'sorted-desc') : ''}">${col.label}</th>`;
        }
      });
      html += `</tr></thead><tbody>`;
      pictosFiltered.forEach(p => {
        const owned = myPictosSet.has(p.id);
        html += `<tr${owned ? ' class="owned"' : ''}>`;
        html += `<td class="checkbox-cell"><input type="checkbox" class="picto-checkbox" data-id="${p.id}"${owned ? " checked" : ""}></td>`;
        tableCols.slice(1).forEach(col => {
          if(col.key === "unlock_description") {
            if(showInfoCol) {
              const infoParts = [];
              if(hideInfo) {
                if(p.region) infoParts.push(`Region: ${p.region}`);
                if(p.level) infoParts.push(`Level: ${p.level}`);
              }
              if(hideUnlock && p.unlock_description) infoParts.push(p.unlock_description);
              const info = infoParts.join('\n');
              html += `<td class="info-cell"><span class="info-icon" data-info="${info.replace(/"/g,'&quot;')}">ℹ️</span></td>`;
            } else {
              html += `<td>${p.unlock_description || ''}</td>`;
            }
            return;
          }
          if((col.key === "region" || col.key === "level") && hideInfo) {
            return; // skip column
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
