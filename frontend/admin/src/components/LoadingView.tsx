import { CircularProgress, Paper } from "@mui/material";

export default function LoadingView() {
  return (
    <Paper
      elevation={0}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: add a background for the loading overlay
      }}
    >
      <CircularProgress />
    </Paper>
  );
}
