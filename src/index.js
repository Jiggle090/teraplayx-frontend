import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  return (
    <div className="container">
      <h1 className="title">TeraPlayX</h1>

      <div className="card">
        <input
          placeholder="Paste TeraBox link here"
          className="input"
        />

        <button
          className="btn"
          onClick={() => {
            const link = document.querySelector(".input").value;

            if (!link) {
              alert("Please paste a TeraBox link!");
              return;
            }

            fetch(`https://terabox-api.up.railway.app/api?url=${link}`)
              .then(res => res.json())
              .then(data => {
                if (!data?.download) {
                  alert("Invalid or unsupported link!");
                  return;
                }

                window.location.href = data.download; // Start download
              })
              .catch(() => alert("API error, try again later!"));
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
