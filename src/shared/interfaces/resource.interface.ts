export abstract class Resource<R> {
  abstract findAll(): Promise<R[]>;
}
