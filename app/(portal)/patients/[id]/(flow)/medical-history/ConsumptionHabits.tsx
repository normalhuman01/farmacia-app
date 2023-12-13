"use client";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { blue } from "@mui/material/colors";
import { Field, useFormikContext } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import React from "react";
import { consumptionHabits } from "./data";
import { Subtitle } from "./Subtitle";
import { OutlinedPaper } from "./OutlinedPaper";

export const ConsumptionHabits = () => {
  const { errors, touched } = useFormikContext<{
    consumptionHabits: { [key: string]: string };
  }>();

  return (
    <Grid container component={OutlinedPaper}>
      <Grid xs={8} container>
        {consumptionHabits.map((group, index) => (
          <Grid key={index} xs={4}>
            <Subtitle component="h6">{group.label}</Subtitle>
            <FormControl
              required
              error={Boolean(
                touched.consumptionHabits?.[group.id] &&
                  errors.consumptionHabits?.[group.id]
              )}
              key={group.id}
            >
              <Field
                component={RadioGroup}
                name={"consumptionHabits." + group.id}
              >
                <FormControlLabel
                  value={group.no.name}
                  control={<Radio sx={{ color: blue[700] }} />}
                  label={group.no.label}
                />
                <Subtitle component="h6">Tipos: </Subtitle>
                {group.types.map((type) => (
                  <FormControlLabel
                    key={type.name}
                    value={type.name}
                    control={
                      <Radio
                        sx={{
                          color: blue[700],
                        }}
                      />
                    }
                    label={type.label}
                  />
                ))}
              </Field>

              <FormHelperText>
                {touched.consumptionHabits?.[group.id] &&
                  errors.consumptionHabits?.[group.id]}
              </FormHelperText>
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <Grid xs={4}>
        <Stack spacing={2}>
          <Field
            component={TextField}
            name="consumptionHabits.water"
            label="Cantidad de agua que consume:"
            variant="outlined"
            fullWidth
          />
          <Field
            name="consumptionHabits.others"
            label="Otros:"
            component={TextField}
            variant="outlined"
            multiline
            rows={4}
            fullWidth
          />
        </Stack>
      </Grid>
    </Grid>
  );
};
