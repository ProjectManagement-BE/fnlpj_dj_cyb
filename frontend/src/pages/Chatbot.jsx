import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography, TextField, List, ListItem } from "@mui/material";
import api from "../api/axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const system = "You are a cybersecurity assistant for the Cyber Threat Detection project. Only answer about this app's features (Threat Detection, Network Monitor, Dark Web Search, Chatbot, Auth) and related cybersecurity concepts. Be concise, structured, and use bullet points where helpful.";
      const { data } = await api.post("/chatbot/", { message: `${system}\n\nUser: ${input}` });
      const botMsg = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    setInput("");
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
      <Card sx={{ p: 2, maxWidth: 800, mx: "auto", boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Cybersecurity Chatbot
          </Typography>
          <List sx={{ minHeight: 300, maxHeight: 400, overflowY: "auto", mb: 2 }}>
            {messages.map((msg, i) => (
              <ListItem
                key={i}
                sx={{
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: msg.sender === "user" ? "primary.main" : "grey.300",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  <span style={{ whiteSpace: "pre-wrap" }}>{msg.text}</span>
                </Box>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Footer />
      </Box>
    </Box>
  );
}
