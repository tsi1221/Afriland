import React, { useEffect, useRef, useContext } from "react";
import { NavLink as RouterNavLink, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import PerfectScrollbar from "perfect-scrollbar";
import { Nav } from "reactstrap";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";

let ps;

function Sidebar({ routes, rtlActive, logo, toggleSidebar }) {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const { color } = useContext(BackgroundColorContext);

  // Highlight active route
  const activeRoute = (routeName) =>
    location.pathname === routeName ? "active" : "";

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebarRef.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return () => {
      if (navigator.platform.indexOf("Win") > -1 && ps) {
        ps.destroy();
      }
    };
  }, []);

  const linkOnClick = () => {
    document.documentElement.classList.remove("nav-open");
  };

  // Render logo
  const renderLogo = () => {
    if (!logo) return null;

    const logoImg = logo.outterLink ? (
      <a
        href={logo.outterLink}
        className="simple-text logo-mini"
        target="_blank"
        rel="noopener noreferrer"
        onClick={toggleSidebar}
      >
        <div className="logo-img">
          <img src={logo.imgSrc} alt="logo" />
        </div>
      </a>
    ) : (
      <Link to={logo.innerLink} className="simple-text logo-mini" onClick={toggleSidebar}>
        <div className="logo-img">
          <img src={logo.imgSrc} alt="logo" />
        </div>
      </Link>
    );

    const logoText = logo.outterLink ? (
      <a
        href={logo.outterLink}
        className="simple-text logo-normal"
        target="_blank"
        rel="noopener noreferrer"
        onClick={toggleSidebar}
      >
        {logo.text}
      </a>
    ) : (
      <Link to={logo.innerLink} className="simple-text logo-normal" onClick={toggleSidebar}>
        {logo.text}
      </Link>
    );

    return (
      <div className="logo">
        {logoImg}
        {logoText}
      </div>
    );
  };

  return (
    <div className="sidebar" data={color}>
      <div className="sidebar-wrapper" ref={sidebarRef}>
        {renderLogo()}
        <Nav>
          {routes.map((route, key) => {
            if (route.redirect) return null;
            const isActive = activeRoute(route.layout + route.path);
            return (
              <li key={key} className={`${isActive} ${route.pro ? "active-pro" : ""}`}>
                <RouterNavLink
                  to={route.layout + route.path}
                  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                  onClick={() => {
                    toggleSidebar();
                    linkOnClick();
                  }}
                >
                  <i className={route.icon} />
                  <p>{rtlActive ? route.rtlName : route.name}</p>
                </RouterNavLink>
              </li>
            );
          })}
        </Nav>
      </div>
    </div>
  );
}

Sidebar.defaultProps = {
  rtlActive: false,
  routes: [],
};

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    text: PropTypes.node,
    imgSrc: PropTypes.string,
  }),
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
