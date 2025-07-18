    const jsonUrl = "data/picto-dictionnary.json";
let pictos = [];
let pictosFiltered = [];
let myPictosSet = new Set();
let currentView = localStorage.getItem('viewMode') || "cards";
let sortCol = null, sortDir = 1; // 1 asc, -1 desc
let ownedCount = 0;
let totalCount = 0;
let hideOwned = false;
let hideMissing = false;
let modified = false;
let hiddenCount = 0;
let dataLoaded = false;
let initialRender = true;
let pictoLabels = {};
let tableCols = [];

function updateTranslations() {
  pictoLabels = {
    "defence": t('defence'),
    "speed": t('speed'),
    "critical-luck": t('critical-luck'),
    "health": t('health')
  };
  tableCols = [
    {key: "checkbox", label: ""},
    {key: "name", label: t('name')},
    {key: "region", label: t('region')},
    {key: "level", label: t('level')},
    {key: "defence", label: t('defence')},
    {key: "speed", label: t('speed')},
    {key: "critical-luck", label: t('critical-luck')},
    {key: "health", label: t('health')},
    {key: "bonus_lumina", label: t('bonus_lumina')},
    {key: "unlock_description", label: t('unlock_description')}
  ];
}

updateTranslations();

    function togglePicto(id) {
      const hadId = myPictosSet.has(id);
      if(hadId) myPictosSet.delete(id); else myPictosSet.add(id);
      ownedCount = myPictosSet.size;
      modified = true;

      // If a filter hides or shows owned/missing pictos, we need a full refresh
      if(hideOwned || hideMissing) {
        applyFilters();
        return;
      }

      const card = document.querySelector(`.card[data-id="${id}"]`);
      if(card) card.classList.toggle('owned', !hadId);
      const row = document.querySelector(`tr[data-id="${id}"]`);
      if(row) {
        row.classList.toggle('owned', !hadId);
        const cb = row.querySelector('.picto-checkbox');
        if(cb) cb.checked = !hadId;
      }
      updateTitle();
      updateIconStates();
    }

function showModal(region, level, description) {
  const modal = document.getElementById('modal');
  if(!modal) return;
  const content = modal.querySelector('.modal-content');
  if(!content) return;
  content.innerHTML = '';
  if(region) {
    const r = document.createElement('div');
    r.className = 'modal-region';
    r.textContent = region;
    content.appendChild(r);
  }
  if(level) {
    const l = document.createElement('div');
    l.className = 'modal-level';
    l.textContent = `${t('level_short')} ${level}`;
    content.appendChild(l);
  }
  if(description) {
    const d = document.createElement('div');
    d.className = 'modal-description';
    d.textContent = description;
    content.appendChild(d);
  }
  modal.style.display = 'flex';
}

function notify(msg, delay = 3000) {
  const container = document.getElementById('notificationContainer');
  if(!container) return;
  const div = document.createElement('div');
  div.className = 'notification';
  div.textContent = msg;
  container.appendChild(div);
  requestAnimationFrame(() => div.classList.add('show'));
  setTimeout(() => {
    div.classList.remove('show');
    setTimeout(() => div.remove(), 300);
  }, delay);
}

function handleCardPressMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if(x < rect.width*0.25 && y < rect.height*0.25 || e.target.closest('.pin-btn')) {
    card.style.transform = '';
    return;
  }
  const ry = ((x - rect.width / 2) / rect.width);
  const weight = 0.8 + 0.4 * (y / rect.height);
  const rx = -((y - rect.height / 2) / rect.height) * weight;
  card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
}

