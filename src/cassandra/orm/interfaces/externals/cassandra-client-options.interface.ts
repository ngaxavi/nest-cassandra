import { ClientOptions } from 'cassandra-driver';

export type ConnectionOptions = { name?: string } & ClientOptionsStatic;

export interface ClientOptionsStatic {
  clientOptions: ClientOptions & Partial<ElasticSearchClientOptionsStatic>;
  ormOptions: Partial<OrmOptionsStatic>;
}

export interface OrmOptionsStatic {
  defaultReplicationStrategy?: {
    class?: 'SimpleStrategy' | 'NetworkTopologyStrategy';
    replication_factor?: number;
  };

  migration?: 'safe' | 'alter' | 'drop';
  createKeyspace?: boolean;
  disableTTYConfirmation?: boolean;
  manageESIndex?: boolean;
  manageGraphs?: boolean;
  udts?: any;
  udfs?: any;
  udas?: any;
}

export interface ElasticSearchClientOptionsStatic {
  elasticsearch: {
    host?: string;
    apiVersion?: string;
    sniffOnStart?: boolean;
  };
}
