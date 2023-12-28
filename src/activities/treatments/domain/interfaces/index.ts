export interface IFindAllTreatmentsOptions {
  patientId?: number;
  treatmentActive?: boolean;
}

export interface IFindAllTreatmentTasksOptions {
  treatmentId: number;
  taskDone?: boolean;
  treatmentActive?: boolean;
}
