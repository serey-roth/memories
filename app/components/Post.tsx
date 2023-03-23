import { Card } from "flowbite-react";

interface PostProps {
    title: string;
    description: string;
}

export default function Post({
    title,
    description
}: PostProps) {
    return (
        <Card className="w-full m-0">
            <h5>
                {title}
            </h5>
            <p>
                {description}
            </p>
        </Card>
    )
}