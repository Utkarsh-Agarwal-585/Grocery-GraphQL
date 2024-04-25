import ProductService, { AddProductPayload, UpdateProductPayload } from "../../services/products";
import { GraphQLError } from "graphql";

// Payload for adding a product
interface ProductOrderInput {
    productID: string;
    quantity: number;
}

// Payload for creating an order
interface CreateOrderInput {
    products: ProductOrderInput[];
}

const queries = {

    // Get all products
    getProducts: async () => {
        try {
            const res = await ProductService.getproducts();
            return res;
        }
        catch (error) {
            console.error('Error getting products:', error);
            throw new GraphQLError("Failed to get products", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    },

    // Get product by ID
    getProductById: async (_: any, payload: { id: string }) => {
        try {
            const res = await ProductService.getProductById(payload.id);
            return res;
        }
        catch (error) {
            console.error('Error getting product by id:', error);
            throw new GraphQLError("Failed to get product by id", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    },
};


const mutations = {

    // Add a product
    AddProduct: async (_: any, payload: AddProductPayload, context: any) => {
        if (context && context.user && context.user.role !== "ADMIN") {
            throw new GraphQLError("You are not allowed to add a product", {
                extensions: {
                    code: 'UNAUTHORIZED'
                },
            });
        }
        try {
            const res = await ProductService.AddProduct(payload);
            return res;
        }
        catch (error) {
            console.error('Error adding product:', error);
            throw new GraphQLError("Failed to add product", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    },

    // Update a product
    UpdateProduct: async (_: any, payload: UpdateProductPayload, context: any) => {
        if (context && context.user && context.user.role !== "ADMIN") {
            throw new GraphQLError("You are not allowed to update a product", {
                extensions: {
                    code: 'UNAUTHORIZED'
                },
            });
        }
        const { id, ...updateData } = payload;

        try {
            const updatedProduct = await ProductService.UpdateProduct(id, updateData);
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            throw new GraphQLError("Failed to update product", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    },

    // Delete a product
    DeleteProduct: async (_: any, payload: { id: string }, context: any) => {
        if (context && context.user && context.user.role !== "ADMIN") {
            throw new GraphQLError("You are not allowed to delete a product", {
                extensions: {
                    code: 'UNAUTHORIZED'
                },
            });
        }
        try {
            const res = await ProductService.DeleteProduct(payload.id);
            return res;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new GraphQLError("Failed to delete product", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    },

    // Book grocery items
    bookGroceryItems: async (_: any, { input }: { input: CreateOrderInput }, context: any) => {
        if (context && context.user && context.user.role !== "USER") {
            throw new GraphQLError("You are not allowed to book grocery items", {
                extensions: {
                    code: 'UNAUTHORIZED'
                },
            });
        }
        const userId = context.user.id;
        const { products } = input;
        try {
            const createdOrder = await ProductService.bookGroceryItems(userId, products);
            return createdOrder;
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("Not enough quantity available")) {
                    throw new GraphQLError("Not enough quantity available for the selected products", {
                        extensions: {
                            code: 'INSUFFICIENT_QUANTITY'
                        },
                    });
                }
            }
            console.error("Error booking grocery items:", error);
            throw new GraphQLError("Failed to book grocery items", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }
};

export const resolvers = {
    mutations,
    queries
};  