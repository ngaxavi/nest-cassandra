import { Injectable } from '@nestjs/common';
import {
  auth,
  Client,
  DseClientOptions,
  mapping,
  types,
} from 'cassandra-driver';

import { format } from 'util';

type DefaultReplicationStrategy = Record<string, any> & {
  class?: 'SimpleStrategy' | 'NetworkTopologyStrategy';
  replication_factor?: number;
};

const USER_TABLE = `CREATE `;

export interface CassandraOptions extends DseClientOptions {
  ormOptions: {
    defaultReplicationStrategy?: Record<string, any> & {
      class?: 'SimpleStrategy' | 'NetworkTopologyStrategy';
      replication_factor?: number;
    };
    migration?: 'safe' | 'alter' | 'drop';
    createKeyspace?: boolean;
    disableTTYConfirmation?: boolean;
    udts?: any;
    udfs?: any;
    udas?: any;
  };
}

@Injectable()
export class CassandraService {
  client: Client;
  mapper: mapping.Mapper;

  async createMapper(mappingOptions: mapping.MappingOptions) {
    try {
      if (this.client == undefined) {
        this.client = this.createClient();
        await this.client.connect();
      }
      const key = Object.keys(mappingOptions.models)[0];
      if (mappingOptions.models[key].keyspace) {
        const keyspaceName = mappingOptions.models[key].keyspace;
        const row = await this.getKeyspace(keyspaceName);
        console.log(row);
        if (!row) {
          await this.createKeyspace(keyspaceName, {
            class: 'NetworkTopologyStrategy',
            datacenter1: 1,
          });
        }
      }
      return new mapping.Mapper(this.client, mappingOptions);
    } catch (e) {
      console.warn(e);
    }
  }

  private createClient() {
    return new Client({
      contactPoints: ['localhost'],
      // keyspace: 'test',
      protocolOptions: {
        port: 9042,
      },
      queryOptions: {
        consistency: 1,
      },
      localDataCenter: 'datacenter1',
      authProvider: new auth.PlainTextAuthProvider('test', 'test'),
    });
  }
  generateReplicationText(replicationOptions) {
    if (typeof replicationOptions === 'string') {
      return replicationOptions;
    }

    const properties = [];
    Object.keys(replicationOptions).forEach((k: string) => {
      properties.push(format("'%s': '%s'", k, replicationOptions[k]));
    });

    return format('{%s}', properties.join(','));
  }

  async createKeyspace(
    keyspaceName: string,
    defaultReplicationStrategy: DefaultReplicationStrategy,
  ) {
    const replicationOption = this.generateReplicationText(
      defaultReplicationStrategy,
    );

    const query = format(
      'CREATE KEYSPACE %s WITH REPLICATION = %s;',
      keyspaceName,
      replicationOption,
    );
    console.log(query);
    try {
      await this.client.execute(query, [], {
        prepare: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async alterKeyspace(
    keyspaceName: string,
    defaultReplicationStrategy: DefaultReplicationStrategy,
  ) {
    const query = 'ALTER KEYSPACE ? WITH REPLICATION = ?';

    try {
      await this.client.execute(query, [
        keyspaceName,
        defaultReplicationStrategy,
      ]);
    } catch (e) {
      await this.client.shutdown();
      console.warn(
        'WARN: KEYSPACE ALTERED! Run the `nodetool repair` command on each affected node.',
      );
    }
  }

  async getKeyspace(keyspaceName: string): Promise<types.Row> {
    const query =
      'SELECT * FROM system_schema.keyspaces WHERE keyspace_name = ?';

    try {
      return (await this.client.execute(query, [keyspaceName])).rows[0];
    } catch (e) {
      // console.log(e);
      return null;
      // await this.client.shutdown();
    }
  }
}
