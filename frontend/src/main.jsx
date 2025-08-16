import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/Store.js";
import { App } from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
