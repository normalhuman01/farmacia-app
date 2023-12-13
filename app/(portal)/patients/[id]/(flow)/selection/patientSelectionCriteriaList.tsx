export type Criterio = {
  id: number;
  name: string;
  score: number;
};

export const patientSelectionCriteriaList: Criterio[] = [
  {
    id: 1,
    name: "Pacientes que reciben medicamentos de estrecho margen terapéutico",
    score: 5,
  },
  {
    id: 2,
    name: "Pacientes que son vulnerables a los efectos adversos por estar en situación fisiológicamente delicada (Con diagnóstico de insuficiencia renal, hepática)",
    score: 4,
  },
  {
    id: 3,
    name: "Pacientes que necesitan ser tratados con medicamentos de extrema toxicidad potencial, especialmente si se dosifican, administran o utilizan de forma inadecuada (antineoplásicos,, anticoagulantes, medicamentos biotecnológicos)",
    score: 4,
  },
  {
    id: 4,
    name: "Pacientes sometidos a medicación múltiple (de 3 a más medicamentos)",
    score: 3,
  },
  {
    id: 5,
    name: "Pacientes que son vulnerables a los efectos adversos (niños, adulto mayor, gestantes y lactantes)",
    score: 2,
  },
  {
    id: 6,
    name: "Pacientes cuyo estado clínico exige la evaluación y manipulación continua de la farmacoterapia (diabetes mellitus, asma, hipertensión arterial entre otros)",
    score: 2,
  },
  {
    id: 7,
    name: "Pacientes con malos hábitos de vida (consumo de alcohol, tabaco, drogas narcóticas)",
    score: 2,
  },
  {
    id: 8,
    name: "Pacientes que presentan algún problema relacionado al medicamento (de necesidad, efictividad, o seguridad)",
    score: 4,
  },
];
