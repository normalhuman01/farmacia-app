import yup from "@/app/validation";
import { picoRowSchema } from "./PicoRow";
import { requiredMessage } from "@/app/(components)/helpers/requiredMessage";

export const picoSheetsSchema = yup.array().of(
  yup.object({
    patient: picoRowSchema(),
    intervention: picoRowSchema(),
    comparison: picoRowSchema(),
    outcome: picoRowSchema(),
    clinicalQuestion: yup.string().required(requiredMessage),
    searchStrategy: yup.string().required(requiredMessage),
  })
);
