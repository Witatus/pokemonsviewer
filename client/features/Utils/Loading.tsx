import React from "react";
import { Vortex } from "react-loader-spinner";
import { Typography, Box } from "@mui/material";

const Loading: React.FC = () => {
  return (
    <div>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Vortex
          visible={true}
          height="120"
          width="120"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
        <Typography
          variant="h4"
          component="div"
          sx={{ fontWeight: 600, textAlign: "center" }}
        >
           First loading may take longer as backend needs to boot up.
        </Typography>
      </Box>
    </div>
  );
};

export default Loading;
