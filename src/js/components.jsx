const {NavLink} = ReactRouterDOM;

const Header = () => (
  <nav className="navbar navbar-dark">
    <div className="container-fluid header-inner">
      <NavLink className="navbar-brand" to="/index" data-i18n="nav_brand">Clair Obscur Helper</NavLink>
      <ul className="navbar-nav flex-row">
        <li className="nav-item"><NavLink className="nav-link" to="/pictos" data-i18n="nav_pictos">Pictos inventory</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/weapons" data-i18n="nav_weapons">Weapons inventory</NavLink></li>
        <li className="nav-item"><NavLink className="nav-link" to="/build" data-i18n="nav_build">Team builder</NavLink></li>
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
