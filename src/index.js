import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

function App() {
  const handleDownload = () => {
    const link = document.querySelector(".input").value;

    if (!link) {
      alert("Please paste a TeraBox link!");
      return;
    }

    const encoded = encodeURIComponent(link);

    fetch(`https://terabox-api.up.railway.app/api?url=${encoded}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.download) {
          alert("Invalid or unsupported link!");
          return;
        }

        // Start the download
        window.location.href = data.download;
      })
      .catch(() => {
        alert("API error, try again later!");
      });
  };

  return (
    <div className="container">
      <h1 className="title">TeraPlayX</h1>

      <div className="card">
        <input
          placeholder="Paste TeraBox link here"
          className="input"
        />

        <button className="btn" onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
