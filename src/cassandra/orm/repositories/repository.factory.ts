import { Repository } from './repository';
import { BaseModel } from '../interfaces';
import { ReturnQueryBuilder } from './builder/return-query.builder';

export class RepositoryFactory {
  static create<T>(
    // eslint-disable-next-line @typescript-eslint/ban-types
    entity: Function,
    model: BaseModel,
    EntityRepository = Repository,
  ): Repository<T> {
    const repository = new EntityRepository();
    const returnQueryBuilder = new ReturnQueryBuilder(model);
    Object.assign(repository, { target: entity, model, returnQueryBuilder });
    return repository;
  }
}
