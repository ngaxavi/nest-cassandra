import { Connection, ConnectionOptions, loadModel, Repository } from './orm';
import { Provider } from '@nestjs/common';
import {
  getConnectionToken,
  getModelToken,
  getRepositoryToken,
} from './helpers/cassandra-orm.utils';
import { getEntity } from './orm/utils/decorator.utils';
import { RepositoryFactory } from './orm/repositories/repository.factory';
import { defer } from 'rxjs';

export function createCassandraProviders(
  entities?: Function[],
  connection?: Connection | ConnectionOptions | string,
) {
  const providerModel = (entity) => ({
    provide: getModelToken(entity),
    useFactory: async (connectionLike: Connection) => {
      return await defer(() => loadModel(connectionLike, entity)).toPromise();
    },
    inject: [getConnectionToken(connection)],
  });

  const provideRepository = (entity) => ({
    provide: getRepositoryToken(entity),
    useFactory: async (model) => RepositoryFactory.create(entity, model),
    inject: [getModelToken(entity)],
  });

  const provideCustomRepository = (EntityRepository) => {
    const entity = getEntity(EntityRepository);
    return {
      provide: getRepositoryToken(EntityRepository),
      useFactory: async (model) =>
        RepositoryFactory.create(entity, model, EntityRepository),
      inject: [getModelToken(entity)],
    };
  };

  const providers: Provider[] = [];
  (entities || []).forEach((entity) => {
    if (entity.prototype instanceof Repository) {
      return providers.push(provideCustomRepository(entity));
    }
    return providers.push(providerModel(entity), provideRepository(entity));
  });

  return [...providers];
}
