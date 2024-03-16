import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { loadSchemaSync } from "@graphql-tools/load";
import express from "express";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { resolvers } from "./resolver/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import userRouter from "./routes/user.route.js";
import { parseCookies } from "oslo/cookie";
import { lucia } from "./lib/auth/index.js";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./lib/uploadthing.js";
import { GraphQLError } from "graphql";
dotenv.config();
const typeDefs = loadSchemaSync("./**/*.graphql", {
    loaders: [new GraphQLFileLoader()],
});
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization, x-uploadthing-version, x-uploadthing-package",
    credentials: true,
}));
app.use("/api/uploadthing", createRouteHandler({
    router: uploadRouter,
    config: {
        isDev: true,
    },
}));
app.use(express.json());
app.get("/health-check", (req, res) => {
    return res.json({ status: "OK" });
});
app.get("/", (req, res) => {
    return res.json({ hello: "World" });
});
app.use("/graphql", cors(), express.json(), expressMiddleware(server, {
    context: async ({ req, res }) => {
        var _a;
        const cookies = parseCookies((_a = req.headers.cookie) !== null && _a !== void 0 ? _a : "");
        const cookieToken = cookies.get("auth_session");
        const authorizationHeader = req.headers.authorization
            ? req.headers.authorization
            : `Bearer ${cookieToken}`;
        const sessionId = lucia.readBearerToken(authorizationHeader);
        const session = await lucia.validateSession(sessionId);
        if (!session.session || !session.user) {
            throw new GraphQLError("You are not authorized to perform this action.", {
                extensions: {
                    code: "FORBIDDEN",
                },
            });
        }
        return { req, res, session };
    },
}));
app.use("/api", userRouter);
await new Promise((resolve) => {
    httpServer.listen({ port: process.env.SERVER_PORT || 4000 }, resolve);
});
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
