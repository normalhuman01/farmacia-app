"use client";
import { useAuthApi } from "@/app/(api)/api";
import { Page } from "@/app/(api)/pagination";
import {
  InexactDatePicker,
  InexactDateType,
} from "@/app/(components)/InexactDatePicker";
import { AsyncAutocomplete } from "@/app/(components)/autocomplete";
import { DrugProduct } from "@/app/(portal)/drugs/pharmaceutical-product/Drug";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { ArrayHelpers, Field, FieldArray, useFormikContext } from "formik";
import { RadioGroup, TextField } from "formik-mui";
import React from "react";
import { TABLE_WIDTH_DATE, TABLE_WIDTH_ACTION } from "./table";
import { emptyHistoryRow } from "./emptyHistoryRow";

export type PharmaceuticHistoryRow = {
  administration: string;
  difficulty: string;
  difficultyJustification: string;
  acceptance: string;
  reasonForUse: string;
  restartDate: InexactDateType;
  startDate: InexactDateType;
  suspensionDate: InexactDateType;
  dose: string;
  mode: string;
  drug: string | DrugProduct;
};

export const PharmacotherapyTable = <T extends string>({
  values,
  name,
}: {
  name: T;
  values: {
    [key in T]: PharmaceuticHistoryRow[];
  };
}) => {
  const { touched, errors } = useFormikContext<any>();

  const getApi = useAuthApi();

  const searchDrugPharmaceuticalProducts = (searchText: string) =>
    getApi().then((api) =>
      api
        .get<Page<DrugProduct>>(
          "drugPharmaceuticalProducts/search/findByFullName",
          {
            params: { page: 0, searchText },
          }
        )
        .then((x) => x.data._embedded.drugPharmaceuticalProducts)
    );

  return (
    <TableContainer component={Paper}>
      <FieldArray name={name}>
        {(arrayHelpers: ArrayHelpers) => (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 300 }}>Medicamento</TableCell>
                <TableCell style={{ width: 50 }}>P/A</TableCell>
                <TableCell style={{ minWidth: 200 }} align="center">
                  Dosis
                </TableCell>
                <TableCell style={{ width: TABLE_WIDTH_DATE }} align="center">
                  Fecha inicio
                </TableCell>
                <TableCell style={{ width: TABLE_WIDTH_DATE }} align="center">
                  Fecha susp
                </TableCell>
                <TableCell sx={{ width: 3 * TABLE_WIDTH_ACTION }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {values[name].map((item, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>
                      <AsyncAutocomplete
                        label="Medicamento"
                        name={`${name}.${index}.drug`}
                        getLabel={(option) => option.fullName}
                        filter={searchDrugPharmaceuticalProducts}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl
                        variant="outlined"
                        error={Boolean(
                          (touched[name] as any)?.[index]?.mode &&
                            (errors[name] as any)?.[index]?.mode
                        )}
                      >
                        <Field
                          component={RadioGroup}
                          name={`${name}.${index}.mode`}
                          row
                        >
                          <FormControlLabel
                            value="P"
                            control={<Radio />}
                            label="P"
                          />
                          <FormControlLabel
                            value="A"
                            control={<Radio />}
                            label="A"
                          />
                        </Field>
                        <FormHelperText>
                          {(touched[name] as any)?.[index]?.mode &&
                            (errors[name] as any)?.[index]?.mode}
                        </FormHelperText>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Field
                        name={`${name}.${index}.dose`}
                        component={TextField}
                        variant="outlined"
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <InexactDatePicker name={`${name}.${index}.startDate`} />
                    </TableCell>
                    <TableCell>
                      <InexactDatePicker
                        name={`${name}.${index}.suspensionDate`}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Eliminar">
                        <IconButton
                          aria-labelledby="eliminar"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <OtherInformationDialog
                        name={name}
                        index={index}
                        item={item}
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => {
                      arrayHelpers.push(emptyHistoryRow);
                    }}
                  >
                    Agregar fila
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </FieldArray>
    </TableContainer>
  );
};

const OtherInformationDialog = ({
  name,
  index,
  item,
}: {
  name: string;
  index: number;
  item: any;
}) => {
  const { touched, errors } = useFormikContext<any>();
  const [open, setOpen] = React.useState(false);

  const onClose = () => {
    setOpen(false);
  };
  const rowErrors = (errors[name] as any)?.[index];
  const rowTouched = (touched[name] as any)?.[index];

  return (
    <>
      <Tooltip title="Ver más">
        <IconButton aria-labelledby="Ver" onClick={() => setOpen(true)}>
          <SearchIcon />
        </IconButton>
      </Tooltip>
      {rowTouched?.acceptance &&
        (rowErrors?.restartDate ||
          rowErrors?.reasonForUse ||
          rowErrors?.acceptance ||
          rowErrors?.acceptance ||
          rowErrors?.administration ||
          rowErrors?.difficulty) && (
          <Tooltip title="Hay errores, vea más">
            <IconButton
              aria-labelledby="Ver"
              onClick={() => setOpen(true)}
              color="error"
            >
              <ErrorOutlineIcon />
            </IconButton>
          </Tooltip>
        )}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle style={{ fontSize: "1rem" }}>Otra información</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <InexactDatePicker
              name={`${name}.${index}.restartDate`}
              label="Fecha rein."
            />
            <Field
              name={`${name}.${index}.reasonForUse`}
              component={TextField}
              variant="outlined"
              label="Motivo de uso"
            />
            <FormControl
              variant="outlined"
              error={Boolean(rowTouched?.acceptance && rowErrors?.acceptance)}
            >
              <FormLabel id="acceptance-radio-group">Aceptación</FormLabel>
              <Field
                component={RadioGroup}
                name={`${name}.${index}.acceptance`}
                row
              >
                <FormControlLabel value="Si" control={<Radio />} label="Si" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
                <FormControlLabel
                  value="No aplica"
                  control={<Radio />}
                  label="No aplica"
                />
              </Field>

              <FormHelperText>
                {rowTouched?.acceptance && rowErrors?.acceptance}
              </FormHelperText>
            </FormControl>
            <Field
              name={`${name}.${index}.administration`}
              component={TextField}
              label="Administración"
              variant="outlined"
            />
            <FormControl
              variant="outlined"
              error={Boolean(rowTouched?.difficulty && rowErrors?.difficulty)}
            >
              <FormLabel id="difficulty-radio-group">
                Dificultades para tomarlo y/o tolerarlo
              </FormLabel>
              <Field
                component={RadioGroup}
                name={`${name}.${index}.difficulty`}
                row
              >
                <FormControlLabel value="Si" control={<Radio />} label="Si" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </Field>
              <FormHelperText>
                {rowTouched?.difficulty && rowErrors?.difficulty}
              </FormHelperText>
            </FormControl>
            {item.difficulty === "Si" && (
              <Field
                name={`${name}.${index}.difficultyJustification`}
                multiline
                rows={4}
                component={TextField}
                label="Comentarios"
                variant="outlined"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "20px 24px" }}>
          <Button variant="contained" onClick={onClose}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
