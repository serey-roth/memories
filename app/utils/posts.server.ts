import { db } from "./db.server";

const PAGE_COUNT = 5;

export type CreatePostArgs = {
    creatorId: string,
    title: string,
    content: string
}

export type UpdatePostArgs = Omit<CreatePostArgs, "creatorId">;

export const createPost = async ({
    creatorId, title, content
}: CreatePostArgs) => {
    return await db.post.create({
        data: {
            creatorId,
            title,
            content
        }
    })
}

export const getTotalPages = async (pageCount: number = PAGE_COUNT) => {
    const totalPosts = await db.post.count();
    return Math.ceil(totalPosts / pageCount);
}

export const getPaginatedPostsWithCreator = async (
    page: number, 
    pageCount: number = PAGE_COUNT
) => {
    return await db.post.findMany({
        take: pageCount,
        skip: page,
        include: {
            creator: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                }
            }
        },
        orderBy: { createdAt: "desc" }
    });
}

export const getPost = async (id: string | undefined) => {
    return await db.post.findUnique({
        where: { id },
        include: {
            creator: {
                select: {
                    username: true
                }
            }
        }
    });
}

export const deletePost = async (id: string) => {
    return await db.post.delete({
        where: { id }
    });
}

export const updatePost = async (id: string, values: UpdatePostArgs) => {
    return await db.post.update({
        data: values,
        where: { id }
    });
}