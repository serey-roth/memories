import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useCatch } from "@remix-run/react";
import { Button } from "flowbite-react";
import { ErrorWithOptionalContent } from "~/components/ErrorWithOptionalContent";
import { FormInputWithLabel } from "~/components/FormInputWithLabel";
import { FormTextareaWithLabel } from "~/components/FormTextareaWithLabel";
import { createUnauthorizedError } from "~/utils/error.server";
import { validatePostTitle, validatePostContent } from "~/utils/formValidation.server";
import { createPost } from "~/utils/posts.server";
import { badRequest } from "~/utils/request.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
    const userId = await requireUserId(request);
    const form = await request.formData();
    const title = form.get("title");
    const content = form.get("content");

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

    await createPost({ ...fields, creatorId: userId });

    return redirect("/posts?page=1");
}

export const loader = async ({ request }: LoaderArgs) => {
    const userId = await getUserId(request);
    if (!userId) {
        throw createUnauthorizedError("Unauthorized!")
    }
    return json({});
}

export default function NewPostRoute() {
    const actionData = useActionData<typeof action>();

    return (
        <div
        className="flex flex-col w-screen sm:max-w-[500px]">
            <Form
            method="post">
                <FormInputWithLabel
                    id="title"
                    name="title"
                    label="Title"
                    defaultValue={actionData?.fields?.title}
                    error={actionData?.fieldErrors?.title}
                />
                <FormTextareaWithLabel
                    id="content"
                    name="content"
                    label="Content"
                    placeholder="Write something for this post..."
                    rows={4}
                    defaultValue={actionData?.fields?.content}
                    error={actionData?.fieldErrors?.content}
                />
                {actionData?.formError ? (
                   <p
                   className="font-medium text-red-500"
                   role="alert">
                       {actionData.formError}
                   </p>
                ): null}
                <Button type="submit">
                    Add
                </Button>
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

    if (caught.status === 401) {
        return (
            <div className="w-screen sm:max-w-[500px]">
                <ErrorWithOptionalContent
                message="You must be logged in to create a post.">
                    <Link 
                    to="/login"
                    className="underline underline-offset-2">Log in</Link>
                </ErrorWithOptionalContent>
            </div>
          );
    }

    throw new Error("Unhandled error: " + caught.status);
}