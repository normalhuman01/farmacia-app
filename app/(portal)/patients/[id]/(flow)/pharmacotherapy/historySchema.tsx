import { inexactDateSchema } from "@/app/(components)/InexactDatePicker";
import { requiredMessage } from "@/app/(components)/helpers/requiredMessage";
import yup from "@/app/validation";

export const historySchema = yup.array().of(
  yup.object({
    administration: yup.string().required(requiredMessage),
    difficulty: yup.string().required(requiredMessage),
    difficultyJustification: yup.string().when("difficulty", {
      is: "Si",
      then: (schema) => schema.required(requiredMessage),
      otherwise: (schema) => schema.notRequired(),
    }),
    acceptance: yup.string().required(requiredMessage),
    reasonForUse: yup.string().required(requiredMessage),
    startDate: inexactDateSchema((value) => value.required(requiredMessage)),
    restartDate: inexactDateSchema(),
    suspensionDate: inexactDateSchema(),
    dose: yup.string().required(requiredMessage),
    mode: yup.string().required(requiredMessage),
    drug: yup.object().required(requiredMessage),
  })
);
