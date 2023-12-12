export abstract class Resource<R, T> {
  abstract findAll(): Promise<R[]>;

  abstract create(payload: T, tx?: any): Promise<R>;
  abstract create(payload: T): Promise<R>;
}
