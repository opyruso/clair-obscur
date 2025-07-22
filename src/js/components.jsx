const {NavLink} = ReactRouterDOM;
const {useState} = React;
const { toast } = ReactToastify;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <nav className="navbar navbar-dark">
      <div className="container-fluid header-inner">
        <NavLink className="navbar-brand" to="/index" data-i18n="nav_brand">Clair Obscur Helper</NavLink>
        <button className="burger-btn" onClick={() => setMenuOpen(o => !o)}><i className="fa-solid fa-bars"></i></button>
        <div className={`nav-collapse${menuOpen ? ' show' : ''}`}>
          <ul className="navbar-nav flex-row">
            <li className="nav-item"><NavLink className="nav-link" to="/pictos" onClick={closeMenu} data-i18n="nav_pictos">Pictos inventory</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/weapons" onClick={closeMenu} data-i18n="nav_weapons">Weapons inventory</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/build" onClick={closeMenu} data-i18n="nav_build">Team builder</NavLink></li>
            <li className="nav-item" id="adminNav" style={{display:'none'}}><NavLink className="nav-link" to="/admin" onClick={closeMenu} data-i18n="nav_admin">Admin</NavLink></li>
          </ul>
          <div className="header-right">
            <div className="icon-bar header-actions">
              <button className="icon-btn" id="downloadBtn" data-i18n-title="download" title="Download"><img src="resources/images/icons/buttons/download.png" alt=""/></button>
              <button className="icon-btn" id="uploadBtn" data-i18n-title="upload" title="Upload"><img src="resources/images/icons/buttons/upload.png" alt=""/></button>
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
    const {__new, id, ...payload} = newRow;
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
    const updated = {...newRow};
    delete updated.__new;
    setRows(rs => rs.map(r => (r[idField] === updated[idField] ? updated : r)));
    return updated;
  }, [api, endpoint, idField, setRows]);

  const handleProcessRowUpdateError = useCallback(err => {
    console.error(err);
    toast.error('Failed to save data');
  }, []);

  const addRow = () => {
    setRows([...rows, { [idField]: '', __new:true }]);
  };

  const deleteRow = useCallback(async (idVal) => {
    const row = rows.find(r => r[idField] === idVal);
    if(!row) return;
    setRows(rows.filter(r => r[idField] !== idVal));
    if(row.__new) return;
    const url = `${api}${endpoint}/${encodeURIComponent(idVal)}`;
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
      <button className="btn btn-sm btn-danger" onClick={()=>deleteRow(params.row[idField])}>x</button>
    )
  });

  const rowData = rows.map((r,i)=>({id:r[idField] || `n${i}`, ...r}));

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
