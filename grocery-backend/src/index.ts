import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createGraphqlServer(), {
      context: async ({ req }) => {
        // @ts-ignore
        const token = req.headers["token"] as string | undefined;

        try {

          const decodedToken: any = UserService.decodeJWTToken(token as string);
          const userEmail = decodedToken.email;

          // Get user's role based on the email
          const user = await UserService.getUserByEmail(userEmail);

          if (!user) {
            throw new Error("User not found");
          }

          return {
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
}

init();
