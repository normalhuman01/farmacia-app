"use client";

import { Page } from "@/app/(api)/pagination";
import { withOutSorting } from "@/app/(components)/helpers/withOutSorting";
import { usePagination } from "@/app/(components)/hook-customization/usePagination";
import { Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
import React from "react";
import useSWR from "swr";
import { DrugProduct } from "./Drug";

const DrugsPage = () => {
  const { paginationModel, setPaginationModel } = usePagination();

  const { data: drugs, isLoading } = useSWR<Page<DrugProduct>>([
    "/drugPharmaceuticalProducts",
    { params: { page: paginationModel.page, size: paginationModel.pageSize } },
  ]);

  const columns = React.useMemo(
    () =>
      (
        [
          { field: "name", headerName: "Nombre", width: 150 },
          { field: "concentration", headerName: "Concentración", width: 150 },
          { field: "form", headerName: "Forma", width: 150 },
        ] as GridColDef<DrugProduct>[]
      ).map(withOutSorting),
    []
  );

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h4">Productos farmacéuticos</Typography>
      </Stack>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rowCount={drugs?.page.totalElements}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableColumnFilter
          rows={drugs?._embedded.drugPharmaceuticalProducts || []}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>
    </Stack>
  );
};

export default DrugsPage;
