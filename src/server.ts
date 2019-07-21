import { config } from "dotenv";
const envVars = config();
if (envVars.error)
  console.error("Failed to parse environment variables: ", envVars.error);

import * as cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import * as express from "express";
import { Server } from "http";
import { buildSchema } from "type-graphql";

import resolvers from "./testing/resolver";
import { terminalColour } from "./utils";

const app = express();
app.use(cookieParser());

let gqlServer: Server;
const port = process.env.PORT;

async function setup() {
  try {

    const schema = await buildSchema({
      resolvers,
      emitSchemaFile: true,
    });

    const server = new ApolloServer({
      schema,
      engine: { apiKey: process.env.APOLLO_ENGINE_API_KEY },
      playground: true,
      introspection: true
    });

    server.applyMiddleware({
      app,
      path: `${process.env.BASE_URL}graphql`,
    });
  
    gqlServer = app.listen(port, () =>
      console.log(
        terminalColour.white,
        `Server ready at http://localhost:${port}${server.graphqlPath}`
      )
    );
    
    const stop = (signal: string) => () => {
      console.log("Exiting, ", signal);
      if (gqlServer) gqlServer.close();
      process.exit();
    };
    
    process.on("SIGINT", stop("SIGINT"));
  } catch (e) {
    console.error('ERROR STARTING SERVER');
    console.log(e);
  }
}

setup();

