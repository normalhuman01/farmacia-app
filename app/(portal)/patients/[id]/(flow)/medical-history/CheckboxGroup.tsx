"use client";
import { Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { blue } from "@mui/material/colors";
import { Field } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import React from "react";
import { GroupItems } from "./data";
import { Subtitle } from "./Subtitle";

export const CheckboxGroup = ({ group }: { group: GroupItems }) => {
  return (
    <Grid xs={3}>
      <Subtitle component="h6">{group.label}</Subtitle>
      <Stack>
        {group.items.map((item, idx) => (
          <Field
            key={idx}
            component={CheckboxWithLabel}
            type="checkbox"
            name={group.id}
            value={item.name}
            Label={{ label: item.label }}
            sx={{
              color: blue[700],
            }}
          />
        ))}
      </Stack>
    </Grid>
  );
};
