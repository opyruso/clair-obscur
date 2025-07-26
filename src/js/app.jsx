document.addEventListener('DOMContentLoaded', () => {
const {useEffect, useState} = React;
const {BrowserRouter, Routes, Route, Navigate, useParams} = ReactRouterDOM;
const { ToastContainer } = ReactToastify;

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
          <p data-i18n="index_desc3">Customize your look by keeping track of all unlocked outfits.</p>
        </div>
        <div className="index-img">
          <img src="resources/images/index/index_cadre_weapons.png" alt=""/>
        </div>
      </div>
      <div className="index-row">
        <div className="index-desc">
          <p data-i18n="index_desc4">Build your team composition and share it with a link.</p>
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
        </div>
        <div id="cards" className="cards"></div>
        <div id="table" className="table-view" style={{display:'none'}}></div>
        <div id="modal" className="modal" style={{display:'none'}}><div className="modal-content"></div></div>
        <div id="notificationContainer" className="notification-container"></div>
      </main>
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
        </div>
        <div id="cards" className="cards"></div>
        <div id="table" className="table-view" style={{display:'none'}}></div>
        <div id="notificationContainer" className="notification-container"></div>
      </main>
    </>
  );
}

function OutfitsPage(){
  useEffect(() => {
    document.body.dataset.page="outfits";
    if(window.outfitsPage?.initPage) window.outfitsPage.initPage();
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();
  }, []);
  return (
    <>
      <main className="content-wrapper mt-4 flex-grow-1">
        <h1 data-i18n="heading_outfits">Outfits inventory</h1>
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
        </div>
        <div id="cards" className="cards"></div>
        <div id="table" className="table-view" style={{display:'none'}}></div>
        <div id="notificationContainer" className="notification-container"></div>
      </main>
    </>
  );
}

