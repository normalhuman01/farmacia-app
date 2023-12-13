import { GridFeatureMode } from "@mui/x-data-grid";
import React from "react";

export const usePagination = () => {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  return { paginationModel, setPaginationModel };
};
