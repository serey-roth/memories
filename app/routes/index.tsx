import { Navbar } from "~/components/Navbar";

export default function Index() {
    return (
        <div>
            <Navbar
            title="Memories"
            links={[
                {
                    name: "Home",
                    to: "/"
                },
                {
                    name: "Login",
                    to: "/login"
                },
            ]} />
        </div>
    );
}
