import cors from "cors";
import http from "http";
// import { Server } from "socket.io";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { loadSchemaSync } from "@graphql-tools/load";
import express, { type Request, type Response } from "express";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { resolvers } from "./resolver/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import userRouter from "./routes/user.route.js";
import { parseCookies } from "oslo/cookie";
import { lucia } from "./lib/auth/index.js";
import { Session, User } from "lucia";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing.js";
import { GraphQLError } from "graphql";

dotenv.config();

const typeDefs = loadSchemaSync("./**/*.graphql", {
  loaders: [new GraphQLFileLoader()],
});

const app = express();
const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   },
// });

export interface GraphQLContext {
  req: Request;
  res: Response;
  session: {
    user: User;
    session: Session;
  };
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  cors({
    origin: process.env.CLIENT_PUBLIC_URL,
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders:
      "Content-Type, Authorization, x-uploadthing-version, x-uploadthing-package",
    credentials: true,
  })
);

app.use(
  "/api/uploadthing",
  createRouteHandler({
    router: uploadRouter,
    config: {
      isDev: true,
    },
  })
);

app.use(express.json());

app.get("/health-check", (req: Request, res: Response) => {
  return res.json({ status: "OK" });
});
app.get("/", (req: Request, res: Response) => {
  return res.json({ hello: "World" });
});

app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      const cookies = parseCookies(req.headers.cookie ?? "");
      const cookieToken = cookies.get("auth_session");
      const authorizationHeader = req.headers.authorization
        ? req.headers.authorization
        : `Bearer ${cookieToken}`;

      const sessionId = lucia.readBearerToken(authorizationHeader) as string;
      const session = await lucia.validateSession(sessionId);

      if (!session.session || !session.user) {
        throw new GraphQLError(
          "You are not authorized to perform this action.",
          {
            extensions: {
              code: "FORBIDDEN",
            },
          }
        );
      }

      return { req, res, session };
    },
  })
);

app.use("/api", userRouter);

// io.use(async (socket, next) => {
//   const authorizationHeader = socket.handshake.headers["authorization"];

//   if (authorizationHeader) {
//     const sessionId = lucia.readBearerToken(authorizationHeader) as string;
//     const session = await lucia.validateSession(sessionId);

//     if (session.user) {
//       next();
//     }
//   }
// });

// io.on("connection", (socket) => {
//   socket.on("room", (room) => {
//     console.log(room);
//   });
// });

await new Promise<void>((resolve) => {
  httpServer.listen({ port: process.env.SERVER_PORT || 4000 }, resolve);
});

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
