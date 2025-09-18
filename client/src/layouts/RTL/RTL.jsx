import React, { useEffect, useRef, useState, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";

// core components
import RTLNavbar from "../../components/Navbars/RTLNavbar";
import Footer from "../../components/Footer/Footer";
import Sidebar from "../../components/Sidebar/Sidebar";
import FixedPlugin from "../../components/FixedPlugin/FixedPlugin";

import routes from "../../routes";
import logo from "../../assets/img/react-logo.png";
import { BackgroundColorContext } from "../../contexts/BackgroundColorContext";

let ps;

function RTL() {
  const location = useLocation();
  const mainPanelRef = useRef(null);
  const [sidebarOpened, setSidebarOpened] = useState(
    document.documentElement.className.indexOf("nav-open") !== -1
  );

  const { color, changeColor } = useContext(BackgroundColorContext);

  // Setup PerfectScrollbar + RTL bootstrap
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.classList.add("perfect-scrollbar-on");
      document.documentElement.classList.remove("perfect-scrollbar-off");

      ps = new PerfectScrollbar(mainPanelRef.current, {
        suppressScrollX: true,
      });

      document.querySelectorAll(".table-responsive").forEach((table) => {
        new PerfectScrollbar(table);
      });
    }

    // add RTL classes and stylesheet
    document.body.classList.add("rtl", "menu-on-right");

    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.id = "rtl-id";
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-rtl/3.4.0/css/bootstrap-rtl.css";
    document.head.appendChild(link);

    return () => {
      if (navigator.platform.indexOf("Win") > -1 && ps) {
        ps.destroy();
        document.documentElement.classList.add("perfect-scrollbar-off");
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.remove("rtl", "menu-on-right");
      const rtlLink = document.getElementById("rtl-id");
      if (rtlLink) rtlLink.remove();
    };
  }, []);

  // Scroll reset on route change
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.querySelectorAll(".table-responsive").forEach((table) => {
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

  const getRoutes = (routes) =>
    routes.map((prop, key) => {
      if (prop.layout === "/rtl") {
        return <Route path={prop.path} element={<prop.component />} key={key} />;
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
    <>
      <div className="wrapper">
        <Sidebar
          routes={routes}
          rtlActive
          logo={{
            outterLink: "https://www.creative-tim.com/",
            text: "الإبداعية تيم",
            imgSrc: logo,
          }}
          toggleSidebar={toggleSidebar}
        />
        <div className="main-panel" ref={mainPanelRef} data={color}>
          <RTLNavbar
            brandText={getBrandText(location.pathname)}
            toggleSidebar={toggleSidebar}
            sidebarOpened={sidebarOpened}
          />
          <Routes>{getRoutes(routes)}</Routes>
          {/* Hide footer on maps page */}
          {location.pathname !== "/admin/maps" && <Footer fluid />}
        </div>
      </div>
      <FixedPlugin bgColor={color} handleBgClick={changeColor} />
    </>
  );
}

export default RTL;
