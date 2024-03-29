import { NextFunction, Request, Response } from "express";
import { lucia } from "../lib/auth/index.js";
import { parseCookies } from "oslo/cookie";

export async function authenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookies = parseCookies(req.headers.cookie ?? "");
  const cookieToken = cookies.get("auth_session");
  const authorizationHeader = req.headers.authorization
    ? req.headers.authorization
    : `Bearer ${cookieToken}`;

  if (!authorizationHeader && !cookieToken) {
    return res.status(403).json({
      message: "No authorization headers found",
    });
  }

  if (authorizationHeader) {
    const sessionId = lucia.readBearerToken(authorizationHeader) as string;
    const session = await lucia.validateSession(sessionId);

    if (!session) {
      return res.status(403).json({ message: "You are not authenticated" });
    }
  }

  next();
}
