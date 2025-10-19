import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Card, CardContent, TextField, Button, Typography } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import "./Auth.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.post("/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "#f5f7fb", px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 420, boxShadow: 6, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h5" fontWeight="bold">Login to Cyber Threat Detection</Typography>
          </Box>
          {error && (
            <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
          )}
          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            <Button type="submit" variant="contained" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
          </Box>
          <Typography sx={{ mt: 2 }}>
            Don’t have an account? <a href="/register">Register here</a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
