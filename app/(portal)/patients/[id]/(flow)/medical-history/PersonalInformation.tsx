"use client";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { differenceInYears } from "date-fns";
import { Field, useFormikContext } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import { DatePicker } from "formik-mui-x-date-pickers";
import { Anamnesis } from "./page";
import { minYear, today } from "@/app/date";
import { isNumber, isString } from "lodash";

const EMPTY = "-";

const getImc = ({
  size,
  weight,
}: {
  size?: number | string;
  weight?: number | string;
}) => {
  if (size && weight && isNumber(size) && isNumber(weight)) {
    return (weight / size ** 2).toFixed(1);
  }

  return EMPTY;
};

// Adapted from: https://stackoverflow.com/questions/66470624/date-fns-format-date-and-age-calculation-problem-in-react
function calculateAge(date: Date) {
  const age = differenceInYears(new Date(), date);
  if (isNaN(age)) {
    return EMPTY;
  }

  return age;
}

export const PersonalInformation = () => {
  const { values, errors, touched } = useFormikContext<Anamnesis>();

  return (
    <Grid container spacing={2}>
      <Grid xs={3}>
        <Field
          label="Ocupación"
          name="occupation"
          fullWidth
          component={TextField}
          variant="outlined"
        />
      </Grid>
      <Grid xs={3}>
        <Field
          component={DatePicker}
          minDate={minYear}
          maxDate={today}
          slotProps={{
            textField: {
              fullWidth: true,
              label: "Fecha de Nacimiento",
              error: touched.birthdate && !!errors.birthdate,
              helperText:
                touched.birthdate && errors.birthdate ? errors.birthdate : "",
            },
          }}
          name="birthdate"
        />
      </Grid>
      <Grid xs={2} p={3}>
        Edad:{" "}
        {values.birthdate && !isString(values.birthdate)
          ? calculateAge(values.birthdate)
          : EMPTY}
      </Grid>
      <Grid xs={2}>
        <FormControl error={Boolean(touched.sex && errors.sex)}>
          <FormLabel>Sexo:</FormLabel>
          <Field component={RadioGroup} name="sex" row>
            <FormControlLabel value="M" control={<Radio />} label="M" />
            <FormControlLabel value="F" control={<Radio />} label="F" />
          </Field>
          <FormHelperText>{touched.sex && errors.sex}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid xs={3}>
        <Field
          label="Peso (kg):"
          name="weight"
          component={TextField}
          type="number"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid xs={3}>
        <Field
          label="Talla (m):"
          name="size"
          component={TextField}
          type="number"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid xs={4} p={3}>
        IMC: {getImc(values)}
      </Grid>
    </Grid>
  );
};
