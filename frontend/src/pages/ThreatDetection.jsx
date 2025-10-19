// pages/ThreatDetection.jsx
import { useState } from "react";
import api from "../api/axios";

export default function ThreatDetection() {
  const [result, setResult] = useState(null);

  const detect = async () => {
    const res = await api.post("/detect/", { url: "http://example.com" });
    setResult(res.data);
  };

  return (
    <div className="p-4">
      <h2>Threat Detection</h2>
      <button onClick={detect} className="btn">Run Detection</button>

      {result && (
        <div className="card">
          <p><strong>URL:</strong> {result.url}</p>
          <p><strong>Prediction:</strong> {result.ml_prediction}</p>
          <h4>VirusTotal Stats:</h4>
          <ul>
            <li>Harmless: {result.virustotal.harmless}</li>
            <li>Malicious: {result.virustotal.malicious}</li>
            <li>Suspicious: {result.virustotal.suspicious}</li>
            <li>Undetected: {result.virustotal.undetected}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
