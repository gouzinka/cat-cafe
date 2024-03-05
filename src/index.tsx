import React from "react";
import ReactDOM from "react-dom/client";

import "./reset.css";
import "./styles.css";
import Header from "./Header";
import Tagline from "./Tagline";
import MewlaConverter from "./mewlaConverter";

function App() {
  return (
    <div className="App">
      <Header />
      <section id="cashier">
        <Tagline />
        <MewlaConverter />
      </section>
    </div>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
