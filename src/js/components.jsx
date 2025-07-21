const {NavLink} = ReactRouterDOM;

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
  const [editCell, setEditCell] = useState(null);

  const onCellDouble = (rowIndex, field) => {
    setEditCell({rowIndex, field});
  };

  const onCellChange = (e, rowIndex, field) => {
    const value = e.target.value;
    setRows(old => {
      const nr = [...old];
      nr[rowIndex] = { ...nr[rowIndex], [field]: value };
      return nr;
    });
  };

  const saveRow = async (rowIndex) => {
    const row = rows[rowIndex];
    setEditCell(null);
    const method = row.__new ? 'POST' : 'PUT';
    const body = JSON.stringify(row);
    await fetch(`${api}${endpoint}`, {
      method,
      headers:{'Content-Type':'application/json'},
      body
    });
    if(row.__new) delete row.__new;
  };

  const addRow = () => {
    setRows([...rows, { [idField]: '', __new:true }]);
  };

  const deleteRow = async (rowIndex) => {
    const row = rows[rowIndex];
    setRows(rows.filter((_,i)=>i!==rowIndex));
    await fetch(`${api}${endpoint}`, {
      method:'DELETE',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(row)
    });
  };

  return (
    <div className="admin-grid">
      <table className="table table-sm table-bordered">
        <thead>
          <tr>
            {columns.map(c => <th key={c.field} style={{width:c.width}} className={c.className}>{c.header}</th>)}
            <th><button className="btn btn-sm btn-primary" onClick={addRow}>+</button></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i) => (
            <tr key={row[idField] || i}>
              {columns.map(col => {
                const val = row[col.field] ?? '';
                const style = col.width ? {width: col.width} : undefined;
                const cls = col.className || undefined;
                if(editCell && editCell.rowIndex===i && editCell.field===col.field){
                  return (
                    <td key={col.field} style={style} className={cls}>
                      <input value={val} onChange={e=>onCellChange(e,i,col.field)} onBlur={()=>saveRow(i)} />
                    </td>
                  );
                }
                return <td key={col.field} style={style} className={cls} onDoubleClick={()=>onCellDouble(i,col.field)}>{val}</td>;
              })}
              <td><button className="btn btn-sm btn-danger" onClick={()=>deleteRow(i)}>x</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
