import { createCookieSessionStorage, redirect } from "@remix-run/node";

type SessionData = {
    userId: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("Session secret is missing!");
}

const storage = createCookieSessionStorage<SessionData>({
    cookie: {
        name: "remix-memories",
        secrets: [sessionSecret],
        maxAge: 60 * 60 * 24 * 100,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    }
});

export const createUserSession = async (
    userId: string,
    redirectTo: string
) => {
    const session = await storage.getSession();
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session)
        }
    });
}

export const getUserSession = async (request: Request) => {
    return storage.getSession(request.headers.get("Cookie"));
}

export const getUserId = async (request: Request) => {
    const session = await getUserSession(request);
    return session.get("userId");
}

export const requireUserId = async (
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) => {
    const userId = await getUserId(request);
    if (!userId) {
        const searchParams = new URLSearchParams([
            ["redirectTo", redirectTo]
        ]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

