import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData, useNavigation } from "@remix-run/react";
import { ErrorWithOptionalContent } from "~/components/ErrorWithOptionalContent";
import { FormInputWithLabel } from "~/components/FormInputWithLabel";
import { FormTextareaWithLabel } from "~/components/FormTextareaWithLabel";
import { SubmitButton } from "~/components/SubmitButton";
import { createBadRequestError, createUnauthorizedError } from "~/utils/error.server";
import { validatePostContent, validatePostTitle } from "~/utils/formValidation.server";
import { getPost, updatePost } from "~/utils/posts.server";
import { badRequest } from "~/utils/request.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const action = async ({ params, request }: ActionArgs) => {
    await requireUserId(request);
    const { postId } = params;
    const form = await request.formData();
    const title = form.get("title");
    const content = form.get("content");

    if (!postId) {
        throw createBadRequestError("The id is necessary for updating a post!");
    }

    if (
        typeof title !== "string" ||
        typeof content !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form submitted incorrectly!"
        });
    }

    const fields = { title, content };
    const fieldErrors = {
        title: validatePostTitle(title),
        content: validatePostContent(content),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fields,
            fieldErrors,
            formError: null
        });
    }

    await updatePost(postId, fields);

    return redirect(`/posts/${postId}`);
}

export const loader = async ({ params, request }: LoaderArgs) => {
    const userId = await getUserId(request);

    if (!userId) {
        throw createUnauthorizedError("Unauthorized!")
    }

    const post = await getPost(params.postId);

    return json({ post });
}

export default function NewPostRoute() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    
    return (
        <div
        className="flex flex-col w-screen sm:max-w-[500px]">
            <Form
            method="post">
                <FormInputWithLabel
                    id="title"
                    name="title"
                    label="Title"
                    defaultValue={loaderData.post?.title || actionData?.fields?.title}
                    error={actionData?.fieldErrors?.title}
                />
                <FormTextareaWithLabel
                    id="content"
                    name="content"
                    label="Content"
                    placeholder="Write something for this post..."
                    rows={4}
                    defaultValue={loaderData.post?.content || actionData?.fields?.content}
                    error={actionData?.fieldErrors?.content}
                />
                {actionData?.formError ? (
                   <p
                   className="font-medium text-red-500"
                   role="alert">
                       {actionData.formError}
                   </p>
                ): null}
                <SubmitButton 
                isSubmitting={navigation.state === "submitting"}>
                    Done
                </SubmitButton>
            </Form>
        </div>
    )
}

export function ErrorBoundary() {
    return (
        <ErrorWithOptionalContent
        message="Something went wrong trying to create a new post. Sorry about that." />
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();

    if (caught.status === 400) {
        return (
            <div className="w-screen sm:max-w-[500px]">
                <ErrorWithOptionalContent
                message={caught.statusText}>
                </ErrorWithOptionalContent>
            </div>
          );
    }

    throw new Error("Unhandled error: " + caught.status);
}