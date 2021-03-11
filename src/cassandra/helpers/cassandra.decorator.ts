import { Inject } from '@nestjs/common';
import { Connection, ConnectionOptions } from '../orm';
import {
  getConnectionToken,
  getModelToken,
  getRepositoryToken,
} from './cassandra-orm.utils';

export const InjectConnection: (
  connection?: Connection | ConnectionOptions | string,
) => ParameterDecorator = (
  connection?: Connection | ConnectionOptions | string,
) => Inject(getConnectionToken(connection));

// eslint-disable-next-line @typescript-eslint/ban-types
export const InjectModel = (entity: Function) => Inject(getModelToken(entity));

// eslint-disable-next-line @typescript-eslint/ban-types
export const InjectRepository = (entity: Function) =>
  Inject(getRepositoryToken(entity));
