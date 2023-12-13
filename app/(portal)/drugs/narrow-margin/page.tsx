"use client";

import { Fab, Stack, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import { withOutSorting } from "@/app/(components)/helpers/withOutSorting";
import { Drug } from "./Drug";
import { esES } from "@mui/x-data-grid";
import useSWR from "swr";
import { usePagination } from "@/app/(components)/hook-customization/usePagination";
import { Page } from "@/app/(api)/pagination";
import { SnackbarContext } from "@/app/(components)/SnackbarContext";
import DialogDelete from "@/app/(components)/DialogDelete";
import { useAuthApi } from "@/app/(api)/api";
import Loading from "@/app/(components)/Loading";

const DrugsPage = () => {
  const router = useRouter();
  const getApi = useAuthApi();
  const [itemToDelete, setItemToDelete] = React.useState<Drug | null>(null);
  const alert = React.useContext(SnackbarContext);

  const deleteDrugs = async () => {
    if (itemToDelete === null) {
      return;
    }

    await getApi().then((api) =>
      api.delete(`/drugNarrowMargins/${itemToDelete.id}`)
    );
    alert.showMessage("Medicamento eliminado");
    setItemToDelete(null);
    await getDrugs();
  };

  const { paginationModel, setPaginationModel } = usePagination();

  const { data: drugs, mutate: getDrugs } = useSWR<Page<Drug>>([
    "/drugNarrowMargins",
    { params: { page: paginationModel.page, size: paginationModel.pageSize } },
  ]);

  const columns = React.useMemo(
    () =>
      (
        [
          { field: "name", headerName: "Nombre", minWidth: 200 },
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
                    onClick={() =>
                      router.push(`/drugs/narrow-margin/${params.row.id}`)
                    }
                  />
                </Tooltip>,
                <Tooltip title="Eliminar" key="delete">
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Eliminar"
                    onClick={() => setItemToDelete(params.row)}
                  />
                </Tooltip>,
              ];
            },
          },
        ] as GridColDef<Drug>[]
      ).map(withOutSorting),
    [router]
  );

  if (!drugs) return <Loading />;

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">Estrecho margen</Typography>
        <Tooltip title="Registrar">
          <Link href="narrow-margin/create">
            <Fab color="primary" aria-labelledby="add">
              <AddIcon />
            </Fab>
          </Link>
        </Tooltip>
      </Stack>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid
          columns={columns}
          rowCount={drugs.page.totalElements}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableColumnFilter
          rows={drugs._embedded.drugNarrowMargins}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>
      <DialogDelete
        itemToDelete={itemToDelete}
        handleClose={() => setItemToDelete(null)}
        onDelete={deleteDrugs}
        itemName="esta medicina"
      />
    </Stack>
  );
};

export default DrugsPage;
