"use client";

import { useAuthApi } from "@/app/(api)/api";
import { Title } from "@/app/(components)/Title";
import {
  Box,
  Button,
  ListSubheader,
  MenuItem,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Field, Form, Formik } from "formik";
import { Checkbox, Select } from "formik-mui";
import { isObject, sum } from "lodash";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Page } from "../../../../../(api)/pagination";
import { AsyncAutocomplete } from "../../../../../(components)/autocomplete";
import yup from "../../../../../validation";
import { Drug } from "../../../../drugs/narrow-margin/Drug";
import { patientSelectionCriteriaList } from "./patientSelectionCriteriaList";
import { PRM_GROUPS } from "./prm-groups";
import { PatientDocument } from "../PatientDocument";
import React from "react";
import { SnackbarContext } from "@/app/(components)/SnackbarContext";

const PrmSelect = () => {
  return (
    <Field
      component={Select}
      formControl={{ sx: { m: 1, width: "100%" } }}
      id="prm"
      name="prm"
      label="PRM"
    >
      <MenuItem value="">
        <em>Ninguno</em>
      </MenuItem>
      {PRM_GROUPS.map((x) => [
        <ListSubheader key={x.group}>{x.group}</ListSubheader>,
        ...x.items.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}: {item.description}
          </MenuItem>
        )),
      ])}
    </Field>
  );
};

const DrugAutocomplete = () => {
  const getApi = useAuthApi();

  return (
    <AsyncAutocomplete
      label="Medicamento"
      name="drug"
      filter={(searchText) =>
        getApi().then((api) =>
          api
            .get<Page<Drug>>(
              "drugNarrowMargins/search/findByNameContainingIgnoringCase",
              {
                params: { page: 0, searchText },
              }
            )
            .then((x) => x.data._embedded.drugNarrowMargins)
        )
      }
    />
  );
};

const CRITERIA_DRUG = 1;
const CRITERIA_PRM = 8;

const helpReferences = [
  { criteriaId: CRITERIA_DRUG, component: DrugAutocomplete },
  { criteriaId: CRITERIA_PRM, component: PrmSelect },
];

const getTotalScore = (criterionList: string[]) => {
  return sum(
    criterionList
      .map((x) => Number(x))
      .map((x) =>
        patientSelectionCriteriaList.find((criterion) => criterion.id === x)
      )
      .map((criterion) => criterion?.score || 0)
  );
};

type SelectionForm = {
  criterionList: string[];
  drug: Drug | string | null;
  prm: string;
};

const initialValues: SelectionForm = {
  criterionList: [],
  drug: null,
  prm: "",
};

export default function PatientSelectionPage({
  params,
}: {
  params: { id: number };
}) {
  const { id: patientId } = params;
  const { data, mutate } = useSWR<SelectionForm & PatientDocument>(
    `/patients/${patientId}/selection-forms`
  );
  const router = useRouter();
  const alert = React.useContext(SnackbarContext);
  const getApi = useAuthApi();

  return (
    <>
      <Title date={data?.createDate || new Date()}>
        Criterios de selección de pacientes
      </Title>
      <Formik
        initialValues={data || initialValues}
        enableReinitialize
        validationSchema={yup.object({
          drug: yup
            .object()
            .nullable()
            .label("Medicamento")
            .when("criterionList", {
              is: (val: string[]) => val.includes(String(CRITERIA_DRUG)),
              then: (schema) => schema.required(),
              otherwise: (schema) => schema,
            }),
          prm: yup.string().when("criterionList", {
            is: (val: string[]) => val.includes(String(CRITERIA_PRM)),
            then: (schema) => schema.required(),
            otherwise: (schema) => schema,
          }),
        })}
        onSubmit={async (values) => {
          const response = await getApi().then((api) =>
            api.post<SelectionForm>(`/patients/${patientId}/selection-forms`, {
              criterionList: values.criterionList,
              drugId: isObject(values.drug) ? values.drug.id : null,
              prm: values.prm,
            })
          );
          mutate(response.data);
          alert.showMessage("Información guardada exitosamente");
          router.push(`/patients/${patientId}/consent`);
        }}
      >
        {({ values }) => (
          <Form>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>N°</TableCell>
                    <TableCell>Criterios</TableCell>
                    <TableCell align="right">Puntaje</TableCell>
                    <TableCell>Referencias de ayuda</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientSelectionCriteriaList.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Field
                          component={Checkbox}
                          type="checkbox"
                          name="criterionList"
                          value={String(row.id)}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.score}</TableCell>
                      <TableCell sx={{ width: "500px" }}>
                        <HelpReference criteriaId={row.id} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" paddingTop={2}>
              <Typography>
                Si el puntaje &ge; 4, inicie seguimiento farmacoterapeutico
                <br />
                Puntaje total: {getTotalScore(values.criterionList)}
              </Typography>
              <Button variant="contained" type="submit">
                Continuar
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </>
  );
}

const HelpReference = ({ criteriaId }: { criteriaId: number }) => {
  const data = helpReferences.find((x) => x.criteriaId == criteriaId);
  if (!data) return "";
  const Component = data.component;

  return (
    <div>
      <Component />
    </div>
  );
};
