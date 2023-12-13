"use client";
import React from "react";
import useSWR from "swr";
import { TrackingSheetForm } from "../TrackingSheetForm";
import { TrackingSheet } from "../TrackingSheet";
import { isString } from "lodash";
import { useAuthApi } from "@/app/(api)/api";
import { useRouter } from "next/navigation";
import Loading from "@/app/(components)/Loading";

export default function EditSoap({
  params,
}: {
  params: { id: number; soapId: number };
}) {
  const { id: patientId, soapId } = params;
  const getApi = useAuthApi();
  const router = useRouter();
  const { data, mutate } = useSWR<TrackingSheet>(
    soapId ? `/soap/${soapId}` : null
  );

  const handleSubmit = async (values: TrackingSheet) => {
    // TODO:
    const data = {
      history: values.history.map(({ drug, ...rest }) => {
        if (isString(drug)) {
          throw "Medicina incorrecta";
        }

        return {
          ...rest,
          drugId: drug.id,
        };
      }),
      drugEvaluations: values.drugEvaluations.map(({ medicine, ...rest }) => {
        if (isString(medicine)) {
          throw "Medicina incorrecta";
        }

        return {
          ...rest,
          medicineId: medicine.id,
        };
      }),
      soapRows: values.soapRows,
      picoSheets: values.picoSheets,
      patientId: patientId,
    };
    const response = await getApi().then((api) =>
      api.put(`soap/${soapId}`, data)
    );
    mutate();
    router.push(`/patients/${patientId}/soap`);
  };

  if (!data) return <Loading />;
  return <TrackingSheetForm initialValues={data} onSubmit={handleSubmit} />;
}
