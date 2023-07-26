export function insertSucessful(entity: string) {
  return `${entity} creado correctamente`;
}

export function updateSucessful(entity: string) {
  return `${entity} actualizado correctamente`;
}

export function deleteSucessful(entity: string) {
  return `${entity} eliminado correctamente`;
}

export function notFound(entity: string) {
  return `${entity} no encontrado`;
}

export function insertFailed(entity: string) {
  return `Error al insertar ${entity}`;
}

export function updateFailed(entity: string) {
  return `Error al actualizar ${entity}`;
}

export function deleteFailed(entity: string) {
  return `Error al eliminar ${entity}`;
}
