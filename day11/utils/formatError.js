require('dotenv').config();

const util = require('util');
const graphql = require('apollo-server-express');
const sequelize = require('sequelize');

util.inspect.defaultOptions.depth = null;

exports.formatError = (error, options = { showHiddenNodes: false }) => {
  util.inspect.defaultOptions.showHidden = options.showHiddenNodes;
  console.log('FORMAT ERROR', { error });
  if (error instanceof sequelize.ValidationError) {
    return {
      success: false,
      errors: error.errors.map((x) => ({ path: x.path, message: x.message })),
      code: 'ERROR_DATABASE_VALIDATION',
    };
  }

  if (error instanceof graphql.ValidationError) {
    return {
      success: false,
      code: 'ERROR_GRAPHQL_VALIDATION',
      errors: [{ path: null, message: error.message }],
    };
  }

  return { success: false, message: 'Something went wrong' };
};

exports.formatGraphqlError = (error) => {
  let { extensions, ...rest } = error;

  if ('stacktrace' in extensions?.exception && process.env.MODE !== 'development') {
    const { stacktrace, ...restException } = extensions.exception;
    rest = {
      ...rest,
      extensions: {
        ...extensions,
        exception: restException,
      },
    };
    return rest;
  }
  return error;
};
