import React, { useRef, useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import LIDashboard from "../../views/LIDashboard";
import routes from "../../routes"; // or "../../routeseller" if needed

import logo from "../../assets/img/react-logo.png";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";

function LI() {
  const location = useLocation();
  const mainPanelRef = useRef(null);
  const [sidebarOpened, setSidebarOpened] = useState(
    document.documentElement.classList.contains("nav-open")
  );

  const { color } = useContext(BackgroundColorContext);

  // PerfectScrollbar setup
  useEffect(() => {
    let psMain, tableScrollbars = [];

    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");

      if (mainPanelRef.current) {
        psMain = new PerfectScrollbar(mainPanelRef.current, {
          suppressScrollX: true,
        });
      }

      const tables = document.querySelectorAll(".table-responsive");
      tableScrollbars = Array.from(tables).map(
        (el) => new PerfectScrollbar(el)
      );
    }

    return () => {
      if (navigator.platform.indexOf("Win") > -1) {
        if (psMain) psMain.destroy();
        tableScrollbars.forEach((ps) => ps.destroy());
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) mainPanelRef.current.scrollTop = 0;
  }, [location]);

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpened(!sidebarOpened);
  };

  const getBrandText = () => {
    const currentRoute = routes.find(
      (r) => location.pathname.indexOf(r.layout + r.path) !== -1
    );
    return currentRoute ? currentRoute.name : "Brand";
  };

  return (
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
          brandText={getBrandText()}
          toggleSidebar={toggleSidebar}
          sidebarOpened={sidebarOpened}
        />

        <Routes>
          {routes
            .filter((prop) => prop.layout === "/LI")
            .map((prop, key) => (
              <Route
                key={key}
                path={prop.layout + prop.path}
                element={<prop.component />}
              />
            ))}
          <Route path="*" element={<Navigate to="/LI/LIDashboard" replace />} />
        </Routes>

        <Footer fluid />
      </div>
    </div>
  );
}

export default LI;
