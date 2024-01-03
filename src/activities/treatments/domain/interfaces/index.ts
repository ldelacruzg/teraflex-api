export interface IFindAllTreatmentsOptions {
  patientId?: number;
  treatmentActive?: boolean;
  tasksNumber?: boolean;
}

export interface IFindAllTreatmentTasksOptions {
  treatmentId: number;
  taskDone?: boolean;
  treatmentActive?: boolean;
}
