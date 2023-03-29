import { Link } from "@remix-run/react";
import { Card, Avatar } from "flowbite-react";

interface PostProps {
    id: string;
    title: string;
    content: string;
    creator: {
        username: string;
    }   
}

export default function Post({ 
    id,
    title,
    content,
    creator
}: PostProps) {
    return (
        <Card className="w-full m-0">
            <div className="flex items-center">
                <Avatar
                rounded={true}
                placeholderInitials={creator.username.charAt(0)}
                />
                <h5 className="font-medium ml-2">
                    {creator.username}
                </h5>
            </div>
            <div>
                <Link to={`/posts/${id}`}>
                    <h5 className="font-bold text-lg">
                        {title}
                    </h5>
                </Link>
                <p>
                    {content}
                </p>
            </div>
        </Card>
    )
}