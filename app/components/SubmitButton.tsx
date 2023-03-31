import { Button, Spinner} from "flowbite-react";
import type{ ButtonProps } from "flowbite-react"

type SubmitButtonProps = ButtonProps & {
    isSubmitting: boolean
};

export const SubmitButton = ({
    isSubmitting,
    children,
    ...rest
}: SubmitButtonProps) => {
    return (
        <Button {...rest} type="submit">
            {isSubmitting ? (
                <Spinner />
            ) : (
                <>
                    {children}
                </>
            )}
        </Button>
    );
}