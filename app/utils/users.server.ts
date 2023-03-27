import { db } from "./db.server";

const getUserSelectOptions = () => ({
    id: true, 
    username: true, 
    email: true,
});

const getUserSelectOptionsWithPassword = () => ({
    id: true, 
    username: true, 
    email: true,
    password: true
});

export const getUserWithoutPassword = async (whereOptions: {
    [x: string]: any
}) => {
    return await db.user.findUnique({
        where: whereOptions,
        select: getUserSelectOptions()
    });
}

export const getUserWithPassword = async (whereOptions: {
    [x: string]: any
}) => {
    return await db.user.findUnique({
        where: whereOptions,
        select: getUserSelectOptionsWithPassword()
    });
}