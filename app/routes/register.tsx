import type { ActionArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { Button, Label, TextInput } from "flowbite-react";
import { Navbar } from "~/components/Navbar";
import { db } from "~/utils/db.server";
import { validateEmail, validatePasswordLength, validateUsernameLength } from "~/utils/formValidation.server";
import { badRequest } from "~/utils/request.server";

export const action = async ({ request }: ActionArgs) => {
    const form = await request.formData();
    const username = form.get("username");
    const email = form.get("email");
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (
        typeof username !== "string" ||
        typeof email !== "string" || 
        typeof password !== "string" ||
        typeof confirmPassword !== "string"
    ) {
        return badRequest({
            fieldErrors: null,
            fields: null,
            formError: "Form submitted incorrectly. Please try again."
        });
    }

    const fields = { username, email, password, confirmPassword };
    const fieldErrors = {
        username: validateUsernameLength(username),
        email: validateEmail(email),
        password: validatePasswordLength(password),
        confirmPassword: validatePasswordLength(confirmPassword),
    }

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({
            fields,
            fieldErrors,
            formError: null,
        });
    }

    if (password !== confirmPassword) {
        return badRequest({
            fields,
            fieldErrors,
            formError: "Passwords don't match. Please try again!",
        });
    }

    const existingUser = await db.user.findUnique({
        where: { username },
        select: { 
            id: true, 
            username: true,
        },
    })

    if (existingUser) {
        return badRequest({
            fieldErrors: null,
            fields,
            formError: "Credentials taken! Please try again."
        });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
        data: {
            username,
            email,
            password: passwordHash
        }
    });

    return redirect(`/login?username=${newUser.username}`);
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
                    <h1 className="text-lg font-bold mb-4">
                        Register an account
                    </h1>
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
                            htmlFor="email"
                            value="Email"
                            color={actionData?.fieldErrors?.email ? "failure" : "gray"}
                            />
                            <TextInput 
                            id="email"
                            name="email"
                            shadow={true}
                            type="email"
                            color={actionData?.fieldErrors?.email ? "failure" : "gray"}
                            helperText={actionData?.fieldErrors?.email ? (
                                <>
                                    <span className="font-medium">
                                        {actionData.fieldErrors.email}
                                    </span>
                                </>
                            ) : null}
                            defaultValue={actionData?.fields?.email}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.email) || 
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.email
                                ? "email-error"
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
                        <div className="mb-2 block">
                            <Label
                            htmlFor="confirmPassword"
                            value="Confirm Password"
                            color={actionData?.fieldErrors?.confirmPassword ? "failure" : "gray"}
                            />
                            <TextInput 
                            id="confirmPassword"
                            name="confirmPassword"
                            shadow={true}
                            type="password"
                            color={actionData?.fieldErrors?.confirmPassword ? "failure" : "gray"}
                            helperText={actionData?.fieldErrors?.confirmPassword ? (
                                <>
                                    <span className="font-medium">
                                        {actionData.fieldErrors.confirmPassword}
                                    </span>
                                </>
                            ) : null}
                            defaultValue={actionData?.fields?.confirmPassword}
                            aria-invalid={
                                Boolean(actionData?.fieldErrors?.confirmPassword) || 
                                undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.confirmPassword
                                ? "confirm-password-error"
                                : undefined
                            }/>
                        </div>
                        {actionData?.formError ? (
                            <p className="font-medium mb-2 text-sm text-red-600">
                                {actionData.formError}
                            </p>
                        ) : null}
                        <Button type="submit" className="mt-4 w-full">
                            Register
                        </Button>
                        <span className="mt-4 text-sm flex items-center">
                            Already have an account? &nbsp;
                            <Link 
                            to="/login"
                            className="text-blue-600 hover:underline font-medium">
                                Login
                            </Link>
                        </span>
                    </form>
                </div>
            </div>
        </div>
    )
}