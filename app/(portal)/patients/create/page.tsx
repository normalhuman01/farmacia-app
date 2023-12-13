"use client";

import React from "react";
import PatientForm from "./PatientForm";

export default function CreatePatient() {
  return <PatientForm patient={{ firstName: "", lastName: "", code: "" }} />;
}
