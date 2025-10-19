import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Card, CardContent, TextField, Button, Typography } from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import "./Auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post("/users/signup/", { username, password });
      setMessage("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setMessage("Error: Username might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)", px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 420, boxShadow: 8, borderRadius: 3, borderTop: "6px solid #9c27b0" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <PersonAddAltIcon sx={{ color: "#9c27b0" }} />
            <Typography variant="h5" fontWeight="bold">Create your account</Typography>
          </Box>
          {message && (
            <Typography sx={{ mb: 1 }}>{message}</Typography>
          )}
          <Box component="form" onSubmit={handleRegister} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            <Button type="submit" variant="contained" color="secondary" disabled={loading}>{loading ? "Creating..." : "Register"}</Button>
          </Box>
          <Typography sx={{ mt: 2 }}>
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
