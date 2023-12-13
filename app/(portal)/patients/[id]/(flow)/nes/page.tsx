"use client";

import { useAuthApi } from "@/app/(api)/api";
import { Page } from "@/app/(api)/pagination";
import { Title } from "@/app/(components)/Title";
import { AsyncAutocomplete } from "@/app/(components)/autocomplete";
import { DiseaseCie10 } from "@/app/(portal)/cie10/DiseaseCie10";
import { DrugProduct } from "@/app/(portal)/drugs/pharmaceutical-product/Drug";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Fab,
  Grid,
  ListSubheader,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ArrayHelpers,
  Field,
  FieldArray,
  Form,
  Formik,
  useFormikContext,
} from "formik";
import { Select, TextField } from "formik-mui";
import { isString } from "lodash";
import { useRouter } from "next/navigation";
import React from "react";
import useSWR from "swr";
import { PI_GROUPS } from "./pi-groups";
import {
  NesTableCells,
  emptyDrugNesEvaluation,
  nesTableCellsHead2,
  nesTableCellsHead3,
} from "./table";

import { requiredMessage } from "@/app/(components)/helpers/requiredMessage";
import yup from "@/app/validation";
import { PicoMedicine } from "./PicoMedicine";
import PicoDialog from "./PicoDialog";
import { picoSheetsSchema } from "./picoSheetsSchema";
import { drugEvaluationSchema } from "./drugEvaluationSchema";
import { SnackbarContext } from "@/app/(components)/SnackbarContext";

const emptyEvaluationRow = {
  symptoms: "",
  ...emptyDrugNesEvaluation,
};

const emptyPharmaceuticInterventionRow = {
  pharmaceuticIntervention: "",
  commentaries: "",
};

type NesRow = {
  evaluation: string;
  justification: string;
  prm: string;
};

type NesForm = {
  diagnosisRelated: {
    disease: string | DiseaseCie10;
    symptoms: string;
    drugEvaluations: DrugEvaluation[];
  }[];
  diagnosisNotRelated: ({ symptoms: string } & DrugEvaluation)[];
  pharmaceuticInterventions: {
    pharmaceuticIntervention: string;
    commentaries: string;
  }[];
  picoSheets: PicoMedicine[];
};

type DrugEvaluation = {
  medicine: string | DrugProduct;
  necessity: NesRow;
  effectivity: NesRow;
  security: NesRow;
};

// type NesForm = typeof initialValues;

