import { TextInput } from "flowbite-react"
import { FormElementWithLabel } from "./FormElementWithLabel"

type FormInputWithLabelProps = {
    id: string,
    name: string,
    label: string,
    helperText?: React.ReactNode,
    error?: string,
    defaultValue?: string,
    type?: string,
}

export const FormInputWithLabel = ({
    id,
    name,
    label,
    error,
    defaultValue,
    type = "text"
}: FormInputWithLabelProps) => {
    return (
        <FormElementWithLabel
        id={id}
        label={label}
        labelColor={error ? "failure" : "gray"}>
            <TextInput 
            id={id}
            name={name}
            shadow={true}
            type={type}
            color={error ? "failure" : "gray"}
            helperText={error ? (
                <>
                    <span className="font-medium">
                        {error}
                    </span>
                </>
            ) : null}
            defaultValue={defaultValue}
            aria-invalid={Boolean(error) || undefined}
            aria-errormessage={error ? `${id}-error` : undefined} />
        </FormElementWithLabel>
    )
}