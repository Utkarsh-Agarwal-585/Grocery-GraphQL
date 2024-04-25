import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";
import { Role } from "@prisma/client";
import { GraphQLError } from "graphql";

const JWT_SECRET = "$Test@123";

// Payload for creating a user
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

// Payload for getting a user token
export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {

  // Generate a hash for the password
  private static generateHash(salt: string, password: string) {
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashedPassword;
  }

  // Get user by ID
  public static getUserById(id: string) {
    try {
      return prismaClient.user.findUnique({ where: { id } });
    } catch (error) {
      console.error('Error getting user by id:', error);
      throw new GraphQLError("Failed to get user by id", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        },
      });
    }
  }

  // Create a user
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password, role } = payload;

    try {
      // Generate salt and hash the password
      const salt = randomBytes(32).toString("hex");
      const hashedPassword = UserService.generateHash(salt, password);

      return prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          salt,
          role: role || Role.USER,
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new GraphQLError("Failed to create user", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        },
      });
    }
  }

  // Get user by email
  public static getUserByEmail(email: string) {
    try {
      return prismaClient.user.findUnique({ where: { email } });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new GraphQLError("Failed to get user by email", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        },
      });
    }
  }

  // Get user token
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) throw new GraphQLError("User not found")

      const userSalt = user.salt;
      const usersHashPassword = UserService.generateHash(userSalt, password);

      if (usersHashPassword !== user.password)
        throw new GraphQLError("Incorrect Password")

      // Gen Token
      const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
      return token;
    } catch (error) {
      console.error('Error getting user token:', error);
      throw new GraphQLError("Failed to get user token", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        },
      });
    }
  }

  // Decode JWT token
  public static decodeJWTToken(token: string) {
      return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;
