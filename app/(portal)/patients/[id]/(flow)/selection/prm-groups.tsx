export type Item = { name: string; description: string };

export enum PRM_GROUP {
  NECESSITY = "Por Necesidad",
  EFFECTIVITY = "Por Efectividad",
  SECURITY = "Por Seguridad",
}

// PRM: es Problema Relacionado com Medicamento
export const PRM_GROUPS = [
  {
    group: PRM_GROUP.NECESSITY,
    items: [
      { name: "PRM 1", description: "Necesita medicamento que no usa" },
      { name: "PRM 2", description: "Usa medicamento que no necesita" },
    ],
  },
  {
    group: PRM_GROUP.EFFECTIVITY,
    items: [
      {
        name: "PRM 3",
        description: "Inefectividad independiente de la dosis.",
      },
      {
        name: "PRM 4",
        description: "Dosis, intervalo o duración inferior a la necesaria",
      },
    ],
  },
  {
    group: PRM_GROUP.SECURITY,
    items: [
      {
        name: "PRM 5",
        description: "Dosis, intervalo o duración superior a la necesaria.",
      },
      {
        name: "PRM 6",
        description: "Provoca una reacción adversa al medicamento",
      },
    ],
  },
];

export const getItemsPerGroup = (group: PRM_GROUP) =>
  PRM_GROUPS.find((x) => x.group == group)?.items || [];
