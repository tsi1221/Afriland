import React, { useEffect, useRef, useState, useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

// core components
import AdminNavbar from "../../components/Navbars/AdminNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import routes from "../../routeseller";
import logo from "../../assets/img/react-logo.png";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";

let ps;

function Seller() {
  const location = useLocation();
  const mainPanelRef = useRef(null);
  const [sidebarOpened, setSidebarOpened] = useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );

  const { color } = useContext(BackgroundColorContext);

  // Perfect Scrollbar setup
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");

      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });

      const tables = document.querySelectorAll(".table-responsive");
      tables.forEach((table) => {
        new PerfectScrollbar(table);
      });
    }

    return () => {
      if (navigator.platform.indexOf("Win") > -1 && ps) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  }, []);

  // Reset scroll on route change
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      const tables = document.querySelectorAll(".table-responsive");
      tables.forEach((table) => {
        new PerfectScrollbar(table);
      });
    }

    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainPanelRef.current) {
      mainPanelRef.current.scrollTop = 0;
    }
  }, [location]);

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpened(!sidebarOpened);
  };

  // Generate route list
  const getRoutes = (routes) =>
    routes.map((prop, key) => {
      if (prop.layout === "/Seller") {
        return (
          <Route
            path={prop.path}
            element={<prop.component />}
            key={key}
          />
        );
      }
      return null;
    });

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (path.includes(routes[i].layout + routes[i].path)) {
        return routes[i].name;
      }
    }
    return "Brand";
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
          brandText={getBrandText(location.pathname)}
          toggleSidebar={toggleSidebar}
          sidebarOpened={sidebarOpened}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/Seller/SellerDashboard" />} />
        </Routes>
        <Footer fluid />
      </div>
    </div>
  );
}

export default Seller;
