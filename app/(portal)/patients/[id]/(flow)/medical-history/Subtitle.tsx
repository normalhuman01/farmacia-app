"use client";
import { Typography } from "@mui/material";
import React from "react";

export const Subtitle = ({
  children,
  component,
}: {
  children: React.ReactNode;
  component: React.ElementType;
}) => (
  <Typography component={component} sx={{ fontWeight: "bold" }} gutterBottom>
    {children}
  </Typography>
);
