import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { ArrayHelpers, Field, FieldArray, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import React from "react";
import { PicoMedicine } from "./PicoMedicine";
import { emptyPicoRow } from "./emptyPicoRow";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { isEqual } from "lodash";

export const PicoDialog = () => {
  const [open, setOpen] = React.useState(false);

  const { values, setFieldValue, errors, touched } = useFormikContext<{
    picoSheets: PicoMedicine[];
  }>();
  const handleClose = () => {
    if (
      values.picoSheets.length === 1 &&
      isEqual(values.picoSheets[0], emptyPicoRow)
    ) {
      setFieldValue("picoSheets", []);
    }

    setOpen(false);
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            if (values.picoSheets.length === 0) {
              setFieldValue("picoSheets", [
                {
                  ...emptyPicoRow,
                },
              ]);
            }
            setOpen(true);
          }}
        >
          {values.picoSheets.length === 0 ||
          (values.picoSheets.length === 1 &&
            isEqual(values.picoSheets[0], emptyPicoRow))
            ? "Agregar PICO"
            : "Ver PICOs"}
        </Button>
        {touched.picoSheets && errors.picoSheets && (
          <Tooltip title="Hay errores, vea más">
            <IconButton
              aria-labelledby="Ver"
              onClick={() => {
                if (values.picoSheets.length === 0) {
                  setFieldValue("picoSheets", [
                    {
                      ...emptyPicoRow,
                    },
                  ]);
                }
                setOpen(true);
              }}
              color="error"
            >
              <ErrorOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        {/* <DialogTitle>PREGUNTA CLINÍCA:</DialogTitle> */}
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>
        <DialogContent>
          <FieldArray name="picoSheets">
            {(arrayHelpers: ArrayHelpers) => (
              <>
                {values.picoSheets.map((x, index) => (
                  <React.Fragment key={index}>
                    {values.picoSheets.length > 1 && (
                      <Grid item xs={12} display="flex" justifyContent="end">
                        <Tooltip title="Eliminar">
                          <Fab
                            aria-label="delete"
                            sx={{ margin: "10px 0px" }}
                            color="primary"
                            onClick={arrayHelpers.handleRemove(index)}
                          >
                            <CloseIcon />
                          </Fab>
                        </Tooltip>
                      </Grid>
                    )}
                    <Field
                      required
                      component={TextField}
                      name={`picoSheets.${index}.clinicalQuestion`}
                      label="Pregunta clínica"
                      variant="outlined"
                      fullWidth
                      sx={{ margin: "10px 0px" }}
                    />
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Español</TableCell>
                            <TableCell>Inglés</TableCell>
                            <TableCell>Término Mesh</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell>P</TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.patient.spanish`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.patient.english`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.patient.meshTerm`}
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>I</TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.intervention.spanish`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.intervention.english`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.intervention.meshTerm`}
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>C</TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.comparison.spanish`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.comparison.english`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.comparison.meshTerm`}
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>O</TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.outcome.spanish`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.outcome.english`}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                <Field
                                  component={TextField}
                                  name={`picoSheets.${index}.outcome.meshTerm`}
                                  variant="outlined"
                                />
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box>
                      <Field
                        required
                        component={TextField}
                        name={`picoSheets.${index}.searchStrategy`}
                        multiline
                        variant="outlined"
                        sx={{ margin: "10px 0px" }}
                        label="Estrategia(s) Búsqueda"
                        placeholder="Describa las palabras claves y los motores de búsqueda que utilizó"
                        rows={4}
                        fullWidth
                      />
                    </Box>
                  </React.Fragment>
                ))}

                <Box display="flex" justifyContent="space-between">
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => arrayHelpers.push(emptyPicoRow)}
                  >
                    Agregar otra fila
                  </Button>
                  <Button variant="contained" onClick={handleClose}>
                    Aceptar
                  </Button>
                </Box>
              </>
            )}
          </FieldArray>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PicoDialog;