function RadarChart({values,buffs}){
  const count = values.length;
  const max = 99;
  const center = 50;
  const radius = 40;
  const angleStep = (Math.PI*2)/count;
  const pts = values.map((v,i)=>{
    const a = -Math.PI/2 + i*angleStep;
    const r = radius * (v/max);
    const x = center + Math.cos(a)*r;
    const y = center + Math.sin(a)*r;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox="-10 -10 120 120" className="radar-chart">
      <polygon points={pts} fill="rgba(0,128,255,0.4)" stroke="#0af" />
      {values.map((v,i)=>{ 
        const a = -Math.PI/2 + i*angleStep; 
        const x = center + Math.cos(a)*(radius+6); 
        const y = center + Math.sin(a)*(radius+6); 
        const grade = buffs[0]===(i+1)?'S':buffs[1]===(i+1)?'A':''; 
        const label = t('damage_buff_type_'+(i+1));
        return (
          <text key={i} x={x} y={y} fontSize="6" fill="#fff" textAnchor="middle" dominantBaseline="middle">
            <tspan x={x} dy="-4">{label}</tspan>
            <tspan x={x} dy="6">{v}{grade?` ${grade}`:''}</tspan>
          </text>
        );
      })}
    </svg>
  );
}

function BuildPage(){
  const routerParams = useParams();
  const defaultCharacters=['Gustave','Maelle','Lune','Sciel','Verso','Monoco'];
  const defaultCharIds=Object.fromEntries(defaultCharacters.map((c,i)=>[c,i+1]));
  const [charNames,setCharNames]=useState(defaultCharacters);
  const [charIds,setCharIds]=useState(defaultCharIds);
  const charNamesMap = React.useMemo(
    () => Object.fromEntries(Object.entries(charIds).map(([name,id])=>[id,name])),
    [charIds]
  );
  const [weapons,setWeapons]=useState([]);
  const [pictos,setPictos]=useState([]);
  const [capacities,setCapacities]=useState([]);
  const [team,setTeam]=useState(
    Array.from({length:5},()=>({
      character:'',
      weapon:'',
      buffStats:[0,0,0,0,0],
      mainPictos:[null,null,null],
      subPictos:[]
    }))
  );
  const [lang,setLang]=useState(currentLang);
  const [modal,setModal]=useState(null);
  const [capModal,setCapModal]=useState(null);
  const apiUrl = window.CONFIG?.["clairobscur-api-url"] || '';

  function mapPictos(list){
    return list.map(p=>({
      id:p.idPicto,
      name:p.name||'',
      region:p.region||'',
      level:p.level,
      luminaCost:p.luminaCost,
      bonus_picto:{
        defense:p.bonusDefense,
        speed:p.bonusSpeed,
        'critical-luck':p.bonusCritChance,
        health:p.bonusHealth
      },
      bonus_lumina:p.descrptionBonusLumina||'',
      unlock_description:p.unlockDescription||''
    })).sort((a,b)=>a.name.localeCompare(b.name,currentLang,{sensitivity:'base'}));
  }

  function mapWeapons(list){
    return list.map(w=>{
      const effect=[w.weaponEffect1,w.weaponEffect2,w.weaponEffect3]
        .filter(Boolean).join(' ');
      return {
        id:w.idWeapon,
        charId:w.character||0,
        character:charNamesMap[w.character]||'',
        name:w.name||'',
        region:w.region||'',
        unlock_description:w.unlockDescription||null,
        damage_type:w.damageType||'',
        weapon_effect:effect,
        damage_buff:[w.damageBuffType1,w.damageBuffType2].filter(Boolean)
      };
    });
  }

  function mapCapacities(list){
    return list.map(c=>({
      id:c.idCapacity,
      character:c.character||0,
      name:c.name||'',
      posX:c.gridPositionX,
      posY:c.gridPositionY
    }));
  }

  useEffect(()=>{
    document.body.dataset.page='build';
    const loadData=()=>{
      getSiteData().then(d=>{
        setWeapons(mapWeapons(d.weapons||[]));
        setPictos(mapPictos(d.pictos||[]));
        setCapacities(mapCapacities(d.capacities||[]));
        let names=[]; let ids={};
        (d.characters||[]).forEach(c=>{
          const nm=c.name||'';
          if(nm){ names.push(nm); ids[nm]=c.idCharacter; }
        });
        if(names.length===0){ names=defaultCharacters.slice(); ids=defaultCharIds; }
        setCharNames(names);
        setCharIds(ids);
      });
    };
    loadData();
    const params=new URLSearchParams(window.location.search);
    const refQuery=params.get('refBuild');
    const refPath=routerParams.refId;
    const d=params.get('data');
    const ref=refPath || refQuery;
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

    const handleLang=()=>{ setLang(currentLang); loadData(); };
    window.addEventListener('langchange', handleLang);
    return ()=>{ window.removeEventListener('langchange', handleLang); };
  },[]);
  useEffect(()=>{ document.title=t('build_title'); },[team,pictos,lang]);

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

  function changeBuffStat(idx, bidx, val){
    val = parseInt(val) || 0;
    if(val < 0) val = 0;
    if(val > 99) val = 99;
    setTeam(t => t.map((c,i)=>{
      if(i!==idx) return c;
      const arr = c.buffStats.slice();
      arr[bidx]=val;
      const total = arr.reduce((a,b)=>a+b,0);
      if(total>297){
        arr[bidx]-=(total-297);
        if(arr[bidx]<0) arr[bidx]=0;
      }
      return {...c, buffStats: arr};
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

  function computeLuminaCost(ids){
    let sum = 0;
    ids.forEach(id => {
      const p = pictos.find(pc => pc.id === id);
      if(p && p.luminaCost){
        sum += p.luminaCost;
      }
    });
    return sum;
  }

  function SelectionModal(){
    if(!modal) return null;
    const {options,onSelect,multi,values,search,grid,hideCheck}=modal;
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
              <div className={`modal-options${grid?' grid':''}`}>
                {list.map(o => (
                  <label key={o.value} className={`modal-option${grid?' grid':''}${hideCheck?' hide-check':''}`}>
                    {o.icon && <img src={o.icon} alt="" />}
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
            <div className={`modal-options${grid?' grid':''}`}>
              {list.map(o => (
                <div
                  key={o.value}
                  className={`modal-option${grid?' grid':''}${hideCheck?' hide-check':''}`}
                  onClick={() => {
                    onSelect(o.value);
                    setModal(null);
                  }}
                >
                  {o.icon && <img src={o.icon} alt="" />}
                  <span>{o.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function CapacityModal(){
    if(!capModal) return null;
    const {character,charId}=capModal;
    const caps=capacities.filter(c=>c.character===charId);
    const isAdmin=window.keycloak?.hasResourceRole?.('admin','coh-app');
    const [edit,setEdit]=React.useState(false);
    const [zone,setZone]=React.useState(null); // confirmed selection {x,y}
    const [hover,setHover]=React.useState(null); // preview following cursor
    const imgRef=React.useRef(null);
    const [scale,setScale]=React.useState(1);
    const [offset,setOffset]=React.useState({x:0,y:0});
    const treeImg=`resources/images/capacity_tree/${character.toLowerCase()}_tree.png`;
    const FRAME=119;

    function close(){ setCapModal(null); setZone(null); setHover(null); }

    const updateScale=React.useCallback(()=>{
      if(imgRef.current && imgRef.current.naturalWidth){
        setScale(imgRef.current.clientWidth/imgRef.current.naturalWidth);
        setOffset({x:imgRef.current.offsetLeft,y:imgRef.current.offsetTop});
        if(!zone) setHover(null);
      }
    },[zone]);

    React.useEffect(()=>{
      updateScale();
      window.addEventListener('resize',updateScale);
      return ()=>window.removeEventListener('resize',updateScale);
    },[updateScale]);

    function calcPos(e){
      const img=e.currentTarget;
      const rect=img.getBoundingClientRect();
      const sc=rect.width/img.naturalWidth;
      const sx=e.clientX-rect.left;
      const sy=e.clientY-rect.top;
      const x=Math.round(sx/sc);
      const y=Math.round(sy/sc);
      return {x,y,scale:sc};
    }

    function handleMove(e){
      const pos = calcPos(e);
      if(edit){
        if(zone) return;
        setHover({x:pos.x,y:pos.y});
      }else{
        const cap=caps.find(c=>pos.x>=c.posX && pos.x<=c.posX+FRAME && pos.y>=c.posY && pos.y<=c.posY+FRAME);
        if(cap){
          setHover({x:cap.posX,y:cap.posY});
        }else{
          setHover(null);
        }
      }
    }

    function handleLeave(){ if(!zone) setHover(null); }

    function handleClick(e){
      const pos=calcPos(e);
      if(edit){
        if(zone){
          const opts=caps.map(c=>({value:c.id,label:c.name}));
          setModal({options:opts,onSelect:id=>{
            const x=zone.x-FRAME;
            const y=zone.y-FRAME;
            setCapacities(cs=>cs.map(c=>c.id===id?{...c,posX:x,posY:y}:c));
            if(apiUrl) apiFetch(`${apiUrl}/admin/capacities/${id}`,{method:'PUT',body:{gridPositionX:x,gridPositionY:y}});
            setZone(null);
            setHover(null);
          }});
        }else{
          setZone({x:pos.x,y:pos.y});
        }
      }else{
        const cap=caps.find(c=>Math.abs(c.posX-pos.x)<60&&Math.abs(c.posY-pos.y)<60);
        if(cap) ReactToastify.toast(cap.name);
      }
    }

    const baseScale=scale;
    const disp=zone||hover;
    const showOutline=edit && disp;
    const showZoom=!edit && hover;
    const size=FRAME*baseScale;
    const zoomFactor=1.02;

    const outlineLeft = disp ? offset.x + disp.x*baseScale : 0;
    const outlineTop = disp ? offset.y + disp.y*baseScale : 0;

    return (
      <div className="modal" onClick={close} id="capModal">
        <div className="modal-content" onClick={e=>e.stopPropagation()} style={{position:'relative'}}>
          <img ref={imgRef} src={treeImg} alt="" onLoad={updateScale} onClick={handleClick} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{width:'100%'}} />
          {edit && caps.map(c=>(
            <div key={c.id} style={{position:'absolute',left:offset.x + c.posX*baseScale,top:offset.y + c.posY*baseScale,width:FRAME*baseScale,height:FRAME*baseScale,border:'1px solid rgba(255,255,255,0.4)',pointerEvents:'none'}}></div>
          ))}
          {showOutline && (
            <div style={{position:'absolute',left:outlineLeft,top:outlineTop,width:size,height:size,border:'2px dashed #fff',pointerEvents:'none',transform:'translate(-100%,-100%)'}}></div>
          )}
          {showZoom && (() => {
            const bgW = (imgRef.current?.clientWidth || 0) * zoomFactor;
            const bgH = (imgRef.current?.clientHeight || 0) * zoomFactor;
            const left = offset.x + hover.x*baseScale;
            const top = offset.y + hover.y*baseScale;
            const centerX = hover.x*baseScale + size/2;
            const centerY = hover.y*baseScale + size/2;
            const shiftX = bgW * 0.01;
            const shiftY = bgH * 0.01;
            const posX = size/2 - centerX * zoomFactor - shiftX;
            const posY = size/2 - centerY * zoomFactor - shiftY;
            return (
              <div style={{position:'absolute',left,top,width:size,height:size,pointerEvents:'none',background:`url(${treeImg}) no-repeat`,backgroundSize:`${bgW}px ${bgH}px`,backgroundPosition:`${posX}px ${posY}px`}}></div>
            );
          })()}
          {isAdmin && (
            <div style={{marginTop:'10px',textAlign:'center'}}>
              <label><input type="checkbox" checked={edit} onChange={e=>{setEdit(e.target.checked);setZone(null);setHover(null);}} /> {t('edit')}</label>
            </div>
          )}
        </div>
      </div>
    );
  }

  const usedChars=new Set(team.map(t=>t.character).filter(Boolean));

  function openCharModal(idx){
    let opts=charNames.filter(ch=>!usedChars.has(ch)||ch===team[idx].character);
    const hasGustave=team.some((t,i)=>t.character==='Gustave' && i!==idx);
    const hasVerso=team.some((t,i)=>t.character==='Verso' && i!==idx);
    if(hasGustave) opts=opts.filter(ch=>ch!=='Verso');
    if(hasVerso) opts=opts.filter(ch=>ch!=='Gustave');
    opts=opts.map(ch=>({value:ch,label:ch,icon:`resources/images/characters/${ch.toLowerCase()}_icon.png`}));
    setModal({options:opts,onSelect:val=>updateTeam(idx,{character:val,weapon:'',mainPictos:[null,null,null],subPictos:[]}),grid:true});
  }
  function openWeaponModal(idx){
    const char=team[idx].character;
    if(!char){
      ReactToastify.toast(t('select_character_first'));
      return;
    }
    const cid=charIds[char];
    const opts=weapons.filter(w=>w.charId===cid).map(w=>({value:w.name,label:w.name}));
    setModal({options:opts,onSelect:val=>updateTeam(idx,{weapon:val}),grid:true});
  }
  function openMainModal(idx,pidx){
    const existing=team[idx].mainPictos.filter((_,i)=>i!==pidx);
    const available = pictos
      .filter(
        p =>
          (!usedMain.has(p.id) || team[idx].mainPictos.includes(p.id)) &&
          !existing.includes(p.id)
      )
      .map(p => ({ value: p.id, label: p.name }))
      .sort((a, b) => a.label.localeCompare(b.label, currentLang, {sensitivity: 'base'}));
    setModal({
      options: available,
      onSelect: val => changeMain(idx, pidx, val),
      search: true,
      grid: true
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
    ].sort((a, b) => a.label.localeCompare(b.label, currentLang, {sensitivity: 'base'}));
    const baseValues = [...new Set([...team[idx].subPictos, ...locked])];
    setModal({
      options: opts,
      onSelect: vals => changeSubs(idx, vals),
      multi: true,
      values: baseValues,
      search: true,
      grid: true,
      hideCheck: true
    });
  }

  function openCapacityModal(idx){
    const char=team[idx].character;
    if(!char){ ReactToastify.toast(t('select_character_first')); return; }
    const cid=charIds[char];
    setCapModal({character:char,charId:cid});
  }

  function countAvailableSubs(idx){
    const locked = team[idx].mainPictos.filter(Boolean);
    return locked.length + pictos.filter(p => !locked.includes(p.id)).length;
  }

  function copyShare(){
    const shareBase=`${window.location.origin}/build`;
    const copyUrl=url=>navigator.clipboard
      .writeText(url)
      .then(()=>alert(t('link_copied')))
      .catch(()=>{});

    if(apiUrl){
      apiFetch(`${apiUrl}/public/builds`,{
        method:'POST',
        body:team
      })
        .then(r=>r.ok?r.json():Promise.reject())
        .then(({id})=>{
          if(!id) throw new Error('no id');
          const url=`${shareBase}/${encodeURIComponent(id)}`;
          copyUrl(url);
        })
        .catch(()=>{
          const data=`${shareBase}?data=${btoa(JSON.stringify(team))}`;
          copyUrl(data);
        });
    }else{
      const data=`${shareBase}?data=${btoa(JSON.stringify(team))}`;
      copyUrl(data);
    }
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
              const cost=computeLuminaCost(col.subPictos);
              const charWeapons=weapons.filter(w=>w.charId===charIds[col.character]);
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
                      {w ? (buffs.length>0 ? `${buffs.map(b=>t(b)).join(', ')}` : '') : t('no_weapon')}
                    </div>
                  </div>
                </div>
                {col.character && (
                  <div className="config-cap-link" onClick={()=>openCapacityModal(cidx)} data-i18n="config_capacities">{t('config_capacities')}</div>
                )}
                <div className="buff-chart">
                  <RadarChart values={col.buffStats} buffs={buffs} />
                </div>
                <div className="buff-row-title" data-i18n="attributes">{t('attributes')}</div>
                <div className="buff-stats-row">
                  <div className="buff-inputs">
                    {[1,2,3,4,5].map((id,i)=>(
                      <label key={id}>
                        {t('damage_buff_type_'+id)}:
                        <input type="number" min="0" max="99" value={col.buffStats[i]} onChange={e=>changeBuffStat(cidx,i,e.target.value)} />
                      </label>
                    ))}
                  </div>
                </div>
                <div className="stats">
                  <div>{t('defense')}: {stats.def}</div>
                  <div>{t('speed')}: {stats.speed}</div>
                  <div>{t('critical-luck')}: {stats.crit}</div>
                  <div>{t('health')}: {stats.health}</div>
                </div>
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
                  <div className="lumina-total">{t('lumina_total')}: {cost}</div>
                </div>
              </div>
              );
            })}
          </div>
          <div className="secondary-team">
            <h2 className="team-title" data-i18n="secondary_team">{t('secondary_team')}</h2>
            {team.slice(3).map((col,cidx)=>{
              const stats=computeStats(col.mainPictos.filter(Boolean));
              const cost=computeLuminaCost(col.subPictos);
              const charWeapons=weapons.filter(w=>w.charId===charIds[col.character]);
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
                      {w ? (buffs.length>0 ? `${buffs.map(b=>t(b)).join(', ')}` : '') : t('no_weapon')}
                    </div>
                    </div>
                  </div>
                  {col.character && (
                    <div className="config-cap-link" onClick={()=>openCapacityModal(idx)} data-i18n="config_capacities">{t('config_capacities')}</div>
                  )}
                  <div className="buff-chart">
                    <RadarChart values={col.buffStats} buffs={buffs} />
                  </div>
                  <div className="buff-row-title" data-i18n="attributes">{t('attributes')}</div>
                  <div className="buff-stats-row">
                    <div className="buff-inputs">
                      {[1,2,3,4,5].map((id,i)=>(
                        <label key={id}>
                          {t('damage_buff_type_'+id)}:
                          <input type="number" min="0" max="99" value={col.buffStats[i]} onChange={e=>changeBuffStat(idx,i,e.target.value)} />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="stats">
                    <div>{t('defense')}: {stats.def}</div>
                    <div>{t('speed')}: {stats.speed}</div>
                    <div>{t('critical-luck')}: {stats.crit}</div>
                    <div>{t('health')}: {stats.health}</div>
                  </div>
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
                      <div className="lumina-total">{t('lumina_total')}: {cost}</div>
                    </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <SelectionModal />
      <CapacityModal />
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
  const [outfits, setOutfits] = React.useState([]);
  const [capacityTypes, setCapacityTypes] = React.useState([]);
  const [capacities, setCapacities] = React.useState([]);
  const [tab, setTab] = React.useState(0);

  const langOptions = ['fr','en'];
  const charOptions = React.useMemo(() => {
    const map = new Map();
    characters.forEach(c => {
      if(!map.has(c.idCharacter)) map.set(c.idCharacter, c.name || c.idCharacter);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [characters]);
  const typeOptions = React.useMemo(() => {
    const map = new Map();
    damageTypes.forEach(t => {
      if(!map.has(t.idDamageType)) map.set(t.idDamageType, t.name || t.idDamageType);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [damageTypes]);
  const buffOptions = React.useMemo(() => {
    const map = new Map();
    damageBuffTypes.forEach(b => {
      if(!map.has(b.idDamageBuffType)) map.set(b.idDamageBuffType, b.name || b.idDamageBuffType);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [damageBuffTypes]);
  const capTypeOptions = React.useMemo(() => {
    const map = new Map();
    capacityTypes.forEach(ct => {
      if(!map.has(ct.idCapacityType)) map.set(ct.idCapacityType, ct.name || ct.idCapacityType);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [capacityTypes]);

  const charCols = React.useMemo(()=>[
    {field:'idCharacter',header:'ID', width:80},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', width:280},
    {field:'story',header:'Story', flex:1}
  ], []);

  const buffCols = React.useMemo(()=>[
    {field:'idDamageBuffType',header:'ID', width:80},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', flex:1}
  ], []);

  const typeCols = React.useMemo(()=>[
    {field:'idDamageType',header:'ID', width:80},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', flex:1}
  ], []);

  const pictoCols = React.useMemo(()=>[
    {field:'idPicto',header:'ID', width:80},
    {field:'level',header:'Level', width:80},
    {field:'bonusDefense',header:'Def', width:80},
    {field:'bonusSpeed',header:'Speed', width:80},
    {field:'bonusCritChance',header:'Crit%', width:80},
    {field:'bonusHealth',header:'HP', width:80},
    {field:'luminaCost',header:'Lumina', width:80},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', width:280},
    {field:'region',header:'Region', width:280},
    {field:'descrptionBonusLumina',header:'Effect', width:500},
    {field:'unlockDescription',header:'Unlock', flex:1}
  ], []);

  const weaponCols = React.useMemo(()=>[
    {field:'idWeapon',header:'ID', width:80},
    {field:'character',header:'Char', width:80, type:'singleSelect', options:charOptions},
    {field:'damageType',header:'Type', width:120, type:'singleSelect', options:typeOptions},
    {field:'damageBuffType1',header:'Buff1', width:120, type:'singleSelect', options:buffOptions},
    {field:'damageBuffType2',header:'Buff2', width:120, type:'singleSelect', options:buffOptions},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', width:280},
    {field:'region',header:'Region', width:280},
    {field:'unlockDescription',header:'Unlock', flex:1},
    {field:'weaponEffect1',header:'Effect1', width:280},
    {field:'weaponEffect2',header:'Effect2', width:280},
    {field:'weaponEffect3',header:'Effect3', width:280}
  ], [charOptions, typeOptions, buffOptions]);

  const outfitCols = React.useMemo(()=>[
    {field:'idOutfit',header:'ID', width:80},
    {field:'character',header:'Char', width:80, type:'singleSelect', options:charOptions},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', width:280},
    {field:'description',header:'Description', flex:1},
  ], [charOptions]);

  const capTypeCols = React.useMemo(()=>[
    {field:'idCapacityType',header:'ID', width:80},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', flex:1}
  ], []);

  const capCols = React.useMemo(()=>[
    {field:'idCapacity',header:'ID', width:80},
    {field:'character',header:'Char', width:80, type:'singleSelect', options:charOptions},
    {field:'damageType',header:'Type', width:120, type:'singleSelect', options:typeOptions},
    {field:'type',header:'CapType', width:120, type:'singleSelect', options:capTypeOptions},
    {field:'energyCost',header:'Energy', width:80},
    {field:'canBreak',header:'Break', width:80},
    {field:'isMultiTarget',header:'Multi', width:80},
    {field:'gridPositionX',header:'PosX', width:80},
    {field:'gridPositionY',header:'PosY', width:80},
    {field:'lang',header:'Lang', width:80, type:'singleSelect', options:langOptions},
    {field:'name',header:'Name', width:200},
    {field:'effectPrimary',header:'Primary', width:200},
    {field:'effectSecondary',header:'Secondary', width:200},
    {field:'bonusDescription',header:'Bonus', width:200},
    {field:'additionnalDescription',header:'More', flex:1}
  ], [charOptions, typeOptions, capTypeOptions]);


  const initRows = React.useCallback(data => {
    if(!data) return;

    const charRows = (data.characters || []).map(c => ({
      idCharacter:c.idCharacter,
      lang:c.lang || '',
      name:c.name || '',
      story:c.story || ''
    }));
    setCharacters(charRows);

    const buffRows = (data.damageBuffTypes || []).map(b => ({
      idDamageBuffType:b.idDamageBuffType,
      lang:b.lang || '',
      name:b.name || ''
    }));
    setDamageBuffTypes(buffRows);

    const typeRows = (data.damageTypes || []).map(t => ({
      idDamageType:t.idDamageType,
      lang:t.lang || '',
      name:t.name || ''
    }));
    setDamageTypes(typeRows);

    const capTypeRows = (data.capacityTypes || []).map(ct => ({
      idCapacityType:ct.idCapacityType,
      lang:ct.lang || '',
      name:ct.name || ''
    }));
    setCapacityTypes(capTypeRows);

    const capRows = (data.capacities || []).map(c => ({
      idCapacity:c.idCapacity,
      character:c.character || '',
      energyCost:c.energyCost,
      canBreak:c.canBreak,
      damageType:c.damageType || '',
      type:c.type || '',
      isMultiTarget:c.isMultiTarget,
      gridPositionX:c.gridPositionX,
      gridPositionY:c.gridPositionY,
      lang:c.lang || '',
      name:c.name || '',
      effectPrimary:c.effectPrimary || '',
      effectSecondary:c.effectSecondary || '',
      bonusDescription:c.bonusDescription || '',
      additionnalDescription:c.additionnalDescription || ''
    }));
    setCapacities(capRows);

    const pictoRows = (data.pictos || []).map(p => ({
      idPicto:p.idPicto,
      level:p.level,
      bonusDefense:p.bonusDefense,
      bonusSpeed:p.bonusSpeed,
      bonusCritChance:p.bonusCritChance,
      bonusHealth:p.bonusHealth,
      luminaCost:p.luminaCost,
      lang:p.lang || '',
      name:p.name || '',
      region:p.region || '',
      descrptionBonusLumina:p.descrptionBonusLumina || '',
      unlockDescription:p.unlockDescription || ''
    }));
    setPictos(pictoRows);

    const weaponRows = (data.weapons || []).map(w => ({
      idWeapon:w.idWeapon,
      character:w.character || '',
      damageType:w.damageType || '',
      damageBuffType1:w.damageBuffType1 || '',
      damageBuffType2:w.damageBuffType2 || '',
      lang:w.lang || '',
      name:w.name || '',
      region:w.region || '',
      unlockDescription:w.unlockDescription || '',
      weaponEffect1:w.weaponEffect1 || '',
      weaponEffect2:w.weaponEffect2 || '',
      weaponEffect3:w.weaponEffect3 || ''
    }));
    setWeapons(weaponRows);

    const outfitRows = (data.outfits || []).map(o => ({
      idOutfit:o.idOutfit,
      character:o.character || '',
      lang:o.lang || '',
      name:o.name || '',
      description:o.description || ''
    }));
    setOutfits(outfitRows);
  }, []);


  const loadData = () => {
    getSiteData().then(data => {
      initRows(data);
    });
  };


  useEffect(()=>{
    document.body.dataset.page='admin';
    if(window.bindLangEvents) window.bindLangEvents();
    if(window.applyTranslations) window.applyTranslations();
    if(window.updateFlagState) window.updateFlagState();

    window.adminPage = { loadData };
    if(window.siteData) initRows(window.siteData);
    loadData();
    return ()=>{ delete window.adminPage; };
  },[]);

  return (
    <>
      <main className="content-wrapper mt-4 flex-grow-1">
        <h1 data-i18n="heading_admin">Administration</h1>
        <div className="admin-tabs-nav">
          <button className={tab===0?'active':''} data-i18n="admin_characters" onClick={()=>setTab(0)}>Characters</button>
          <button className={tab===1?'active':''} data-i18n="admin_damage_buff_types" onClick={()=>setTab(1)}>Buff Types</button>
          <button className={tab===2?'active':''} data-i18n="admin_damage_types" onClick={()=>setTab(2)}>Damage Types</button>
          <button className={tab===3?'active':''} data-i18n="admin_outfits" onClick={()=>setTab(3)}>Outfits</button>
          <button className={tab===4?'active':''} data-i18n="admin_pictos" onClick={()=>setTab(4)}>Pictos</button>
          <button className={tab===5?'active':''} data-i18n="admin_weapons" onClick={()=>setTab(5)}>Weapons</button>
          <button className={tab===6?'active':''} data-i18n="admin_capacity_types" onClick={()=>setTab(6)}>Capacity Types</button>
          <button className={tab===7?'active':''} data-i18n="admin_capacities" onClick={()=>setTab(7)}>Capacities</button>
        </div>

        <div className={"admin-tab-pane"+(tab===0?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_characters">Characters</h2>
          {tab===0 && (
            <div className="admin-row">
              <UIGrid columns={charCols} rows={characters} setRows={setCharacters} endpoint="/admin/characters" idField="idCharacter" />
              <ImportBox columns={charCols} rows={characters} setRows={setCharacters} endpoint="/admin/characters" idField="idCharacter" label="characters" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===1?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_damage_buff_types">Damage Buff Types</h2>
          {tab===1 && (
            <div className="admin-row">
              <UIGrid columns={buffCols} rows={damageBuffTypes} setRows={setDamageBuffTypes} endpoint="/admin/damagebufftypes" idField="idDamageBuffType" />
              <ImportBox columns={buffCols} rows={damageBuffTypes} setRows={setDamageBuffTypes} endpoint="/admin/damagebufftypes" idField="idDamageBuffType" label="damagebufftypes" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===2?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_damage_types">Damage Types</h2>
          {tab===2 && (
            <div className="admin-row">
              <UIGrid columns={typeCols} rows={damageTypes} setRows={setDamageTypes} endpoint="/admin/damagetypes" idField="idDamageType" />
              <ImportBox columns={typeCols} rows={damageTypes} setRows={setDamageTypes} endpoint="/admin/damagetypes" idField="idDamageType" label="damagetypes" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===3?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_outfits">Outfits</h2>
          {tab===3 && (
            <div className="admin-row">
              <UIGrid columns={outfitCols} rows={outfits} setRows={setOutfits} endpoint="/admin/outfits" idField="idOutfit" />
              <ImportBox columns={outfitCols} rows={outfits} setRows={setOutfits} endpoint="/admin/outfits" idField="idOutfit" label="outfits" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===4?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_pictos">Pictos</h2>
          {tab===4 && (
            <div className="admin-row">
              <UIGrid columns={pictoCols} rows={pictos} setRows={setPictos} endpoint="/admin/pictos" idField="idPicto" />
              <ImportBox columns={pictoCols} rows={pictos} setRows={setPictos} endpoint="/admin/pictos" idField="idPicto" label="pictos" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===5?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_weapons">Weapons</h2>
          {tab===5 && (
            <div className="admin-row">
              <UIGrid columns={weaponCols} rows={weapons} setRows={setWeapons} endpoint="/admin/weapons" idField="idWeapon" />
              <ImportBox columns={weaponCols} rows={weapons} setRows={setWeapons} endpoint="/admin/weapons" idField="idWeapon" label="weapons" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===6?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_capacity_types">Capacity Types</h2>
          {tab===6 && (
            <div className="admin-row">
              <UIGrid columns={capTypeCols} rows={capacityTypes} setRows={setCapacityTypes} endpoint="/admin/capacitytypes" idField="idCapacityType" />
              <ImportBox columns={capTypeCols} rows={capacityTypes} setRows={setCapacityTypes} endpoint="/admin/capacitytypes" idField="idCapacityType" label="capacitytypes" />
            </div>
          )}
        </div>

        <div className={"admin-tab-pane"+(tab===7?" active":"")}>
          <h2 className="admin-section" data-i18n="admin_capacities">Capacities</h2>
          {tab===7 && (
            <div className="admin-row">
              <UIGrid columns={capCols} rows={capacities} setRows={setCapacities} endpoint="/admin/capacities" idField="idCapacity" />
              <ImportBox columns={capCols} rows={capacities} setRows={setCapacities} endpoint="/admin/capacities" idField="idCapacity" label="capacities" />
            </div>
          )}
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
        <Route path="/outfits" element={<OutfitsPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/build/:refId" element={<BuildPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
if(window.bindLangEvents) window.bindLangEvents();
if(window.applyTranslations) window.applyTranslations();
if(window.updateFlagState) window.updateFlagState();
});
