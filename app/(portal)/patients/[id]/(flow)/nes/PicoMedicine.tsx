import { PicoRow } from "./PicoRow";

export type PicoMedicine = {
  patient: PicoRow;
  intervention: PicoRow;
  comparison: PicoRow;
  outcome: PicoRow;
  clinicalQuestion: string;
  searchStrategy: string;
};
