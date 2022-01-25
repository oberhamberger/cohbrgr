import { graphqlHTTP } from 'express-graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

import * as typeDefs from 'src/server/i18n/schema.graphql';
import Logger from 'src/server/utils/logger';
import { Language, Scalars } from 'src/@types/translations';
import data from 'src/server/i18n/translations.json';

console.log(JSON.stringify(typeDefs));

const resolvers = {
    Query: {
        translation(id: Scalars['ID'], lang: Language) {
            return data[id]?.[lang];
        },
        allTranslations() {
            return data;
        },
    },
};

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const root = {
    allTranslations: () => data,
};

const translation = () => {
    Logger.info('calling GraphQL Middleware');
    return graphqlHTTP({
        schema: executableSchema,
        rootValue: root,
        graphiql: true,
    });
};

export default translation;
