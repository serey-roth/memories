import { useState } from "react";

type ToggleState = "open" | "close";

export const useToggle = () => {
    const [toggleState, setToggleState] = useState<ToggleState>("close");

    const toggle = () => {
        setToggleState(prevState => prevState === "close" ? "open" : "close");
    }

    return {
        toggleState: toggleState === "open",
        toggle
    }
}