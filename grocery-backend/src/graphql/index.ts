import { ApolloServer } from '@apollo/server';
import { User } from './user';
import { Product } from './products';

async function createGraphqlServer() {
    //Create a new ApolloServer instance
    try {
        const gqlServer = new ApolloServer({
            typeDefs: `
    ${User.typeDefs}
    ${Product.typeDefs}
    type Query {
       ${User.queries}
       ${Product.queries}
    }

    type Mutation {
       ${User.mutations}
       ${Product.mutations}
    }
`,

            resolvers: {
                Query: {
                    ...User.resolvers.queries,
                    ...Product.resolvers.queries
                },
                Mutation: {
                    ...User.resolvers.mutations,
                    ...Product.resolvers.mutations
                },
            }
        },
        );

        //Start the gql server
        await gqlServer.start();
        return gqlServer;
    } catch (error) {
        console.error('Error creating graphql server:', error);
        throw new Error('Failed to create graphql server');
    }
}

export default createGraphqlServer;