export default function NesPage({ params }: { params: { id: number } }) {
  const { id: patientId } = params;
  const getApi = useAuthApi();
  const router = useRouter();
  const alert = React.useContext(SnackbarContext);

  const { data: anamnesis } = useSWR(`/patients/${patientId}/anamnesis`);
  const { data, mutate } = useSWR(
    anamnesis ? `/patients/${patientId}/nes` : null
  );

  if (!anamnesis) {
    return <div>Complete hoja de anamnesis</div>;
  }

  const initialValues: NesForm = {
    diagnosisRelated: anamnesis.diseases.map((disease: any) => ({
      disease,
      symptoms: "",
      drugEvaluations: [
        {
          ...emptyEvaluationRow,
        },
      ],
    })),
    diagnosisNotRelated: [
      {
        ...emptyEvaluationRow,
      },
    ],
    pharmaceuticInterventions: [
      {
        ...emptyPharmaceuticInterventionRow,
      },
    ],
    picoSheets: [],
  };

  const formInitialValues: NesForm = data
    ? {
        diagnosisRelated: data.diagnosisRelated.map((diagnosisR: any) => {
          return {
            ...diagnosisR,
            diagnosis: diagnosisR.disease,
          };
        }),
        diagnosisNotRelated: data.diagnosisNotRelated,
        pharmaceuticInterventions: data.pharmaceuticInterventions,
        picoSheets: data.picoSheets,
      }
    : initialValues;

  return (
    <div>
      <Title date={data?.createDate || new Date()}>
        Para la evaluación y el análisis de datos e identificación del PRM
      </Title>
      <Formik
        initialValues={formInitialValues}
        enableReinitialize
        validationSchema={yup.object({
          diagnosisRelated: yup.array().of(
            yup.object({
              disease: yup.object().required(requiredMessage),
              symptoms: yup.string().required(requiredMessage),
              drugEvaluations: yup
                .array()
                .of(yup.object(drugEvaluationSchema())),
            })
          ),
          diagnosisNotRelated: yup.array().of(
            yup.object({
              symptoms: yup.string().required(requiredMessage),
              ...drugEvaluationSchema(),
            })
          ),
          pharmaceuticInterventions: yup.array().of(
            yup.object({
              pharmaceuticIntervention: yup.string().required(requiredMessage),
              commentaries: yup.string().required(requiredMessage),
            })
          ),
          picoSheets: picoSheetsSchema,
        })}
        onSubmit={async (values) => {
          const data = {
            diagnosisRelated: values.diagnosisRelated.map(
              ({ disease, drugEvaluations, ...rest }) => {
                if (isString(disease)) {
                  throw "Diagnóstico inválido";
                }

                return {
                  ...rest,
                  diseaseId: disease.id,
                  drugEvaluations: drugEvaluations.map((drugEvaluation) => {
                    if (isString(drugEvaluation.medicine)) {
                      throw "Medicina inválida";
                    }

                    return {
                      ...drugEvaluation,
                      medicineId: drugEvaluation.medicine.id,
                    };
                  }),
                };
              }
            ),
            diagnosisNotRelated: values.diagnosisNotRelated.map(
              ({ medicine, ...rest }) => {
                if (isString(medicine)) {
                  throw "Medicina inválida";
                }

                return {
                  ...rest,
                  medicineId: medicine.id,
                };
              }
            ),
            pharmaceuticInterventions: values.pharmaceuticInterventions,
            picoSheets: values.picoSheets,
          };
          const response = await getApi().then((api) =>
            api.post(`patients/${patientId}/nes`, data)
          );
          mutate();
          alert.showMessage("Información guardada exitosamente");
          router.push(`/patients/${patientId}/soap`);
        }}
      >
        {({ values }) => (
          <Form>
            <Typography variant="h6" pt={4}>
              Evaluación de medicamentos relacionados al diagnóstico
            </Typography>
            <DiagnosisTable anamnesis={anamnesis} />
            <Typography variant="h6" pt={4}>
              Evaluación de medicamentos que no se relacionan con el diagnóstico
            </Typography>
            <EvaluationNesTable
              values={values.diagnosisNotRelated}
              name="diagnosisNotRelated"
            />
            <Grid container pt={4}>
              <Grid item xs={10} paddingBottom={2}>
                <Typography variant="h6" pt={2}>
                  Plan de intervención farmaceutica
                </Typography>
              </Grid>
              <FieldArray name="pharmaceuticInterventions">
                {(arrayHelpers: ArrayHelpers) => (
                  <Grid container>
                    {values.pharmaceuticInterventions.map((x, index) => (
                      <Grid container key={index} paddingBottom={2}>
                        {values.pharmaceuticInterventions.length > 1 && (
                          <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="end"
                            paddingBottom={2}
                          >
                            <Fab
                              color="primary"
                              aria-label="delete"
                              onClick={arrayHelpers.handleRemove(index)}
                            >
                              <CloseIcon />
                            </Fab>
                          </Grid>
                        )}
                        <Grid item xs={6} sx={{ paddingRight: "20px" }}>
                          <PiSelect
                            name={`pharmaceuticInterventions.${index}.pharmaceuticIntervention`}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            component={TextField}
                            name={`pharmaceuticInterventions.${index}.commentaries`}
                            label="Comentarios"
                            variant="outlined"
                            multiline
                            rows={4}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      // <Box key={index}>Hola</Box>
                    ))}
                    {values.pharmaceuticInterventions.length > 0 && (
                      <div>
                        <Box textAlign="center">
                          <Button
                            startIcon={<AddIcon />}
                            onClick={() =>
                              arrayHelpers.push(
                                emptyPharmaceuticInterventionRow
                              )
                            }
                          >
                            Agregar otra intervención farmaceutica
                          </Button>
                        </Box>
                        <PicoDialog />
                      </div>
                    )}
                  </Grid>
                )}
              </FieldArray>
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
}

const DiagnosisTable = ({ anamnesis }: { anamnesis: any }) => {
  const { values } = useFormikContext<NesForm>();
  const getApi = useAuthApi();

  const searchDiseases = (searchText: string) => {
    return getApi().then((api) =>
      api
        .get<Page<DiseaseCie10>>(
          "/diseases/search/findByNameContainingIgnoringCase",
          {
            params: { page: 0, searchText },
          }
        )
        .then((x) => x.data._embedded.diseases)
    );
  };

  return (
    <TableContainer component={Paper} sx={{ pt: 2 }}>
      <FieldArray name="diagnosis">
        {(arrayHelpers: ArrayHelpers) => (
          <Table>
            {/* <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Datos de Salud
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Evaluación de datos de salud
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell rowSpan={2} sx={{ minWidth: 300 }}>
                  Diagnóstico(s)
                </TableCell>
                <TableCell rowSpan={2} sx={{ minWidth: 300 }}>
                  Signos y sintomas que se relacionan con el diagnóstico
                </TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {values.diagnosisRelated.map((x, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <AsyncAutocomplete
                        label="Diagnóstico"
                        name={`diagnosisRelated.${index}.disease`}
                        filter={searchDiseases}
                        disabled
                      />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Field
                        component={TextField}
                        fullWidth
                        name={`diagnosisRelated.${index}.symptoms`}
                        label="Signos y sintomas que se relacionan con el diagnóstico"
                        multiline
                        rows={4}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <EvaluationNesTable
                        values={values.diagnosisRelated[index].drugEvaluations}
                        name={`diagnosisRelated.${index}.drugEvaluations`}
                      />
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </FieldArray>
    </TableContainer>
  );
};

const EvaluationNesTable = ({ name, values }: { name: any; values: any[] }) => {
  return (
    <TableContainer component={Paper} sx={{ pt: 2 }}>
      <FieldArray name={name}>
        {(arrayHelpers: ArrayHelpers) => (
          <Table>
            <TableHead>
              {/* <TableRow>
                {name === "diagnosisNotRelated" && (
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Evaluación de datos de salud
                  </TableCell>
                )}
                {nesTableCellsHead1}
              </TableRow> */}
              <TableRow>
                {name === "diagnosisNotRelated" && (
                  <TableCell rowSpan={2} sx={{ minWidth: 300 }}>
                    Signos y sintomas que no se relacionan con el diagnóstico
                  </TableCell>
                )}
                {nesTableCellsHead2}
              </TableRow>
              <TableRow>{nesTableCellsHead3}</TableRow>
            </TableHead>
            <TableBody>
              {values.map((x, index) => (
                <TableRow key={index}>
                  {name === "diagnosisNotRelated" && (
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Field
                        component={TextField}
                        fullWidth
                        name={`${name}.${index}.symptoms`}
                        label="Sintomas"
                        multiline
                        rows={4}
                      />
                    </TableCell>
                  )}
                  <NesTableCells
                    name={name}
                    index={index}
                    values={x}
                    onRemove={arrayHelpers.handleRemove(index)}
                  />
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => arrayHelpers.push(emptyEvaluationRow)}
                  >
                    Agregar medicamento
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

const PiSelect = ({ name }: any) => {
  return (
    <Field
      component={Select}
      formControl={{ sx: { width: "100%" } }}
      name={name}
      label="Intervenciones Farmaceuticas"
      fullWidth
    >
      <MenuItem value="">
        <em>Ninguno:</em>
      </MenuItem>
      {PI_GROUPS.map((x) => [
        <ListSubheader key={x.group}>{x.group}</ListSubheader>,
        ...x.items.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        )),
      ])}
    </Field>
  );
};
