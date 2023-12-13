"use client";
import { Paper, PaperProps } from "@mui/material";
import React from "react";

export const OutlinedPaper = ({ children, ...rest }: PaperProps) => (
  <Paper variant="outlined" sx={{ p: 2 }} {...rest}>
    {children}
  </Paper>
);
