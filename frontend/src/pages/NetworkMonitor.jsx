import React, { useState } from "react";
import { Box, Button, Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import api from "../api/axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NetworkMonitor() {
  const [logs, setLogs] = useState([]);

  const capture = async () => {
    try {
      // Backend GET returns { captured_packets: [...] }
      const { data } = await api.get("/monitor/");
      const packets = data.captured_packets || [];
      setLogs(packets.map((p) => ({ src: p.src, dst: p.dst, protocol: p.proto })));
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
            Network Monitor
          </Typography>
          <Button variant="contained" color="secondary" onClick={capture} sx={{ mb: 2 }}>
            Capture Packets
          </Button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Destination</TableCell>
                <TableCell>Protocol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{log.src}</TableCell>
                  <TableCell>{log.dst}</TableCell>
                  <TableCell>{log.protocol}</TableCell>
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
