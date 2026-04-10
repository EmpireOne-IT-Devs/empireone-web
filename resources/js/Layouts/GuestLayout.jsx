import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    const colors = {
        darkNavy: "#1a0b3b",
        electricBlue: "#e85c0d",
        cyan: "#00FFFF",
        deepPurple: "#5a3d9a",
        mutedPurple: "#7b52c8",
        blue: "#3b82f6",
        orange: "#e85c0d",
    };
    return (
        <div
            className={`min-h-screen flex items-center justify-center font-sans overflow-hidden relative`}
            style={{
                background: `linear-gradient(135deg, ${colors.deepPurple} 0%, #0d1b4b 50%, #0a0a2e 50%, ${colors.orange} 150%)`,
            }}
        >
            <div>
                {/* <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link> */}
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
