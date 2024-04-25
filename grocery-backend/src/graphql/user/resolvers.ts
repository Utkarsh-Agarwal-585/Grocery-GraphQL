import UserService, { CreateUserPayload } from "../../services/user";
import { GraphQLError } from "graphql";

const queries = {

  // getUserToken is a function that takes an email and password as arguments and returns a string.
  getUserToken: async (
    _: any,
    payload: { email: string; password: string }
  ) => {
    try {
      const token = await UserService.getUserToken({
        email: payload.email,
        password: payload.password,
      });
      return token;
    } catch (error) {
      console.error('Error getting user token:', error);
      throw new GraphQLError("Failed to get user token", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        },
      });
    }

  },

  // getCurrentLoggedInUser is a function that returns the current logged-in user.
  getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const id = context.user.id;
      try {
        const user = await UserService.getUserById(id);
        return user;
      } catch (error) {
        console.error('Error getting current logged-in user:', error);
        throw new GraphQLError("Failed to get current logged-in user", {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR'
          },
        });
      }
    }
  },
};

const mutations = {

  // createUser is a function that takes a CreateUserPayload as an argument and returns a string.
  createUser: async (_: any, payload: CreateUserPayload, context: any) => {
    try {
      const res = await UserService.createUser(payload);
      return res.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new GraphQLError("Failed to create user", {
        extensions: {
          code: 'INTERNAL_SERVER_ERROR'
        },
      });
    }
  },
};

export const resolvers = {
  queries,
  mutations,
  User: {
    role: async (user: any) => {
      return user.role || "USER";
    },
  },
};
