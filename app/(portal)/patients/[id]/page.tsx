"use client";

import React from "react";
import useSWR from "swr";
import PatientForm from "../create/PatientForm";
import Loading from "@/app/(components)/Loading";

const EditPatient = ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { data: patient } = useSWR(id ? `patients/${id}` : null);

  if (!patient) return <Loading />;
  return <PatientForm patient={patient} />;
};

export default EditPatient;
