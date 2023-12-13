"use client";
import { Title } from "@/app/(components)/Title";
import { requiredMessage } from "@/app/(components)/helpers/requiredMessage";
import yup from "@/app/validation";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Fab, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { ArrayHelpers, Field, FieldArray, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import React from "react";
import PicoDialog from "../nes/PicoDialog";
import { drugEvaluationSchema } from "../nes/drugEvaluationSchema";
import { picoSheetsSchema } from "../nes/picoSheetsSchema";
import { PharmacotherapyTable } from "../pharmacotherapy/PharmacotherapyTable";
import { historySchema } from "../pharmacotherapy/historySchema";
import { NesTable } from "./NesTable";
import { TrackingSheet, emptySoapRow } from "./TrackingSheet";

export const TrackingSheetForm = ({
  initialValues,
  onSubmit,
}: {
  initialValues: TrackingSheet & { createDate: Date };
  onSubmit: (values: TrackingSheet) => Promise<void>;
}) => {
  return (
    <div>
      <Title date={initialValues.createDate}>Hoja de seguimiento</Title>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={yup.object({
          history: historySchema,
          drugEvaluations: yup.array().of(yup.object(drugEvaluationSchema())),
          soapRows: yup.array().of(
            yup.object({
              problem: yup.string().required(requiredMessage),
              subjective: yup.string().required(requiredMessage),
              objective: yup.string().required(requiredMessage),
              analysis: yup.string().required(requiredMessage),
              plan: yup.string().required(requiredMessage),
            })
          ),
          picoSheets: picoSheetsSchema,
        })}
        onSubmit={onSubmit}
      >
        {({ values, errors }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid xs={10} pt={4}>
                <strong>Farmacoterapia (P) Prescrito (A) Automedicado </strong>
              </Grid>
              <Grid xs={12}>
                <PharmacotherapyTable name="history" values={values} />
              </Grid>
              <Grid xs={12}>
                <NesTable />
              </Grid>
              <Grid xs={12}>
                <Typography variant="h5">SOAP</Typography>
              </Grid>
              <Grid xs={12} container>
                <FieldArray name="soapRows">
                  {(arrayHelpers: ArrayHelpers) => (
                    <Grid xs={12} container spacing={1}>
                      {values.soapRows.map((x, index) => (
                        <Grid xs={12} container spacing={1} key={index}>
                          {values.soapRows.length > 1 && (
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
                          <Grid xs={12}>
                            <Field
                              component={TextField}
                              name={`soapRows.${index}.problem`}
                              label="Problema"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid xs={1} alignItems="center" display="flex">
                            S
                          </Grid>
                          <Grid xs={11}>
                            <Field
                              component={TextField}
                              name={`soapRows.${index}.subjective`}
                              label="Subjetivo"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid xs={1} alignItems="center" display="flex">
                            O
                          </Grid>
                          <Grid xs={11}>
                            <Field
                              component={TextField}
                              name={`soapRows.${index}.objective`}
                              label="Objetivo"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid xs={1} alignItems="center" display="flex">
                            A
                          </Grid>
                          <Grid xs={11}>
                            <Field
                              component={TextField}
                              name={`soapRows.${index}.analysis`}
                              label="Análisis"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                          <Grid xs={1} alignItems="center" display="flex">
                            P
                          </Grid>
                          <Grid xs={11}>
                            <Field
                              component={TextField}
                              name={`soapRows.${index}.plan`}
                              label="Plan"
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      ))}
                      <div>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() => {
                              arrayHelpers.push(emptySoapRow);
                            }}
                          >
                            Agregar otra fila
                          </Button>
                        </Box>
                        <PicoDialog />
                      </div>
                    </Grid>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
            <Box
              display="flex"
              justifyContent="flex-end"
              sx={{ marginTop: "10px" }}
            >
              <Button variant="contained" type="submit">
                Guardar
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
};
