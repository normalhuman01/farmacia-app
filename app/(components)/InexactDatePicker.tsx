"use client";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { isDate, isValid } from "date-fns";
import format from "date-fns/format";
import { useField } from "formik";
import { useState } from "react";
import yup from "../validation";
import { requiredMessage } from "./helpers/requiredMessage";

type DateType = "year" | "year-month" | "date";
export type InexactDateType = {
  type: DateType;
  value: Date | null;
};

export const defaultDate: InexactDateType = {
  type: "date",
  value: null,
};

export const inexactDateSchema = (
  callback = (x: yup.DateSchema) => x.notRequired()
) =>
  yup.object({
    type: yup.string().required(),
    value: callback(yup.date()),
  });

export function InexactDatePicker({
  label,
  name,
}: {
  label?: string;
  name: string;
}) {
  const [field, meta, helpers] = useField<InexactDateType>(name);

  const { type, value } = field.value;

  const [open, setOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue({
      type: (event.target as HTMLInputElement).value as DateType,
      value,
    });
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <FormControl variant="outlined" error={Boolean(meta.error)}>
        {label && <InputLabel htmlFor="inexact-date">{label}</InputLabel>}
        <OutlinedInput
          id="inexact-date"
          type="text"
          readOnly
          value={
            type && value && isDate(value) && isValid(value)
              ? type === "year"
                ? value.getFullYear()
                : type === "year-month"
                ? format(value, "MM-yyyy")
                : value.toLocaleDateString()
              : ""
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="edit"
                onClick={() => setOpen(true)}
                edge="end"
              >
                <EditIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{(meta.error as any)?.value || ""}</FormHelperText>
      </FormControl>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <FormControl>
            {label && <FormLabel id="unspecific-date">{label}</FormLabel>}
            <RadioGroup
              aria-labelledby="unspecific-date"
              value={type}
              onChange={handleChange}
            >
              <FormControlLabel
                value="year"
                control={<Radio />}
                label="Solo sé el año"
              />
              <FormControlLabel
                value="year-month"
                control={<Radio />}
                label="Sé el año y mes"
              />
              <FormControlLabel
                value="date"
                control={<Radio />}
                label="Sé la fecha exacta"
              />
            </RadioGroup>
          </FormControl>
          <Stack>
            <DatePicker
              value={value}
              onChange={(newValue) =>
                helpers.setValue({ type, value: newValue })
              }
              views={
                type === "year"
                  ? ["year"]
                  : type === "year-month"
                  ? ["month", "year"]
                  : undefined
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
