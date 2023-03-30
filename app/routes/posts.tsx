import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import { getUserId } from "~/utils/session.server";
import { getUserWithoutPassword } from "~/utils/users.server";

export const loader = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);

    let user; 

    if (userId) {
        user = await getUserWithoutPassword({ id: userId });
    } 

    return json({ user });

}

export default function PostsRoute() {
    const data = useLoaderData<typeof loader>();

    return (
        <div>
            <Navbar title="Memories" user={data.user} />
            <div className="flex justify-center
            items-center w-screen mb-10">
                <Outlet />
            </div>
        </div>
    )
}