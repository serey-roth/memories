import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData, useSearchParams } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { Button } from "flowbite-react";
import { FormInputWithLabel } from "~/components/FormInputWithLabel";
import { Navbar } from "~/components/Navbar";
import { validatePasswordLength, validateUsernameLength } from "~/utils/formValidation.server";
import { badRequest } from "~/utils/request.server";
import { createUserSession } from "~/utils/session.server";
import { getUserWithPassword } from "~/utils/users.server";

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const redirectTo = form.get("redirectTo") || "/posts?page=1";

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

    const user = await getUserWithPassword({ username });

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

const createLinkToRegister = (redirectTo: string) => {
    return "/register?" + new URLSearchParams([
        ["redirectTo", redirectTo]
    ]);
}

export default function LoginRoute() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const [searchParams] = useSearchParams();

    const redirectTo = searchParams.get("redirectTo");
    const linkToRegister = redirectTo ? 
        createLinkToRegister(redirectTo) : 
        "/register";

    return (
        <div>
            <Navbar title="Memories"/>
            <div className="flex justify-center
            items-center mb-10">
                <div className="w-screen sm:max-w-[500px]">
                    <h1 className="text-lg font-bold mb-4">
                        Log in to your account
                    </h1>
                    <Form
                    method="post">
                        <input 
                        type="hidden"
                        name="redirectTo"
                        value={redirectTo ?? undefined}
                        />
                        <FormInputWithLabel
                            id="username"
                            name="username"
                            label="Username"
                            defaultValue={loaderData.username || actionData?.fields?.username}
                            error={actionData?.fieldErrors?.username}
                        />
                        <FormInputWithLabel
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            defaultValue={actionData?.fields?.password}
                            error={actionData?.fieldErrors?.password}
                        />
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
                    </Form>
                </div>
            </div>
        </div>
    )
}