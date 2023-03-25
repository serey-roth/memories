import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUserSession, storage } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
    const session = await getUserSession(request);
    return redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session)
        }
    });
}

export const loader = async () => {
    return redirect("/");
}