import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import { Button } from "flowbite-react";
import { ErrorWithOptionalContent } from "~/components/ErrorWithOptionalContent";
import { createForbiddenRequestError, createPostNotFoundError } from "~/utils/error.server";
import { deletePost, getPost } from "~/utils/posts.server";
import { requireUserId } from "~/utils/session.server";

const renderDeleteButton = () => {
    return (
        <>
        <form method="post">
            <Button 
            name="intent" 
            type="submit" 
            value="delete"
            className="bg-red-500 w-full mt-4">
                Delete
            </Button>
        </form>
        </>
    );
}

export const loader = async ({ params, request }: LoaderArgs) => {
    const userId = await requireUserId(request);
    const { postId } = params;

    const post = await getPost(postId);

    if (!post) {
        throw createPostNotFoundError("Post not found.");
    }

    const isOwner = userId === post.creatorId;

    return json({ post, isOwner });
}

export const action = async ({ params, request }: ActionArgs) => {
    const userId = await requireUserId(request);

    const { postId } = params;
    const form = await request.formData();
    const intent = form.get("intent");

    const post = await getPost(postId);

    if (!post) {
        throw createPostNotFoundError(
            "Cannot delete: post not found."
        );
    }

    if (post.creatorId !== userId) {
        throw createForbiddenRequestError(
            "Cannot delete: post does not belong to current user."
        );
    }

    switch(intent) {
        case "delete": {
            await deletePost(post.id);
            return redirect("/posts?page=1");
        }
    }
}

export const meta: MetaFunction<typeof loader> = ({
    data,
}) => {
    if (!data) {
        return {
            title: "No post",
            description: "No post found",
        };
    }
    return {
        title: `"${data.post.title}" post`,
        description: `Enjoy the "${data.post.title}" post and much more`,
    };
};


export default function PostRoute() {
    const data = useLoaderData<typeof loader>();

    return (
        <div 
        className="flex flex-col w-screen sm:max-w-[500px]">
            <div className="flex flex-col items-start border-b pb-2">
                <h1 className="font-bold text-xl mr-auto">
                    {data.post.title}
                </h1>
                <p className="flex items-center">
                    by 
                    <span className="font-semibold ml-2">
                    {data.post.creator.username}
                    </span>
                </p>
            </div>
            <div className="flex flex-col mt-4 mb-2 gap-2">
               {data.post.content}
            </div>
            {data.isOwner ? renderDeleteButton() : null}
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();
    const params = useParams();
    
    let message: string = "";

    switch (caught.status) {
        case 400: {
            message = "What you're trying to do is not allowed.";
            break;
        }
        case 404: {
            message = `Huh? What the heck is ${params.postId}?`;
            break;
        }
        case 403: {
            message = `Sorry, but {params.jokeId} is not your joke.`;
            break;
        }
        default: {
            message = caught.statusText;
        }
    }

    return (
        <div className="w-screen sm:max-w-[500px]">
            <ErrorWithOptionalContent message={message} />
        </div>
    )
}
