import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { FormInputWithLabel } from "~/components/FormInputWithLabel";
import { Navbar } from "~/components/Navbar";
import { SubmitButton } from "~/components/SubmitButton";
import { db } from "~/utils/db.server";
import { validateEmail, validatePasswordLength, validateUsernameLength } from "~/utils/formValidation.server";
import { badRequest } from "~/utils/request.server";
import { getUserWithoutPassword } from "~/utils/users.server";

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

    const existingUser = await getUserWithoutPassword({ username });

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
    const navigation = useNavigation();

    return (
        <div>
            <Navbar title="Memories" />
            <div className="flex justify-center
            items-center mb-10">
                <div className="w-screen sm:max-w-[500px]">
                    <h1 className="text-lg font-bold mb-4">
                        {navigation.state === "submitting" ? 
                        `Registering "${navigation.formData.get("username")}"` :
                        "Register an account"}
                    </h1>
                    <Form
                    method="post">
                        <FormInputWithLabel
                            id="username"
                            name="username"
                            label="Username"
                            defaultValue={actionData?.fields?.username}
                            error={actionData?.fieldErrors?.username}
                        />
                        <FormInputWithLabel
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            defaultValue={actionData?.fields?.email}
                            error={actionData?.fieldErrors?.email}
                        />
                        <FormInputWithLabel
                            id="password"
                            name="password"
                            type="password"
                            label="Password"
                            defaultValue={actionData?.fields?.password}
                            error={actionData?.fieldErrors?.password}
                        />
                        <FormInputWithLabel
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            defaultValue={actionData?.fields?.confirmPassword}
                            error={actionData?.fieldErrors?.confirmPassword}
                        />
                        {actionData?.formError ? (
                            <p className="font-medium mb-2 text-sm text-red-600">
                                {actionData.formError}
                            </p>
                        ) : null}
                        <SubmitButton 
                        className="mt-4 w-full"
                        isSubmitting={navigation.state === "submitting"}>
                            Register
                        </SubmitButton>
                        <span className="mt-4 text-sm flex items-center">
                            Already have an account? &nbsp;
                            <Link 
                            to="/login"
                            className="text-blue-600 hover:underline font-medium">
                                Login
                            </Link>
                        </span>
                    </Form>
                </div>
            </div>
        </div>
    )
}