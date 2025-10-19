import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography, TextField, List, ListItem } from "@mui/material";
import api from "../api/axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function DarkWebSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    try {
      const { data } = await api.get("/darkweb/", { params: { q: query } });
      // DarkWebView returns { status, query, results }
      setResults(data.results || []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4 }}>
      <Card sx={{ p: 2, maxWidth: 800, mx: "auto", boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Dark Web Search
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Search Keyword"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={search}>
              Search
            </Button>
          </Box>
          <List>
            {results.map((r, i) => (
              <ListItem key={i}>
                {typeof r === "string" ? (
                  r
                ) : (
                  <Box>
                    <Typography variant="subtitle2">{r.title || r.source || "Result"}</Typography>
                    {r.url && (
                      <Typography variant="body2" color="text.secondary">
                        {r.url}
                      </Typography>
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <Footer />
      </Box>
    </Box>
  );
}
