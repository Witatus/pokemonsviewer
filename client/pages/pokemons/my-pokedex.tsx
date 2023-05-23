import React from "react";
import { Typography, Box } from "@mui/material";
import Sidebar from "@/features/Navigation/components/Sidebar";

const Pokedex: React.FC = () => {
  return (
    <>
    <Sidebar />
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Typography 
        variant="h4" 
        component="div" 
        sx={{ fontWeight: 600, textAlign: "center" }}
      >
        In progress
      </Typography>
    </Box>
    </>
  );
};

export default Pokedex;
