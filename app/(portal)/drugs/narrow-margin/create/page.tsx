"use client";

import React from "react";
import DrugForm from "../drugsForm";

const CreateDrugsPage = () => {
  return <DrugForm drugs={{ name: ""}} textName="Registrar"/>;
};

export default CreateDrugsPage;
