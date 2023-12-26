export interface IFindAssignedTasksByPatient {
  patientId: number;
  taskDone?: boolean;
  treatmentActive?: boolean;
}
