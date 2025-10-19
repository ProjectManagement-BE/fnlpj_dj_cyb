import React, { useState } from "react";
import { Box, Card, CardContent, Typography, TextField, Button, Chip, Grid, Stack } from "@mui/material";
import api from "../api/axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function IPThreat() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [resolving, setResolving] = useState(false);

  const analyze = async () => {
    if (!ip.trim()) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const { data } = await api.get("/monitor/ip/", { params: { ip } });
      if (data.error && data.error.includes("Invalid IP")) {
        setError("Please enter a valid IPv4 address.");
      } else {
        setData(data);
      }
    } catch (e) {
      setError("Failed to analyze IP");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const useMyPublicIp = async () => {
    setResolving(true);
    setError("");
    try {
      const resp = await fetch("https://api.ipify.org?format=json");
      const json = await resp.json();
      setIp(json.ip || "");
      if (json.ip) {
        // Auto-run analysis
        const { data } = await api.get("/monitor/ip/", { params: { ip: json.ip } });
        setData(data);
      }
    } catch (e) {
      setError("Could not resolve your public IP");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setResolving(false);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
        <Card sx={{ p: 2, maxWidth: 900, mx: "auto", boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              IP Threat Analysis
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
              <TextField fullWidth label="IP Address (e.g., 8.8.8.8)" value={ip} onChange={(e) => setIp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && analyze()} />
              <Button variant="contained" onClick={analyze} disabled={loading}>{loading ? "Analyzing..." : "Analyze"}</Button>
              <Button variant="outlined" color="secondary" onClick={useMyPublicIp} disabled={resolving}>{resolving ? "Detecting..." : "Use my public IP"}</Button>
            </Stack>
            {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

            {data && (
              <Box>
                {data.note && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {data.note}
                  </Typography>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">IP</Typography>
                    <Typography>{data.ip}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Risk</Typography>
                    <Chip label={data.risk || "unknown"} color={data.risk === "critical" ? "error" : data.risk === "high" ? "warning" : data.risk === "medium" ? "warning" : "default"} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                    <Typography>{[data.city, data.region, data.country].filter(Boolean).join(", ") || "-"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">Organization</Typography>
                    <Typography>{data.org || data.isp || "-"}</Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Abuse Score</Typography>
                  <Typography>{data.abuse_score ?? "-"} (reports: {data.total_reports ?? "-"})</Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
}


