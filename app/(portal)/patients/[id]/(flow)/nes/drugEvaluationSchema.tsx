"use client";
import { requiredMessage } from "@/app/(components)/helpers/requiredMessage";
import yup from "@/app/validation";
import { newsRowSchema } from "./newsRowSchema";

export const drugEvaluationSchema = () => {
  return {
    medicine: yup.object().required(requiredMessage),
    necessity: newsRowSchema(),
    effectivity: newsRowSchema(),
    security: newsRowSchema(),
  };
};
