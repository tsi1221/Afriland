import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin";
import Dashboard from "../../views/Dashboard";
import routes from "../../routes";

import logo from "../../assets/img/react-logo.png";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";

let ps;

function Admin(props) {
  const location = useLocation();
  const mainPanelRef = React.useRef(null);
  const [sidebarOpened, setSidebarOpened] = React.useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });
      const tables = document.querySelectorAll(".table-responsive");
      tables.forEach((table) => {
        ps = new PerfectScrollbar(table);
      });
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1 && ps) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  }, []);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      const tables = document.querySelectorAll(".table-responsive");
      tables.forEach((table) => {
        ps = new PerfectScrollbar(table);
      });
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) mainPanelRef.current.scrollTop = 0;
  }, [location]);

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpened(!sidebarOpened);
  };

  const getBrandText = (path) => {
    const route = routes.find(
      (r) => path.indexOf(r.layout + r.path) !== -1
    );
    return route ? route.name : "Brand";
  };

  return (
    <BackgroundColorContext.Consumer>
      {({ color, changeColor }) => (
        <React.Fragment>
          <div className="wrapper">
            <Sidebar
              routes={routes}
              logo={{
                outterLink: "#",
                text: "Land Registration",
                imgSrc: logo,
              }}
              toggleSidebar={toggleSidebar}
            />
            <div className="main-panel" ref={mainPanelRef} data={color}>
              <AdminNavbar
                brandText={getBrandText(location.pathname)}
                toggleSidebar={toggleSidebar}
                sidebarOpened={sidebarOpened}
              />
              <Routes>
                {routes.map((prop, key) =>
                  prop.layout === "/admin" ? (
                    <Route
                      path={prop.path}
                      element={<prop.component />}
                      key={key}
                    />
                  ) : null
                )}
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
              <Footer fluid />
            </div>
          </div>
          {/* <FixedPlugin bgColor={color} handleBgClick={changeColor} /> */}
        </React.Fragment>
      )}
    </BackgroundColorContext.Consumer>
  );
}

export default Admin;
