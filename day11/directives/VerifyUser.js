const { SchemaDirectiveVisitor, ApolloError } = require('apollo-server-express');
const { defaultFieldResolver } = require('graphql');

const { errorCodes, errors } = require('../core/strings');
const { GraphqlError, AuthenticationError } = require('../services/ErrorService');

class VerifyUser extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    let User;
    let Credential;

    field.resolve = async (root, args, context, info) => {
      const { user, credentialId, db, role } = context;
      Credential = await db.credential.getByFields({
        status: 1,
        id: credentialId,
        role_id: role.roleId,
      });
      if (!Credential) {
        throw new ApolloError(errors.ACCOUNT_DOES_NOT_EXISTS, errorCodes.account.ACCOUNT_DOES_NOT_EXISTS);
      }
      User = await db.user.getByFields({
        status: 1,
        id: user.id,
      });
      if (!User) {
        throw new ApolloError(errors.ACCOUNT_DOES_NOT_EXISTS, errorCodes.account.ACCOUNT_DOES_NOT_EXISTS);
      }

      return resolver(
        root,
        args,
        {
          ...context,
          directives: {
            ...(context.directives || {}),
            ...(User && Credential ? { verifyUser: { user: JSON.parse(JSON.stringify(User)), credential: JSON.parse(JSON.stringify(Credential)) } } : {}),
          },
        },
        info,
      );
    };
  }
}

module.exports = VerifyUser;
