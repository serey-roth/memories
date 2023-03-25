import { Card } from "flowbite-react";

interface PostProps {
    title: string;
    content: string;
    creator: {
        username: string;
    }   
}

export default function Post({ 
    title,
    content,
    creator
}: PostProps) {
    return (
        <Card className="w-full m-0">
            <h5>
                {title} by {creator.username}
            </h5>
            <p>
                {content}
            </p>
        </Card>
    )
}