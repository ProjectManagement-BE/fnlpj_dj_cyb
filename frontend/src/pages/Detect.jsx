import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Divider, Chip, Grid } from "@mui/material";
import api from "../api/axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Detect() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleDetect = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await api.post("/detect/", { url });
      setResult(response.data);
    } catch (e) {
      setError("Detection failed. Please try again.");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
      <Card sx={{ p: 2, maxWidth: 800, mx: "auto", boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            URL Threat Detection
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Enter URL to analyze"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDetect()}
            />
            <Button variant="contained" color="primary" onClick={handleDetect} disabled={loading}>
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {result && (
            <Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Result for: {result.url}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">ML Prediction</Typography>
                  <Box>
                    <Chip label={result.ml_prediction} color={result.ml_prediction === "Phishing" ? "error" : "success"} size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Threat</Typography>
                  <Box>
                    <Chip label={result.threat ? "Yes" : "No"} color={result.threat ? "error" : "success"} size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Overall</Typography>
                  <Box>
                    <Chip label={result.threat ? "Block" : "Allow"} color={result.threat ? "error" : "success"} size="small" />
                  </Box>
                </Grid>
              </Grid>

              {result.virustotal && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">VirusTotal</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}><Typography variant="body2">Harmless: {result.virustotal.harmless}</Typography></Grid>
                    <Grid item xs={6} sm={3}><Typography variant="body2">Malicious: {result.virustotal.malicious}</Typography></Grid>
                    <Grid item xs={6} sm={3}><Typography variant="body2">Suspicious: {result.virustotal.suspicious}</Typography></Grid>
                    <Grid item xs={6} sm={3}><Typography variant="body2">Undetected: {result.virustotal.undetected}</Typography></Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
      <Footer />
      </Box>
    </Box>
  );
}


