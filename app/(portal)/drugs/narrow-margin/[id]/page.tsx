"use client";

import React from "react";
import useSWR from "swr";
import DrugForm from "../drugsForm";
import Loading from "@/app/(components)/Loading";

const EditEstrechoMargen = ({ params }: { params: { id: number } }) => {
  const { id } = params;

  const { data: drugs } = useSWR(id ? `drugNarrowMargins/${id}` : null);

  if (!drugs)
    return (
      <h1>
        <Loading />
      </h1>
    );
  return <DrugForm drugs={drugs} textName="Editar" />;
};

export default EditEstrechoMargen;
