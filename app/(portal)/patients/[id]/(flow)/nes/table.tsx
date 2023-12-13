import { useAuthApi } from "@/app/(api)/api";
import { Page } from "@/app/(api)/pagination";
import { AsyncAutocomplete } from "@/app/(components)/autocomplete";
import { DrugProduct } from "@/app/(portal)/drugs/pharmaceutical-product/Drug";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, MenuItem, Stack, TableCell, Tooltip } from "@mui/material";
import { Field } from "formik";
import { Select, TextField } from "formik-mui";
import { PRM_GROUP, getItemsPerGroup } from "../selection/prm-groups";

export const emptyDrugNesEvaluation = {
  medicine: "",
  necessity: {
    evaluation: "",
    justification: "",
    prm: "",
  },
  effectivity: {
    evaluation: "",
    justification: "",
    prm: "",
  },
  security: {
    evaluation: "",
    justification: "",
    prm: "",
  },
};

export const nesTableCellsHead1 = [
  <TableCell key={1} sx={{ fontWeight: "bold" }}>
    Datos de farmacoterapia
  </TableCell>,
  <TableCell key={2} sx={{ fontWeight: "bold" }} colSpan={3}>
    Evaluación de datos de farmacoterapia
  </TableCell>,
  <TableCell key={3}></TableCell>,
];

export const nesTableCellsHead2 = [
  <TableCell key={1} rowSpan={2} sx={{ minWidth: 300 }}>
    Medicamentos que consume el paciente
  </TableCell>,
  <TableCell key={2} colSpan={3} sx={{ minWidth: 600 }}>
    Evaluar c/u de los medicamentos si son:
  </TableCell>,
];

export const nesTableCellsHead3 = [
  <TableCell key={1} sx={{ minWidth: 200 }}>
    Necesidad
  </TableCell>,
  <TableCell key={2} sx={{ minWidth: 200 }}>
    Efectividad
  </TableCell>,
  <TableCell key={3} sx={{ minWidth: 200 }}>
    Seguridad
  </TableCell>,
];

export const NesTableCells = ({
  name,
  index,
  values,
  onRemove,
}: {
  name: string;
  index: number;
  values: any;
  onRemove: () => void;
}) => {
  const getApi = useAuthApi();

  const searchMedicine = (searchText: string) => {
    return getApi().then((api) =>
      api
        .get<Page<DrugProduct>>(
          "drugDcis/search/findByNameContainingIgnoringCase",
          {
            params: { page: 0, searchText },
          }
        )
        .then((x) => x.data._embedded.drugDcis)
    );
  };

  return (
    <>
      <TableCell sx={{ verticalAlign: "top" }}>
        <AsyncAutocomplete
          label="Medicina"
          name={`${name}.${index}.medicine`}
          filter={searchMedicine}
        />
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        <Field
          formControl={{ fullWidth: true }}
          component={Select}
          fullWidth
          id={`${name}.${index}.necessity`}
          name={`${name}.${index}.necessity.evaluation`}
        >
          <MenuItem value={"yes real"}>Si real</MenuItem>
          <MenuItem value={"yes potential"}>Si potencial</MenuItem>
          <MenuItem value={"no real"}>No real</MenuItem>
          <MenuItem value={"no potential"}>No potencial</MenuItem>
        </Field>
        {(values.necessity.evaluation === "yes real" ||
          values.necessity.evaluation === "yes potential") && (
          <Justification name={`${name}.${index}.necessity`} />
        )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        <Field
          component={Select}
          formControl={{ fullWidth: true }}
          id={`${name}.${index}.effectivity`}
          name={`${name}.${index}.effectivity.evaluation`}
        >
          <MenuItem value={"yes"}>Si</MenuItem>
          <MenuItem value={"no real"}>No real</MenuItem>
          <MenuItem value={"no potential"}>No potencial</MenuItem>
        </Field>
        {values.effectivity.evaluation &&
          values.effectivity.evaluation !== "yes" && (
            <Justification name={`${name}.${index}.effectivity`} />
          )}
      </TableCell>
      <TableCell sx={{ verticalAlign: "top" }}>
        <Field
          component={Select}
          formControl={{ fullWidth: true }}
          id={`${name}.${index}.security`}
          name={`${name}.${index}.security.evaluation`}
        >
          <MenuItem value={"yes"}>Si</MenuItem>
          <MenuItem value={"no real"}>No real</MenuItem>
          <MenuItem value={"no potential"}>No potencial</MenuItem>
        </Field>
        {values.security.evaluation && values.security.evaluation !== "yes" && (
          <Justification name={`${name}.${index}.security`} />
        )}
      </TableCell>
      <TableCell>
        <Tooltip title="Eliminar">
          <IconButton aria-label="delete" onClick={onRemove}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );
};

const Justification = ({ name }: { name: string }) => {
  const groupName = name.includes("effectivity")
    ? PRM_GROUP.EFFECTIVITY
    : name.includes("security")
    ? PRM_GROUP.SECURITY
    : PRM_GROUP.NECESSITY;

  const items = getItemsPerGroup(groupName);

  return (
    <Stack gap={2} pt={2}>
      <Field
        formControl={{ sx: { width: 200 } }}
        component={Select}
        id={`${name}.prm`}
        name={`${name}.prm`}
        label="PRM identificado"
      >
        {items.map((item) => (
          <MenuItem value={item.name} key={item.name}>
            {item.name}: {item.description}
          </MenuItem>
        ))}
      </Field>
      <Field
        component={TextField}
        label="Justifique"
        name={`${name}.justification`}
        variant="outlined"
        multiline
        rows={4}
        fullWidth
      />
    </Stack>
  );
};
