"use client";

import Loading from "@/app/(components)/Loading";
import { withOutSorting } from "@/app/(components)/helpers/withOutSorting";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Fab, Stack, Tooltip, Typography } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  esES,
} from "@mui/x-data-grid";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";
import { Interview } from "./Interview";

export default function SOAP({ params }: { params: { id: number } }) {
  const { id: patientId } = params;
  const router = useRouter();

  const { data: interviews } = useSWR<Interview[]>(
    patientId ? `/patients/${patientId}/soap` : null
  );

  const columns = useMemo(() => {
    const result: GridColDef<Interview>[] = [
      {
        field: "number",
        headerName: "Número",
        width: 180,
      },
      {
        field: "createDate",
        headerName: "Fecha de entrevista",
        width: 140,
        valueGetter: ({ row }) =>
          row.createDate
            ? format(new Date(row.createDate), "dd/MM/yyyy HH:mm")
            : "",
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <Tooltip title="Editar" key="edit">
              <GridActionsCellItem
                icon={<EditIcon />}
                label="Editar"
                onClick={() => router.push(`soap/${params.row.id}`)}
              />
            </Tooltip>,
          ];
        },
      },
    ];

    return result.map(withOutSorting);
  }, [router]);

  if (!interviews) return <Loading />;
  return (
    <Box>
      <Stack alignItems="start" direction="column" spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h5">
            SOAP (Subjetivo Objetivo Analisis y Plan de intervencion)
          </Typography>
          <Tooltip title="Registrar nueva entrevista">
            <Link href="soap/create">
              <Fab color="primary" aria-labelledby="add">
                <AddIcon />
              </Fab>
            </Link>
          </Tooltip>
        </Stack>
        <div style={{ width: "100%", height: "70vh" }}>
          <DataGrid
            columns={columns}
            rowCount={interviews.length}
            hideFooter={true}
            rows={interviews}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          />
        </div>
      </Stack>
    </Box>
  );
}
