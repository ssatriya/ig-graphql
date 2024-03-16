import { parseCookies, serializeCookie } from "oslo/cookie";
import { OAuth2RequestError, generateCodeVerifier, generateState, } from "arctic";
import { generateId } from "lucia";
import { and, eq } from "drizzle-orm";
import { google, lucia } from "../lib/auth/index.js";
import db from "../lib/db/index.js";
import { oauthAccounts, users } from "../lib/db/schema.js";
import dotenv from "dotenv";
dotenv.config();
export async function googleLoginController(req, res) {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ["profile", "email"],
    });
    res.appendHeader("Set-Cookie", serializeCookie("google_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 60,
        sameSite: "lax",
    }));
    res.appendHeader("Set-Cookie", serializeCookie("code_verifier", codeVerifier, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    }));
    return res.redirect(url.toString());
}
export async function googleLoginCallbackController(req, res) {
    var _a, _b, _c, _d, _e, _f, _g;
    const clientAfterLoginRedirect = `${process.env.CLIENT_PUBLIC_URL}${process.env.CLIENT_AFTER_LOGIN_URL}`;
    const code = (_b = (_a = req.query.code) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null;
    const state = (_d = (_c = req.query.state) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null;
    const cookies = parseCookies((_e = req.headers.cookie) !== null && _e !== void 0 ? _e : "");
    const codeVerifier = (_f = cookies.get("code_verifier")) !== null && _f !== void 0 ? _f : null;
    const storedState = (_g = cookies.get("google_oauth_state")) !== null && _g !== void 0 ? _g : null;
    if (!code ||
        !state ||
        !storedState ||
        state !== storedState ||
        !codeVerifier) {
        return res.sendStatus(400).end();
    }
    try {
        const tokens = await google.validateAuthorizationCode(code, codeVerifier);
        const googleUserResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
            },
        });
        const googleUserResult = await googleUserResponse.json();
        const [existingAccount] = await db
            .select()
            .from(oauthAccounts)
            .where(and(eq(oauthAccounts.providerId, "google"), eq(oauthAccounts.providerUserId, googleUserResult.sub)));
        if (existingAccount) {
            const session = await lucia.createSession(existingAccount.userId, {});
            res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
            return res.redirect(clientAfterLoginRedirect);
        }
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, googleUserResult.email));
        if (existingUser.length > 0) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/auth/login?error=OAuthEmailTaken",
                },
            });
        }
        const userId = generateId(16);
        await db.transaction(async (tx) => {
            await tx.insert(users).values({
                id: userId,
                name: googleUserResult.name,
                username: `${googleUserResult.given_name.toLowerCase()}`,
                email: googleUserResult.email,
                isOauth: true,
                image: googleUserResult.picture,
            });
            await tx.insert(oauthAccounts).values({
                providerId: "google",
                providerUserId: googleUserResult.sub,
                userId: userId,
            });
        });
        const session = await lucia.createSession(userId, {});
        res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
        return res.redirect(clientAfterLoginRedirect);
    }
    catch (error) {
        console.log(error);
        if (error instanceof OAuth2RequestError) {
            return res.status(400).json({ error: error.description }).end();
        }
        return res.sendStatus(500);
    }
}
export async function userSessionController(req, res) {
    var _a;
    const cookies = parseCookies((_a = req.headers.cookie) !== null && _a !== void 0 ? _a : "");
    const cookieToken = cookies.get("auth_session");
    const authorizationHeader = req.headers.authorization
        ? req.headers.authorization
        : `Bearer ${cookieToken}`;
    const sessionId = lucia.readBearerToken(authorizationHeader !== null && authorizationHeader !== void 0 ? authorizationHeader : "");
    if (!sessionId) {
        return new Response(null, {
            status: 401,
        });
    }
    const session = await lucia.validateSession(sessionId);
    return res.status(200).json(session);
}
export async function logoutController(req, res) {
    try {
        const authorizationHeader = req.headers.authorization;
        const sessionId = lucia.readBearerToken(authorizationHeader !== null && authorizationHeader !== void 0 ? authorizationHeader : "");
        if (!sessionId) {
            return new Response(null, {
                status: 401,
            });
        }
        await lucia.invalidateSession(sessionId);
        return res
            .setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
            .end();
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}
