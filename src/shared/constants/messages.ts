export function insertSucessful(entity: string) {
  return `${entity} creado con éxito`;
}

export function updateSucessful(entity: string) {
  return `${entity} actualizado con éxito`;
}

export function deleteSucessful(entity: string) {
  return `${entity} eliminado con éxito`;
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
