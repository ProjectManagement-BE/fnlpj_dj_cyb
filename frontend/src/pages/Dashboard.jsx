import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, CardContent, Typography, Button, Divider, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import ReportIcon from "@mui/icons-material/Report";
import PublicIcon from "@mui/icons-material/Public";
import ShieldIcon from "@mui/icons-material/Shield";
import SecurityIcon from "@mui/icons-material/Security";
import LanIcon from "@mui/icons-material/Lan";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ChatIcon from "@mui/icons-material/Chat";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import api from "../api/axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, categories: 0, darkweb: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [monitorRes, darkwebRes, statsRes] = await Promise.all([
          api.get("/monitor/", { params: { count: 10 } }),
          api.get("/darkweb/", { params: { q: "threat" } }),
          api.get("/monitor/stats/"),
        ]);
        if (!mounted) return;
        const packets = monitorRes.data.captured_packets || [];
        const dw = darkwebRes.data.results || [];
        // compute severity per packet first
        const isPrivate = (ip) => {
          if (!ip) return true;
          const parts = ip.split(".").map((x) => parseInt(x, 10));
          if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
          const [a, b] = parts;
          return (
            a === 10 ||
            (a === 172 && b >= 16 && b <= 31) ||
            (a === 192 && b === 168) ||
            a === 127 ||
            a === 169
          );
        };
        const pickSeverity = (pkt) => {
          const srcPriv = isPrivate(pkt.src);
          const dstPriv = isPrivate(pkt.dst);
          const proto = String(pkt.protocol || "");
          if (!srcPriv && !dstPriv) return "high";
          if (!srcPriv || !dstPriv) return proto === "1" ? "medium" : "medium";
          return "low";
        };
        setStats({
          total: statsRes.data.total_24h || 0,
          active: statsRes.data.active_alerts || 0,
          categories: statsRes.data.categories || 0,
          darkweb: dw.length,
        });
        const protoName = (proto) => {
          const v = String(proto || "");
          if (v === "6") return "TCP";
          if (v === "17") return "UDP";
          if (v === "1") return "ICMP";
          return v || "-";
        };
        const confidenceScore = (pkt) => {
          let score = 50;
          const sev = pickSeverity(pkt);
          if (sev === "high") score += 30;
          if (sev === "medium") score += 15;
          const p = String(pkt.protocol || "");
          if (p === "1") score += 5; // ICMP
          if (p === "6") score += 10; // TCP
          if (p === "17") score += 5; // UDP
          return Math.min(99, score);
        };
        setRecent(
          packets.slice(0, 5).map((p) => ({
            timestamp: new Date(p.timestamp || Date.now()).toLocaleString(),
            ip: `${p.src || "-"} → ${p.dst || "-"}`,
            type: protoName(p.protocol),
            confidence: confidenceScore(p),
            severity: pickSeverity(p),
          }))
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };
    load();
    const id = setInterval(load, 2000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const features = [
    { name: "Threat Detection", path: "/detect" },
    { name: "Network Monitor", path: "/network" },
    { name: "Dark Web Search", path: "/darkweb" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "IP Threat Analysis", path: "/ip-threat" },
  ];

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <ShieldIcon color="primary" />
        <Typography variant="h4" gutterBottom fontWeight="bold">Dashboard</Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Welcome back, {localStorage.getItem("username") || "Analyst"}. Here is your security overview.</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, borderTop: "4px solid #1976d2" }}>
            <Typography variant="subtitle2" color="text.secondary">Total Threats (24h)</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InsightsIcon color="primary" />
              <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, borderTop: "4px solid #d32f2f" }}>
            <Typography variant="subtitle2" color="text.secondary">Active Alerts</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ReportIcon color="error" />
              <Typography variant="h5" fontWeight="bold">{stats.active}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, borderTop: "4px solid #2e7d32" }}>
            <Typography variant="subtitle2" color="text.secondary">Threat Categories</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ShieldIcon color="success" />
              <Typography variant="h5" fontWeight="bold">{stats.categories}</Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, boxShadow: 3, borderTop: "4px solid #6a1b9a" }}>
            <Typography variant="subtitle2" color="text.secondary">Dark Web Mentions (today)</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PublicIcon sx={{ color: "#6a1b9a" }} />
              <Typography variant="h5" fontWeight="bold">{stats.darkweb}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {features.map((f, i) => {
          const iconMap = {
            "Threat Detection": <SecurityIcon />,
            "Network Monitor": <LanIcon />,
            "Dark Web Search": <DarkModeIcon />,
            "Chatbot": <ChatIcon />,
            "IP Threat Analysis": <TravelExploreIcon />,
          };
          return (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ p: 2, textAlign: "center", boxShadow: 4, borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 1, color: "primary.main" }}>
                    {iconMap[f.name]}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {f.name}
                  </Typography>
                  <Button fullWidth variant="contained" color="primary" onClick={() => navigate(f.path)}>
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Card sx={{ mt: 3, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Threats</Typography>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Threat Type</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Severity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.timestamp}</TableCell>
                  <TableCell>{r.ip}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.confidence}%</TableCell>
                  <TableCell>
                    <Chip
                      label={(r.severity || "low").toUpperCase()}
                      color={r.severity === "high" ? "error" : r.severity === "medium" ? "warning" : "success"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Footer />
      </Box>
    </Box>
  );
}
