import React, { useRef, useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin";
import AddLand from "../../views/AddLand";
import routes from "../../routes";

import logo from "../../assets/img/react-logo.png";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";

function Land() {
  const location = useLocation();
  const mainPanelRef = useRef(null);
  const [sidebarOpened, setSidebarOpened] = useState(
    document.documentElement.classList.contains("nav-open")
  );

  const { color, changeColor } = useContext(BackgroundColorContext);

  // PerfectScrollbar setup
  useEffect(() => {
    let psMain, tableScrollbars = [];

    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");

      if (mainPanelRef.current) {
        psMain = new PerfectScrollbar(mainPanelRef.current, { suppressScrollX: true });
      }

      const tables = document.querySelectorAll(".table-responsive");
      tableScrollbars = Array.from(tables).map(el => new PerfectScrollbar(el));
    }

    return () => {
      if (navigator.platform.indexOf("Win") > -1) {
        if (psMain) psMain.destroy();
        tableScrollbars.forEach(ps => ps.destroy());

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

  // Toggle sidebar
  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpened(!sidebarOpened);
  };

  // Optional: dynamic brand text
  const getBrandText = () => {
    const currentRoute = routes.find(
      (r) => location.pathname.indexOf(r.layout + r.path) !== -1
    );
    return currentRoute ? currentRoute.name : "Land Registration";
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
          sidebarOpened={sidebarOpened}
          toggleSidebar={toggleSidebar}
          brandText={getBrandText()}
        />
        <Routes>
          <Route path="/admin/AddLand" element={<AddLand />} />
          <Route path="*" element={<Navigate to="/admin/AddLand" replace />} />
        </Routes>
      </div>
      <FixedPlugin bgColor={color} handleBgClick={changeColor} />
    </div>
  );
}

export default Land;
