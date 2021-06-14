import express from 'express';
import {graphqlExpress, graphiqlExpress} from "apollo-server-express";
import cors from 'cors'
import { makeExecutableSchema } from 'graphql-tools';

import loaders from './loaders';

import typeDefs from "./typedefs";
import resolvers from "./resolvers"

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

app.use(cors());

app.use(
  '/graphql',
  express.json(),
  graphqlExpress(() => ({ 
    schema,
    context: {
      loaders: loaders()
    }
  }))
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(4000);
