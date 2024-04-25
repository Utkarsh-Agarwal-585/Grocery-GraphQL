# Grocery Booking API

This project is a grocery application that supports two user roles: USER and ADMIN. It provides GraphQL APIs to manage grocery-related operations using a PostgreSQL database for storing and fetching information.

## Installation

Clone the project

```bash
  git clone https://github.com/Utkarsh-Agarwal-585/qp-assessment.git
```

Go to the project directory

```bash
  cd qp-assessment/grocery-backend
```

Install dependencies and run the server

```bash
  docker compose -f docker-compose.yml up --build --remove-orphans
```

It will Start the server on `port:8000`



## Environment Variables

To run this project, you will need to add the environment variables to your .env file.

For reference, check Sample [.env file](./.env.example)

## Using Prisma Migrate

To migrate the db or schema
```
npx prisma migrate dev --name init 
``` 

Note: Instead of `init` use any commit message

## API endpoint

Once the above steps are done, then enter the below URL to browser

```
http://localhost:8000/graphql
```

## API Contracts
[API Documentation](./src/APIDOC.md)