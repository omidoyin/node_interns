"use strict";
/*Powered By: Manaknightdigital Inc. https://manaknightdigital.com/ Year: 2020*/
/**
 * App
 * @copyright 2020 Manaknightdigital Inc.
 * @link https://manaknightdigital.com
 * @license Proprietary Software licensing
 * @author Ryan Wong
 *
 */
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const logger = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { graphqlUploadExpress } = require("graphql-upload");
const body_parser = require("body-parser");

const db = require("./models");
const typeDefs = fs.readFileSync(
  path.join(__dirname, "/types/schema.graphql"),
  "utf8"
);
const jwtService = require("./services/JwtService");
const resolvers = require("./resolvers");
const schemaDirectives = require("./directives");
const { AuthenticationError } = require("./services/ErrorService");
const { errorCodes } = require("./core/strings");
const { formatGraphqlError } = require("./utils/formatError");

const GRAPHQL_PATH = "/graphql";
const ALLOWED_ROLE_IDS = [2];

let app = express();

app.use(logger("dev"));

if (process.env.MODE === "development") {
  logger.token("graphql-query", (req) => {
    const disallowedLogs = ["IntrospectionQuery"];

    if (req.method === "POST" && req.originalUrl === GRAPHQL_PATH) {
      const { query, variables, operationName } = req.body;
      return !disallowedLogs.includes(operationName)
        ? `GRAPHQL: \nOperation Name: ${operationName} \nQuery: ${query} \nVariables: ${JSON.stringify(
            variables
          )}`
        : "";
    }
    return "";
  });
  app.use(logger(":graphql-query"));
}

const server = new ApolloServer({
  uploads: false,
  typeDefs,
  resolvers,
  schemaDirectives,
  // context: async ({ req }) => {
  //   const token = req.headers.authorization;

  //   if (!token) {
  //     throw new AuthenticationError(
  //       'Invalid token',
  //       errorCodes.token.INVALID_TOKEN
  //     )
  //   }
  //   const cleanToken = token.replace('Bearer ', '')
  //   const verify = jwtService.verifyAccessToken(cleanToken)

  //   const roleId = verify?.role_id
  //   const user = verify?.user
  //   const credentialId = verify?.credential_id

  //   if (!verify || !roleId || !user || !credentialId) {
  //     throw new AuthenticationError(
  //       'Invalid token',
  //       errorCodes.token.INVALID_TOKEN
  //     )
  //   }

  //   if (!ALLOWED_ROLE_IDS.includes(+roleId)) {
  //     throw new AuthenticationError(
  //       'Access Denied',
  //       errorCodes.account.UNAUTHORIZED
  //     )
  //   }

  //   return {
  //     credentialId,
  //     user,
  //     db,
  //     role: {
  //       roleId,
  //       allowedRoleIds: ALLOWED_ROLE_IDS,
  //     },
  //   };
  // },
  formatError: formatGraphqlError,
});

if (process.NODE_ENV === "maintenance") {
  app.all("*", (req, res) => {
    res.status(503).json({ message: "website under maintenance" });
  });
}

app.set("iocContainer", process.env);
app.set("db", db);
app.use(body_parser.json({ limit: "50mb" }));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());
app.set("view engine", "eta");
app.set("views", path.join(__dirname, "/views"));
app.use(cookieParser());
app.use(helmet());

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/uploads")));
app.use(express.static(path.join(__dirname)));

app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));

server.applyMiddleware({ app, path: GRAPHQL_PATH });

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

app.use((_, res, next) => {
  return res
    .status(400)
    .send("<h3 style='text-align:center';>404: Page Not Found!</h3>");
});

module.exports = {
  app,
  apollo: server,
};
