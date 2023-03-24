import type { User } from "@prisma/client";
import { Avatar, Navbar as FlowbiteNavbar } from "flowbite-react";

type NavbarLink = {
    name: string,
    to: string
}

interface NavbarProps {
    title: string
    links: NavbarLink[]
    user?: Pick<User, "username"> | null
}

export function Navbar({
    title,
    links,
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
                {links.map(({ name, to }) => (
                    <FlowbiteNavbar.Link 
                    key={name}
                    href={to}>
                        {name}
                    </FlowbiteNavbar.Link>
                ))}
                {user ? (
                    <Avatar 
                    rounded={true}
                    placeholderInitials={user.username.charAt(0)} />
                ) : null}
            </div>
        </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>);
}