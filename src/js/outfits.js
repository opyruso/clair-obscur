(() => {
const defaultCharacters=['Gustave','Maelle','Lune','Sciel','Verso','Monoco'];
let characters = defaultCharacters.slice();
let characterIds = Object.fromEntries(defaultCharacters.map((c,i)=>[c,i+1]));
const defaultCharKeys=defaultCharacters.map(c=>c.toLowerCase());
let charKeysById=Object.fromEntries(defaultCharKeys.map((k,i)=>[i+1,k]));
let allOutfits = [];
let outfits = [];
let filteredOutfits = [];
let myOutfits = new Set();
const storageKey = 'outfits';
let currentCharacter = characters[0];
let currentCharId = characterIds[currentCharacter];
let currentView = localStorage.getItem('outfitViewMode') || 'cards';
let hideOwned = false;
let hideMissing = false;
let sortCol = null, sortDir = 1;
let tableCols = [];

function updateTranslations() {
  tableCols = [
    {key:'checkbox',label:''},
    {key:'name',label:t('name')},
    {key:'region',label:t('region')}
  ];
}
updateTranslations();

function initPage(){
  document.getElementById('gridViewBtn').addEventListener('click', () => { if(currentView!=='cards'){currentView='cards';localStorage.setItem('outfitViewMode',currentView);render();updateIconStates();}});
  document.getElementById('tableViewBtn').addEventListener('click', () => { if(currentView!=='table'){currentView='table';localStorage.setItem('outfitViewMode',currentView);render();updateIconStates();}});
  document.getElementById('search').addEventListener('input', applyFilters);
  document.getElementById('hideOwnedBtn').addEventListener('click',()=>{hideOwned=!hideOwned;if(hideOwned)hideMissing=false;applyFilters();});
  document.getElementById('hideMissingBtn').addEventListener('click',()=>{hideMissing=!hideMissing;if(hideMissing)hideOwned=false;applyFilters();});
  document.getElementById('selectAllBtn').addEventListener('click',()=>{filteredOutfits.forEach(w=>myOutfits.add(w.id));applyFilters();setSavedItems(storageKey,Array.from(myOutfits));});
  document.getElementById('clearAllBtn').addEventListener('click',()=>{filteredOutfits.forEach(w=>myOutfits.delete(w.id));applyFilters();setSavedItems(storageKey,Array.from(myOutfits));});
  initCharacters();
  loadData();
}

function initCharacters(){
  const div=document.getElementById('charSelect');
  div.innerHTML='';
  characters.forEach(c=>{
    const img=document.createElement('img');
    const id=characterIds[c];
    const key=charKeysById[id]||c.toLowerCase();
    img.src=`resources/images/characters/${key}_icon.png`;
    img.alt=c;
    img.dataset.char=c;
    img.className='char-icon'+(c===currentCharacter?' active':'');
    img.addEventListener('click',()=>{
      currentCharacter=c;
      currentCharId=characterIds[c];
      document.querySelectorAll('.char-icon').forEach(i=>i.classList.toggle('active',i.dataset.char===c));
      applyFilters();
    });
    div.appendChild(img);
  });
}

function mapOutfits(list){
  return list.map(w=>{
    const cid=w.characterId ?? w.character ?? 0;
    const charKey=(charKeysById[cid]||cid||'').toString().toLowerCase();
    return {
      id:w.idOutfit,
      charId:cid,
      charKey,
      character:tg(w.characterNameKey||w.characterName,w.characterName)||'',
      name:tg(w.nameKey||w.name,w.name)||'',
      region:w.region||'',
      unlock_description:w.unlockDescription||null
    };
  });
}

function loadData(){
  getSiteData().then(data=>{
    characters=[];
    characterIds={};
    charKeysById={};
    (data.characters||[]).forEach(c=>{
      const name=tg(c.nameKey||c.name,c.name)||'';
      if(name){
        characters.push(name);
        characterIds[name]=c.idCharacter;
      }
      if(c.idCharacter!==undefined){
        const id=(c.idCharacter||'').toString().toLowerCase();
        charKeysById[c.idCharacter]=id;
      }
    });
    if(characters.length===0){
      characters=defaultCharacters.slice();
      characterIds=Object.fromEntries(defaultCharacters.map((c,i)=>[c,i+1]));
      charKeysById=Object.fromEntries(defaultCharKeys.map((k,i)=>[i+1,k]));
    }
    currentCharacter=characters[0];
    currentCharId=characterIds[currentCharacter];
    initCharacters();
    const list = mapOutfits(data.outfits || []);
    allOutfits=list.map(w=>({id:w.id,...w}));
    getSavedItems(storageKey).forEach(id=>myOutfits.add(id));
    applyFilters();
  });
}

function applyFilters(){
  outfits = allOutfits.filter(w=>w.charId===currentCharId);
  const term=document.getElementById('search').value.trim().toLowerCase();
  filteredOutfits=outfits.filter(w=>{
    const text=Object.values(w).join(' ').toLowerCase();
    if(term && !text.includes(term)) return false;
    if(hideOwned && myOutfits.has(w.id)) return false;
    if(hideMissing && !myOutfits.has(w.id)) return false;
    return true;
  });
  updateTitle();
  updateIconStates();
  render();
}

function updateTitle(){
  const ownedForChar=outfits.filter(w=>myOutfits.has(w.id)).length;
  const visibleOwned=filteredOutfits.filter(w=>myOutfits.has(w.id)).length;
  const hiddenOwned=ownedForChar-visibleOwned;
  const visibleTotal=filteredOutfits.length;
  const hiddenTotal=outfits.length-visibleTotal;
  const ownedPart=hiddenOwned>0
    ?`${visibleOwned} (+${hiddenOwned} ${t('hidden')})`
    :`${visibleOwned}`;
  const totalPart=hiddenTotal>0
    ?`${visibleTotal} (+${hiddenTotal} ${t('hidden')})`
    :`${visibleTotal}`;
  const suffix=` - ${ownedPart} / ${totalPart}`;
  const h1=document.querySelector('h1');
  if(h1)h1.textContent=`${t('heading_outfits')}${suffix}`;
  document.title=`${t('outfits_title')}${suffix}`;
}

function toggleOutfit(id){
  const hadId = myOutfits.has(id);
  if(hadId) myOutfits.delete(id); else myOutfits.add(id);

  // Refresh list if current filters hide/show owned/missing outfits
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

  setSavedItems(storageKey, Array.from(myOutfits));
}

function render(){
  document.getElementById('cards').style.display=currentView==='cards'?'grid':'none';
  document.getElementById('table').style.display=currentView==='table'?'block':'none';
  if(currentView==='cards') renderCards(); else renderTable();
}

function renderCards(){
  const container=document.getElementById('cards');
  container.innerHTML='';
  const skins=filteredOutfits.filter(w=>!w.id.includes('_Hair_'));
  const hairs=filteredOutfits.filter(w=>w.id.includes('_Hair_'));
  const addGroup=(title,list)=>{
    if(!list.length) return;
    const p=document.createElement('p');
    p.className='group-title';
    p.textContent=title;
    container.appendChild(p);
    list.forEach(w=>{
      const owned=myOutfits.has(w.id);
      const card=document.createElement('div');
      card.className='card'+(owned?' owned':'');
      card.dataset.id=w.id;
      card.innerHTML=`<div class="card-inner"><img class="outfit-img" src="resources/images/outfits/${w.charKey}/${w.id}.webp" alt=""><div class="card-face card-front"><div class="card-header"><span class="pin-btn" data-id="${w.id}"><i class="fa-solid fa-thumbtack"></i></span><span class="name">${w.name}</span></div><div class="region">${w.region}${w.unlock_description?` (${w.unlock_description})`:''}</div></div></div>`;
      card.querySelector('.pin-btn').addEventListener('click',e=>{e.stopPropagation();toggleOutfit(w.id);});
      container.appendChild(card);
    });
  };
  addGroup(t('skins_label'), skins);
  addGroup(t('haircuts_label'), hairs);
}

function renderTable(){
  const div=document.getElementById('table');
  let html='<table><thead><tr>';
  tableCols.forEach((col,i)=>{ html+=`<th onclick=\"window.outfitsPage.sortTableCol(${i})\" class=\"${sortCol===i?(sortDir===1?'sorted-asc':'sorted-desc'):''}\">${col.label}</th>`;});
  html+='</tr></thead><tbody>';
  filteredOutfits.forEach(w=>{
    html+=`<tr data-id="${w.id}"${myOutfits.has(w.id)?' class="owned"':''}>`;
    html+=`<td class="checkbox-cell"><input type="checkbox" ${myOutfits.has(w.id)?'checked':''} data-id="${w.id}" class="picto-checkbox"></td>`;
    html+=`<td class="name-cell">${w.name}</td>`;
    html+=`<td>${w.region}${w.unlock_description?` (${w.unlock_description})`:''}</td>`;
    html+='</tr>';
  });
  html+='</tbody></table>';
  div.innerHTML=html;
  div.querySelectorAll('.picto-checkbox').forEach(cb=>cb.addEventListener('change',e=>toggleOutfit(e.target.dataset.id)));
}

function sortTableCol(idx){
  if(sortCol===idx) sortDir=-sortDir; else {sortCol=idx; sortDir=1;}
  const key=tableCols[idx].key;
  filteredOutfits.sort((a,b)=>{const av=(a[key]||'').toString().toLowerCase(); const bv=(b[key]||'').toString().toLowerCase(); if(av<bv) return -1*sortDir; if(av>bv) return 1*sortDir; return 0;});
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



function onSiteDataUpdated(){
  myOutfits = new Set(getSavedItems(storageKey));
  applyFilters();
}

window.outfitsPage = { initPage, updateTranslations, loadData, render, onSiteDataUpdated, sortTableCol };
})();
