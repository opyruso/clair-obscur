const {NavLink} = ReactRouterDOM;
const {useState, useRef} = React;
const { toast } = ReactToastify;

// Clean API responses so datagrid cells don't display "[object Object]"
function sanitizeRow(row){
  if(!row || typeof row !== 'object') return row;
  const idProps=[
    'id','value','idCharacter','idDamageType','idDamageBuffType',
    'idOutfit','idCapacity','idWeapon'
  ];
  for(const k of Object.keys(row)){
    const v=row[k];
    if(v && typeof v==='object'){
      const prop=idProps.find(p=>v[p]!==undefined);
      if(prop) row[k]=v[prop];
    }
  }
  return row;
}

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef();
  const closeMenu = () => setMenuOpen(false);
  const handleDownload = () => {
    if(window.downloadSiteData) window.downloadSiteData();
  };
  const handleUploadClick = () => fileRef.current?.click();
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if(file && window.handleSiteUpload) {
      window.handleSiteUpload(file);
    }
    e.target.value = '';
  };
  return (
    <nav className="navbar navbar-dark">
      <div className="container-fluid header-inner">
        <NavLink className="navbar-brand" to="/index" data-i18n="nav_brand">Clair Obscur Helper</NavLink>
        <button className="burger-btn" onClick={() => setMenuOpen(o => !o)}><i className="fa-solid fa-bars"></i></button>
        <div className={`nav-collapse${menuOpen ? ' show' : ''}`}>
          <ul className="navbar-nav flex-row">
            <li className="nav-item"><NavLink className="nav-link" to="/pictos" onClick={closeMenu} data-i18n="nav_pictos">Pictos inventory</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/weapons" onClick={closeMenu} data-i18n="nav_weapons">Weapons inventory</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/outfits" onClick={closeMenu} data-i18n="nav_outfits">Outfits inventory</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/build" onClick={closeMenu} data-i18n="nav_build">Team builder</NavLink></li>
            <li className="nav-item" id="adminNav" style={{display:'none'}}><NavLink className="nav-link" to="/admin" onClick={closeMenu} data-i18n="nav_admin">Admin</NavLink></li>
          </ul>
          <div className="header-right">
            <div className="icon-bar header-actions">
              <button className="icon-btn" id="downloadBtn" data-i18n-title="download" title="Download" onClick={handleDownload}><img src="resources/images/icons/buttons/download.png" alt=""/></button>
              <button className="icon-btn" id="uploadBtn" data-i18n-title="upload" title="Upload" onClick={handleUploadClick}><img src="resources/images/icons/buttons/upload.png" alt=""/></button>
              <input type="file" ref={fileRef} accept="application/json" style={{display:'none'}} onChange={handleFileChange}/>
            </div>
            <div className="lang-flags">
              <span className="lang-flag fi fi-fr" data-lang="fr" id="frFlag"></span>
              <span className="lang-flag fi fi-gb" data-lang="en" id="enFlag"></span>
            </div>
            <div className="icon-sep"></div>
            <button className="icon-btn" id="loginBtn" data-i18n-title="login" title="Login"><i className="fa-solid fa-user"></i></button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="text-center text-white py-3">
    Copyright oPyRuSo 2025-{new Date().getFullYear()}
  </footer>
);

function UIGrid({columns, rows, setRows, endpoint, idField}){
  const {useCallback} = React;
  const {DataGrid, GridFooterContainer, GridPagination} = MaterialUI;
  const api = window.CONFIG?.["clairobscur-api-url"] || '';

  const processRowUpdate = useCallback(async (newRow) => {
    const {__new, id, _tmpId, ...payload} = newRow;
    const method = __new ? 'POST' : 'PUT';
    let url = `${api}${endpoint}`;
    if(method === 'PUT') {
      url += `/${encodeURIComponent(newRow[idField])}`;
    }
    const response = await apiFetch(url, {
      method,
      headers:{'Accept':'application/json'},
      body: payload
    });
    if(!response.ok){
      console.error('Failed to save row', response.status);
      toast.error('Failed to save data');
      throw new Error('Request failed');
    }
    let updated = {...newRow};
    try {
      const ct = response.headers.get('content-type') || '';
      if(ct.includes('application/json')) {
        const data = await response.json();
        if(data && typeof data === 'object') {
          updated = {...updated, ...data};
        }
      }
    } catch(e){ /* ignore json errors */ }
    updated = sanitizeRow(updated);
    delete updated.__new;
    delete updated._tmpId;
    setRows(rs => rs.map(r => (
      (r.id ? r.id === newRow.id : r[idField] === newRow[idField]) ? updated : r
    )));
    return updated;
  }, [api, endpoint, idField, setRows]);

  const handleProcessRowUpdateError = useCallback(err => {
    console.error(err);
    toast.error('Failed to save data');
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      { [idField]: '', __new:true, id: `tmp-${Date.now()}-${Math.random()}` }
    ]);
  };

  const deleteRow = useCallback(async (rowId) => {
    const row = rows.find(r => (r.id === rowId || r[idField] === rowId));
    if(!row) return;
    setRows(rows.filter(r => (r.id !== rowId && r[idField] !== rowId)));
    if(row.__new) return;
    const url = `${api}${endpoint}/${encodeURIComponent(row[idField])}`;
    await apiFetch(url, {
      method:'DELETE',
      headers:{'Accept':'application/json'}
    });
  }, [rows, api, endpoint, idField, setRows]);

  const cols = columns.map(c => {
    const col = {field:c.field, headerName:c.header, editable: c.editable !== undefined ? c.editable : true};
    if(c.width !== undefined) col.width = c.width;
    if(c.flex !== undefined) col.flex = c.flex;
    if(c.type) col.type = c.type;
    if(Array.isArray(c.options)) {
      col.valueOptions = c.options;
      if(c.options.length && typeof c.options[0] === 'object'){
        const map = new Map(c.options.map(o => [o.value, o.label]));
        col.valueFormatter = ({ value }) => map.get(value) ?? value;
      }
    }
    if(col.width === undefined && col.flex === undefined){
      const sample = rows.find(r => r?.[c.field] !== undefined);
      const val = sample?.[c.field];
      if(c.field === 'lang' || c.field.toLowerCase().startsWith('id') || typeof val === 'number'){
        col.width = 80;
      }else{
        col.flex = 1;
      }
    }
    return col;
  });
  cols.push({
    field:'__actions',
    headerName:'',
    sortable:false,
    filterable:false,
    width:60,
    renderCell:(params)=> (
      <button className="btn btn-sm btn-danger" onClick={()=>deleteRow(params.row.id)}>x</button>
    )
  });

  const rowData = rows.map((r,i)=>({id: r[idField] || r.id || `n${i}`, ...r}));

  const AddRowFooter = (props) => (
    <GridFooterContainer>
      <GridPagination {...props} />
      <button className="btn btn-sm btn-primary add-row-btn" onClick={addRow}>+</button>
    </GridFooterContainer>
  );

  return (
    <div className="admin-grid">
      <div style={{height:'100%',width:'100%'}}>
        <DataGrid
          columns={cols}
          rows={rowData}
          getRowId={r=>r[idField] || r.id}
          editMode="row"
          experimentalFeatures={{newEditingApi:true}}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          autoHeight
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          slots={{ footer: AddRowFooter }}
        />
      </div>
    </div>
  );
}

