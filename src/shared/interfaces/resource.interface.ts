export abstract class Resource<R, T> {
  /**
   * @description Creates an entity
   * @param payload Entity to be created
   * @param tx Transaction to be used
   */
  abstract create(payload: T): Promise<R>;
  abstract create(payload: T, tx?: any): Promise<R>;

  /**
   * @description Finds all entities
   * @param tx Transaction to be used
   */
  abstract findAll(): Promise<R[]>;

  /**
   * @description Finds one entity by id
   * @param id Id of the entity to be found
   * @param tx Transaction to be used
   */
  abstract findOne<G>(id: G): Promise<R>;
  abstract findOne<G>(id: G, tx?: any): Promise<R>;

  /**
   * @description Updates an entity
   * @param id Id of the entity to be updated
   * @param payload Entity to be updated
   */
  abstract update<G>(id: G, payload: T): Promise<R>;
  abstract update<G>(id: G, payload: T, tx?: any): Promise<R>;

  /**
   * @description Removes an entity
   * @param id Id of the entity to be removed
   * @param tx Transaction to be used
   */
  abstract remove<G>(id: G): Promise<R>;
  abstract remove<G>(id: G, tx?: any): Promise<R>;
}
