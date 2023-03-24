import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "flowbite-react";
import Post from "~/components/Post";
import { db } from "~/utils/db.server";

export const loader = async () => {
    const posts = await db.post.findMany({
        take: 10,
        orderBy: { createdAt: "desc" }
    });
    return json({
        posts
    });
}

export default function PostsIndexRoute() {
    const data = useLoaderData<typeof loader>();
    
    return (
        <div 
        className="flex flex-col w-screen sm:max-w-[500px]">
            <div className="flex items-center">
                <h1 className="font-bold text-xl mr-auto">Posts</h1>
                <Link to="new">
                    <Button 
                    color="light" 
                    pill={true}
                    >
                        New Post
                    </Button>
                </Link>
            </div>
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