function ImportBox({columns, rows, setRows, endpoint, idField, label}){
  const api = window.CONFIG?.["clairobscur-api-url"] || '';
  const fields = columns.map(c => c.field);
  const fileRef = React.useRef();
  const [lines, setLines] = React.useState([]);
  const [states, setStates] = React.useState([]); // normal,error,success,fail

  const exportCsv = () => {
    const pad = n => String(n).padStart(2, '0');
    const d = new Date();
    const name = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}_${label}_${currentLang}.csv`;
    const content = rows.map(r => fields.map(f => r[f] ?? '').join(';')).join('\n');
    const blob = new Blob([content], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  };

  const loadFile = e => {
    const file = e.target.files?.[0];
    if(!file) return;
    file.text().then(txt => {
      const ls = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const st = ls.map(l => (l.split(';').length === fields.length ? 'normal' : 'error'));
      setLines(ls); setStates(st);
    });
  };

  const importData = async () => {
    const newStates = [...states];
    let newRows = [...rows];
    for(let i=0;i<lines.length;i++){
      if(states[i]==='error') continue;
      const parts = lines[i].split(';');
      const obj = {};
      fields.forEach((f,j)=>{ obj[f] = parts[j] ?? ''; });
      const exists = rows.some(r => r[idField] == obj[idField]);
      const method = exists ? 'PUT' : 'POST';
      let url = `${api}${endpoint}`;
      if(method === 'PUT') url += `/${encodeURIComponent(obj[idField])}`;
      try{
        const resp = await apiFetch(url,{method,headers:{'Accept':'application/json'},body:obj});
        if(!resp.ok) throw new Error('err');
        let data = {...obj};
        try{ const ct=resp.headers.get('content-type')||''; if(ct.includes('application/json')){ const d=await resp.json(); if(d&&typeof d==='object') data={...data,...d}; }}catch(e){}
        data = sanitizeRow(data);
        if(exists){
          newRows=newRows.map(r=>r[idField]==obj[idField]?{...r,...data}:r);
        }else{
          newRows=[...newRows,data];
        }
        newStates[i]='success';
      }catch(e){ newStates[i]='fail'; }
    }
    setRows(newRows); setStates(newStates);
  };

  const cleanData = async () => {
    const ls=[]; const st=[];
    for(const r of rows){
      const url=`${api}${endpoint}/${encodeURIComponent(r[idField])}`;
      try{ const resp=await apiFetch(url,{method:'DELETE',headers:{'Accept':'application/json'}}); if(!resp.ok) throw new Error('del'); st.push('success'); }catch(e){ st.push('fail'); }
      ls.push(String(r[idField]));
    }
    setRows([]); setLines(ls); setStates(st);
  };

  return (
    <div className="import-box">
      <div className="controls">
        <button className="btn btn-sm btn-secondary" onClick={exportCsv}>Exporter</button>
        <input type="file" ref={fileRef} style={{display:'none'}} accept=".csv" onChange={loadFile}/>
        <button className="btn btn-sm btn-secondary" onClick={()=>fileRef.current.click()}>Charger</button>
        <button className="btn btn-sm btn-primary" onClick={importData} disabled={states.includes('error')||!lines.length}>Importer</button>
        <button className="btn btn-sm btn-danger" onClick={cleanData}>Nettoyer</button>
      </div>
      <div className="log">
        {lines.map((l,i)=>(<pre key={i} className={states[i]==='error'||states[i]==='fail'?'text-danger':states[i]==='success'?'text-success':''}>{l}</pre>))}
      </div>
    </div>
  );
}

