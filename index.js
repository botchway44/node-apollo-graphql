const gql = require('graphql-tag');
const { ApolloServer }  = require( 'apollo-server-express' );
const { ApolloServerPluginDrainHttpServer } = require ('apollo-server-core');
const express = require( 'express');
const http = require( 'http');
const morgan = require('morgan');

const typeDefs = gql`
        type User {
            id: ID!
            name: String!
            email: String!
            last_name: String!
            first_name: String!
        }

        type Query {
            me: User!
        }

        type Mutation {
            me: User!
        }

    `;

const resolvers = {
    Query: {
        me: (parent, args, context) => {
            console.log(context);

            return {
                id: 1,
                first_name: 'John',
                email: 'john@gmail.com',
                last_name: 'Doe',
            }
        }
    }
};


async function startApolloServer(typeDefs, resolvers) {
    // Required logic for integrating with Express
    const app = express();
    app.use(morgan('dev'));

    const httpServer = http.createServer(app);
  
    // Same ApolloServer initialization as before, plus the drain plugin.
    const server = new ApolloServer({
      context(){         
         return {data : "hello"};
      },
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
     
    ],
    });
  
    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
      app,
  
      // By default, apollo-server hosts its GraphQL endpoint at the
      // server root. However, *other* Apollo Server packages host it at
      // /graphql. Optionally provide this to match apollo-server.
      path: '/'
    });
  
    // Modified server startup
    await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  }

//start the apollo server
startApolloServer(typeDefs, resolvers);