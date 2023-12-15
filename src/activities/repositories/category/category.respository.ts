export abstract class CategoryRepository {
  abstract exists(ids: number[]): Promise<boolean>;
}
