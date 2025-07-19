document.addEventListener('DOMContentLoaded', () => {
const {useEffect, useState} = React;
const {BrowserRouter, Routes, Route, Navigate} = ReactRouterDOM;

function Home(){
  useEffect(() => {
    document.body.dataset.page="index";
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();
  }, []);
  return (
    <main className="content-wrapper mt-4 flex-grow-1">
      <h1 data-i18n="heading_home">Welcome</h1>
      <div className="index-row">
        <div className="index-desc">
          <p data-i18n="index_desc1">Manage your Clair Obscur picto collection. Mark the pictos you own, search through the list and save your progress.</p>
        </div>
        <div className="index-img">
          <img src="resources/images/index/index_cadre_pictos.png" alt=""/>
        </div>
      </div>
      <div className="index-row reverse">
        <div className="index-desc">
          <p data-i18n="index_desc2">The weapons inventory lets you track every weapon as well. More features are coming, such as a build maker.</p>
        </div>
        <div className="index-img">
          <img src="resources/images/index/index_cadre_weapons.png" alt=""/>
        </div>
      </div>
    </main>
  );
}

function PictosPage(){
  useEffect(() => {
    document.body.dataset.page="pictos";
    if(window.pictosPage?.initPage) window.pictosPage.initPage();
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();
  }, []);
  return (
    <>
      <img className="section-frame frame-top" src="resources/images/general/frame_horizontal.png" alt=""/>
      <img className="section-separator separator-top" src="resources/images/general/separator_horizontal.png" alt=""/>
      <main className="content-wrapper mt-4 flex-grow-1">
        <h1 data-i18n="heading_pictos">Pictos inventory</h1>
        <div className="actions">
          <div className="icon-bar">
            <button className="icon-btn toggle" id="hideOwnedBtn" data-i18n-title="hide_owned" title="Hide owned"><img src="resources/images/icons/buttons/show_found.png" alt=""/></button>
            <button className="icon-btn toggle" id="hideMissingBtn" data-i18n-title="hide_missing" title="Hide missing"><img src="resources/images/icons/buttons/hide_notfound.png" alt=""/></button>
            <div className="icon-sep"></div>
            <button className="icon-btn" id="selectAllBtn" data-i18n-title="select_all" title="Select all"><img src="resources/images/icons/buttons/select_all.png" alt=""/></button>
            <button className="icon-btn" id="clearAllBtn" data-i18n-title="clear_all" title="Clear all"><img src="resources/images/icons/buttons/deselect_all.png" alt=""/></button>
            <div className="icon-sep"></div>
            <button className="icon-btn" id="gridViewBtn" data-i18n-title="grid_view" title="Grid view"><img src="resources/images/icons/buttons/tile_view.png" alt=""/></button>
            <button className="icon-btn" id="tableViewBtn" data-i18n-title="table_view" title="Table view"><img src="resources/images/icons/buttons/tab_view.png" alt=""/></button>
            <div className="icon-sep"></div>
          </div>
          <input className="searchbar" id="search" placeholder="Search pictos by any field..." data-i18n-placeholder="search_placeholder"/>
          <input type="file" id="fileInput" accept="application/json" style={{display:'none'}}/>
        </div>
        <div id="cards" className="cards"></div>
        <div id="table" className="table-view" style={{display:'none'}}></div>
        <div id="modal" className="modal" style={{display:'none'}}><div className="modal-content"></div></div>
        <div id="notificationContainer" className="notification-container"></div>
      </main>
      <img className="section-frame frame-bottom" src="resources/images/general/frame_horizontal.png" alt=""/>
      <img className="section-separator separator-bottom" src="resources/images/general/separator_horizontal.png" alt=""/>
    </>
  );
}

function WeaponsPage(){
  useEffect(() => {
    document.body.dataset.page="weapons";
    if(window.weaponsPage?.initPage) window.weaponsPage.initPage();
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();
  }, []);
  return (
    <>
      <img className="section-frame frame-top" src="resources/images/general/frame_horizontal.png" alt=""/>
      <img className="section-separator separator-top" src="resources/images/general/separator_horizontal.png" alt=""/>
      <main className="content-wrapper mt-4 flex-grow-1">
        <h1 data-i18n="heading_weapons">Weapons inventory</h1>
        <div className="char-select" id="charSelect"></div>
        <div className="actions">
          <div className="icon-bar">
            <button className="icon-btn toggle" id="hideOwnedBtn" data-i18n-title="hide_owned" title="Hide owned"><img src="resources/images/icons/buttons/show_found.png" alt=""/></button>
            <button className="icon-btn toggle" id="hideMissingBtn" data-i18n-title="hide_missing" title="Hide missing"><img src="resources/images/icons/buttons/hide_notfound.png" alt=""/></button>
            <div className="icon-sep"></div>
            <button className="icon-btn" id="selectAllBtn" data-i18n-title="select_all" title="Select all"><img src="resources/images/icons/buttons/select_all.png" alt=""/></button>
            <button className="icon-btn" id="clearAllBtn" data-i18n-title="clear_all" title="Clear all"><img src="resources/images/icons/buttons/deselect_all.png" alt=""/></button>
            <div className="icon-sep"></div>
            <button className="icon-btn" id="gridViewBtn" data-i18n-title="grid_view" title="Grid view"><img src="resources/images/icons/buttons/tile_view.png" alt=""/></button>
            <button className="icon-btn" id="tableViewBtn" data-i18n-title="table_view" title="Table view"><img src="resources/images/icons/buttons/tab_view.png" alt=""/></button>
            <div className="icon-sep"></div>
          </div>
          <input className="searchbar" id="search" placeholder="Search..." data-i18n-placeholder="search_placeholder"/>
          <input type="file" id="fileInput" accept="application/json" style={{display:'none'}}/>
        </div>
        <div id="cards" className="cards"></div>
        <div id="table" className="table-view" style={{display:'none'}}></div>
        <div id="notificationContainer" className="notification-container"></div>
      </main>
      <img className="section-frame frame-bottom" src="resources/images/general/frame_horizontal.png" alt=""/>
      <img className="section-separator separator-bottom" src="resources/images/general/separator_horizontal.png" alt=""/>
    </>
  );
}

function BuildPage(){
  const characters=['Gustave','Maelle','Lune','Sciel','Verso','Monoco'];
  const [weapons,setWeapons]=useState([]);
  const [pictos,setPictos]=useState([]);
  const [team,setTeam]=useState(Array.from({length:5},()=>({character:'',weapon:'',mainPictos:[null,null,null],subPictos:[]})));

  useEffect(()=>{
    document.body.dataset.page='build';
    fetch(`data/armes-dictionnary_${currentLang}.json`).then(r=>r.json()).then(d=>setWeapons(d));
    fetch(`data/picto-dictionnary_${currentLang}.json`).then(r=>r.json()).then(d=>setPictos(d));
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();
  },[]);
  useEffect(()=>{ document.title=t('build_title'); },[team,pictos]);

  const usedMain=new Set();
  team.forEach(t=>t.mainPictos.forEach(p=>{if(p) usedMain.add(p);}));

  function updateTeam(idx,data){
    setTeam(t=>t.map((c,i)=>i===idx?{...c,...data}:c));
  }

  function changeMain(idx,pidx,val){
    setTeam(t=>{
      const nt=t.map((c,i)=>({...c,mainPictos:[...c.mainPictos]}));
      nt[idx].mainPictos[pidx]=val||null;
      for(let i=0;i<nt.length;i++) if(i!==idx){
        nt[i].mainPictos=nt[i].mainPictos.map(p=>p===val?null:p);
      }
      return nt;
    });
  }

  function changeSubs(idx,vals){
    setTeam(t=>t.map((c,i)=>i===idx?{...c,subPictos:vals}:c));
  }

  function computeStats(ids){
    const stats={def:0,speed:0,crit:0,health:0};
    ids.forEach(id=>{
      const p=pictos.find(pc=>pc.id===id);
      if(p && p.bonus_picto){
        stats.def+=(p.bonus_picto.defense||0);
        stats.speed+=(p.bonus_picto.speed||0);
        stats.crit+=(p.bonus_picto['critical-luck']||0);
        stats.health+=(p.bonus_picto.health||0);
      }
    });
    return stats;
  }

  return (
    <>
      <main className="content-wrapper mt-4 flex-grow-1">
        <h1 data-i18n="heading_build">Team builder</h1>
        <div className="team-builder">
          {team.map((col,cidx)=>{
            const stats=computeStats(col.mainPictos.filter(Boolean));
            const charWeapons=weapons.filter(w=>w.character===col.character);
            const availablePictos=pictos.filter(p=>!usedMain.has(p.id)||col.mainPictos.includes(p.id));
            return (
              <div className="build-col" key={cidx}>
                <div className="stats">
                  <div>{t('defense')}: {stats.def}</div>
                  <div>{t('speed')}: {stats.speed}</div>
                  <div>{t('critical-luck')}: {stats.crit}</div>
                  <div>{t('health')}: {stats.health}</div>
                </div>
                <select value={col.character} onChange={e=>updateTeam(cidx,{character:e.target.value,weapon:'',mainPictos:[null,null,null],subPictos:[]})}>
                  <option value="">--</option>
                  {characters.map(ch=>(<option key={ch} value={ch}>{ch}</option>))}
                </select>
                {col.character && <img className="char-img" src={`resources/images/characters/${col.character.toLowerCase()}.avif`} alt=""/>}
                <select value={col.weapon} onChange={e=>updateTeam(cidx,{weapon:e.target.value})}>
                  <option value="">--</option>
                  {charWeapons.map(w=>(<option key={w.name} value={w.name}>{w.name}</option>))}
                </select>
                {col.weapon && (()=>{const w=charWeapons.find(x=>x.name===col.weapon);return w?<div className="weapon-detail">{w.weapon_effect}</div>:null;})()}
                <div className="mains">
                  {col.mainPictos.map((pid,pidx)=>(
                    <div key={pidx}>
                      <select value={pid||''} onChange={e=>changeMain(cidx,pidx,e.target.value)}>
                        <option value="">--</option>
                        {availablePictos.map(p=>(<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                      {pid && (()=>{const p=pictos.find(pc=>pc.id===pid);return p?<div className="picto-detail">{Object.entries(p.bonus_picto||{}).map(([k,v])=>`${t(k)}:${v}`).join(' | ')}{p.bonus_lumina?` - ${p.bonus_lumina}`:''}</div>:null;})()}
                    </div>
                  ))}
                </div>
                <select multiple value={col.subPictos} onChange={e=>changeSubs(cidx,Array.from(e.target.selectedOptions).map(o=>o.value))}>
                  {pictos.filter(p=>!col.subPictos.includes(p.id)).map(p=>(<option key={p.id} value={p.id}>{p.name}</option>))}
                </select>
                <div className="subs">
                  {col.subPictos.map(id=>{const p=pictos.find(pc=>pc.id===id);return p?<div key={id}>{p.name}: {p.bonus_lumina||''}</div>:null;})}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}

function NotFound(){
  useEffect(() => {
    document.body.dataset.page="404";
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();
  }, []);
  return (
    <main className="content-wrapper mt-4 flex-grow-1">
      <h1>404 - Not Found</h1>
    </main>
  );
}

function App(){
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/index" replace />} />
        <Route path="/index" element={<Home />} />
        <Route path="/pictos" element={<PictosPage />} />
        <Route path="/weapons" element={<WeaponsPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
if(window.bindLangEvents) window.bindLangEvents();
if(window.applyTranslations) window.applyTranslations();
if(window.updateFlagState) window.updateFlagState();
});
