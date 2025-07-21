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
          <p data-i18n="index_desc2">Track your entire arsenal. Each weapon sheet shows who can wield it and the effects it grants so you never miss a piece of equipment.</p>
        </div>
        <div className="index-img">
          <img src="resources/images/index/index_cadre_weapons.png" alt=""/>
        </div>
      </div>
      <div className="index-row">
        <div className="index-desc">
          <p data-i18n="index_desc3">Build your team composition and share it with a link.</p>
        </div>
        <div className="index-img">
          <img src="resources/images/index/index_cadre_teambuilder.png" alt=""/>
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
  const apiUrl = window.CONFIG?.["clairobscur-api-url"] || '';

  useEffect(()=>{
    document.body.dataset.page='build';
    fetch(`data/armes-dictionnary_${currentLang}.json`).then(r=>r.json()).then(d=>setWeapons(d));
    fetch(`data/picto-dictionnary_${currentLang}.json`).then(r=>r.json()).then(d=>setPictos(d));
    const params=new URLSearchParams(window.location.search);
    const ref=params.get('refBuild');
    const d=params.get('data');
    if(ref && apiUrl){
      apiFetch(`${apiUrl}/public/builds/${encodeURIComponent(ref)}`)
        .then(r=>r.ok?r.json():Promise.reject())
        .then(obj=>{ if(Array.isArray(obj)&&obj.length===5) setTeam(obj); })
        .catch(()=>{});
    }else if(d){
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
      const oldLocked=t[idx].mainPictos.filter(Boolean);
      nt[idx].mainPictos[pidx]=val||null;
      // remove duplicate main pictos for this character
      nt[idx].mainPictos=nt[idx].mainPictos.map((p,i)=>i!==pidx&&p===val?null:p);
      const locked=nt[idx].mainPictos.filter(Boolean);
      // sync locked luminas, removing those unlocked
      nt[idx].subPictos=[
        ...locked,
        ...nt[idx].subPictos.filter(s=>!oldLocked.includes(s) && !locked.includes(s))
      ];
      // enforce unique across team
      if(val){
        for(let i=0;i<nt.length;i++) if(i!==idx){
          nt[i].mainPictos = nt[i].mainPictos.map(p => (p === val ? null : p));
          nt[i].subPictos = nt[i].subPictos.filter(s => s !== val);
        }
      }
      return nt;
    });
  }

  function changeSubs(idx, vals){
    setTeam(t =>
      t.map((c, i) => {
        if (i !== idx) return c;
        const locked = c.mainPictos.filter(Boolean);
        const filtered = [
          ...locked,
          ...new Set(vals.filter(v => locked.indexOf(v) === -1))
        ];
        return { ...c, subPictos: filtered };
      })
    );
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
    const {options,onSelect,multi,values,search}=modal;
    const [local,setLocal]=React.useState(multi?values.slice():values||'');
    const [term,setTerm]=React.useState('');
    const list=search?options.filter(o=>{
      const txt=(o.label+ (o.desc? ' '+o.desc : '')).toLowerCase();
      return txt.includes(term.toLowerCase());
    }):options;
    function apply(){ onSelect(local); setModal(null); }
    return (
      <div className="modal" onClick={()=>setModal(null)} id="modalSelect">
        <div className="modal-content" onClick={e=>e.stopPropagation()}>
          {search && (
            <input
              className="searchbar modal-filter"
              style={{width:'100%'}}
              placeholder={t('filter_placeholder')}
              value={term}
              onChange={e=>setTerm(e.target.value)}
            />
          )}
          {multi ? (
            <>
              <div className="modal-options">
                {list.map(o => (
                  <label key={o.value} className="modal-option">
                    <input
                      type="checkbox"
                      disabled={o.disabled}
                      checked={local.includes(o.value)}
                      onChange={e => {
                        const v = o.value;
                        setLocal(l =>
                          e.target.checked ? [...l, v] : l.filter(x => x !== v)
                        );
                      }}
                    />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
              <div className="modal-actions">
                <button className="modal-save-btn" onClick={apply}>
                  {t('save')}
                </button>
              </div>
            </>
          ) : (
            <div className="modal-options">
              {list.map(o => (
                <div
                  key={o.value}
                  className="modal-option"
                  onClick={() => {
                    onSelect(o.value);
                    setModal(null);
                  }}
                >
                  {o.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const usedChars=new Set(team.map(t=>t.character).filter(Boolean));

  function openCharModal(idx){
    let opts=characters.filter(ch=>!usedChars.has(ch)||ch===team[idx].character);
    const hasGustave=team.some((t,i)=>t.character==='Gustave' && i!==idx);
    const hasVerso=team.some((t,i)=>t.character==='Verso' && i!==idx);
    if(hasGustave) opts=opts.filter(ch=>ch!=='Verso');
    if(hasVerso) opts=opts.filter(ch=>ch!=='Gustave');
    opts=opts.map(ch=>({value:ch,label:ch}));
    setModal({options:opts,onSelect:val=>updateTeam(idx,{character:val,weapon:'',mainPictos:[null,null,null],subPictos:[]})});
  }
  function openWeaponModal(idx){
    const char=team[idx].character;
    const opts=weapons.filter(w=>w.character===char).map(w=>({value:w.name,label:w.name}));
    setModal({options:opts,onSelect:val=>updateTeam(idx,{weapon:val})});
  }
  function openMainModal(idx,pidx){
    const existing=team[idx].mainPictos.filter((_,i)=>i!==pidx);
    const available = pictos
      .filter(
        p =>
          (!usedMain.has(p.id) || team[idx].mainPictos.includes(p.id)) &&
          !existing.includes(p.id)
      )
      .map(p => ({ value: p.id, label: p.name }));
    setModal({
      options: available,
      onSelect: val => changeMain(idx, pidx, val),
      search: true
    });
  }
  function openSubsModal(idx){
    const locked = team[idx].mainPictos.filter(Boolean);
    const opts = [
      ...locked.map(id => {
        const p = pictos.find(p => p.id === id);
        return {
          value: id,
          label: p?.name || id,
          desc: p?.bonus_lumina || '',
          disabled: true
        };
      }),
      ...pictos
        .filter(p => !locked.includes(p.id))
        .map(p => ({ value: p.id, label: p.name, desc: p.bonus_lumina }))
    ];
    const baseValues = [...new Set([...team[idx].subPictos, ...locked])];
    setModal({
      options: opts,
      onSelect: vals => changeSubs(idx, vals),
      multi: true,
      values: baseValues,
      search: true
    });
  }

  function countAvailableSubs(idx){
    const locked = team[idx].mainPictos.filter(Boolean);
    return locked.length + pictos.filter(p => !locked.includes(p.id)).length;
  }

  function copyShare(){
    if(!apiUrl) return;
    apiFetch(`${apiUrl}/public/builds`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(team)
    })
      .then(r=>r.json())
      .then(({id})=>{
        if(!id) throw new Error('no id');
        const url=`${window.location.origin}/build?refBuild=${encodeURIComponent(id)}`;
        navigator.clipboard.writeText(url).then(()=>alert(t('link_copied')));
      })
      .catch(()=>{});
  }

  return (
    <>
      <main className="content-wrapper mt-4 flex-grow-1">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <h1 data-i18n="heading_build">Team builder</h1>
          <button className="icon-btn" onClick={copyShare} data-i18n-title="share" title="Share"><i className="fa-solid fa-share-nodes"></i></button>
        </div>
        <div className="team-builder">
          <div className="main-team">
            <h2 className="team-title" data-i18n="main_team">{t('main_team')}</h2>
            {team.slice(0,3).map((col,cidx)=>{
              const stats=computeStats(col.mainPictos.filter(Boolean));
              const charWeapons=weapons.filter(w=>w.character===col.character);
              const w=charWeapons.find(x=>x.name===col.weapon);
              const buffs=w?.damage_buff||[];
              return (
              <div className="build-col" key={cidx}>
                <div className="char-head">
                  {col.character
                    ? <img className="char-img" src={`resources/images/characters/${col.character.toLowerCase()}.avif`} alt="" onClick={()=>openCharModal(cidx)}/>
                    : <div className="char-add" onClick={()=>openCharModal(cidx)}>+</div>}
                  <div className="weapon-box">
                    {col.weapon
                      ? <span className="weapon-name" onClick={()=>openWeaponModal(cidx)}>{col.weapon}</span>
                      : <div className="weapon-add" onClick={()=>openWeaponModal(cidx)}>Arme</div>}
                    <div className="weapon-buff">
                      {w ? (buffs.length>0 ? `${t('damage_buff')}: ${buffs.map(b=>t(b)).join(', ')}` : '') : t('no_weapon')}
                    </div>
                  </div>
                </div>
                <div className="stats">
                  <div>{t('defense')}: {stats.def}</div>
                  <div>{t('speed')}: {stats.speed}</div>
                  <div>{t('critical-luck')}: {stats.crit}</div>
                  <div>{t('health')}: {stats.health}</div>
                </div>
                {w && <div className="weapon-detail">{w.weapon_effect}</div>}
                <div className="bottom-controls">
                  <div className="mains">
                    {col.mainPictos.map((pid,pidx)=>(
                      <div key={pidx}>
                        {pid
                          ? <span className="picto-name" onClick={()=>openMainModal(cidx,pidx)}>{pictos.find(pc=>pc.id===pid)?.name}</span>
                          : <div className="picto-add" onClick={()=>openMainModal(cidx,pidx)}>Picto</div>}
                      </div>
                    ))}
                  </div>
                  <span
                    className="lumina-trigger"
                    onClick={() => openSubsModal(cidx)}
                  >
                    {t('luminas_label')}: {col.subPictos.length} / {countAvailableSubs(cidx)}
                  </span>
                </div>
              </div>
              );
            })}
          </div>
          <div className="secondary-team">
            <h2 className="team-title" data-i18n="secondary_team">{t('secondary_team')}</h2>
            {team.slice(3).map((col,cidx)=>{
              const stats=computeStats(col.mainPictos.filter(Boolean));
              const charWeapons=weapons.filter(w=>w.character===col.character);
              const w=charWeapons.find(x=>x.name===col.weapon);
              const buffs=w?.damage_buff||[];
              const idx=cidx+3;
              return (
                <div className="build-col" key={idx}>
                  <div className="char-head">
                  {col.character
                      ? <img className="char-img" src={`resources/images/characters/${col.character.toLowerCase()}.avif`} alt="" onClick={()=>openCharModal(idx)}/>
                      : <div className="char-add" onClick={()=>openCharModal(idx)}>+</div>}
                    <div className="weapon-box">
                    {col.weapon
                      ? <span className="weapon-name" onClick={()=>openWeaponModal(idx)}>{col.weapon}</span>
                      : <div className="weapon-add" onClick={()=>openWeaponModal(idx)}>Arme</div>}
                    <div className="weapon-buff">
                      {w ? (buffs.length>0 ? `${t('damage_buff')}: ${buffs.map(b=>t(b)).join(', ')}` : '') : t('no_weapon')}
                    </div>
                    </div>
                  </div>
                  <div className="stats">
                    <div>{t('defense')}: {stats.def}</div>
                    <div>{t('speed')}: {stats.speed}</div>
                    <div>{t('critical-luck')}: {stats.crit}</div>
                    <div>{t('health')}: {stats.health}</div>
                  </div>
                  {w && <div className="weapon-detail">{w.weapon_effect}</div>}
                    <div className="bottom-controls">
                      <div className="mains">
                        {col.mainPictos.map((pid,pidx)=>(
                          <div key={pidx}>
                            {pid
                              ? <span className="picto-name" onClick={()=>openMainModal(idx,pidx)}>{pictos.find(pc=>pc.id===pid)?.name}</span>
                              : <div className="picto-add" onClick={()=>openMainModal(idx,pidx)}>Picto</div>}
                          </div>
                        ))}
                      </div>
                      <span
                        className="lumina-trigger"
                        onClick={() => openSubsModal(idx)}
                      >
                        {t('luminas_label')}: {col.subPictos.length} / {countAvailableSubs(idx)}
                      </span>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <SelectionModal />
    </>
  );
}

function AdminPage(){
  const api = window.CONFIG?.["clairobscur-api-url"] || '';
  const [characters, setCharacters] = React.useState([]);
  const [damageBuffTypes, setDamageBuffTypes] = React.useState([]);
  const [damageTypes, setDamageTypes] = React.useState([]);
  const [pictos, setPictos] = React.useState([]);
  const [weapons, setWeapons] = React.useState([]);
  const [tab, setTab] = React.useState(0);


  const loadData = () => {
    apiFetch(`${api}/public/data/${currentLang}`).then(r=>r.json()).then(data=>{
      const charRows = [];
      data.characters.forEach(c=>{
        (c.details||[{lang:'',name:'',story:''}]).forEach(d=>{
          charRows.push({idCharacter:c.idCharacter,lang:d.lang,name:d.name||'',story:d.story||''});
        });
      });
      setCharacters(charRows);

      const buffRows = [];
      data.damageBuffTypes.forEach(b=>{
        (b.details||[{lang:'',name:''}]).forEach(d=>{
          buffRows.push({idDamageBuffType:b.idDamageBuffType,lang:d.lang,name:d.name||''});
        });
      });
      setDamageBuffTypes(buffRows);

      const typeRows = [];
      data.damageTypes.forEach(t=>{
        (t.details||[{lang:'',name:''}]).forEach(d=>{
          typeRows.push({idDamageType:t.idDamageType,lang:d.lang,name:d.name||''});
        });
      });
      setDamageTypes(typeRows);

      const pictoRows = [];
      data.pictos.forEach(p=>{
        (p.details||[{lang:'',name:'',region:'',descrptionBonusLumina:'',unlockDescription:''}]).forEach(d=>{
          pictoRows.push({
            idPicto:p.idPicto,
            level:p.level,
            bonusDefense:p.bonusDefense,
            bonusSpeed:p.bonusSpeed,
            bonusCritChance:p.bonusCritChance,
            bonusHealth:p.bonusHealth,
            luminaCost:p.luminaCost,
            lang:d.lang,
            name:d.name||'',
            region:d.region||'',
            descrptionBonusLumina:d.descrptionBonusLumina||'',
            unlockDescription:d.unlockDescription||''
          });
        });
      });
      setPictos(pictoRows);

      const weaponRows = [];
      data.weapons.forEach(w=>{
        (w.details||[{lang:'',name:'',region:'',unlockDescription:'',weaponEffect1:'',weaponEffect2:'',weaponEffect3:''}]).forEach(d=>{
          weaponRows.push({
            idWeapon:w.idWeapon,
            character:w.character?.idCharacter||'',
            damageType:w.damageType?.idDamageType||'',
            damageBuffType1:w.damageBuffType1?.idDamageBuffType||'',
            damageBuffType2:w.damageBuffType2?.idDamageBuffType||'',
            lang:d.lang,
            name:d.name||'',
            region:d.region||'',
            unlockDescription:d.unlockDescription||'',
            weaponEffect1:d.weaponEffect1||'',
            weaponEffect2:d.weaponEffect2||'',
            weaponEffect3:d.weaponEffect3||''
          });
        });
      });
      setWeapons(weaponRows);
    });
  };


  useEffect(()=>{
    document.body.dataset.page='admin';
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();

    window.adminPage = { loadData };
    loadData();
    return ()=>{ delete window.adminPage; };
  },[]);

  return (
    <>
      <img className="section-frame frame-top" src="resources/images/general/frame_horizontal.png" alt=""/>
      <img className="section-separator separator-top" src="resources/images/general/separator_horizontal.png" alt=""/>
      <main className="content-wrapper mt-4 flex-grow-1">
        <h1 data-i18n="heading_admin">Administration</h1>
        <div className="admin-tabs-nav">
          <button className={tab===0?'active':''} data-i18n="admin_base" onClick={()=>setTab(0)}>Base</button>
          <button className={tab===1?'active':''} data-i18n="admin_pictos" onClick={()=>setTab(1)}>Pictos</button>
          <button className={tab===2?'active':''} data-i18n="admin_weapons" onClick={()=>setTab(2)}>Weapons</button>
        </div>

        <div className={"admin-tab-pane"+(tab===0?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_base">Gérer les données de base</h2>
          <div className="admin-row base-row">
            <UIGrid columns={[
              {field:'idCharacter',header:'ID'},
              {field:'lang',header:'Lang'},
              {field:'name',header:'Name'},
              {field:'story',header:'Story', width:150}
            ]} rows={characters} setRows={setCharacters} endpoint="/admin/characters" idField="idCharacter" />
            <UIGrid columns={[
              {field:'idDamageBuffType',header:'ID'},
              {field:'lang',header:'Lang'},
              {field:'name',header:'Name'}
            ]} rows={damageBuffTypes} setRows={setDamageBuffTypes} endpoint="/admin/damagebufftypes" idField="idDamageBuffType" />
            <UIGrid columns={[
              {field:'idDamageType',header:'ID'},
              {field:'lang',header:'Lang'},
              {field:'name',header:'Name'}
            ]} rows={damageTypes} setRows={setDamageTypes} endpoint="/admin/damagetypes" idField="idDamageType" />
          </div>
        </div>

        <div className={"admin-tab-pane"+(tab===1?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_pictos">Pictos</h2>
          <div className="admin-row">
            <UIGrid
              columns={[
                {field:'idPicto',header:'ID'},
                {field:'level',header:'Level'},
                {field:'bonusDefense',header:'Def'},
                {field:'bonusSpeed',header:'Speed'},
                {field:'bonusCritChance',header:'Crit%'},
                {field:'bonusHealth',header:'HP'},
                {field:'luminaCost',header:'Lumina'},
                {field:'lang',header:'Lang'},
                {field:'name',header:'Name'},
                {field:'region',header:'Region'},
                {field:'descrptionBonusLumina',header:'Effect', width:150},
                {field:'unlockDescription',header:'Unlock', width:150}
              ]}
              rows={pictos}
              setRows={setPictos}
              endpoint="/admin/pictos"
              idField="idPicto"
            />
          </div>
        </div>

        <div className={"admin-tab-pane"+(tab===2?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_weapons">Weapons</h2>
          <div className="admin-row">
            <UIGrid
              columns={[
                {field:'idWeapon',header:'ID'},
                {field:'character',header:'Char'},
                {field:'damageType',header:'Type'},
                {field:'damageBuffType1',header:'Buff1'},
                {field:'damageBuffType2',header:'Buff2'},
                {field:'lang',header:'Lang'},
                {field:'name',header:'Name'},
                {field:'region',header:'Region'},
                {field:'unlockDescription',header:'Unlock', width:150},
                {field:'weaponEffect1',header:'Effect1', width:150},
                {field:'weaponEffect2',header:'Effect2', width:150},
                {field:'weaponEffect3',header:'Effect3', width:150}
              ]}
              rows={weapons}
              setRows={setWeapons}
              endpoint="/admin/weapons"
              idField="idWeapon"
            />
          </div>
        </div>
      </main>
      <img className="section-frame frame-bottom" src="resources/images/general/frame_horizontal.png" alt=""/>
      <img className="section-separator separator-bottom" src="resources/images/general/separator_horizontal.png" alt=""/>
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
      <div className="d-flex flex-column align-items-center">
        <img src="resources/images/general/404.png" alt="Merchant backpack" className="not-found-img mb-3"/>
        <p className="lead text-center">Oops...</p>
      </div>
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
        <Route path="/admin" element={<AdminPage />} />
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
