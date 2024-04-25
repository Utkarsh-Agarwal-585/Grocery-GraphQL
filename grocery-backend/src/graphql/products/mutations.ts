export const mutations = `#graphql
AddProduct(name: String!, price: Float!, quantity: Int!, description: String!, imageURL: String!): Product
UpdateProduct(id: ID!, name: String, price: Float, quantity: Int, description: String, imageURL: String): Product
DeleteProduct(id: ID!): Product
bookGroceryItems(input: CreateOrderInput!): Order!
`;
