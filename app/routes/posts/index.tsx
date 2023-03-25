import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Button } from "flowbite-react";
import Post from "~/components/Post";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
    const user = await getUserId(request);
    const posts = await db.post.findMany({
        take: 10,
        select: { 
            id: true, 
            title: true, 
            content: true,
            creator: {
                select: {
                    username: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
    return json({
        posts,
        isLoggedIn: !!user,
    });
}

export default function PostsIndexRoute() {
    const data = useLoaderData<typeof loader>();
    
    return (
        <div 
        className="flex flex-col w-screen sm:max-w-[500px]">
            <div className="flex items-center">
                <h1 className="font-bold text-xl mr-auto">Posts</h1>
                {data.isLoggedIn ? (<Link to="new">
                    <Button 
                    color="light" 
                    pill={true}
                    >
                        New Post
                    </Button>
                </Link>) : null}
            </div>
            <div className="flex flex-col mt-4 gap-2">
               {data.posts.map(post => (
                    <Post
                    key={post.id}
                    title={post.title} 
                    content={post.content}
                    creator={post.creator} />
               ))}
            </div>
        </div>
    )
}