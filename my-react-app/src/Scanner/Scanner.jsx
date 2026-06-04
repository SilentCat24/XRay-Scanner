import React, { useState } from "react";
import useAuth from "./Hooks";


const Scanner = () => {
    const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const { xrayScanner } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
    setResult('');
  if (!file) {
    console.log("enter file");
    return;
  }

  try {
    setLoading(true);

    const data = await xrayScanner(file);

    setResult(data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <h4>Enter Your X-ray</h4>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

   <button onClick={handleSubmit}>
  {loading ? "Scanning..." : "Scan"}
</button>


{loading && <h3>Scanning X-ray... Please wait ⏳</h3>}
      {result && (
        <div>
          <h2>Scan Report</h2>

          <p><b>File Name:</b> {result.fileName}</p>
          <p><b>File Type:</b> {result.fileType}</p>

          <h3>Patient Info</h3>
          <p><b>Image Type:</b> {result.report.patientInfo.imageType}</p>
          <p><b>Quality:</b> {result.report.patientInfo.quality}</p>
          <p><b>Date:</b> {result.report.patientInfo.date}</p>

          <h3>Findings</h3>
          {result.report.findings.map((item, index) => (
            <div key={index}>
              <h4>{item.region}</h4>
              <p><b>Observation:</b> {item.observation}</p>
              <p><b>Severity:</b> {item.severity}</p>
            </div>
          ))}

          <h3>Impression</h3>
          <p>{result.report.impression}</p>

          <h3>Severity</h3>
          <p>{result.report.severity}</p>

          <h3>Recommendations</h3>
          <ul>
            {result.report.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>

          <h3>Follow Up</h3>
          <p>{result.report.followUp}</p>

          <h3>Disclaimer</h3>
          <p>{result.report.disclaimer}</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;