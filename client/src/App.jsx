// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./login.component";

// Views
import SellerDashboard from "./views/SellerDashboard";
import BuyerDashboard from "./views/Dashboard"; // Admin/Buyer dashboard
import ViewImage from "./views/viewImage";
import UpdateSeller from "./views/updateSeller";
import UpdateBuyer from "./views/updateBuyer";

// Other pages
import Help from "./Help";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Login />} />

        {/* Seller Routes */}
        <Route path="/Seller/SellerDashboard" element={<SellerDashboard />} />
        <Route path="/Seller/updateSeller" element={<UpdateSeller />} />
        <Route path="/Seller/viewImage" element={<ViewImage />} />

        {/* Buyer/Admin Routes */}
        <Route path="/admin/dashboard" element={<BuyerDashboard />} />
        <Route path="/admin/updateBuyer" element={<UpdateBuyer />} />
        <Route path="/admin/viewImage" element={<ViewImage />} />

        {/* Help */}
        <Route path="/Help" element={<Help />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
