import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Post from "~/components/Post";
import { db } from "~/utils/db.server";

export const loader = async () => {
    const posts = await db.post.findMany();
    return json({
        posts
    });
}

export default function PostsIndexRoute() {
    const data = useLoaderData<typeof loader>();

    return (
        <div 
        className="flex flex-col w-screen sm:max-w-[500px]">
            <h1 className="font-semibold border-b">Posts</h1>
            <div className="flex flex-col mt-4 gap-2">
               {data.posts.map(post => (
                    <Post
                    key={post.id}
                    title={post.title}
                    content={post.content || ""} />
               ))}
            </div>
        </div>
    )
}