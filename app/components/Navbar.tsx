import type { User } from "@prisma/client";
import { Avatar, Navbar as FlowbiteNavbar } from "flowbite-react";

interface NavbarProps {
    title: string
    user?: Pick<User, "username"> | null
}

export function Navbar({
    title,
    user
}: NavbarProps) {
    return (
    <FlowbiteNavbar fluid={true} rounded={true}>
        <FlowbiteNavbar.Brand href="/">
            <p className="text-xl font-semibold whitespace-nowrap">
                {title}
            </p>
        </FlowbiteNavbar.Brand>
        <FlowbiteNavbar.Toggle />
        <FlowbiteNavbar.Collapse>
            <div className="flex items-center gap-4">
                <FlowbiteNavbar.Link href="/">
                    Home
                </FlowbiteNavbar.Link>
                <FlowbiteNavbar.Link href="/posts?page=1">
                    Posts
                </FlowbiteNavbar.Link>
                {user ? (
                    <form method="post" action="/logout">
                        <button 
                        className="hover:text-blue-700"
                        type="submit">
                            Log out
                        </button>
                    </form>
                ) : (
                    <FlowbiteNavbar.Link href="/login">
                        Log in
                    </FlowbiteNavbar.Link>
                )}
                {user ? (
                    <Avatar 
                    rounded={true}
                    placeholderInitials={user.username.charAt(0)} />
                ) : null}
            </div>
        </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>);
}