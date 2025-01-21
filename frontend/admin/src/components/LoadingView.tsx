import { CircularProgress, Paper } from "@mui/material";
import React from "react";


export default function LoadingView() {

    return (
        <Paper elevation={0}>
            <CircularProgress />
        </Paper>
    );
}
