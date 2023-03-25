import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { Button, Label, TextInput } from "flowbite-react";
import { Navbar } from "~/components/Navbar";
import { db } from "~/utils/db.server";
import { validatePasswordLength, validateUsernameLength } from "~/utils/formValidation.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/posts";

    if (
        typeof username !== "string" ||
        typeof password !== "string" ||
        typeof redirectTo !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form submitted incorrectly. Please try again."
        });
    }

    const fields = { username, password };
    const fieldErrors = {
        username: validateUsernameLength(username),
        password: validatePasswordLength(password),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fields,
            fieldErrors,
            formError: null,
        });
    }

    const user = await db.user.findUnique({
        where: { username },
        select: { 
            id: true, 
            username: true, 
            password: true 
        },
    })

    if (!user) {
        return badRequest({
            fieldErrors: null,
            fields,
            formError: "Invalid credentials! Please try again."
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return badRequest({
            fieldErrors: null,
            fields,
            formError: "Incorrect password! Please try again."
        })
    }

    return createUserSession(user.id, redirectTo);
}

export const loader = async ({ request }: LoaderArgs) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    return json({ username });
}

export default function LoginRoute() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();

    const redirectTo = searchParams.get("redirectTo");
    const linkToRegister = "/register" + (redirectTo ? "?" + new URLSearchParams([
        ["redirectTo", redirectTo]
    ]) : "");

    return (
        <div>
            <Navbar
            title="Memories"
            links={[
                {
                    name: "Home",
                    to: "/"
                }
            ]} />
            <div className="flex justify-center
            items-center mb-10">
                <div className="w-screen sm:max-w-[500px]">
                    <h1 className="text-lg font-bold mb-4">
                        Log in to your account
                    </h1>
                    <form
                    method="post">
                        <input 
                        type="hidden"
                        name="redirectTo"
                        value={redirectTo ?? undefined}
                        />
                        <div className="mb-2 block">
                            <Label
                            htmlFor="username"
                            value="Username"
                            color={actionData?.fieldErrors?.username ? "failure" : "gray"}
                            />
                            <TextInput 
                            id="username"
                            name="username"
                            shadow={true}
                            type="text"
                            color={actionData?.fieldErrors?.username ? "failure" : "gray"}
                            helperText={actionData?.fieldErrors?.username ? (
                                <>
                                    <span className="font-medium">
                                        {actionData.fieldErrors.username}
                                    </span>
                                </>
                            ) : null}
                            defaultValue={loaderData.username || actionData?.fields?.username}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.username) || 
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.username
                                ? "username-error"
                                : undefined
                            }/>
                        </div>
                        <div className="mb-2 block">
                            <Label
                            htmlFor="password"
                            value="Password"
                            color={actionData?.fieldErrors?.password ? "failure" : "gray"}
                            />
                            <TextInput 
                            id="password"
                            name="password"
                            shadow={true}
                            type="password"
                            color={actionData?.fieldErrors?.password ? "failure" : "gray"}
                            helperText={actionData?.fieldErrors?.password ? (
                                <>
                                    <span className="font-medium">
                                        {actionData.fieldErrors.password}
                                    </span>
                                </>
                            ) : null}
                            defaultValue={actionData?.fields?.password}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.password) || 
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.password
                                ? "password-error"
                                : undefined
                            }/>
                        </div>
                        {actionData?.formError ? (
                            <p className="font-medium mb-2 text-sm text-red-600">
                                {actionData.formError}
                            </p>
                        ) : null}
                        <Button type="submit" className="mt-4 w-full">
                            Log in
                        </Button>
                        <span className="mt-4 text-sm flex items-center">
                            Don't have an account yet? &nbsp;
                            <Link 
                            to={linkToRegister}
                            className="text-blue-600 hover:underline font-medium">
                                Register
                            </Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    )
}