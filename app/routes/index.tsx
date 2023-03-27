import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

export const meta: MetaFunction = () => ({
	title: "Memories with Remix: Capture the moment!",
	description:
	  "Memories: a social feed app with Remix.",
});
  
export default function Index() {
    const data = useLoaderData<typeof loader>();
    
    return (
        <div>
            <Navbar title="Memories" user={data.user}/>
        </div>
    );
}
