// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Drizzle, generateStore } from "@drizzle/store";
import { DrizzleProvider } from "@drizzle/react-plugin";
import Land from "./artifacts/Land.json";

// Drizzle setup
const drizzleOptions = { contracts: [Land] };
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

// React 18 root render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DrizzleProvider drizzle={drizzle}>
      <App />
    </DrizzleProvider>
  </React.StrictMode>
);
