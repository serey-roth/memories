import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useSearchParams } from "@remix-run/react";
import { Alert, Button, Pagination } from "flowbite-react";
import Post from "~/components/Post";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
    const user = await getUserId(request);

    const url = new URL(request.url);
    const page = url.searchParams.get("page");

    if (page && Number.parseInt(page, 10) < 1) {
        throw new Response("Page number must be at least 1", {
            status: 400
        });
    }

    const totalPosts = await db.post.count();
    const totalPages = Math.ceil(totalPosts / 10);

    if (page && Number.parseInt(page, 10) > totalPages) {
        throw new Response("Page number must be at most " + totalPages, {
            status: 400
        });
    }

    const posts = await db.post.findMany({
        take: 10,
        skip: page ? (Number.parseInt(page, 10) - 1) * 10 : 0,
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
        currentPage: page ? Number.parseInt(page, 10) : 1,
        isLoggedIn: !!user,
        totalPages,
    });
}

export default function PostsIndexRoute() {
    const { 
        posts, 
        currentPage, 
        isLoggedIn,
        totalPages
    } = useLoaderData<typeof loader>();
    const [, setSearchParams] = useSearchParams();

    const handlePageChange = (page: number) => {
        setSearchParams({ page: page.toString() });
    }
    
    return (
        <div 
        className="flex flex-col w-screen sm:max-w-[500px]">
            <div className="flex items-center">
                <h1 className="font-bold text-xl mr-auto">Posts</h1>
                {isLoggedIn ? (<Link to="new">
                    <Button 
                    color="light" 
                    pill={true}
                    >
                        New Post
                    </Button>
                </Link>) : null}
            </div>
            <div className="flex flex-col mt-4 mb-2 gap-2">
               {posts.map(post => (
                    <Post
                    key={post.id}
                    title={post.title} 
                    content={post.content}
                    creator={post.creator} />
               ))}
            </div>
            <Pagination
            layout="pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            showIcons={true}
            onPageChange={handlePageChange}
            />
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();

    if (caught.status === 400) {
        return (
            <div className="w-screen sm:max-w-[500px]">
                <h1 className="font-bold text-xl mr-auto mb-2">Posts</h1>
                <Alert color="info">
                    <div className="font-medium">
                        <p className="text-lg">No links</p>
                    </div>
                </Alert>
            </div>
        )
    }
}