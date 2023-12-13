"use client";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import { ArrayHelpers, FieldArray, useFormikContext } from "formik";
import React from "react";
import {
  NesTableCells,
  emptyDrugNesEvaluation,
  nesTableCellsHead1,
  nesTableCellsHead2,
  nesTableCellsHead3,
} from "../nes/table";
import { TrackingSheet } from "./TrackingSheet";

export const NesTable = () => {
  const { values } = useFormikContext<TrackingSheet>();
  const name = "drugEvaluations";
  return (
    <FieldArray name={name}>
      {(arrayHelpers: ArrayHelpers) => (
        <Table>
          <TableHead>
            <TableRow>{nesTableCellsHead1}</TableRow>
            <TableRow>{nesTableCellsHead2}</TableRow>
            <TableRow>{nesTableCellsHead3}</TableRow>
          </TableHead>
          <TableBody>
            {values[name].map((x, index) => (
              <TableRow key={index}>
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
                  onClick={() => arrayHelpers.push(emptyDrugNesEvaluation)}
                >
                  Agregar fila
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </FieldArray>
  );
};
