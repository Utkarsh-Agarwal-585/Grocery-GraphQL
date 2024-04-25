# API Documentation (Graphql)
# User

## Mutations
### createUser
Create a user

- **Input**:
  - `firstName`: string!
  - `lastName`: string
  - `email`: string!
  - `password`: string!
  - `role`: string (USER | ADMIN)

- **Output**:
  ```graphql
  data: {
    createUser: ID
  }
  ```

### bookGroceryItems
Creating an Order

- **Input**:
    - **Headers**:
        - `token`: string! 
  - `CreateOrderInput`: Object!
    - `productID`: string!
    - `quantity`: number:
    

- **Output**:
  ```graphql
  data: {
    bookGroceryItems: Order (Object)
  }
  ```

## Queries

### getUserToken

Retrieve a user by ID.

- **Input**:
  - `email`: string!
  - `password`: string!
  
- **Output**:
  ```graphql
  data: {
    getUserToken: String
  }
  ```
### getCurrentLoggedInUser

Retrieve a user by ID.

- **Input**:
    - **Headers**:
        - `token`: string! 
  
- **Output**:
  ```graphql
  data: {
    getCurrentLoggedInUser: User (Object)
  }
  ```

# ADMIN

## Mutations
### AddProduct
Add a product

- **Input**:
    - **Headers**:
        - `token`: String! 
  - `name`: string!
  - `price`: number!
  - `quantity`: number!
  - `description`: string!
  - `imageURL`: string!

- **Output**:
  ```graphql
  data: {
    AddProduct: Product (Object)
  }
  ```

### UpdateProduct
Update a product (price | quantity | name | description | imageURL)

- **Input**:
    - **Headers**:
        - `token`: String! 
  - `updateProductId`: ID!
  - `name`: string
  - `price`: number
  - `quantity`: number
  - `description`: string
  - `imageURL`: string

- **Output**:
  ```graphql
  data: {
    UpdateProduct: {
        name: string,
        price: number,
        quantity: number,
        description: string,
        imageURL: string
    }
  }
  ```

  ### DeleteProduct
Delete a product

- **Input**:
    - **Headers**:
        - `token`: String! 
  - `deleteProductId`: ID! (Product)

- **Output**:
  ```graphql
  data: {
    DeleteProduct: Product (Object)
  }
  ```

## Queries

### getProducts

Retrieve all Products

- **Input**:
    - **Headers**:
        - `token`: String! 
  - `Product`: Object (Fields)
  
- **Output**:
  ```graphql
  data: {
    getProducts: [Product]
  }
  ```
### getProductById

Retrieve a product by ID.

- **Input**:
    - **Headers**:
        - `token`: String! 
    - `getProductByIdId`: ID! (ProductID)
  
- **Output**:
  ```graphql
  data: {
    getProductById: Product (Object)
  }
  ```



