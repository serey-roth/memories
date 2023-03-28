import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useSearchParams } from "@remix-run/react";
import { Button } from "flowbite-react";
import { ErrorWithOptionalContent } from "~/components/ErrorWithOptionalContent";
import { Pagination } from "~/components/Pagination";
import Post from "~/components/Post";
import { createBadRequestError } from "~/utils/error.server";
import { getPaginatedPostsWithCreator, getTotalPages } from "~/utils/posts.server";
import { getUserId } from "~/utils/session.server";

const MIN_PAGE_NUMBER = 1;

const renderNewPostButton = () => {
    return (
        <Link to="new">
            <Button 
            color="light" 
            pill={true}
            >
                New Post
            </Button>
        </Link>
    )
}

export const loader = async ({ request }: LoaderArgs) => {
    const user = await getUserId(request);

    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");

    if (!pageParam) {
        throw createBadRequestError(
            "Page number is mandatory!"
        );
    }

    const pageNumber = Number.parseInt(pageParam, 10);
    const totalPages = await getTotalPages();

    if (pageNumber < MIN_PAGE_NUMBER || pageNumber > totalPages) {
        throw createBadRequestError(
            "Page number must be between 1 and " + totalPages
        );
    }

    const posts = await getPaginatedPostsWithCreator(pageNumber);

    return json({
        posts,
        currentPage: pageNumber,
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
                {isLoggedIn ? renderNewPostButton() : null}
            </div>
            <div className="flex flex-col mt-4 mb-2 gap-2">
               {posts.map(post => (
                    <Post
                    key={post.id}
                    id={post.id}
                    title={post.title} 
                    content={post.content}
                    creator={post.creator} />
               ))}
            </div>
            <div className="w-full flex items-center justify-center">
                <Pagination
                layout="pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                showIcons={true}
                onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();

    if (caught.status === 400) {
        return (
            <div className="w-screen sm:max-w-[500px]">
                <h1 className="font-bold text-xl mr-auto mb-2">Posts</h1>
                <ErrorWithOptionalContent message="No posts" />
            </div>
        )
    }
}