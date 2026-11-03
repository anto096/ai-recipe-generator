import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  askBedrock: a
    .query()
    .arguments({
      ingredients: a.string().array(),
    })
    .returns(
      a.customType({
        body: a.string(),
        error: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({
        entry: './bedrock.js',
        dataSource: 'bedrockDS',
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});