"use client";
import { InexactDateType } from "@/app/(components)/InexactDatePicker";
import { DrugProduct } from "@/app/(portal)/drugs/pharmaceutical-product/Drug";
import { PicoMedicine } from "../nes/PicoMedicine";
import { DrugTest } from "./create/DrugTest";

// type TrackingSheet = typeof emptyInitialValues;

export type TrackingSheet = {
  history: {
    administration: string;
    difficulty: string;
    difficultyJustification: string;
    acceptance: string;
    reasonForUse: string;
    restartDate: InexactDateType;
    startDate: InexactDateType;
    suspensionDate: InexactDateType;
    dose: string;
    mode: string;
    drug: string | DrugProduct;
  }[];
  drugEvaluations: {
    medicine: string | DrugProduct;
    necessity: DrugTest;
    effectivity: DrugTest;
    security: DrugTest;
  }[];
  soapRows: {
    problem: string;
    subjective: string;
    objective: string;
    analysis: string;
    plan: string;
  }[];
  picoSheets: PicoMedicine[];
  createDate: Date;
};

export const emptySoapRow = {
  problem: "",
  subjective: "",
  objective: "",
  analysis: "",
  plan: "",
};
