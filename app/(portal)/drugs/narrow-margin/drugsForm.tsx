import { Button, Grid, Stack, Typography } from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { TextField } from "formik-mui";
import React, { useContext } from "react";
import { Drug } from "./Drug";
import { SnackbarContext } from "@/app/(components)/SnackbarContext";
import { useRouter } from "next/navigation";
import { useAuthApi } from "@/app/(api)/api";

type DrugFormProps = {
  drugs: Drug;
  textName: string;
};

const DrugForm = ({ drugs, textName }: DrugFormProps) => {
  const snackbar = useContext(SnackbarContext);
  const router = useRouter();
  const getApi = useAuthApi();

  const saveDrugForm = async (
    values: Drug,
    { setSubmitting }: FormikHelpers<Drug>
  ) => {
    const api = await getApi();

    setSubmitting(false);

    if (drugs.id) {
      await api.put(`/drugNarrowMargins/${drugs.id}`, values);
    } else {
      await api.post(`/drugNarrowMargins`, values);
    }
    snackbar.showMessage("Medicamento guardado");
    router.push("/drugs/narrow-margin");
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Formik initialValues={drugs} onSubmit={saveDrugForm}>
          {({ isSubmitting }) => (
            <Form>
              <Typography variant="h4" style={{ paddingBottom: "20px" }}>
                {textName} medicamento
              </Typography>
              <Grid>
                <Stack spacing={2}>
                  <Field
                    component={TextField}
                    name="name"
                    label="Nombre"
                    variant="outlined"
                    required
                  />
                </Stack>
                <Button
                  type="submit"
                  style={{ marginTop: "20px" }}
                  disabled={isSubmitting}
                  variant="contained"
                >
                  Guardar
                </Button>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default DrugForm;
