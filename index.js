import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <div className="container">
      <h1 className="title">TeraPlayX</h1>

      <div className="card">
        <input 
          placeholder="Paste TeraBox link here…" 
          className="input"
        />

        <button className="btn play">
          Download
        </button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
