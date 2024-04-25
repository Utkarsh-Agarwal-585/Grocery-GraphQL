import { prismaClient } from "../lib/db";
import { GraphQLError } from "graphql";

// Payload for adding a product
export interface AddProductPayload {
    name: string;
    price: number;
    quantity: number;
    description: string;
    imageURL: string;
}

// Payload for updating a product
export interface UpdateProductPayload {
    id: string;
    name?: string;
    price?: number;
    quantity?: number;
    description?: string;
    imageURL?: string;
}

// Interface for a product
interface Products {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

// Interface for a product order
interface ProductOrder {
    productID: string;
    quantity: number;
}

class ProductService {

    // Get all products
    public static getproducts() {
        try {
            return prismaClient.product.findMany();
        } catch (error) {
            console.error('Error getting products:', error);
            throw new GraphQLError("Failed to get products", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }

    // Get product by ID
    public static getProductById(id: string) {
        try {
            return prismaClient.product.findUnique({ where: { id } });
        } catch (error) {
            console.error('Error getting product by id:', error);
            throw new GraphQLError("Failed to get product by id", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }
 
    // Add a product
    public static AddProduct(payload: AddProductPayload) {
        const { name, price, quantity, description, imageURL } = payload;

        try {
            return prismaClient.product.create({
                data: {
                    name,
                    price,
                    quantity,
                    description,
                    imageURL

                },
            });
        } catch (error) {
            console.error('Error adding product:', error);
            throw new GraphQLError("Failed to add product", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }

    // Update a product
    public static UpdateProduct(id: string, updateData: Partial<UpdateProductPayload>) {
        try {
            const updatedProduct = prismaClient.product.update({
                where: { id },
                data: updateData,
            });
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
            throw new GraphQLError("Failed to update product", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }

    // Delete a product
    public static DeleteProduct(id: string) {
        try {
            return prismaClient.product.delete({ where: { id } });
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new GraphQLError("Failed to delete product", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }

    // Get a product by ID
    public static async getProductByID(productID: string): Promise<Products | null> {
        try {
            return prismaClient.product.findUnique({ where: { id: productID } });
        } catch (error) {
            console.error('Error getting product by id:', error);
            throw new GraphQLError("Failed to get product by id", {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                },
            });
        }
    }

    // Book grocery items
    public static async bookGroceryItems(userId: string, productOrders: ProductOrder[]): Promise<any> {
        let totalAmount = 0;
        let orderQuantity = 0;

        try {
            // Calculate total amount and quantity based on product orders
            for (const { productID, quantity } of productOrders) {
                const product = await ProductService.getProductByID(productID);
                if (!product) {
                    throw new GraphQLError(`Product with ID ${productID} not found`);

                }
                if (quantity > product.quantity) {
                    throw new GraphQLError(`Not enough quantity available for product: ${product.id}`);
                }
                totalAmount += product.price * quantity;
                orderQuantity += quantity;
            }

            // Create the order in the database
            const createdOrder = await prismaClient.order.create({
                data: {
                    userId,
                    totalAmount,
                    quantity: orderQuantity,
                    products: {
                        create: productOrders.map(({ productID, quantity }) => ({
                            product: { connect: { id: productID } },
                            quantity,
                        })),
                    },
                },
                include: {
                    products: true,
                },
            });

            return createdOrder;
        } catch (error) {
            console.error("Error in bookGroceryItems:", error);
            throw error;
        }
    }

}

export default ProductService;
