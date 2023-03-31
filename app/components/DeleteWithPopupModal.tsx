import { Form } from "@remix-run/react";
import { Button, Modal } from "flowbite-react";
import { useToggle } from "~/utils/useToggle";

type DeleteWithPopupModalProps = {
    idToBeDeleted: string;
    label?: string;
}

export const DeleteWithPopupModal = ({
    idToBeDeleted,
    label = "Delete"
}: DeleteWithPopupModalProps) => {
    const { toggleState, toggle } = useToggle();

    return (
        <>
            <Button 
            aria-label="delete"
            color="failure"
            onClick={toggle}>
                {label}
            </Button>
            <Modal
                dismissible={true}
                show={toggleState}
                size="md"
                popup={true}
                onClose={toggle}
            >
                <Modal.Header />
                <Modal.Body>
                <div className="text-center">
                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this item?
                    </h3>
                    <div className="flex justify-center gap-4">
                    <Form
                    method="post"
                    action={`/posts/${idToBeDeleted}`}>
                        <Button
                            color="failure"
                            name="intent"
                            value="delete"
                            type="submit"
                        >
                            Yes, I'm sure
                        </Button>
                    </Form>
                    <Button
                        color="gray"
                        onClick={toggle}
                    >
                        No, cancel
                    </Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </>
    );
}