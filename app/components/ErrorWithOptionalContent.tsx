import { Alert } from "flowbite-react"

type ErrorWithOptionalContentProps = {
    message: string,
    children?: React.ReactNode
}

export const ErrorWithOptionalContent = ({ 
    message,
    children
}: ErrorWithOptionalContentProps) => {
    return (
        <Alert color="failure">
            <div className="font-medium">
                <p className="text-lg">{message}</p>
                {children}
            </div>
        </Alert>
    )
}