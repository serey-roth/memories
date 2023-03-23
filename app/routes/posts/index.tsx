import Post from "~/components/Post";

export default function PostsIndexRoute() {
    return (
        <div 
        className="flex flex-col w-screen sm:max-w-[500px]">
            <h1 className="font-semibold border-b">Posts</h1>
            <div className="flex flex-col mt-4 gap-2">
                <Post
                title="testing"
                description="lorem ipsum" />
                <Post
                title="testing"
                description="lorem ipsum" />
            </div>
        </div>
    )
}