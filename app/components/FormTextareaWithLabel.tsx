import { Textarea } from "flowbite-react"
import { FormElementWithLabel } from "./FormElementWithLabel"

type FormTextareaWithLabelProps = {
    id: string,
    name: string,
    label: string,
    rows?: number,
    placeholder?: string,
    error?: string,
    defaultValue?: string,
}

export const FormTextareaWithLabel = ({
    id,
    name,
    label,
    placeholder,
    rows,
    error,
    defaultValue,
}: FormTextareaWithLabelProps) => {
    return (
        <FormElementWithLabel
        id={id}
        label={label}
        labelColor={error ? "failure" : "gray"}>
            <Textarea
            id={id}
            name={name}
            placeholder={placeholder}
            rows={rows}
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