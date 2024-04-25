export const typeDefs = `#graphql
type Product {
    id: ID!
    name: String!
    price: Float!
    quantity: Int!
    description: String!
    imageURL: String!
  }

  type Products {
    id: ID!
    quantity: Int!
  }

input ProductOrderInput {
    productID: ID!
    quantity: Int!
}

input CreateOrderInput {
  products: [ProductOrderInput!]!
}

type Order {
    id: ID!
    userId: ID
    totalAmount: Float!
    quantity: Int!
    createdAt: String!
    products: [Products!]!
}
`;