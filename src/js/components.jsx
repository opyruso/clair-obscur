const {NavLink} = ReactRouterDOM;

import { DataGrid } from '/node_modules/@mui/x-data-grid/index.js';

const Header = () => (
  <nav className="navbar navbar-dark">
    <div className="container-fluid header-inner">
      <NavLink className="navbar-brand" to="/index" data-i18n="nav_brand">Clair Obscur Helper</NavLink>
      <ul className="navbar-nav flex-row">
        <li className="nav-item"><NavLink className="nav-link" to="/pictos" data-i18n="nav_pictos">Pictos inventory</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/weapons" data-i18n="nav_weapons">Weapons inventory</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/build" data-i18n="nav_build">Team builder</NavLink></li>
        <li className="nav-item" id="adminNav" style={{display:'none'}}><NavLink className="nav-link" to="/admin" data-i18n="nav_admin">Admin</NavLink></li>
      </ul>
      <div className="header-right">
        <div className="header-panel">
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

const Footer = () => (
  <footer className="text-center text-white py-3">
    Copyright oPyRuSo 2025-{new Date().getFullYear()}
  </footer>
);

function UIGrid({columns, rows, setRows, endpoint, idField}){
  const {useState} = React;
  const api = window.CONFIG?.["clairobscur-api-url"] || '';
  const processRowUpdate = async (row) => {
    const method = row.__new ? 'POST' : 'PUT';
    const body = JSON.stringify(row);
    await apiFetch(`${api}${endpoint}`, {
      method,
      headers:{'Content-Type':'application/json'},
      body
    });
    const newRow = {...row};
    if(newRow.__new) delete newRow.__new;
    return newRow;
  };

  const addRow = () => {
    setRows(old => [...old, { [idField]: '', __new:true }]);
  };

  const deleteRow = async (id) => {
    const row = rows.find(r => (r[idField] || rows.indexOf(r)) === id);
    setRows(rows.filter(r => (r[idField] || rows.indexOf(r)) !== id));
    await apiFetch(`${api}${endpoint}`, {
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(row)
    });
  };

  const gridColumns = React.useMemo(() => [
    ...columns.map(c => ({
      field:c.field,
      headerName:c.header,
      width:c.width,
      headerClassName:c.className,
      flex:c.width?undefined:1
    })),
    {
      field:'__actions',
      headerName:'',
      sortable:false,
      filterable:false,
      width:60,
      renderCell:(params)=>(
        <button className="btn btn-sm btn-danger" onClick={()=>deleteRow(params.id)}>x</button>
      )
    }
  ], [columns]);

  return (
    <div className="admin-grid">
      <DataGrid
        rows={rows}
        columns={gridColumns}
        getRowId={(row)=> row[idField] || rows.indexOf(row)}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(e)=>console.error(e)}
        editMode="row"
        autoHeight
        hideFooter
        disableColumnMenu
      />
      <button className="btn btn-sm btn-primary mt-2" onClick={addRow}>+</button>
    </div>
  );
}
