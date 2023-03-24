import { Outlet } from "@remix-run/react";
import { Navbar } from "~/components/Navbar";

export default function PostsRoute() {
    return (
        <div>
            <Navbar
            title="Memories"
            links={[
                {
                    name: "Home",
                    to: "/"
                },
                {
                    name: "Login",
                    to: "/login"
                },
            ]} />
            <div className="flex justify-center
            items-center w-screen mb-10">
                <Outlet />
            </div>
        </div>
    )
}