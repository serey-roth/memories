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
                    to: "/"
                },
            ]} />
            <div className="flex justify-center
            items-center w-screen">
                <Outlet />
            </div>
        </div>
    )
}