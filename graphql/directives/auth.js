const { mapSchema, getDirective, MapperKind } = require("@graphql-tools/utils");
const { AuthenticationError } = require("apollo-server-express");
const { defaultFieldResolver } = require("graphql");

// prettier-ignore
module.exports = {
  authDirectiveTransformer: (schema,directiveName) => {
    return mapSchema(schema,{
      [MapperKind.OBJECT_FIELD]: fieldConfig => {
        const authDirective = getDirective(schema,fieldConfig,directiveName)?.[0]
        if(authDirective) {
          const {resolve = defaultFieldResolver} = fieldConfig
          fieldConfig.resolve = async function(source, args, context,info ) {
            if(!context.user) {
              throw new AuthenticationError('You are not authenticated')
            }
            console.log(fieldConfig);
            return resolve(source,args,context,info)
          }
        }
      }
    })
  }
}
