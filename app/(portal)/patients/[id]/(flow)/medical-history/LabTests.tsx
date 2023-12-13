"use client";
import { useAuthApi } from "@/app/(api)/api";
import { Page } from "@/app/(api)/pagination";
import { AsyncAutocomplete } from "@/app/(components)/autocomplete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Fab,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { blue } from "@mui/material/colors";
import {
  ArrayHelpers,
  Field,
  FieldArray,
  getIn,
  useFormikContext,
} from "formik";
import { RadioGroup, TextField } from "formik-mui";
import { DatePicker } from "formik-mui-x-date-pickers";
import React from "react";
import { LabTestD } from "./LabTestD";
import { Anamnesis } from "./page";

export type LabTest = {
  name: string;
  date: Date | null;
  result: string;
  normalRange: string;
  comments: string;
};

const emptyLabTest: LabTest = {
  name: "",
  date: null,
  result: "",
  normalRange: "",
  comments: "",
};

export const LabTests = () => {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<Anamnesis>();
  const getApi = useAuthApi();

  const searchLabTest = (searchText: string) => {
    return getApi().then((api) =>
      api
        .get<Page<LabTestD>>(
          "labTests/search/findByNameContainingIgnoringCase",
          {
            params: { page: 0, searchText },
          }
        )
        .then((x) => x.data._embedded.labTests.map((x) => x.name))
    );
  };

  return (
    <Box>
      <Stack spacing={2} direction="row" alignItems="center">
        <FormControl
          error={Boolean(touched.existLabTests && errors.existLabTests)}
        >
          <Box display="flex" alignItems="center">
            <label htmlFor="existLabTests">
              ¿Se realizaron examenes de laboratorio u otra prueba diagnostica?
            </label>
            <Field
              component={RadioGroup}
              id="existLabTests"
              name="existLabTests"
              sx={{ marginLeft: "20px" }}
              row
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const existLabTests = e.target.value === "true";
                setFieldValue("labTests", existLabTests ? [emptyLabTest] : []);
                setFieldValue("existLabTests", existLabTests);
              }}
            >
              <FormControlLabel
                value={true}
                control={<Radio sx={{ color: blue[700] }} />}
                label="Si"
              />
              <FormControlLabel
                value={false}
                control={<Radio sx={{ color: blue[700] }} />}
                label="No"
              />
            </Field>
          </Box>
          <FormHelperText>
            {touched.existLabTests && errors.existLabTests}
          </FormHelperText>
        </FormControl>
      </Stack>
      <Stack>
        <FieldArray name="labTests">
          {(arrayHelpers: ArrayHelpers) => (
            <Stack spacing={2}>
              {values.labTests.map((x, index) => {
                const touch = getIn(touched, `labTests[${index}]`);
                const error = getIn(errors, `labTests[${index}]`);

                return (
                  <Grid container spacing={1} key={index}>
                    {values.labTests.length > 1 && (
                      <Grid xs={12} display="flex" justifyContent="end">
                        <Fab
                          color="primary"
                          aria-label="delete"
                          onClick={arrayHelpers.handleRemove(index)}
                        >
                          <CloseIcon />
                        </Fab>
                      </Grid>
                    )}
                    <Grid xs={6}>
                      <AsyncAutocomplete
                        label="Examen de laboratorio o prueba diagnostica"
                        name={`labTests.${index}.name`}
                        filter={searchLabTest}
                        getLabel={(x) => x}
                      />
                    </Grid>
                    <Grid xs={3}>
                      <Field
                        component={DatePicker}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            label: "Fecha",
                            error: touch?.date && !!error?.date,
                            helperText:
                              touch?.date && error?.date ? error?.date : "",
                          },
                        }}
                        name={`labTests.${index}.date`}
                      />
                    </Grid>
                    <Grid xs={3}>
                      <Field
                        name={`labTests.${index}.result`}
                        label="Resultado"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Field
                        name={`labTests.${index}.normalRange`}
                        label="Rango de valor normal"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Field
                        name={`labTests.${index}.comments`}
                        label="Evaluacion/comentarios"
                        component={TextField}
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                );
              })}
              {values.labTests.length > 0 && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    arrayHelpers.push(emptyLabTest);
                  }}
                >
                  Agregar otra prueba de laboratorio
                </Button>
              )}
            </Stack>
          )}
        </FieldArray>
      </Stack>
    </Box>
  );
};
