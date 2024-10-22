const { AuthenticationError: AuthenticationErrorNative } = require('apollo-server-express');
const { GraphQLError } = require('graphql');

class ErrorService extends Error {
  constructor(name = null, message = null, code = null) {
    super();
    this.name = name;
    this.message = message;
    this.code = code;
    this.stack = null;
  }
}

class GraphqlErrorService extends GraphQLError {
  constructor(message = '', code) {
    super(message);
    this.message = message;
    this.code = code;
    this.stack = null;
  }
}

class AuthenticationError extends AuthenticationErrorNative {
  constructor(message = null, code = null) {
    super(message);
    this.extensions.code = code;
    this.code = code;
    this.stack = null;
  }
}

module.exports = {
  Error: ErrorService,
  GraphqlError: GraphqlErrorService,
  AuthenticationError,
};
