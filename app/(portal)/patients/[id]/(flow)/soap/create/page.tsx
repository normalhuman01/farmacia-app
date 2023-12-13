"use client";

import { useAuthApi } from "@/app/(api)/api";
import { isString } from "lodash";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { TrackingSheet } from "../TrackingSheet";
import { TrackingSheetForm } from "../TrackingSheetForm";
import { Interview } from "../Interview";

export default function CreateTrackingSheet({
  params,
}: {
  params: { id: number };
}) {
  const { id: patientId } = params;

  const { data: pharmacoterapy } = useSWR(
    patientId ? `/patients/${patientId}/pharmacoterapy` : null
  );

  const { mutate: getSoapInterviews } = useSWR<Interview[]>(
    patientId ? `/patients/${patientId}/soap` : null
  );
  const { data: nes } = useSWR(patientId ? `/patients/${patientId}/nes` : null);

  const { data: lastInterview, mutate: getLastInterview } =
    useSWR<TrackingSheet>(
      pharmacoterapy && nes ? `/patients/${patientId}/soap/last` : null
    );
  const getApi = useAuthApi();
  const router = useRouter();

  const handleSubmit = async (values: TrackingSheet) => {
    const data = {
      history: values.history.map(({ drug, ...rest }) => {
        if (isString(drug)) {
          throw "Medicina inválida";
        }

        return {
          ...rest,
          drugId: drug.id,
        };
      }),
      drugEvaluations: values.drugEvaluations.map(({ medicine, ...rest }) => {
        if (isString(medicine)) {
          throw "Medicina inválida";
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
    await getApi().then((api) => api.post("soap", data));
    getLastInterview();
    getSoapInterviews();
    router.push(`/patients/${patientId}/soap`);
  };

  if (!lastInterview) {
    return <div>Complete las hojas de farmacoterapia y NES</div>;
  }
  return (
    <TrackingSheetForm
      initialValues={{ ...lastInterview, createDate: new Date() }}
      onSubmit={handleSubmit}
    />
  );
}
