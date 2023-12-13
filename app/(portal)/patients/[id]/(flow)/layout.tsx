"use client";

import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { HorizontalStepper } from "./HorizontalStepper";
import { apiUrl } from "@/app/(api)/api";
import { Patient } from "../../create/Patient";
import useSWR from "swr";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import Loading from "@/app/(components)/Loading";

export default function MedicalFlowLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { id: number };
}) {
  const { id } = params;
  const { data: patient, isLoading } = useSWR<Patient>(
    `${apiUrl}/patients/${id}`
  );

  const router = useRouter();

  if (isLoading || !patient) return <Loading />;
  return (
    <div>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Paciente: {patient.firstName} {patient.lastName}, código:{" "}
          {patient.code}
        </Typography>
        <Tooltip title="Editar">
          <IconButton
            aria-label="edit"
            sx={{ marginLeft: 1, marginBottom: "0.35em" }}
            onClick={() => router.push(`/patients/${id}`)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <HorizontalStepper patientId={id} />
      {children}
    </div>
  );
}
