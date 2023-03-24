import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

const validatePostTitle = (title: string) => {
    if (title.length < 3) {
        return "A post's title must be at least 3 characters long."
    }
}

const validatePostContent = (content: string) => {
    if (content.length < 10) {
        return "A post's content must be at least 10 characters long."
    }
}

export const action = async ({ request }: ActionArgs) => {
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

    await db.post.create({
        data: fields
    });
    return redirect("/posts");
}

export default function NewPostRoute() {
    const actionData = useActionData<typeof action>();

    return (
        <div
        className="flex flex-col w-screen sm:max-w-[500px]">
            <form
            method="post">
                <div className="mb-2 block">
                    <Label
                        htmlFor="title"
                        value="Title" 
                        color={actionData?.fieldErrors?.title ? "failure" : "gray"}/>
                    <TextInput
                        id="title"
                        name="title"
                        type="text"
                        sizing="md"
                        placeholder="Title"
                        shadow={true}
                        color={actionData?.fieldErrors?.title ? "failure" : "gray"}
                        helperText={
                            actionData?.fieldErrors?.title ? (
                                <>
                                    <span className="font-medium">
                                        {actionData.fieldErrors.title}
                                    </span>
                                </>
                            ) : null
                        }
                        defaultValue={actionData?.fields?.title}
                        aria-invalid={
                            Boolean(actionData?.fieldErrors?.title) || 
                            undefined
                        }
                        aria-errormessage={
                            actionData?.fieldErrors?.title
                            ? "title-error"
                            : undefined
                        }/>
                </div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="content"
                        value="Content" 
                        color={actionData?.fieldErrors?.content ? "failure" : "gray"}/>
                    <Textarea
                        id="content"
                        name="content"
                        placeholder="Write something for this post..."
                        rows={4}
                        color={actionData?.fieldErrors?.content ? "failure" : "gray"}
                        helperText={
                            actionData?.fieldErrors?.content ? (
                                <>
                                    <span className="font-medium">
                                        {actionData.fieldErrors.content}
                                    </span>
                                </>
                            ) : null
                        }
                        defaultValue={actionData?.fields?.content}
                        aria-invalid={
                            Boolean(actionData?.fieldErrors?.content) || 
                            undefined
                        }
                        aria-errormessage={
                            actionData?.fieldErrors?.content
                            ? "content-error"
                            : undefined
                        }/>
                </div>
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
            </form>
        </div>
    )
}