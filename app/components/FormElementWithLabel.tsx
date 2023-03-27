import { Label } from "flowbite-react"

type FormElementWithLabelProps = {
    label: string,
    labelColor: string,
    id: string,
    children: React.ReactNode
}

export const FormElementWithLabel = ({
    label,
    labelColor,
    id,
    children,
}: FormElementWithLabelProps) => {
    return (
        <div className="mb-2 block">
            <Label
            htmlFor={id}
            value={label}
            color={labelColor}
            />
            {children}
        </div>
    )
}