"use client";

import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Stepper from "@mui/material/Stepper";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Step = { path: string; label: string };

const steps = [
  { path: "selection", label: "Selección" },
  { path: "consent", label: "Consentimiento" },
  { path: "medical-history", label: "Anamnesis" },
  { path: "pharmacotherapy", label: "Farmacoterapia" },
  { path: "nes", label: "NES" },
  // { path: "pico", label: "PICO" },
  { path: "soap", label: "SOAP" },
];

// const getParent = (path: string) => {
//   const pathSplit = path.split("/");
//   pathSplit.pop();
//   return pathSplit.join("/");
// };

export function HorizontalStepper({ patientId }: { patientId: number }) {
  const router = useRouter();
  const pathname = usePathname();

  const activeStep: number = steps.findIndex((x) => pathname.includes(x.path));

  const [completed] = React.useState<{
    [k: number]: boolean;
  }>({});

  const handleStep = (step: Step) => () => {
    router.push(`/patients/${patientId}/${step.path}`);
  };

  return (
    <Box sx={{ width: "100%" }} py={4}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={step.path} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(step)}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
