import type { User } from "@prisma/client";
import { Avatar, Dropdown } from "flowbite-react";

interface DropdownAvatarProps {
    user: Pick<User, "username" | "email">
}

export const DropdownAvatar = ({
    user,
}: DropdownAvatarProps) => {
    return (
        <Dropdown
        label={
            <Avatar
            rounded={true}
            className="font-bold capitalize text-lg"
            placeholderInitials={user.username.charAt(0)} />
        }
        arrowIcon={false}
        inline={true}
        >
            <Dropdown.Header>
                <span className="block text-sm">
                    {user.username}
                </span>
                <span className="block truncate text-sm font-medium">
                    {user.email}
                </span>
            </Dropdown.Header>
            <Dropdown.Item>
                Sign out
            </Dropdown.Item>
        </Dropdown>
    )
}