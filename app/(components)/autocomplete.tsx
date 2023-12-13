import {
  AutocompleteRenderInputParams,
  TextField as MuiTextField,
} from "@mui/material";
import { Field, useField } from "formik";
import { Autocomplete } from "formik-mui";
import { debounce } from "lodash";
import React from "react";

type AsyncAutocompleteProps<T, F> = {
  label: React.ReactNode;
  name: string;
  filter: (searchText: string) => Promise<T[]>;
  getLabel?: (option: any) => string;
  disabled?: boolean;
};

// export const getTextParams = <T,>(
//   name: string,
//   touched: FormikTouched<T>,
//   errors: FormikErrors<T>
// ) => ();

// T is the response type, F is the form type
export const AsyncAutocomplete = <T, F>({
  label,
  name,
  filter,
  getLabel = (option) => option.name,
  disabled = false,
}: AsyncAutocompleteProps<T, F>) => {
  const [field, meta, helpers] = useField<F>(name);

  const [items, setItems] = React.useState<T[]>([]);
  const searchItems = debounce(async (newInputValue: string) => {
    if (newInputValue) {
      const data = await filter(newInputValue);
      setItems(data);
    } else {
      setItems([]);
    }
  }, 500);

  return (
    <Field
      disabled={disabled}
      name={name}
      component={Autocomplete}
      freeSolo
      options={items}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <MuiTextField
          label={label}
          variant="outlined"
          {...params}
          name={name}
          error={Boolean(meta.touched && meta.error)}
          helperText={meta.touched ? meta.error : ""}
        />
      )}
      getOptionLabel={(option: any) =>
        typeof option === "string" ? option : getLabel(option)
      }
      filterOptions={(x: any) => x}
      onInputChange={(_event: any, newInputValue: any) => {
        if (!_event) {
          // is null when formik initialValues enableReinitialize works
          return;
        }

        searchItems(newInputValue);
        helpers.setValue(newInputValue);
      }}
    />
  );
};