function handleCardPressLeave(e) {
  e.currentTarget.style.transform = '';
}

    document.addEventListener('click', () => {
      const modal = document.getElementById('modal');
      if(modal && modal.style.display !== 'none') modal.style.display = 'none';
    });

    function updateTitle() {
      const visibleOwned = pictosFiltered.filter(p => myPictosSet.has(p.id)).length;
      const hiddenOwned = ownedCount - visibleOwned;
      const visibleTotal = pictosFiltered.length;
      const hiddenTotal = totalCount - visibleTotal;
      const ownedPart = hiddenOwned > 0
        ? `${visibleOwned} (+${hiddenOwned} ${t('hidden')})`
        : `${visibleOwned}`;
      const totalPart = hiddenTotal > 0
        ? `${visibleTotal} (+${hiddenTotal} ${t('hidden')})`
        : `${visibleTotal}`;
      const suffix = ` - ${ownedPart} / ${totalPart}`;
      const h1 = document.querySelector("h1");
      if (h1) h1.textContent = `${t('pictos_title')}${suffix}`;
      document.title = `${t('pictos_title')}${suffix}`;
    }

    function applyFilters() {
      const term = document.getElementById("search").value.trim().toLowerCase();
      const searchFiltered = pictos.filter(p => {
        return Object.values(p).some(v => (v && typeof v === 'string' && v.toLowerCase().includes(term)))
          || (p.bonus_picto && Object.entries(p.bonus_picto).some(([k,v]) => String(v).toLowerCase().includes(term)));
      });
      pictosFiltered = searchFiltered.filter(p => {
        if(hideOwned && myPictosSet.has(p.id)) return false;
        if(hideMissing && !myPictosSet.has(p.id)) return false;
        return true;
      });
      hiddenCount = searchFiltered.length - pictosFiltered.length;
      updateIconStates();
      updateTitle();
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
          if (!Array.isArray(arr)) throw new Error(t('invalid_format'));
          let added = 0;
          arr.forEach(entry => {
            if (typeof entry !== 'string') return;
            let p = pictos.find(x => x.id === entry);
            if (!p) p = pictos.find(x => x.name.toLowerCase() === entry.toLowerCase());
            if (!p) {
              const {picto, score} = bestMatch(entry);
              if (picto && score >= 0.75) {
                if (confirm(t('no_match_confirm', {entry, picto: picto.name}))) p = picto;
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
          applyFilters();
          notify(t('pictos_added', {count: added}));
        } catch(err) {
          notify(t('invalid_json'));
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

    function saveToLocal() {
      if(!confirm(t('save_confirm'))) return;
      localStorage.setItem('myPictos', JSON.stringify(Array.from(myPictosSet)));
      modified = false;
      notify(t('selection_saved'));
      updateIconStates();
    }

    function selectAll() {
      const total = pictosFiltered.length;
      const selected = pictosFiltered.filter(p => myPictosSet.has(p.id)).length;
      if(total === selected) return;
      if(selected > 0 && selected < total) {
        if(!confirm(t('select_all_confirm'))) return;
      }
      pictosFiltered.forEach(p => myPictosSet.add(p.id));
      ownedCount = myPictosSet.size;
      modified = true;
      applyFilters();
    }

    function clearAll() {
      const total = pictosFiltered.length;
      const selected = pictosFiltered.filter(p => myPictosSet.has(p.id)).length;
      if(selected === 0) return;
      if(selected > 0 && selected < total) {
        if(!confirm(t('clear_selection_confirm'))) return;
      }
      pictosFiltered.forEach(p => myPictosSet.delete(p.id));
      ownedCount = myPictosSet.size;
      modified = true;
      applyFilters();
    }

    function updateIconStates() {
      const downloadBtn = document.getElementById('downloadBtn');
      if(downloadBtn) downloadBtn.classList.toggle('disabled', !modified);
      const saveBtn = document.getElementById('saveBtn');
      if(saveBtn) saveBtn.classList.toggle('disabled', !modified);
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

    async function loadData() {
      if(dataLoaded) return;
      const data = await fetch(jsonUrl).then(r => r.json());
      pictos = data;
      pictosFiltered = pictos.slice();
      myPictosSet = new Set();
      const saved = localStorage.getItem('myPictos');
      if(saved) {
        try {
          JSON.parse(saved).forEach(id => myPictosSet.add(id));
        } catch(e) { /* ignore */ }
      }
      ownedCount = myPictosSet.size;
      totalCount = pictos.length;
      dataLoaded = true;
      updateIconStates();
      applyFilters();
    }

    document.getElementById('downloadBtn').addEventListener('click', downloadJson);
    document.getElementById('uploadBtn').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('saveBtn').addEventListener('click', saveToLocal);
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

    // Recherche/filter
    document.getElementById("search").addEventListener("input", applyFilters);

    document.getElementById("gridViewBtn").addEventListener("click", () => {
      if(currentView !== 'cards') {
        currentView = 'cards';
        localStorage.setItem('viewMode', currentView);
        updateIconStates();
        render();
      }
    });
    document.getElementById("tableViewBtn").addEventListener("click", () => {
      if(currentView !== 'table') {
        currentView = 'table';
        localStorage.setItem('viewMode', currentView);
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
        card.dataset.id = p.id;
        if(!initialRender) {
          card.classList.add('fade');
        }

        let front = `<div class="card-face card-front">`;
        front += `<div class="card-header"><span class="pin-btn" data-id="${p.id}"><i class="fa-solid fa-thumbtack"></i></span><span class="name">${p.name}</span></div>`;
        if (p.bonus_picto && Object.keys(p.bonus_picto).length > 0) {
          front += `<div class="bonus-list">`;
          for (const k in p.bonus_picto) {
            front += `<div class="bonus"><div class="bonus-name">${pictoLabels[k] || k}</div><div class="bonus-value">${p.bonus_picto[k]}${k==="critical-luck"?"%":""}</div></div>`;
          }
          front += `</div>`;
        }
        front += `<hr class="separator">`;
        if (p.bonus_lumina)
          front += `<div class="bonus-lumina">${p.bonus_lumina}</div>`;
        front += `</div>`;

        let back = `<div class="card-face card-back">`;
        back += `<div class="card-header"><span class="pin-btn" data-id="${p.id}"><i class="fa-solid fa-thumbtack"></i></span><span class="name">${p.name}</span></div>`;
        back += `<div class="level">Lv. ${p.level || ''}</div>`;
        back += `<div class="region-block">`;
        if (p.region)
          back += `<div class="region-title">${p.region}</div>`;
        if (p.unlock_description)
          back += `<div class="description">${p.unlock_description}</div>`;
        back += `</div></div>`;

        card.innerHTML = `<div class="card-inner">${front}${back}</div>`;

        card.addEventListener('mousemove', handleCardPressMove);
        card.addEventListener('mouseleave', handleCardPressLeave);
        card.addEventListener('click', e => {
          const pin = e.target.closest('.pin-btn');
          if(pin) {
            e.stopPropagation();
            togglePicto(pin.dataset.id);
          } else {
            card.classList.toggle('pinned');
            card.classList.toggle('flipped', card.classList.contains('pinned'));
            handleCardPressLeave({currentTarget: card});
          }
        });
        container.appendChild(card);
        if(!initialRender) requestAnimationFrame(() => card.classList.add('show'));
      });
      initialRender = false;
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
          if(showInfoCol) html += `<th><i class="fa-solid fa-circle-info"></i></th>`;
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
        html += `<tr data-id="${p.id}"${owned ? ' class="owned"' : ''}>`;
        html += `<td class="checkbox-cell"><input type="checkbox" class="picto-checkbox" data-id="${p.id}"${owned ? " checked" : ""}></td>`;
        tableCols.slice(1).forEach(col => {
          if(col.key === "unlock_description") {
            if(showInfoCol) {
              const region = hideInfo ? (p.region || '') : '';
              const level = hideInfo ? (p.level || '') : '';
              const desc = hideUnlock ? (p.unlock_description || '') : '';
              const r = region.replace(/"/g,'&quot;');
              const l = String(level).replace(/"/g,'&quot;');
              const d = desc.replace(/"/g,'&quot;');
              html += `<td class="info-cell"><span class="info-icon" data-region="${r}" data-level="${l}" data-desc="${d}"><i class="fa-solid fa-circle-info"></i></span></td>`;
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
          const el = e.currentTarget;
          showModal(el.dataset.region, el.dataset.level, el.dataset.desc);
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

    // Load pictos immediately on startup
    loadData();
