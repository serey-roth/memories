import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);

    let user;

    if (userId) {
        user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true }
        });
    } 

    return json({
        user
    });

}

export default function Index() {
    const data = useLoaderData<typeof loader>();

    const isLoggedIn = !!data.user;

    return (
        <div>
            <Navbar
            title="Memories"
            links={[
                {
                    name: "Home",
                    to: "/"
                },
                {
                    name: isLoggedIn ? "Logout" : "Login",
                    to: isLoggedIn ? "/logout" : "/login"
                },
            ]} 
            user={data.user}/>
        </div>
    );
}
