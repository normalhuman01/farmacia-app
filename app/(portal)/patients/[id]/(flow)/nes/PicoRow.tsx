import yup from "@/app/validation";

export type PicoRow = {
  spanish: string;
  english: string;
  meshTerm: string;
};

export const picoRowSchema = () => {
  return yup.object({
    spanish: yup.string(),
    english: yup.string(),
    meshTerm: yup.string(),
  });
};
