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
  const [modal,setModal]=useState(null);

  useEffect(()=>{
    document.body.dataset.page='build';
    fetch(`data/armes-dictionnary_${currentLang}.json`).then(r=>r.json()).then(d=>setWeapons(d));
    fetch(`data/picto-dictionnary_${currentLang}.json`).then(r=>r.json()).then(d=>setPictos(d));
    const params=new URLSearchParams(window.location.search);
    const d=params.get('data');
    if(d){
      try{
        const obj=JSON.parse(atob(d));
        if(Array.isArray(obj)&&obj.length===5) setTeam(obj);
      }catch(e){/* ignore */}
    }
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
      const nt=t.map((c,i)=>({...c,mainPictos:[...c.mainPictos],subPictos:[...c.subPictos]}));
      nt[idx].mainPictos[pidx]=val||null;
      // remove duplicate main pictos for this character
      nt[idx].mainPictos=nt[idx].mainPictos.map((p,i)=>i!==pidx&&p===val?null:p);
      // remove from subs if selected there
      nt[idx].subPictos=nt[idx].subPictos.filter(s=>s!==val);
      // enforce unique across team
      for(let i=0;i<nt.length;i++) if(i!==idx){
        nt[i].mainPictos=nt[i].mainPictos.map(p=>p===val?null:p);
      }
      return nt;
    });
  }

  function changeSubs(idx,vals){
    setTeam(t=>t.map((c,i)=>{
      if(i!==idx) return c;
      const filtered=[...new Set(vals.filter(v=>!c.mainPictos.includes(v)))];
      return {...c,subPictos:filtered};
    }));
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

  function SelectionModal(){
    if(!modal) return null;
    const {options,onSelect,multi,values}=modal;
    const [local,setLocal]=React.useState(multi?values.slice():values||'');
    function apply(){ onSelect(local); setModal(null); }
    return (
      <div className="modal" onClick={()=>setModal(null)} id="modalSelect">
        <div className="modal-content" onClick={e=>e.stopPropagation()}>
          {multi ? (
            <>
              {options.map(o=>(
                <label key={o.value} className="modal-option">
                  <input type="checkbox" checked={local.includes(o.value)} onChange={e=>{
                    const v=o.value;
                    setLocal(l=>e.target.checked?[...l,v]:l.filter(x=>x!==v));
                  }}/>
                  {o.label}
                </label>
              ))}
              <div style={{marginTop:'10px',textAlign:'right'}}>
                <button className="btn btn-primary" onClick={apply}>{t('save')}</button>
              </div>
            </>
          ) : (
            options.map(o=>(
              <div key={o.value} className="modal-option" onClick={()=>{onSelect(o.value); setModal(null);}}>{o.label}</div>
            ))
          )}
        </div>
      </div>
    );
  }

  const usedChars=new Set(team.map(t=>t.character).filter(Boolean));

  function openCharModal(idx){
    const opts=characters.filter(ch=>!usedChars.has(ch)||ch===team[idx].character).map(ch=>({value:ch,label:ch}));
    setModal({options:opts,onSelect:val=>updateTeam(idx,{character:val,weapon:'',mainPictos:[null,null,null],subPictos:[]})});
  }
  function openWeaponModal(idx){
    const char=team[idx].character;
    const opts=weapons.filter(w=>w.character===char).map(w=>({value:w.name,label:w.name}));
    setModal({options:opts,onSelect:val=>updateTeam(idx,{weapon:val})});
  }
  function openMainModal(idx,pidx){
    const existing=team[idx].mainPictos.filter((_,i)=>i!==pidx);
    const available=pictos
      .filter(p=>(!usedMain.has(p.id) || team[idx].mainPictos.includes(p.id)) && !existing.includes(p.id))
      .map(p=>({value:p.id,label:p.name}));
    setModal({options:available,onSelect:val=>changeMain(idx,pidx,val)});
  }
  function openSubsModal(idx){
    const disallowed=team[idx].mainPictos.filter(Boolean);
    const opts=pictos
      .filter(p=>!disallowed.includes(p.id))
      .map(p=>({value:p.id,label:p.name}));
    setModal({options:opts,onSelect:vals=>changeSubs(idx,vals),multi:true,values:team[idx].subPictos});
  }

  function copyShare(){
    const data=btoa(JSON.stringify(team));
    const url=`${window.location.origin}/build?data=${encodeURIComponent(data)}`;
    navigator.clipboard.writeText(url).then(()=>alert(t('link_copied')));
  }

  return (
    <>
      <main className="content-wrapper mt-4 flex-grow-1">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h1 data-i18n="heading_build">Team builder</h1>
          <button className="icon-btn" onClick={copyShare} data-i18n-title="share" title="Share"><i className="fa-solid fa-share-nodes"></i></button>
        </div>
        <div className="team-builder">
          {team.map((col,cidx)=>{
            const stats=computeStats(col.mainPictos.filter(Boolean));
            const charWeapons=weapons.filter(w=>w.character===col.character);
            const w=charWeapons.find(x=>x.name===col.weapon);
            const buffs=w?.damage_buff||[];
            return (
              <div className="build-col" key={cidx}>
                <div className="stats">
                  <div>{t('defense')}: {stats.def}</div>
                  <div>{t('speed')}: {stats.speed}</div>
                  <div>{t('critical-luck')}: {stats.crit}</div>
                  <div>{t('health')}: {stats.health}</div>
                  {buffs.length>0&&<div>{t('damage_buff')}: {buffs.map(b=>t(b)).join(', ')}</div>}
                </div>
                <span className="select-btn" onClick={()=>openCharModal(cidx)}>{col.character||t('choose_character')}</span>
                {col.character && <img className="char-img" src={`resources/images/characters/${col.character.toLowerCase()}.avif`} alt=""/>}
                <span className="select-btn" onClick={()=>openWeaponModal(cidx)}>{col.weapon||t('choose_weapon')}</span>
                {w && <div className="weapon-detail">{w.weapon_effect}</div>}
                <div className="mains">
                  {col.mainPictos.map((pid,pidx)=>(
                    <div key={pidx}>
                      <span className="select-btn" onClick={()=>openMainModal(cidx,pidx)}>{pid? pictos.find(pc=>pc.id===pid)?.name : t('choose_picto',{num:pidx+1})}</span>
                      {pid && (()=>{const p=pictos.find(pc=>pc.id===pid);return p?<div className="picto-detail">{Object.entries(p.bonus_picto||{}).map(([k,v])=>`${t(k)}:${v}`).join(' | ')}{p.bonus_lumina?` - ${p.bonus_lumina}`:''}</div>:null;})()}
                    </div>
                  ))}
                </div>
                <span className="select-btn" onClick={()=>openSubsModal(cidx)}>{t('choose_luminas')}</span>
                <div className="subs">
                  {col.subPictos.map(id=>{const p=pictos.find(pc=>pc.id===id);return p?<div key={id}>{p.name}: {p.bonus_lumina||''}</div>:null;})}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <SelectionModal />
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
