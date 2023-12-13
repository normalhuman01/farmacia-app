"use client";

import { withOutSorting } from "@/app/(components)/helpers/withOutSorting";
import { usePagination } from "@/app/(components)/hook-customization/usePagination";
import { Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
import React from "react";
import { DiseaseCie10 } from "./DiseaseCie10";
import useSWR from "swr";
import { Page } from "@/app/(api)/pagination";

const Cie10 = () => {
  const { paginationModel, setPaginationModel } = usePagination();

  const { data: diseases, isLoading } = useSWR<Page<DiseaseCie10>>([
    "/diseases",
    { params: { page: paginationModel.page, size: paginationModel.pageSize } },
  ]);

  const columns = React.useMemo(
    () =>
      (
        [
          { field: "code", headerName: "Código", height: 100 },
          { field: "name", headerName: "Nombre", flex: 1 },
        ] as GridColDef<DiseaseCie10>[]
      ).map(withOutSorting),
    []
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        <Typography variant="h4">CIE10</Typography>
      </Stack>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rowCount={diseases?.page.totalElements}
          rows={diseases?._embedded.diseases || []}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableColumnFilter
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </div>
    </Stack>
  );
};

export default Cie10;
