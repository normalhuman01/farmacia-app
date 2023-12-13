"use client";

import React from "react";
import { Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef, esES } from "@mui/x-data-grid";
import { withOutSorting } from "@/app/(components)/helpers/withOutSorting";
import { usePagination } from "@/app/(components)/hook-customization/usePagination";
import { DrugDci } from "./DrugDci";
import useSWR from "swr";
import { Page } from "@/app/(api)/pagination";
import Loading from "@/app/(components)/Loading";

const DciList = () => {
  const { paginationModel, setPaginationModel } = usePagination();

  const { data: drugDcis } = useSWR<Page<DrugDci>>([
    "/drugDcis",
    { params: { page: paginationModel.page, size: paginationModel.pageSize } },
  ]);

  const columns = React.useMemo(
    () =>
      (
        [
          { field: "name", headerName: "Nombre", flex: 1 },
        ] as GridColDef<DrugDci>[]
      ).map(withOutSorting),
    []
  );

  if (!drugDcis) return <Loading />;
  return (
    <Stack spacing={2}>
      <Stack spacing={2}>
        <Typography variant="h4">
          Denominación común internacional (DCI)
        </Typography>
      </Stack>
      <div style={{ height: "70vh", width: "100%" }}>
        <DataGrid
          columns={columns}
          rowCount={drugDcis.page.totalElements}
          rows={drugDcis._embedded.drugDcis}
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

export default DciList;
