import { Card } from "flowbite-react";

interface PostProps {
    title: string;
    content: string;
}

export default function Post({
    title,
    content
}: PostProps) {
    return (
        <Card className="w-full m-0">
            <h5>
                {title}
            </h5>
            <p>
                {content}
            </p>
        </Card>
    )
}