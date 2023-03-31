import { Form, useNavigation } from "@remix-run/react";
import { Button, Modal } from "flowbite-react";
import { useToggle } from "~/utils/useToggle";
import { SubmitButton } from "./SubmitButton";

type DeleteWithPopupModalProps = {
    idToBeDeleted: string;
    label?: string;
}

export const DeleteWithPopupModal = ({
    idToBeDeleted,
    label = "Delete"
}: DeleteWithPopupModalProps) => {
    const { toggleState, toggle } = useToggle();
    const navigation = useNavigation();

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
                        <SubmitButton
                            color="failure"
                            name="intent"
                            value="delete"
                            isSubmitting={navigation.state === "submitting"}
                        >
                            Yes, I'm sure
                        </SubmitButton>
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