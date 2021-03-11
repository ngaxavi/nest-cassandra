#!/bin/bash

if [ -z $1 ]; then
    nodes=1
else
  nodes=$1
fi

echo $nodes

docker-compose -f docker-compose.yaml up --scale cassandra-node=$nodes
