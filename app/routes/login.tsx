import type { ActionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { Button, Label, TextInput } from "flowbite-react";
import { Navbar } from "~/components/Navbar";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import bcrypt from "bcryptjs";

const validateUsername = (username: string) => {
    if (username.length < 3) {
        return "Username must be at least 3 characters long!"
    }
}

const validatePassword = (password: string) => {
    if (password.length < 6) {
        return "Password must be at least 6 characters long!"
    }
}

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    if (
        typeof username !== "string" ||
        typeof password !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form submitted incorrectly. Please try again."
        });
    }

    const fields = { username, password };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
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
            formError: `Invalid credentials! Please try again.`
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return badRequest({
            fieldErrors: null,
            fields,
            formError: `Incorrect password! Please try again.`
        })
    }

    return redirect("/posts");
}

export default function LoginRoute() {
    const actionData = useActionData<typeof action>();

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
                    <h1 className="text-lg font-bold mb-4">Sign in to your account</h1>
                    <form
                    method="post">
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
                            defaultValue={actionData?.fields?.username}
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
                            Login
                        </Button>
                        <span className="mt-4 text-sm flex items-center">
                            Don't have an account yet? &nbsp;
                            <Link 
                            to="/register"
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