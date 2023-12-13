"use client";
import { requiredMessage } from "@/app/(components)/helpers/requiredMessage";
import yup from "@/app/validation";

export const newsRowSchema = () => {
  return yup.object({
    evaluation: yup.string().required(requiredMessage),
    justification: yup.string(),
    prm: yup.string(),
  });
};
