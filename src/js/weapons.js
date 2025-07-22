(() => {
const api = window.CONFIG?.["clairobscur-api-url"] || '';
const characters = ['Gustave','Maelle','Lune','Sciel','Verso','Monoco'];
const damageIcons={
  'Feu':'fire',
  'Glace':'ice',
  'Lumière':'light',
  'Léger':'light',
  'Éclair':'lightning',
  'Foudre':'lightning',
  'Physique':'physical',
  'Sombre':'dark',
  'Terre':'nature',
  'Vide':'void'
};
let allWeapons = [];
let weapons = [];
let filteredWeapons = [];
let myWeapons = new Set();
const storageKey = 'weapons';
let currentCharacter = characters[0];
let currentView = localStorage.getItem('weaponViewMode') || 'cards';
let hideOwned = false;
let hideMissing = false;
let sortCol = null, sortDir = 1;
let tableCols = [];

function updateTranslations() {
  tableCols = [
    {key:'checkbox',label:''},
    {key:'name',label:t('name')},
    {key:'region',label:t('region')},
    {key:'damage_type',label:t('damage_type')},
    {key:'damage_buff',label:t('damage_buff')}
  ];
}
updateTranslations();

function initPage(){
  document.getElementById('gridViewBtn').addEventListener('click', () => { if(currentView!=='cards'){currentView='cards';localStorage.setItem('weaponViewMode',currentView);render();updateIconStates();}});
  document.getElementById('tableViewBtn').addEventListener('click', () => { if(currentView!=='table'){currentView='table';localStorage.setItem('weaponViewMode',currentView);render();updateIconStates();}});
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('hideOwnedBtn').addEventListener('click',()=>{hideOwned=!hideOwned;if(hideOwned)hideMissing=false;applyFilters();});
  document.getElementById('hideMissingBtn').addEventListener('click',()=>{hideMissing=!hideMissing;if(hideMissing)hideOwned=false;applyFilters();});
  document.getElementById('selectAllBtn').addEventListener('click',()=>{filteredWeapons.forEach(w=>myWeapons.add(w.id));applyFilters();setSavedItems(storageKey,Array.from(myWeapons));});
  document.getElementById('clearAllBtn').addEventListener('click',()=>{filteredWeapons.forEach(w=>myWeapons.delete(w.id));applyFilters();setSavedItems(storageKey,Array.from(myWeapons));});
  document.getElementById('downloadBtn').addEventListener('click',downloadJson);
  document.getElementById('uploadBtn').addEventListener('click',()=>document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change',e=>{if(e.target.files&&e.target.files[0])handleSiteUpload(e.target.files[0]);e.target.value='';});
  initCharacters();
  loadData();
}

function initCharacters(){
  const div=document.getElementById('charSelect');
  characters.forEach(c=>{
    const img=document.createElement('img');
    img.src=`resources/images/characters/${c.toLowerCase()}_icon.png`;
    img.alt=c;
    img.dataset.char=c;
    img.className='char-icon'+(c===currentCharacter?' active':'');
    img.addEventListener('click',()=>{currentCharacter=c;document.querySelectorAll('.char-icon').forEach(i=>i.classList.toggle('active',i.dataset.char===c));applyFilters();});
    div.appendChild(img);
  });
}

function mapWeapons(list){
  return list.map(w=>{
    const det=(w.details||[]).find(d=>d.lang===currentLang)||{};
    const effect=[det.weaponEffect1,det.weaponEffect2,det.weaponEffect3]
      .filter(Boolean).join(' ');
    const buffs=[w.damageBuffType1?.idDamageBuffType,w.damageBuffType2?.idDamageBuffType]
      .filter(Boolean);
    const charDet=(w.character?.details||[]).find(d=>d.lang===currentLang)||{};
    return {
      character:charDet.name||w.character?.idCharacter||'',
      name:det.name||'',
      region:det.region||'',
      unlock_description:det.unlockDescription||null,
      damage_type:w.damageType?.idDamageType||'',
      weapon_effect:effect,
      damage_buff:buffs
    };
  });
}

function loadData(){
  apiFetch(`${api}/public/data/${currentLang}`).then(r=>r.json()).then(data=>{
    const list = mapWeapons(data.weapons || []);
    allWeapons=list.map((w,i)=>({id:`${w.character}|${w.name}`,...w}));
    getSavedItems(storageKey).forEach(id=>myWeapons.add(id));
    applyFilters();
  });
}

function applyFilters(){
  weapons = allWeapons.filter(w=>w.character===currentCharacter);
  const term=document.getElementById('search').value.trim().toLowerCase();
  filteredWeapons=weapons.filter(w=>{
    const text=Object.values(w).join(' ').toLowerCase();
    if(term && !text.includes(term)) return false;
    if(hideOwned && myWeapons.has(w.id)) return false;
    if(hideMissing && !myWeapons.has(w.id)) return false;
    return true;
  });
  updateTitle();
  updateIconStates();
  render();
}

function updateTitle(){
  const ownedForChar=weapons.filter(w=>myWeapons.has(w.id)).length;
  const visibleOwned=filteredWeapons.filter(w=>myWeapons.has(w.id)).length;
  const hiddenOwned=ownedForChar-visibleOwned;
  const visibleTotal=filteredWeapons.length;
  const hiddenTotal=weapons.length-visibleTotal;
  const ownedPart=hiddenOwned>0
    ?`${visibleOwned} (+${hiddenOwned} ${t('hidden')})`
    :`${visibleOwned}`;
  const totalPart=hiddenTotal>0
    ?`${visibleTotal} (+${hiddenTotal} ${t('hidden')})`
    :`${visibleTotal}`;
  const suffix=` - ${ownedPart} / ${totalPart}`;
  const h1=document.querySelector('h1');
  if(h1)h1.textContent=`${t('heading_weapons')}${suffix}`;
  document.title=`${t('weapons_title')}${suffix}`;
}

function toggleWeapon(id){
  const hadId = myWeapons.has(id);
  if(hadId) myWeapons.delete(id); else myWeapons.add(id);

  // Refresh list if current filters hide/show owned/missing weapons
  if(hideOwned || hideMissing){
    applyFilters();
  } else {
    const card = document.querySelector(`.card[data-id="${id}"]`);
    if(card) card.classList.toggle('owned', !hadId);
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if(row){
      row.classList.toggle('owned', !hadId);
      const cb = row.querySelector('.picto-checkbox');
      if(cb) cb.checked = !hadId;
    }
    updateTitle();
    updateIconStates();
  }

  setSavedItems(storageKey, Array.from(myWeapons));
}

function render(){
  document.getElementById('cards').style.display=currentView==='cards'?'grid':'none';
  document.getElementById('table').style.display=currentView==='table'?'block':'none';
  if(currentView==='cards') renderCards(); else renderTable();
}

function renderCards(){
  const container=document.getElementById('cards');
  container.innerHTML='';
  filteredWeapons.forEach(w=>{
    const owned=myWeapons.has(w.id);
    const card=document.createElement('div');
    card.className='card'+(owned?' owned':'');
    card.dataset.id=w.id;
    const icon=damageIcons[w.damage_type]||'physical';
    card.innerHTML=`<div class="card-inner"><div class="card-face card-front"><div class="card-header"><span class="pin-btn" data-id="${w.id}"><i class="fa-solid fa-thumbtack"></i></span><img class="damage-icon" src="resources/images/icons/damage/${icon}.png" alt="${w.damage_type||''}"><span class="name">${w.name}</span></div><div class="region">${w.region}${w.unlock_description?` (${w.unlock_description})`:''}</div><div class="description">${w.weapon_effect||''}</div><div class="badges">${(w.damage_buff||[]).map(b=>`<span class="badge">${t(b)||b}</span>`).join('')}</div></div></div>`;
    card.querySelector('.pin-btn').addEventListener('click',e=>{e.stopPropagation();toggleWeapon(w.id);});
    container.appendChild(card);
  });
}

function renderTable(){
  const div=document.getElementById('table');
  let html='<table><thead><tr>';
  tableCols.forEach((col,i)=>{ html+=`<th onclick=\"window.weaponsPage.sortTableCol(${i})\" class=\"${sortCol===i?(sortDir===1?'sorted-asc':'sorted-desc'):''}\">${col.label}</th>`;});
  html+='</tr></thead><tbody>';
  filteredWeapons.forEach(w=>{
    html+=`<tr data-id="${w.id}"${myWeapons.has(w.id)?' class="owned"':''}>`;
    html+=`<td class="checkbox-cell"><input type="checkbox" ${myWeapons.has(w.id)?'checked':''} data-id="${w.id}" class="picto-checkbox"></td>`;
    html+=`<td class="name-cell">${w.name}</td>`;
    html+=`<td>${w.region}${w.unlock_description?` (${w.unlock_description})`:''}</td>`;
    const icon=damageIcons[w.damage_type]||'physical';
    html+=`<td><img class="damage-icon" src="resources/images/icons/damage/${icon}.png" alt="${w.damage_type||''}"></td>`;
    html+=`<td>${(w.damage_buff||[]).join(', ')}</td>`;
    html+='</tr>';
  });
  html+='</tbody></table>';
  div.innerHTML=html;
  div.querySelectorAll('.picto-checkbox').forEach(cb=>cb.addEventListener('change',e=>toggleWeapon(e.target.dataset.id)));
}

function sortTableCol(idx){
  if(sortCol===idx) sortDir=-sortDir; else {sortCol=idx; sortDir=1;}
  const key=tableCols[idx].key;
  filteredWeapons.sort((a,b)=>{const av=(a[key]||'').toString().toLowerCase(); const bv=(b[key]||'').toString().toLowerCase(); if(av<bv) return -1*sortDir; if(av>bv) return 1*sortDir; return 0;});
  renderTable();
  document.querySelectorAll('th').forEach((th,i)=>{th.classList.remove('sorted-asc','sorted-desc'); if(i===sortCol) th.classList.add(sortDir===1?'sorted-asc':'sorted-desc');});
}

function updateIconStates(){
  document.getElementById('downloadBtn').classList.remove('disabled');
  document.getElementById('selectAllBtn').classList.remove('disabled');
  document.getElementById('clearAllBtn').classList.remove('disabled');
  document.getElementById('gridViewBtn').classList.toggle('disabled',currentView==='cards');
  document.getElementById('tableViewBtn').classList.toggle('disabled',currentView==='table');
  document.getElementById('hideOwnedBtn').classList.toggle('toggled',hideOwned);
  document.getElementById('hideMissingBtn').classList.toggle('toggled',hideMissing);
}

function downloadJson(){
  setSavedItems(storageKey, Array.from(myWeapons));
  downloadSiteData();
  updateIconStates();
}

function handleUpload(file){
  handleSiteUpload(file);
}

function onSiteDataUpdated(){
  myWeapons = new Set(getSavedItems(storageKey));
  applyFilters();
}

window.weaponsPage = { initPage, updateTranslations, loadData, render, onSiteDataUpdated, sortTableCol };
})();
