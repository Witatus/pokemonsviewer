import React from "react";
import Sidebar from "@/features/Navigation/components/Sidebar";
import { Typography, Box } from "@mui/material";

const AddPokemon: React.FC = () => {
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

export default AddPokemon;
