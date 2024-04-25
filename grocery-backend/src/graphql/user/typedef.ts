export const typeDefs = `#graphql
type User {
        id: ID!
        firstName: String!
        lastName: String
        email: String!
        profileImageURL: String
        role: Role!
        createdAt: String!
        updatedAt: String!
    }

    enum Role {
    ADMIN
    USER
}
`;
