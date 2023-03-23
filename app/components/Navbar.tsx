import { Navbar as FlowbiteNavbar } from "flowbite-react";

type NavbarLink = {
    name: string,
    to: string
}

interface NavbarProps {
    title: string
    links: NavbarLink[]
}

export function Navbar({
    title,
    links
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
            {links.map(({ name, to }) => (
                <FlowbiteNavbar.Link 
                key={name}
                href={to}>
                    {name}
                </FlowbiteNavbar.Link>
            ))}
        </FlowbiteNavbar.Collapse>
    </FlowbiteNavbar>);
}