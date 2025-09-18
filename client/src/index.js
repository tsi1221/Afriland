import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages & Layouts
import Login from "./login.component";
import RegisterBuyer from "./RegisterBuyer";
import RegisterSeller from "./RegisterSeller";
import AdminLayout from "./layouts/Admin/Admin";
import LI from "./layouts/Admin/LI";
import Seller from "./layouts/Admin/Seller";
import Help from './Help';

// Styles
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// Context Wrappers
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";

// Other
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/RegisterBuyer" element={<RegisterBuyer />} />
          <Route path="/RegisterSeller" element={<RegisterSeller />} />

          {/* Protected / Layout Routes */}
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/LI/*" element={<LI />} />
          <Route path="/Seller/*" element={<Seller />} />

          {/* Fallback / Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById('root')
);

// Optional: measure performance
reportWebVitals();
